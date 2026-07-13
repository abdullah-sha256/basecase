import * as AlertDialog from "@radix-ui/react-alert-dialog";
import React from "react";
import { IProblem } from "../../../models/problem";
import { messages } from "../../../locale/en-CA";
import { useCreateAttemptMutation } from "../../../hooks/useCreateAttemptMutation";
import { difficultyToMaxAttemptTime } from "../../../constants/utils";

interface IAttemptConfirmationDialogProps {
  problemToAttempt: IProblem | undefined;
  setProblemToAttempt: (problem: IProblem | undefined) => void;
}

/**
 * AttemptConfirmationDialog component displays a confirmation dialog
 * when the user initiates an attempt on a problem. It confirms whether
 * the user wants to proceed with attempting the problem.
 *
 * @param problemToAttempt - The problem that the user is about to attempt.
 * @param setProblemToAttempt - Function to update the problem to attempt. Setting it to undefined closes the dialog.
 *
 * @returns JSX.Element representing the confirmation dialog.
 */
export const AttemptConfirmationDialog: React.FC<
  IAttemptConfirmationDialogProps
> = ({ problemToAttempt: problem, setProblemToAttempt: setProblem }) => {
  const createAttemptMutation = useCreateAttemptMutation();

  const minutes = problem
    ? difficultyToMaxAttemptTime[problem.difficulty] / 60
    : 0;

  return (
    <AlertDialog.Root
      open={!!problem}
      onOpenChange={(open) => {
        if (!open) setProblem(undefined);
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-40 bg-base-950/70 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-base-700 bg-base-900 p-6 shadow-2xl shadow-black/50 focus:outline-none">
          <AlertDialog.Title className="text-base font-bold text-base-100">
            <span className="text-term-400" aria-hidden="true">
              ${" "}
            </span>
            {messages.ATTEMPT_CONFIRMATION_HEADER.replace(
              "{problemName}",
              problem?.name || ""
            )}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 font-sans text-sm text-base-300">
            {messages.ATTEMPT_CONFIRMATION_BODY.replace(
              "{minutes}",
              minutes.toString()
            )}
          </AlertDialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button className="rounded-md border border-base-700 px-4 py-2 text-sm font-semibold text-base-300 transition hover:border-base-400 hover:text-base-100">
                {messages.ATTEMPT_CONFIRMATION_CANCEL_BUTTON.toLowerCase()}
              </button>
            </AlertDialog.Cancel>
            <button
              disabled={createAttemptMutation.isPending}
              className="rounded-md bg-term-500 px-4 py-2 text-sm font-semibold text-base-950 shadow-glow-term-sm transition hover:bg-term-400 disabled:opacity-60"
              onClick={() => {
                if (problem) {
                  setProblem(undefined);
                  createAttemptMutation.mutate(problem);
                }
              }}
            >
              ${" "}
              {messages.ATTEMPT_CONFIRMATION_CONFIRM_BUTTON.toLowerCase()}
            </button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
