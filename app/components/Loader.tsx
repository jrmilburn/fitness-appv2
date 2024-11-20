"use client";

import { ClimbingBoxLoader } from "react-spinners"

export default function Loader({ size = 10, color = "#000"}) {
    return (
        <ClimbingBoxLoader
            size={size} 
            color={color}
            />
    )
}