"use client";

import Loader from "../../components/Loader";

export default function Loading() {

    return (
        <div className="w-2xl mx-auto p-8 flex flex-col items-center justify-center w-full h-full">
            <Loader />
        </div>
    )

}