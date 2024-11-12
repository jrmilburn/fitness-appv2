"use client";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 Tooltip,
 PointElement,
 LineElement,
} from "chart.js";
// Register ChartJS components using ChartJS.register
ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip
);