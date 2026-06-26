import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ChurnPredict - Customer Churn Prediction System",
  description: "ML-powered customer churn prediction system. Upload customer data and identify high-risk customers using machine learning.",
  keywords: ["machine learning", "customer churn", "prediction", "ML portfolio"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
