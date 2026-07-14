import { create } from "zustand";
import { IAttempt, IProblem } from "../models/problem";

interface IAttemptState {
  /**
   * The in-progress attempt shown in the attempt modal, if any.
   */
  attempt: IAttempt | undefined;
  setAttempt: (attempt: IAttempt | undefined) => void;

  /**
   * The problem the attempt belongs to.
   */
  problem: IProblem | undefined;
  setProblem: (problem: IProblem | undefined) => void;

  /**
   * True once the attempt's countdown has expired.
   */
  isTimeUp: boolean;
  setIsTimeUp: (val: boolean) => void;

  /**
   * Clears the active attempt state.
   */
  reset: () => void;
}

/**
 * Zustand store holding the currently active problem attempt.
 */
export const useAttemptStore = create<IAttemptState>((set) => ({
  attempt: undefined,
  setAttempt: (attempt: IAttempt | undefined) =>
    set(() => ({ attempt: attempt })),
  problem: undefined,
  setProblem: (problem: IProblem | undefined) =>
    set(() => ({ problem: problem })),
  isTimeUp: false,
  setIsTimeUp: (val: boolean) => set(() => ({ isTimeUp: val })),
  reset: () =>
    set(() => ({ isTimeUp: false, problem: undefined, attempt: undefined })),
}));
