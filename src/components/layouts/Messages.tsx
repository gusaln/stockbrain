"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Messages() {
    const searchParams = useSearchParams();

    useEffect(function () {
        const url = new URL(location.href);

        if (searchParams.has("message[success]")) {
            toast.success(searchParams.get("message[success]"));

            url.searchParams.delete("message[success]");
        }

        history.replaceState(null, "", url);
    }, []);

    return (
        <>
            <ToastContainer pauseOnHover position="bottom-right"/>

            {/* {message && (
                <div role="alert" className="alert alert-success mb-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{message}</span>
                </div>
            )} */}
        </>
    );
}
