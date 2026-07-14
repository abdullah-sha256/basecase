import { IAttempt, IProblem, TProblemDifficulty } from "../../../models/problem";
import { formatDistance } from "date-fns";
import React, { useState } from "react";
import { messages } from "../../../locale/en-CA";
import { useModalStore } from "../../../hooks/useModalStore";
import { useAttemptStore } from "../../../hooks/useAttemptStore";
import { computeProblemAttemptTimeLeft } from "../../../constants/utils";
import { useShallow } from "zustand/react/shallow";
import { AttemptConfirmationDialog } from "./AttemptConfirmationDialog";

interface IProblemTableProps {
  problems: IProblem[];
}

// Map difficulty levels to their corresponding styles and labels.
// Colors follow the design system: easy = term green, medium = amber,
// hard = traffic red (see design/DESIGN.md).
const difficultyStyles: Record<
  TProblemDifficulty,
  { className: string; label: string }
> = {
  easy: {
    className: "text-term-400",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_EASY,
  },
  medium: {
    className: "text-amber-400",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_MEDIUM,
  },
  hard: {
    className: "text-traffic-red",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_HARD,
  },
};

/**
 * ProblemTable component displays a list of coding problems with various details.
 *
 * @param problems - Array of problem objects to display in the table.
 *
 * @returns JSX.Element representing the table of problems.
 */
export const ProblemTable: React.FC<IProblemTableProps> = ({ problems }) => {
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

  /**
   * Renders the last attempted time as a formatted string.
   *
   * @param lastAttempt - The last attempt object, if any.
   *
   * @returns The formatted last attempt time, or an empty string.
   */
  const renderLastAttemptText = (lastAttempt: IAttempt | undefined): string => {
    if (!lastAttempt?.timestamp) {
      return "";
    }
    const distance = formatDistance(lastAttempt.timestamp, new Date(), {
      addSuffix: true,
    });
    return distance.charAt(0).toUpperCase() + distance.slice(1);
  };

  /**
   * Renders a progress bar indicating the confidence level based on last attempt.
   *
   * @param lastAttempt - The last attempt object, if any.
   *
   * @returns JSX.Element with a progress bar, indeterminate if in progress.
   */
  const renderConfidenceBar = (
    lastAttempt: IAttempt | undefined
  ): JSX.Element => (
    <span className="block h-1.5 w-24 overflow-hidden rounded-full bg-base-700">
      {lastAttempt ? (
        <span className="progress-sweep block h-full w-2/5 bg-glow-400"></span>
      ) : (
        <span className="block h-full w-0 bg-glow-400"></span>
      )}
    </span>
  );

  const headerClass =
    "px-5 py-3 text-left text-xs font-bold tracking-wider text-base-400 uppercase";
  const cellClass = "px-5 py-3.5";

  return (
    <>
      <AttemptConfirmationDialog
        problemToAttempt={problemToAttempt}
        setProblemToAttempt={setProblemToAttempt}
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-base-700/70 bg-base-800/40">
            <th className={headerClass}>
              {messages.PROBLEMS_TABLE_PROBLEM_HEADER}
            </th>
            <th className={headerClass}>
              {messages.PROBLEMS_TABLE_DIFFICULTY_HEADER}
            </th>
            <th className={headerClass}>
              {messages.PROBLEMS_TABLE_CONFIDENCE_HEADER}
            </th>
            <th className={headerClass}>
              {messages.PROBLEMS_TABLE_LAST_ATTEMPTED_HEADER}
            </th>
            <th className={headerClass}>
              {messages.PROBLEMS_TABLE_ACTION_HEADER}
            </th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr
              key={problem.id}
              className="border-b border-base-700/40 last:border-b-0 hover:bg-base-800/40"
            >
              <td className={`${cellClass} font-bold text-base-100`}>
                {problem.name}
              </td>
              <td
                className={`${cellClass} font-bold ${
                  difficultyStyles[problem.difficulty].className
                }`}
              >
                {difficultyStyles[problem.difficulty].label.toLowerCase()}
              </td>
              <td className={cellClass}>
                {renderConfidenceBar(problem.last_attempt)}
              </td>
              <td className={`${cellClass} text-base-300`}>
                {renderLastAttemptText(problem.last_attempt)}
              </td>
              <td className={cellClass}>
                <button
                  onClick={() =>
                    problem.last_attempt
                      ? resumeProblem(problem)
                      : attemptProblem(problem)
                  }
                  className="font-semibold text-term-400 transition hover:text-term-300"
                >
                  {problem.last_attempt
                    ? messages.PROBLEMS_TABLE_ACTION_BUTTON_RESUME.toLowerCase()
                    : messages.PROBLEMS_TABLE_ACTION_BUTTON_ATTEMPT.toLowerCase()}
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProblemTable;
