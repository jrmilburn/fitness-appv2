// app/api/nutrition/log/scan/[id]/route.ts

import { prisma } from "@/app/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth"; // Adjust the import path based on your setup
import { authOptions } from "@/app/lib/authOptions"; // Adjust the import path based on your setup

/**
 * Handler for POST requests to scan a barcode and add a food item to a daily log.
 *
 * Endpoint: POST /api/nutrition/log/scan/[id]
 *
 * Request Body: { upc: string }
 *
 * Response:
 * - 200: { success: true, data: FoodItem }
 * - 400: { success: false, error: 'Error message' }
 * - 401: { success: false, error: 'Unauthorized message' }
 * - 403: { success: false, error: 'Forbidden message' }
 * - 404: { success: false, error: 'Not Found message' }
 * - 500: { success: false, error: 'Internal Server Error message' }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: dailyLogId } = params;

  // Retrieve user session using NextAuth.js
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    // Parse the request body
    const { upc } = await req.json();

    console.log('UPC', upc);

    // Validate UPC
    if (!upc || typeof upc !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing UPC code." },
        { status: 400 }
      );
    }

    // Fetch product data from Open Food Facts API using fetch
    const openFoodFactsURL = `https://world.openfoodfacts.org/api/v0/product/${upc}.json`;
    const response = await fetch(openFoodFactsURL);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      console.error(
        `Open Food Facts API responded with status ${response.status}`
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to fetch product data from Open Food Facts. Please try again later.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log('PRODUCT DATA', data);

    // Check if the product exists
    if (data.status !== 1) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found in Open Food Facts database.",
        },
        { status: 404 }
      );
    }

    const product = data.product;

    // Extract relevant nutritional information
    const nutriments = product.nutriments || {};

    const foodData = {
      name: product.product_name || "Unknown Product",
      carbohydratesPerServe: parseFloat(
        nutriments.carbohydrates || nutriments["carbohydrates_100g"] || "0"
      ),
      proteinPerServe: parseFloat(
        nutriments.proteins || nutriments["proteins_100g"] || "0"
      ),
      fatPerServe: parseFloat(
        nutriments.fat || nutriments["fat_100g"] || "0"
      ),
      caloriesPerServe: parseFloat(
        nutriments["energy-kcal"] || nutriments.energy || "0"
      ),
      quantity: 100, // Default quantity; can be modified based on your requirements
      unit: "g", // Default unit; can be modified based on your requirements
      image: product.image_url,
      upc: upc,
    };

    // Verify that the DailyLog exists
    const dailyLog = await prisma.dailyLog.findUnique({
      where: { id: dailyLogId },
    });

    if (!dailyLog) {
      return NextResponse.json(
        { success: false, error: "Daily Log not found." },
        { status: 404 }
      );
    }

    // Verify that the DailyLog belongs to the authenticated user
    if (dailyLog.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. You do not have access to this Daily Log.",
        },
        { status: 403 }
      );
    }

    // Create the FoodItem and associate it with the DailyLog
    const foodItem = await prisma.food.create({
      data: {
        name: foodData.name,
        carbohydratesPerServe: foodData.carbohydratesPerServe,
        proteinPerServe: foodData.proteinPerServe,
        fatPerServe: foodData.fatPerServe,
        caloriesPerServe: foodData.caloriesPerServe,
        quantity: foodData.quantity,
        unit: foodData.unit,
        dailylogId: dailyLogId,
        image: foodData.image
      },
    });

    return NextResponse.json(
      foodItem
    );
  } catch (error) {
    console.error("Error in /api/nutrition/log/scan/[id]:", error.message || error);

    // Handle fetch errors
    if (error instanceof TypeError) {
      // Network errors or JSON parsing errors
      return NextResponse.json(
        {
          success: false,
          error:
            "Network error occurred while fetching product data. Please try again.",
        },
        { status: 502 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { success: false, error: "Internal Server Error." },
      { status: 500 }
    );
  }
}