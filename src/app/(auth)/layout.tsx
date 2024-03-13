import Providers from "@/app/providers";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <Providers>
            <div className="h-full flex-grow flex-shrink-0 pt-6">
                <Suspense fallback={<Loader />}>{children}</Suspense>
            </div>
        </Providers>
    );
}
