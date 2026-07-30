import { useMutation, UseMutationResult } from "@tanstack/react-query";
import basecaseApi from "../apis/basecaseApi";
import { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import { IGradeSuggestion } from "../models/problem";
import { useAttemptStore } from "./useAttemptStore";
import { useShallow } from "zustand/react/shallow";

/**
 * Custom hook that sends a pasted solution to the backend for an
 * advisory AI grade of the active attempt.
 */
export const useGradeAttemptMutation = (): UseMutationResult<
  IGradeSuggestion,
  AxiosError,
  { code: string; notes?: string },
  unknown
> => {
  const { attempt } = useAttemptStore(
    useShallow((state) => ({ attempt: state.attempt }))
  );
  const auth = useAuth();

  return useMutation<
    IGradeSuggestion,
    AxiosError,
    { code: string; notes?: string },
    unknown
  >({
    mutationFn: (payload) =>
      basecaseApi.Problem.gradeAttempt(attempt!.id, payload, auth.authToken),
  });
};
