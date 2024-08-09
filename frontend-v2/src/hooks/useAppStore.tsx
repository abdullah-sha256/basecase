import { create } from "zustand";

/**
 * Interface representing the application state.
 */
interface IAppState {
  /**
   * Indicates whether the user should be prompted to log in again.
   */
  shouldRetryAuth: boolean;

  /**
   * Function to update the `shouldRetryAuth` state.
   *
   * @param val - The new value for the `shouldRetryAuth` state.
   */
  setShouldRetryAuth: (val: boolean) => void;
}

/**
 * Zustand store for managing the application's client-side state.
 *
 */
export const useAppStore = create<IAppState>((set) => ({
  shouldRetryAuth: false,
  setShouldRetryAuth: (val: boolean) => set(() => ({ shouldRetryAuth: val })),
}));
