"use client";

import { ClimbingBoxLoader } from "react-spinners"

export default function Loader({ size = 10}) {
    return (
        <ClimbingBoxLoader
            size={size} />
    )
}