import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import codeNowApi from "../apis/codeNowApi";
import { AxiosError } from "axios";
import { useModalStore } from "./useModalStore";
import { useAuth } from "./useAuth";
import { IAttempt, IProblem } from "../models/problem";
import { useAttemptStore } from "./useAttemptStore";
import { useShallow } from "zustand/react/shallow";

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
      codeNowApi.Problem.createAttempt(problem.id, auth.authToken),
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
