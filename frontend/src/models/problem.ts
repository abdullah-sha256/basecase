import { messages } from "../locale/en-CA";

/**
 * ProblemDifficulty represents the available difficulty levels for a problem.
 * This object is used to map the difficulty levels to their respective string values.
 */
export const ProblemDifficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
} as const;

/**
 * TProblemDifficulty is a type representing the possible difficulty levels.
 */
export type TProblemDifficulty =
  (typeof ProblemDifficulty)[keyof typeof ProblemDifficulty];

/**
 * ProblemCategory represents the available categories for problems.
 * This object maps category names to their respective string values.
 */
export const ProblemCategory = {
  ArraysAndHashing: "arrays-hashing",
  TwoPointers: "two-pointers",
  SlidingWindow: "sliding-window",
  Stack: "stack",
  BinarySearch: "binary-search",
  LinkedList: "linked-list",
  Trees: "trees",
  HeapPQ: "heap-pq",
  Backtracking: "backtracking",
  Tries: "tries",
  Graphs: "graphs",
  AdvancedGraphs: "advanced-graphs",
  Dynamic1D: "dynamic-1d",
  Dynamic2D: "dynamic-2d",
  Greedy: "greedy",
  Intervals: "intervals",
  MathGeometry: "math-geom",
  BitManipulation: "bit-manip",
} as const;

/**
 * TProblemCategory is a type representing the possible categories for problems.
 */
export type TProblemCategory =
  (typeof ProblemCategory)[keyof typeof ProblemCategory];

/**
 * ProblemCategoryToLabel maps problem categories to their human-readable labels.
 * This object is used to display the category names in the UI.
 */
export const ProblemCategoryToLabel: { [key in TProblemCategory]: string } = {
  [ProblemCategory.ArraysAndHashing]: messages.PATTERN_LABEL_ARRAYS_HASHING,
  [ProblemCategory.TwoPointers]: messages.PATTERN_LABEL_TWO_POINTERS,
  [ProblemCategory.SlidingWindow]: messages.PATTERN_LABEL_SLIDING_WINDOW,
  [ProblemCategory.Stack]: messages.PATTERN_LABEL_STACK,
  [ProblemCategory.BinarySearch]: messages.PATTERN_LABEL_BINARY_SEARCH,
  [ProblemCategory.LinkedList]: messages.PATTERN_LABEL_LINKED_LIST,
  [ProblemCategory.Trees]: messages.PATTERN_LABEL_TREES,
  [ProblemCategory.HeapPQ]: messages.PATTERN_LABEL_HEAP_PQ,
  [ProblemCategory.Backtracking]: messages.PATTERN_LABEL_BACKTRACKING,
  [ProblemCategory.Tries]: messages.PATTERN_LABEL_TRIES,
  [ProblemCategory.Graphs]: messages.PATTERN_LABEL_GRAPHS,
  [ProblemCategory.AdvancedGraphs]: messages.PATTERN_LABEL_ADVANCED_GRAPHS,
  [ProblemCategory.Dynamic1D]: messages.PATTERN_LABEL_DYNAMIC_1D,
  [ProblemCategory.Dynamic2D]: messages.PATTERN_LABEL_DYNAMIC_2D,
  [ProblemCategory.Greedy]: messages.PATTERN_LABEL_GREEDY,
  [ProblemCategory.Intervals]: messages.PATTERN_LABEL_INTERVALS,
  [ProblemCategory.MathGeometry]: messages.PATTERN_LABEL_MATH_GEOMETRY,
  [ProblemCategory.BitManipulation]: messages.PATTERN_LABEL_BIT_MANIPULATION,
} as const;

/**
 * IProblem represents the structure of a coding problem.
 */
export interface IProblem {
  id: string;
  name: string;
  lc_id: string;
  difficulty: TProblemDifficulty;
  category: TProblemCategory;
  last_attempt?: IAttempt;
  attempts?: IAttempt[];
}

/**
 * IAttempt represents the structure of an attempt to solve a problem.
 *
 * @remarks
 * `duration`, `score`, and `num_attempts` are null while the attempt is
 * still in progress; completing the attempt fills them in.
 */
export interface IAttempt {
  id: number;
  timestamp: string;
  duration: number | null;
  score: number | null;
  num_attempts: number | null;
}

/**
 * An attempt is in progress while it has no recorded outcome.
 */
export const isAttemptInProgress = (attempt: IAttempt): boolean =>
  attempt.score === null &&
  attempt.duration === null &&
  attempt.num_attempts === null;

/**
 * TAttemptOutcome is the rubric outcome for a completed attempt. The
 * backend maps it (plus time and tries) to a 0-10 score.
 */
export type TAttemptOutcome = "clean" | "hints" | "partial" | "failed";

/**
 * Payload for completing (scoring) an attempt: either a rubric outcome
 * (score computed server-side) or a raw score of 0 for forfeit/time-up.
 */
export interface ICompleteAttemptPayload {
  outcome?: TAttemptOutcome;
  score?: number;
  num_attempts?: number;
}

/**
 * Claude's advisory grade for a pasted solution.
 */
export interface IGradeSuggestion {
  outcome: TAttemptOutcome;
  feedback: string;
}

/**
 * Today's study plan: reviews due per the spaced-repetition schedule,
 * plus fresh problems from the least-covered categories.
 */
export interface ITodayPlan {
  reviews: IProblem[];
  new: IProblem[];
}

/**
 * Feature availability reported by the backend.
 */
export interface IClientConfig {
  ai_grading: boolean;
}
