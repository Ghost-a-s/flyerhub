"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type UiState = { catalogView: "grid" | "list"; setCatalogView: (view: "grid" | "list") => void; uploadDraftKind: "PSD_TEMPLATE" | "REFERENCE" | "DESIGN_BRIEF"; setUploadDraftKind: (kind: UiState["uploadDraftKind"]) => void };
export const useUiStore = create<UiState>()(persist((set) => ({ catalogView: "grid", setCatalogView: (catalogView) => set({ catalogView }), uploadDraftKind: "PSD_TEMPLATE", setUploadDraftKind: (uploadDraftKind) => set({ uploadDraftKind }) }), { name: "at-psd-ui" }));
