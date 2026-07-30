import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import basecaseApi from "../apis/basecaseApi";
import { useAuth } from "./useAuth";
import { IClientConfig } from "../models/problem";

/**
 * Custom hook for fetching backend feature availability (e.g. whether
 * AI grading is configured).
 */
export const useClientConfigQuery = (): UseQueryResult<
  IClientConfig,
  AxiosError
> => {
  const auth = useAuth();

  return useQuery<IClientConfig, AxiosError>({
    queryKey: ["useClientConfigQuery"],
    queryFn: () => basecaseApi.Config.get(auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
};
