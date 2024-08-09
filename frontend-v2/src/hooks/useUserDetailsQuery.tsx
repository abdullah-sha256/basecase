import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { IUserDetails } from "../models/account";
import { AxiosError } from "axios";
import codeNowApi from "../apis/codeNowApi";
import { useAuth } from "./useAuth";

/**
 * Custom hook for fetching user details using React Query.
 *
 * @remarks
 * The query is enabled only if an authentication token is present.
 *
 * @returns {UseQueryResult<IUserDetails, AxiosError>}
 */
export const useUserDetailsQuery = (): UseQueryResult<
  IUserDetails,
  AxiosError
> => {
  const auth = useAuth();

  return useQuery<IUserDetails, AxiosError>({
    queryKey: ["useUserDetailsQuery"],
    queryFn: () => codeNowApi.Account.details(auth.authToken),
    enabled: !!auth.authToken,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};
