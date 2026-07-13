import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import basecaseApi from "../apis/basecaseApi";
import { AxiosError } from "axios";
import { useModalStore } from "./useModalStore";
import { useAuth } from "./useAuth";
import { IAttempt, IProblem } from "../models/problem";
import { useAttemptStore } from "./useAttemptStore";
import { useShallow } from "zustand/react/shallow";

/**
 * Custom hook that creates a new attempt for a problem, then loads it into
 * the attempt store and opens the attempt modal.
 */
export const useCreateAttemptMutation = (): UseMutationResult<
  IAttempt,
  AxiosError,
  IProblem,
  unknown
> => {
  const { openAttemptModal } = useModalStore(
    useShallow((state) => ({ openAttemptModal: state.openAttemptModal }))
  );
  const { attemptStoreSetAttempt, attemptStoreSetProblem } = useAttemptStore(
    useShallow((state) => ({
      attemptStoreSetProblem: state.setProblem,
      attemptStoreSetAttempt: state.setAttempt,
    }))
  );
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation<IAttempt, AxiosError, IProblem, unknown>({
    mutationFn: (problem: IProblem) =>
      basecaseApi.Problem.createAttempt(problem.id, auth.authToken),
    onSuccess: (attempt, problem) => {
      queryClient.invalidateQueries({
        queryKey: ["useListProblemQuery"],
      });
      attemptStoreSetProblem(problem);
      attemptStoreSetAttempt(attempt);
      openAttemptModal();
    },
  });
};
