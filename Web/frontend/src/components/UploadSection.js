"use client";

import { useState, useRef } from "react";
import { Button }   from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { predictBatch, fetchAnalytics } from "@/lib/api";
import { saveToStore } from "@/lib/store";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function UploadSection({ onPredictionsReceived }) {
  const [file,       setFile]       = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading,  setIsLoading]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [error,      setError]      = useState(null);
  const [success,    setSuccess]    = useState(false);

  const fileInputRef = useRef(null);

  function pickFile(picked) {
    setError(null); setSuccess(false);
    if (!picked) return;
    if (!picked.name.endsWith(".csv")) { setError("Please upload a CSV file."); return; }
    setFile(picked);
  }

  function clearFile() {
    setFile(null); setError(null); setSuccess(false); setProgress(0);
    fileInputRef.current.value = "";
  }

  function onDragOver(e)  { e.preventDefault(); setIsDragging(true);  }
  function onDragLeave(e) { e.preventDefault(); setIsDragging(false); }
  function onDrop(e)      { e.preventDefault(); setIsDragging(false); pickFile(e.dataTransfer.files[0]); }

  async function handleUpload() {
    setError(null); setSuccess(false); setIsLoading(true); setProgress(0);

    const timer = setInterval(() => setProgress((p) => p >= 85 ? p : p + 10), 200);

    try {
      // Both API calls with the same file — predictions + analytics together
      const [predictions, analytics] = await Promise.all([
        predictBatch(file),
        fetchAnalytics(file),
      ]);

      setProgress(100);
      setSuccess(true);

      // Save to localStorage so Analytics page can read without re-upload
      saveToStore("predictions", predictions);
      saveToStore("analytics", analytics);

      onPredictionsReceived(predictions);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setProgress(0);
    } finally {
      clearInterval(timer);
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6">
      <div className="rounded-2xl border border-[#2a2a3c] bg-[#13131f] p-6 sm:p-8">

        <div className="mb-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-slate-100">Upload Customer Data</h2>
          <p className="text-sm text-slate-400">Drag and drop your CSV file or click to browse</p>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300
            ${isDragging ? "border-indigo-500 bg-indigo-500/10" : "border-[#2a2a3c] bg-[#0a0a0f] hover:border-[#3a3a50] hover:bg-[#1a1a2e]"}
            ${file       ? "border-emerald-500/50 bg-emerald-500/5" : ""}
          `}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden"
            onChange={(e) => pickFile(e.target.files[0])} />
          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e1e2d]">
                <Upload className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                {isDragging ? "Drop your CSV file here" : "Click or drag CSV file here"}
              </p>
              <p className="text-xs text-slate-500">Supports .csv files</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400">
            <CheckCircle className="h-4 w-4 shrink-0" /> Predictions & analytics generated successfully!
          </div>
        )}
        {isLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Uploading & analyzing...</span><span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {file && !isLoading && (
            <Button variant="outline" onClick={clearFile} className="flex-1">
              <X className="h-4 w-4 mr-2" /> Clear
            </Button>
          )}
          <Button onClick={handleUpload} disabled={!file || isLoading} className="flex-1">
            {isLoading
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              : <><Upload  className="h-4 w-4 mr-2" /> Upload & Predict</>
            }
          </Button>
        </div>

      </div>
    </section>
  );
}
