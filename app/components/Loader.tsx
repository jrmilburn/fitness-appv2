"use client";

import { PuffLoader } from "react-spinners"

export default function Loader({ size = 10, color = "#000"}) {
    return (
        <PuffLoader
            size={size} 
            color={color}
            />
    )
}