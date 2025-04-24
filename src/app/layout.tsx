import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hack-n-Hope",
  description: "Consultant matching platform",
  icons: {
    icon: [
      {
        url: "/globe.svg",
        href: "/globe.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen ">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 