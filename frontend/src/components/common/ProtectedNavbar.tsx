import { Link, NavLink } from "react-router-dom";
import { messages } from "../../locale/en-CA";
import { LoginModal } from "./LoginModal";
import { useLogoutMutation } from "../../hooks/useLogoutMutation";
import { protectedRoutes } from "../../constants/routes";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-2 py-1.5 transition hover:text-base-100 ${
    isActive ? "text-term-400" : "text-base-300"
  }`;

export default function ProtectedNavbar() {
  const logoutMutation = useLogoutMutation();

  return (
    <>
      <LoginModal />
      <header className="sticky top-0 z-30 border-b border-base-700/60 bg-base-950/85 backdrop-blur-md">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 text-sm"
          aria-label="Primary"
        >
          <div className="flex items-center gap-6">
            <Link
              to={protectedRoutes.home}
              className="flex items-baseline gap-1 text-base font-bold tracking-tight text-base-100"
            >
              <span className="text-term-400" aria-hidden="true">
                ~/
              </span>
              {messages.APP_NAME}
              <span
                className="cursor-blink -mb-px inline-block h-4 w-2 self-center bg-term-400"
                aria-hidden="true"
              ></span>
            </Link>

            <div className="hidden items-center gap-1 sm:flex">
              <NavLink to={protectedRoutes.home} end className={navLinkClass}>
                --problems
              </NavLink>
              <NavLink to={protectedRoutes.stats} className={navLinkClass}>
                --stats
              </NavLink>
            </div>
          </div>

          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            className="px-2 py-1.5 text-base-300 transition hover:text-base-100 disabled:opacity-50"
          >
            {messages.PROTECTED_NAVBAR_LOGOUT_BUTTON_TEXT.toLowerCase()}
          </button>
        </nav>
      </header>
    </>
  );
}
