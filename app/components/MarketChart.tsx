"use client";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 Tooltip,
 PointElement,
 LineElement,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
// Register ChartJS components using ChartJS.register
ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 Tooltip
);