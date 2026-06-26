"use client";

import { useState, useEffect } from "react";
import HeroSection    from "@/components/HeroSection";
import UploadSection  from "@/components/UploadSection";
import ResultsSection from "@/components/ResultsSection";
import { loadFromStore } from "@/lib/store";

export default function HomePage() {
  const [predictions, setPredictions] = useState([]);

  // Load from localStorage on first render (if user comes back from Analytics page)
  useEffect(() => {
    const saved = loadFromStore("predictions");
    if (saved?.length) setPredictions(saved);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      <HeroSection />
      <UploadSection onPredictionsReceived={setPredictions} />
      {predictions.length > 0 && <ResultsSection predictions={predictions} />}
    </div>
  );
}
