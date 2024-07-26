import { create } from "zustand";

interface IModalState {
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  openLoginModal: () => void;
}

export const useModalStore = create<IModalState>((set) => ({
  isLoginModalOpen: false,
  closeLoginModal: () => set(() => ({ isLoginModalOpen: false })),
  openLoginModal: () => set(() => ({ isLoginModalOpen: true })),
}));
