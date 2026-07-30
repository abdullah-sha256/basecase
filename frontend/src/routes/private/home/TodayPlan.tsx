import { IProblem, isAttemptInProgress } from "../../../models/problem";
import { useTodayPlanQuery } from "../../../hooks/useTodayPlanQuery";
import { useProblemActions } from "../../../hooks/useProblemActions";
import { AttemptConfirmationDialog } from "./AttemptConfirmationDialog";
import { messages } from "../../../locale/en-CA";

const difficultyClass: Record<string, string> = {
  easy: "text-term-400",
  medium: "text-amber-400",
  hard: "text-traffic-red",
};

/**
 * Terminal-style "$ basecase today" panel: problems due for review per
 * the spaced-repetition schedule plus fresh picks from the least-covered
 * categories.
 */
export const TodayPlan = () => {
  const { data: plan, isLoading, isError } = useTodayPlanQuery();
  const { problemToAttempt, setProblemToAttempt, attemptProblem, resumeProblem } =
    useProblemActions();

  if (isError) {
    return null;
  }

  const renderRow = (problem: IProblem, tag: string, tagClass: string) => {
    const inProgress =
      problem.last_attempt && isAttemptInProgress(problem.last_attempt);
    return (
      <div
        key={problem.id}
        className="flex items-center gap-3 py-1.5 text-sm"
      >
        <span className="text-base-400" aria-hidden="true">
          ├─
        </span>
        <span className="min-w-0 flex-1 truncate font-bold text-base-100">
          {problem.name}
        </span>
        <span
          className={`hidden font-bold sm:inline ${
            difficultyClass[problem.difficulty]
          }`}
        >
          {problem.difficulty}
        </span>
        <span className={`hidden md:inline ${tagClass}`}>{tag}</span>
        <button
          onClick={() =>
            inProgress ? resumeProblem(problem) : attemptProblem(problem)
          }
          className="font-semibold text-term-400 transition hover:text-term-300"
        >
          {inProgress
            ? messages.PROBLEMS_TABLE_ACTION_BUTTON_RESUME.toLowerCase()
            : messages.PROBLEMS_TABLE_ACTION_BUTTON_ATTEMPT.toLowerCase()}
        </button>
      </div>
    );
  };

  return (
    <>
      <AttemptConfirmationDialog
        problemToAttempt={problemToAttempt}
        setProblemToAttempt={setProblemToAttempt}
      />
      <section className="mb-10 overflow-hidden rounded-xl border border-base-700 bg-base-900/70">
        <div className="flex items-center gap-2 border-b border-base-700 bg-base-800/60 px-5 py-2.5">
          <span
            className="h-2.5 w-2.5 rounded-full bg-traffic-red"
            aria-hidden="true"
          ></span>
          <span
            className="h-2.5 w-2.5 rounded-full bg-traffic-yellow"
            aria-hidden="true"
          ></span>
          <span
            className="h-2.5 w-2.5 rounded-full bg-traffic-green"
            aria-hidden="true"
          ></span>
          <span className="ml-2 text-xs text-base-400">
            {messages.TODAY_PLAN_TITLE}
          </span>
        </div>

        <div className="px-5 py-4">
          {isLoading ? (
            <div
              role="status"
              aria-label="Loading today's plan"
              className="h-16 animate-pulse rounded-md bg-base-800/60"
            ></div>
          ) : plan && plan.reviews.length + plan.new.length > 0 ? (
            <div className="font-mono">
              {plan.reviews.map((problem) =>
                renderRow(
                  problem,
                  messages.TODAY_PLAN_REVIEW_TAG,
                  "text-amber-400"
                )
              )}
              {plan.new.map((problem) =>
                renderRow(problem, messages.TODAY_PLAN_NEW_TAG, "text-base-400")
              )}
            </div>
          ) : (
            <p className="font-sans text-sm text-base-300">
              {messages.TODAY_PLAN_EMPTY}
            </p>
          )}
        </div>
      </section>
    </>
  );
};
