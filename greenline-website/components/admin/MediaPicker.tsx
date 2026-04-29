"use client";

import { useEffect, useState } from "react";
import { adminApi, MediaItem } from "@/lib/admin-api";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onPick: (url: string) => void;
}

export default function MediaPicker({ open, onClose, onPick }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    adminApi
      .listMedia()
      .then((d) => setItems(d.items))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load library"))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 px-4 py-10"
      onClick={onClose}
      data-testid="media-picker-overlay"
    >
      <div
        className="bg-bone-warm border-2 border-ink shadow-brutal-lg max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        data-testid="media-picker"
      >
        <header className="flex items-center justify-between p-4 bg-ink text-bone border-b-2 border-ink">
          <span className="font-display font-black uppercase tracking-tight">
            Image library
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-display font-bold uppercase tracking-wider hover:text-street"
            data-testid="media-picker-close"
          >
            ✕ Close
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4">
          {loading && <p className="font-sans text-ink/60">Loading…</p>}
          {error && (
            <p className="border-2 border-ink bg-street/20 px-3 py-2 font-bold">{error}</p>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center py-12">
              <p className="font-display font-bold text-xl mb-2">No uploads yet</p>
              <p className="font-sans text-ink/60 text-sm">
                Use "Upload image" or the editor's image button to add media here.
              </p>
            </div>
          )}
          {items.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    onPick(m.url);
                    onClose();
                  }}
                  className="group bg-white border-2 border-ink hover:shadow-brutal hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all text-left"
                  data-testid={`media-pick-${m.public_id}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.original_filename}
                    className="w-full h-32 object-cover border-b-2 border-ink"
                  />
                  <div className="p-2">
                    <p className="text-[11px] font-mono text-ink/60 truncate">
                      {m.original_filename || m.public_id}
                    </p>
                    <p className="text-[10px] text-ink/40 mt-0.5">
                      {m.width}×{m.height} · {m.format}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
