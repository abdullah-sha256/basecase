import { differenceInSeconds } from "date-fns";
import { ProblemDifficulty, TProblemDifficulty } from "../models/problem";

/**
 * A mapping of problem difficulty levels to the maximum allowed attempt time in seconds.
 *
 * @remarks
 * - The time values are stored in seconds.
 *
 * @example
 * ```typescript
 * difficultyToMaxAttemptTime[ProblemDifficulty.Easy]; // 1200 seconds (20 minutes)
 * ```
 */
export const difficultyToMaxAttemptTime: Record<TProblemDifficulty, number> = {
  [ProblemDifficulty.Easy]: 20 * 60,
  [ProblemDifficulty.Medium]: 40 * 60,
  [ProblemDifficulty.Hard]: 60 * 60,
};

export const computeProblemAttemptTimeLeft = (
  attemptTime: number,
  difficulty: TProblemDifficulty
): number => {
  const now = new Date();
  const maxTime = difficultyToMaxAttemptTime[difficulty];

  const secondsElapsed = differenceInSeconds(now, attemptTime);
  const timeLeft = maxTime - secondsElapsed;

  return timeLeft > 0 ? timeLeft : 0;
};

export const computeProblemAttemptTimePercentage = (
  attemptTime: number,
  difficulty: TProblemDifficulty
): number => {
  const maxTime = difficultyToMaxAttemptTime[difficulty];
  return (
    ((maxTime - computeProblemAttemptTimeLeft(attemptTime, difficulty)) /
      maxTime) *
    100
  );
};
