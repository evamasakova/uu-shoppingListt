import React from "react";

export default function ErrorCard({ message = "Something went wrong", onRetry, onClose }) {
  return (
    <div className="bg-white border border-red-200 rounded-md px-4 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-red-600 font-semibold">Error</div>
          <div className="text-sm text-gray-600 mt-1">{message}</div>
        </div>
        <div className="flex flex-col gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 text-sm"
            >
              Retry
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-md border text-sm"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}