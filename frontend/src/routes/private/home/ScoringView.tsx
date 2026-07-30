import { useState } from "react";
import { TAttemptOutcome } from "../../../models/problem";
import { useClientConfigQuery } from "../../../hooks/useClientConfigQuery";
import { useGradeAttemptMutation } from "../../../hooks/useGradeAttemptMutation";
import { messages } from "../../../locale/en-CA";

const OUTCOMES: {
  value: TAttemptOutcome;
  label: string;
  detail: string;
  accent: string;
}[] = [
  {
    value: "clean",
    label: messages.ATTEMPT_MODAL_OUTCOME_CLEAN,
    detail: messages.ATTEMPT_MODAL_OUTCOME_CLEAN_DETAIL,
    accent: "text-term-400",
  },
  {
    value: "hints",
    label: messages.ATTEMPT_MODAL_OUTCOME_HINTS,
    detail: messages.ATTEMPT_MODAL_OUTCOME_HINTS_DETAIL,
    accent: "text-glow-400",
  },
  {
    value: "partial",
    label: messages.ATTEMPT_MODAL_OUTCOME_PARTIAL,
    detail: messages.ATTEMPT_MODAL_OUTCOME_PARTIAL_DETAIL,
    accent: "text-amber-400",
  },
  {
    value: "failed",
    label: messages.ATTEMPT_MODAL_OUTCOME_FAILED,
    detail: messages.ATTEMPT_MODAL_OUTCOME_FAILED_DETAIL,
    accent: "text-traffic-red",
  },
];

interface IScoringViewProps {
  isPending: boolean;
  onBack: () => void;
  onSubmit: (outcome: TAttemptOutcome, tries: number) => void;
}

/**
 * Rubric-based scoring form shown after "complete problem": pick an
 * outcome, record submissions-until-pass, and optionally paste the
 * solution for an advisory AI grade that prefills the outcome.
 */
export const ScoringView = ({
  isPending,
  onBack,
  onSubmit,
}: IScoringViewProps) => {
  const [outcome, setOutcome] = useState<TAttemptOutcome | undefined>(
    undefined
  );
  const [tries, setTries] = useState<number>(1);
  const [code, setCode] = useState("");

  const { data: config } = useClientConfigQuery();
  const gradeMutation = useGradeAttemptMutation();

  const requestGrade = () => {
    gradeMutation.mutate(
      { code },
      { onSuccess: (suggestion) => setOutcome(suggestion.outcome) }
    );
  };

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-center text-xl font-bold text-base-100">
        {messages.ATTEMPT_MODAL_SCORE_HEADING}
      </h2>

      <fieldset className="mt-8">
        <legend className="mb-3 font-sans text-sm text-base-300">
          {messages.ATTEMPT_MODAL_OUTCOME_LABEL}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OUTCOMES.map((option) => (
            <button
              key={option.value}
              onClick={() => setOutcome(option.value)}
              aria-pressed={outcome === option.value}
              className={`rounded-lg border p-3 text-left transition ${
                outcome === option.value
                  ? "border-term-500 bg-term-500/10 shadow-glow-term-sm"
                  : "border-base-700 hover:border-base-400"
              }`}
            >
              <span className={`block text-sm font-bold ${option.accent}`}>
                {option.label}
              </span>
              <span className="mt-1 block font-sans text-xs text-base-400">
                {option.detail}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {config?.ai_grading && (
        <div className="mt-6 rounded-lg border border-base-700/70 bg-base-950/40 p-4">
          <p className="text-sm font-semibold text-glow-400">
            {"// "}
            {messages.ATTEMPT_MODAL_AI_HEADING}
          </p>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={messages.ATTEMPT_MODAL_AI_PLACEHOLDER}
            rows={5}
            className="mt-3 w-full resize-y rounded-md border border-base-700 bg-base-950/60 px-3 py-2 text-sm text-base-100 placeholder:text-base-400 focus:border-glow-500 focus:ring-1 focus:ring-glow-500 focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            {gradeMutation.isError ? (
              <p className="text-xs text-traffic-red" role="alert">
                ✘ {messages.ATTEMPT_MODAL_AI_ERROR}
              </p>
            ) : (
              <span></span>
            )}
            <button
              onClick={requestGrade}
              disabled={!code.trim() || gradeMutation.isPending}
              className="rounded-md border border-glow-500/60 bg-glow-500/10 px-4 py-1.5 text-sm font-semibold text-glow-300 transition hover:bg-glow-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ${" "}
              {gradeMutation.isPending
                ? messages.ATTEMPT_MODAL_AI_PENDING
                : messages.ATTEMPT_MODAL_AI_BUTTON}
            </button>
          </div>
          {gradeMutation.isSuccess && (
            <p className="mt-3 border-t border-base-700/70 pt-3 font-sans text-sm text-base-200">
              <span className="font-mono text-glow-400" aria-hidden="true">
                claude&gt;{" "}
              </span>
              {gradeMutation.data.feedback}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <label
          htmlFor="attempt-tries"
          className="mb-1.5 block font-sans text-sm text-base-300"
        >
          {messages.ATTEMPT_MODAL_TRIES_LABEL}
        </label>
        <input
          id="attempt-tries"
          type="number"
          min={1}
          max={10}
          value={tries}
          onChange={(event) =>
            setTries(Math.min(10, Math.max(1, Number(event.target.value))))
          }
          className="w-full rounded-md border border-base-700 bg-base-950/60 px-3 py-2 text-base-100 focus:border-term-500 focus:ring-1 focus:ring-term-500 focus:outline-none"
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-base-400 transition hover:text-base-100"
        >
          ← {messages.ATTEMPT_MODAL_BACK_BUTTON}
        </button>
        <button
          onClick={() => outcome && onSubmit(outcome, tries)}
          disabled={outcome === undefined || isPending}
          className="rounded-md bg-term-500 px-5 py-2.5 text-sm font-semibold text-base-950 shadow-glow-term-sm transition hover:bg-term-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          $ {isPending ? "logging..." : messages.ATTEMPT_MODAL_LOG_BUTTON}
        </button>
      </div>
    </div>
  );
};
