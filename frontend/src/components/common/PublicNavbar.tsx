import { messages } from "../../locale/en-CA";
import { useModalStore } from "../../hooks/useModalStore";
import { LoginModal } from "./LoginModal";

export default function PublicNavbar() {
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  return (
    <>
      <LoginModal />
      <header className="sticky top-0 z-30 border-b border-base-700/60 bg-base-950/85 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5"
          aria-label="Primary"
        >
          <span className="flex items-baseline gap-1 text-base font-bold tracking-tight text-base-100">
            <span className="text-term-400" aria-hidden="true">
              ~/
            </span>
            {messages.APP_NAME}
            <span
              className="cursor-blink -mb-px inline-block h-4 w-2 self-center bg-term-400"
              aria-hidden="true"
            ></span>
          </span>

          <button
            onClick={openLoginModal}
            className="rounded-md border border-term-500/60 bg-term-500/10 px-3.5 py-1.5 text-sm font-semibold text-term-300 transition hover:bg-term-500/20 hover:shadow-glow-term-sm"
          >
            $ {messages.NAVBAR_SIGN_IN_BUTTON_TEXT.toLowerCase()}
          </button>
        </nav>
      </header>
    </>
  );
}
