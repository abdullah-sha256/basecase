import * as Dialog from "@radix-ui/react-dialog";
import { useModalStore } from "../../../hooks/useModalStore";
import { AttemptTimer } from "./AttemptTimer";
import { useAttemptStore } from "../../../hooks/useAttemptStore";
import { useShallow } from "zustand/react/shallow";
import { messages } from "../../../locale/en-CA";

/**
 * Fullscreen modal for an in-progress attempt: a terminal-style takeover
 * with a countdown timer and a link to the problem on LeetCode.
 *
 * Completing/forfeiting an attempt (score submission) is not implemented
 * yet; the buttons are placeholders for that follow-up.
 */
export const AttemptModal = () => {
  const { closeAttemptModal, isAttemptModalOpen } = useModalStore(
    useShallow((state) => ({
      closeAttemptModal: state.closeAttemptModal,
      isAttemptModalOpen: state.isAttemptModalOpen,
    }))
  );
  const { attempt, problem, resetAttempt, isTimeUp } = useAttemptStore(
    useShallow((state) => ({
      attempt: state.attempt,
      problem: state.problem,
      isTimeUp: state.isTimeUp,
      resetAttempt: state.reset,
    }))
  );

  if (problem === undefined || attempt === undefined) {
    return null;
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      closeAttemptModal();
      resetAttempt();
    }
  };

  const attemptTime = Date.parse(attempt.timestamp);

  return (
    <Dialog.Root open={isAttemptModalOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-base-950/80" />
        <Dialog.Content className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-2xl shadow-black/50 focus:outline-none sm:inset-8">
          {/* terminal title bar */}
          <div className="flex items-center gap-2 border-b border-base-700 bg-base-800/80 px-4 py-2.5">
            <span
              className="h-3 w-3 rounded-full bg-traffic-red"
              aria-hidden="true"
            ></span>
            <span
              className="h-3 w-3 rounded-full bg-traffic-yellow"
              aria-hidden="true"
            ></span>
            <span
              className="h-3 w-3 rounded-full bg-traffic-green"
              aria-hidden="true"
            ></span>
            <Dialog.Title className="ml-3 text-xs text-base-400">
              basecase — {messages.ATTEMPT_MODAL_HEADER.toLowerCase()}:{" "}
              {problem.name}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="ml-auto text-base-400 transition hover:text-base-100"
                aria-label="Close attempt"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center gap-10 overflow-y-auto p-8">
            <p className="text-center text-lg text-base-200">
              <span className="text-term-400" aria-hidden="true">
                ${" "}
              </span>
              {messages.ATTEMPT_MODAL_HEADER.toLowerCase()}{" "}
              <a
                href={`https://leetcode.com/problems/${problem.lc_id}/`}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-glow-400 underline decoration-glow-500/50 underline-offset-4 transition hover:text-glow-300"
              >
                {problem.name} ↗
              </a>
            </p>

            <AttemptTimer
              attemptTime={attemptTime}
              difficulty={problem.difficulty}
            />

            <div className="flex items-center gap-4">
              {!isTimeUp && (
                <button className="rounded-md border border-base-700 px-5 py-2.5 text-sm font-semibold text-base-300 transition hover:border-base-400 hover:text-base-100">
                  ✕ {messages.ATTEMPT_MODAL_FORFEIT_BUTTON.toLowerCase()}
                </button>
              )}
              <button className="rounded-md bg-term-500 px-5 py-2.5 text-sm font-semibold text-base-950 shadow-glow-term-sm transition hover:bg-term-400">
                ${" "}
                {(isTimeUp
                  ? messages.ATTEMPT_MODAL_CONTINUE_BUTTON
                  : messages.ATTEMPT_MODAL_COMPLETE_BUTTON
                ).toLowerCase()}{" "}
                →
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
