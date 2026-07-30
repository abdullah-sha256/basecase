import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import basecaseApi from "../apis/basecaseApi";
import { useAuth } from "./useAuth";
import { ITodayPlan } from "../models/problem";

/**
 * Custom hook for fetching today's study plan (due reviews + new picks).
 */
export const useTodayPlanQuery = (): UseQueryResult<ITodayPlan, AxiosError> => {
  const auth = useAuth();

  return useQuery<ITodayPlan, AxiosError>({
    queryKey: ["useTodayPlanQuery"],
    queryFn: () => basecaseApi.Problem.todayPlan(auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 1 * 60 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};
