"use client";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useRef, useState } from "react";
import { FaStar } from "react-icons/fa"; // Importing a star icon from react-icons

export default function EmbeddedCheckoutButton() {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  const [showCheckout, setShowCheckout] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const fetchClientSecret = useCallback(() => {
    // Create a Checkout Session
    return fetch("/api/embedded-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId: "price_1QS6f2J3Q1OWPGZRfDZt51rd" }),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, []);

  const options = { fetchClientSecret };

  const handleCheckoutClick = () => {
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const handleCloseModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };

  return (
    <div id="checkout" className="my-4 flex">
      <button
        className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
        onClick={handleCheckoutClick}
      >
        <FaStar className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
        <span className="relative z-10">Upgrade to Premium</span>
        {/* Decorative Elements */}
        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
      </button>
      <dialog
        ref={modalRef}
        className="modal max-h-[60vh]"
        style={{ padding: 0 }} // Optional: remove default dialog padding
      >
        <div
          className="modal-box bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl"
          style={{
            width: "90%", // Default width for smaller screens
            maxHeight: "90vh", // Ensure the modal does not exceed viewport height
          }}
        >
          <h3 className="font-bold text-2xl text-gray-900 dark:text-white">JFit Premium Subscription</h3>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
          Unlock exclusive features and enjoy an ad-free experience with our Premium plan.
          </p>

            <ul className="mt-6 text-gray-700">
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Volume autoregulation algorithm
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Custom program builder
              </li>
              <li className="flex items-center">
                <svg
                  className="w-6 h-6 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Access to regularly updated JFit templates
              </li>
            </ul>
          <div className="py-4 self-center">
            {showCheckout && (
              <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
