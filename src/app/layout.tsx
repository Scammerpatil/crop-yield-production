import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>AgriYield AI - Smart Crop Yield Prediction</title>
        <meta
          name="description"
          content="AgriYield AI is an advanced AI-powered crop yield prediction system designed to help farmers and agricultural planners estimate crop production accurately. Using machine learning and real-time data analysis, the system predicts expected yield based on soil quality, weather patterns, crop type, and farming practices."
        />
      </head>
      <body className={`antialiased`}>
        <Toaster />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
