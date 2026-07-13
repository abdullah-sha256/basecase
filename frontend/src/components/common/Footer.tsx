import { messages } from "../../locale/en-CA";

export default function Footer() {
  return (
    <footer className="border-t border-base-700/60 bg-base-950/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-base-400 sm:flex-row">
        <p className="font-bold text-base-200">
          <span className="text-term-400" aria-hidden="true">
            ~/
          </span>
          {messages.APP_NAME}
        </p>
        <p>{messages.FOOTER_TEXT}</p>
        <p aria-hidden="true">[exit 0]</p>
      </div>
    </footer>
  );
}
