import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ Import toaster

// 🎨 Import Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // different weights for headings
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // body text weights
});

export const metadata = {
  title: "Real Estate Project",
  description: "Modern Real Estate UI with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}

        {/* ✅ Global Toast Notifications */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            // 🔹 Default toast style
            style: {
              background: "#ffffff",
              color: "#333",
              padding: "14px 18px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "500",
              fontFamily: "var(--font-poppins)", // Match your UI font
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)",
            },
            // 🔹 Success toast
            success: {
              style: {
                background: "#e6f9f0",
                color: "#065f46",
                border: "1px solid #34d399",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#ffffff",
              },
            },
            // 🔹 Error toast
            error: {
              style: {
                background: "#fff5f5",
                color: "#991b1b",
                border: "1px solid #f87171",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
