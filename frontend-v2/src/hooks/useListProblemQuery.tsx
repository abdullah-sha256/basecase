import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import codeNowApi from "../apis/codeNowApi";
import { useAuth } from "./useAuth";
import { IProblem } from "../models/problem";

/**
 * Custom hook for fetching list of problems using React Query.
 *
 * @remarks
 * The query is enabled only if an authentication token is present.
 *
 * @returns {UseQueryResult<IProblem[], AxiosError>}
 */
export const useListProblemQuery = (): UseQueryResult<
  IProblem[],
  AxiosError
> => {
  const auth = useAuth();

  return useQuery<IProblem[], AxiosError>({
    queryKey: ["useListProblemQuery"],
    queryFn: () => codeNowApi.Problem.list(auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
