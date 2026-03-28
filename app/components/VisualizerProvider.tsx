"use client";

/**
 * VisualizerProvider
 *
 * Holds the photo session as actual File objects inside React context.
 * This survives client-side Next.js navigation (no page reload) without
 * needing to serialise large images into localStorage.
 *
 * Photos are cleared when the browser tab is closed — that is intentional.
 * Lead info and the active product config are persisted separately in localStorage.
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface PersistedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
}

interface VisualizerContextValue {
  photos: PersistedPhoto[];
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
}

const VisualizerContext = createContext<VisualizerContextValue>({
  photos: [],
  addPhotos: () => {},
  removePhoto: () => {},
  clearPhotos: () => {},
});

export function VisualizerProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<PersistedPhoto[]>([]);

  const addPhotos = useCallback((files: File[]) => {
    const next = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));
    setPhotos((prev) => [...prev, ...next]);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const clearPhotos = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      return [];
    });
  }, []);

  return (
    <VisualizerContext.Provider value={{ photos, addPhotos, removePhoto, clearPhotos }}>
      {children}
    </VisualizerContext.Provider>
  );
}

export function useVisualizerSession() {
  return useContext(VisualizerContext);
}
