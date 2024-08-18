import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FocusableElement } from "@chakra-ui/utils";
import React, { useRef } from "react";
import { IProblem } from "../../../models/problem";
import { messages } from "../../../locale/en-CA";
import { useCreateAttemptMutation } from "../../../hooks/useCreateAttemptMutation";

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
  const cancelRef = useRef<FocusableElement>(null);
  const createAttemptMutation = useCreateAttemptMutation();

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={() => setProblem(undefined)}
      isOpen={!!problem}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>
          {messages.ATTEMPT_CONFIRMATION_HEADER.replace(
            "{problemName}",
            problem?.name || ""
          )}
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{messages.ATTEMPT_CONFIRMATION_BODY}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            ref={cancelRef as React.RefObject<HTMLButtonElement>}
            onClick={() => setProblem(undefined)}
          >
            {messages.ATTEMPT_CONFIRMATION_CANCEL_BUTTON}
          </Button>
          <Button
            colorScheme="red"
            ml={3}
            isLoading={createAttemptMutation.isPending}
            onClick={() => {
              if (problem) {
                setProblem(undefined);
                createAttemptMutation.mutate(problem);
              }
            }}
          >
            {messages.ATTEMPT_CONFIRMATION_CONFIRM_BUTTON}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
