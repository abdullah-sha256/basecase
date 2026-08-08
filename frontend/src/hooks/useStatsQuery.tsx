import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import basecaseApi from "../apis/basecaseApi";
import { useAuth } from "./useAuth";
import { IStats } from "../models/problem";

/**
 * Custom hook for fetching the user's aggregate practice statistics.
 */
export const useStatsQuery = (): UseQueryResult<IStats, AxiosError> => {
  const auth = useAuth();

  return useQuery<IStats, AxiosError>({
    queryKey: ["useStatsQuery"],
    queryFn: () => basecaseApi.Stats.get(auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};
