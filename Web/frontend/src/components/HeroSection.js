import { Brain, Zap, BarChart3 } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">

        {/* Top badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
          <Zap className="h-4 w-4" />
          ML-Powered Predictions
        </div>

        {/* Title */}
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Predict Churn{" "}
          <span className="gradient-text">Before It Happens.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 leading-relaxed">
          Upload customer data and identify high-risk customers using machine learning.
          Get instant churn predictions with probability scores and risk assessments.
        </p>

        {/* 3 feature cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard icon={<Brain  className="h-5 w-5 text-indigo-400" />} title="ML Powered"       description="Advanced machine learning model for accurate predictions" />
          <FeatureCard icon={<Zap    className="h-5 w-5 text-purple-400" />} title="Instant Results"  description="Get predictions in seconds with batch processing" />
          <FeatureCard icon={<BarChart3 className="h-5 w-5 text-emerald-400"/>} title="Analytics Dashboard" description="Visual insights into churn patterns, payment risks, and loyalty segments" />
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-[#2a2a3c] bg-[#13131f]/80 p-4 card-hover">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1e1e2d]">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}
