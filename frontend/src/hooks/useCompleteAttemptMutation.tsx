import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import basecaseApi from "../apis/basecaseApi";
import { AxiosError } from "axios";
import { useModalStore } from "./useModalStore";
import { useAuth } from "./useAuth";
import { IAttempt, ICompleteAttemptPayload } from "../models/problem";
import { useAttemptStore } from "./useAttemptStore";
import { useShallow } from "zustand/react/shallow";

/**
 * Custom hook that completes (scores) the active attempt, then closes the
 * attempt modal and clears the attempt store.
 *
 * A score of 0 records a forfeit/failure; duration is computed server-side.
 */
export const useCompleteAttemptMutation = (): UseMutationResult<
  IAttempt,
  AxiosError,
  ICompleteAttemptPayload,
  unknown
> => {
  const { closeAttemptModal } = useModalStore(
    useShallow((state) => ({ closeAttemptModal: state.closeAttemptModal }))
  );
  const { attempt, resetAttempt } = useAttemptStore(
    useShallow((state) => ({
      attempt: state.attempt,
      resetAttempt: state.reset,
    }))
  );
  const auth = useAuth();
  const queryClient = useQueryClient();

  return useMutation<IAttempt, AxiosError, ICompleteAttemptPayload, unknown>({
    mutationFn: (payload: ICompleteAttemptPayload) =>
      basecaseApi.Problem.completeAttempt(
        attempt!.id,
        payload,
        auth.authToken
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["useListProblemQuery"],
      });
      closeAttemptModal();
      resetAttempt();
    },
  });
};
