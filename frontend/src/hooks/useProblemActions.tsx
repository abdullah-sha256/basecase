import { useState } from "react";
import { IProblem } from "../models/problem";
import { useModalStore } from "./useModalStore";
import { useAttemptStore } from "./useAttemptStore";
import { computeProblemAttemptTimeLeft } from "../constants/utils";
import { useShallow } from "zustand/react/shallow";

/**
 * Custom hook providing the attempt/resume actions shared by every
 * surface that lists problems (the problems table, the today plan).
 *
 * `problemToAttempt` holds the problem awaiting confirmation; render an
 * AttemptConfirmationDialog with it next to the consuming component.
 */
export const useProblemActions = () => {
  const [problemToAttempt, setProblemToAttempt] = useState<
    IProblem | undefined
  >(undefined);
  const { openAttemptModal } = useModalStore(
    useShallow((state) => ({ openAttemptModal: state.openAttemptModal }))
  );
  const { setAttemptInStore, setProblemInStore, setIsTimeUpInStore } =
    useAttemptStore(
      useShallow((state) => ({
        setProblemInStore: state.setProblem,
        setAttemptInStore: state.setAttempt,
        setIsTimeUpInStore: state.setIsTimeUp,
      }))
    );

  /**
   * Opens the confirmation dialog before starting a fresh attempt.
   */
  const attemptProblem = (problem: IProblem) => {
    setProblemToAttempt(problem);
  };

  /**
   * Resumes the problem's in-progress attempt in the attempt modal.
   */
  const resumeProblem = (problem: IProblem) => {
    setProblemInStore(problem);
    setAttemptInStore(problem.last_attempt);
    const timeLeft = computeProblemAttemptTimeLeft(
      Date.parse(problem.last_attempt!.timestamp),
      problem.difficulty
    );
    setIsTimeUpInStore(timeLeft <= 0);
    openAttemptModal();
  };

  return { problemToAttempt, setProblemToAttempt, attemptProblem, resumeProblem };
};
