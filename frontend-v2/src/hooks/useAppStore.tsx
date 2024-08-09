import { create } from "zustand";

interface IAppState {
  /* State variable to control auth modal */
  shouldRetryAuth: boolean;
  setshouldRetryAuth: (val: boolean) => void;
}

export const useAppStore = create<IAppState>((set) => ({
  shouldRetryAuth: false,
  setshouldRetryAuth: (val: boolean) => set(() => ({ shouldRetryAuth: val })),
}));
