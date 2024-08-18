import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import codeNowApi from "../apis/codeNowApi";
import { useAuth } from "./useAuth";
import { IProblem } from "../models/problem";

export const useDetailProblemQuery = (
  problemId: string
): UseQueryResult<IProblem, AxiosError> => {
  const auth = useAuth();

  return useQuery<IProblem, AxiosError>({
    queryKey: ["useDetailProblemQuery"],
    queryFn: () => codeNowApi.Problem.detail(problemId, auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};
