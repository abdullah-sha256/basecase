import { messages } from "../../locale/en-CA";
import { LoginModal } from "./LoginModal";
import { useLogoutMutation } from "../../hooks/useLogoutMutation";

export default function ProtectedNavbar() {
  const logoutMutation = useLogoutMutation();

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
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="px-2 py-1.5 text-sm text-base-300 transition hover:text-base-100 disabled:opacity-50"
          >
            {messages.PROTECTED_NAVBAR_LOGOUT_BUTTON_TEXT.toLowerCase()}
          </button>
        </nav>
      </header>
    </>
  );
}
