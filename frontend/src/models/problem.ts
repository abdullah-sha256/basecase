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
 */
export interface IAttempt {
  timestamp: string;
  duration: number;
  score: number;
  num_attempts: number;
}
