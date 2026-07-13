import { addSeconds, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { useAttemptStore } from "../../../hooks/useAttemptStore";
import { useShallow } from "zustand/react/shallow";
import {
  computeProblemAttemptTimeLeft,
  computeProblemAttemptTimePercentage,
} from "../../../constants/utils";
import { TProblemDifficulty } from "../../../models/problem";
import { messages } from "../../../locale/en-CA";

const RING_SIZE = 280;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Circular countdown for an in-progress attempt. Ticks every second and
 * flips the attempt store's isTimeUp flag when the countdown expires.
 *
 * @param attemptTime - Epoch milliseconds of when the attempt started.
 * @param difficulty - Problem difficulty; determines the time budget.
 */
export const AttemptTimer = ({
  attemptTime,
  difficulty,
}: {
  attemptTime: number;
  difficulty: TProblemDifficulty;
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(
    computeProblemAttemptTimeLeft(attemptTime, difficulty)
  );
  const { setIsTimeUp } = useAttemptStore(
    useShallow((state) => ({ setIsTimeUp: state.setIsTimeUp }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = computeProblemAttemptTimeLeft(attemptTime, difficulty);
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsTimeUp(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptTime, difficulty, setIsTimeUp]);

  const duration = intervalToDuration({
    start: new Date(0),
    end: addSeconds(new Date(0), remainingTime),
  });

  const pad = (value: number | undefined) =>
    (value ?? 0).toString().padStart(2, "0");
  const clock = `${pad((duration.hours ?? 0) * 60 + (duration.minutes ?? 0))}:${pad(duration.seconds)}`;

  const isTimeUp = remainingTime <= 0;
  const percentElapsed = computeProblemAttemptTimePercentage(
    attemptTime,
    difficulty
  );
  const dashOffset = (RING_CIRCUMFERENCE * percentElapsed) / 100;

  return (
    <div className="relative inline-grid place-items-center">
      <svg
        width={RING_SIZE}
        height={RING_SIZE}
        viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke="var(--bc-base-700)"
          strokeWidth={RING_STROKE}
        />
        <circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RING_RADIUS}
          fill="none"
          stroke={isTimeUp ? "var(--bc-traffic-red)" : "var(--bc-term-500)"}
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute text-center" role="timer" aria-live="polite">
        {isTimeUp ? (
          <p className="text-2xl font-bold text-traffic-red">
            {messages.ATTEMPT_MODAL_TIME_UP}
          </p>
        ) : (
          <>
            <p className="text-5xl font-bold text-base-100">{clock}</p>
            <p className="mt-2 text-sm text-base-400">
              {messages.ATTEMPT_MODAL_TIME_REMAINING}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
