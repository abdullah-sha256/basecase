import { useEffect } from "react";
import { useModalStore } from "../../hooks/useModalStore";
import { messages } from "../../locale/en-CA";

/**
 * The app's root public route. The marketing landing page lives in the
 * standalone Astro site (landing/); this route only signs users in.
 *
 * Opens the login modal on mount, and offers a button to reopen it if the
 * user dismisses the modal.
 */
export const SignInRoute = () => {
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  useEffect(() => {
    openLoginModal();
  }, [openLoginModal]);

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-72 max-w-xl rounded-full bg-glow-500/15 blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-base-100">
          {messages.SIGN_IN_ROUTE_HEADING}
          <span className="text-glow-400">.</span>
        </h1>
        <p className="mt-3 font-sans text-base-300">
          {messages.SIGN_IN_ROUTE_SUBHEADING}
        </p>
        <button
          onClick={openLoginModal}
          className="mt-8 rounded-lg bg-term-500 px-6 py-3 font-semibold text-base-950 shadow-glow-term-md transition hover:bg-term-400"
        >
          $ {messages.SIGN_IN_ROUTE_BUTTON_TEXT.toLowerCase()}
        </button>
      </div>
    </section>
  );
};
