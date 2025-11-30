import React from "react";

export default function LoadingCard({ label = "Loading…" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-4 py-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-3 text-sm text-gray-400">{label}</div>
    </div>
  );
}