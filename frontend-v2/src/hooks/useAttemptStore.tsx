import { create } from "zustand";
import { IAttempt, IProblem } from "../models/problem";

interface IAttemptState {
  attempt: IAttempt | undefined;
  setAttempt: (attempt: IAttempt | undefined) => void;
  problem: IProblem | undefined;
  setProblem: (problem: IProblem | undefined) => void;
  isTimeUp: boolean;
  setIsTimeUp: (val: boolean) => void;
  reset: () => void;
}

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
