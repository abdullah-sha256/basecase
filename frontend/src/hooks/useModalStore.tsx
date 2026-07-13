import { create } from "zustand";

interface IModalState {
  /**
   * Boolean indicating whether the login modal is currently open.
   */
  isLoginModalOpen: boolean;
  /**
   * This function sets the `isLoginModalOpen` state to `false`
   */
  closeLoginModal: () => void;
  /**
   * This function sets the `isLoginModalOpen` state to `true`
   */
  openLoginModal: () => void;
}

/**
 * Zustand store for managing the state of modals in the application.
 *
 * @returns {IModalState} The current modal state and actions to manipulate it.
 */
export const useModalStore = create<IModalState>((set) => ({
  isLoginModalOpen: false,
  closeLoginModal: () => set(() => ({ isLoginModalOpen: false })),
  openLoginModal: () => set(() => ({ isLoginModalOpen: true })),
}));
