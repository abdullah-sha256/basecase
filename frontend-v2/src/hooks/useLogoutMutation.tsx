import { useMutation, UseMutationResult } from "@tanstack/react-query";
import codeNowApi from "../apis/codeNowApi";
import { IUserLogoutFailureResponse } from "../models/account";
import { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for handling user logout via a mutation.
 *
 * @returns
 */
export const useLogoutMutation = (): UseMutationResult<
  void,
  AxiosError<IUserLogoutFailureResponse>,
  void,
  unknown
> => {
  const auth = useAuth();
  const navigate = useNavigate();

  return useMutation<
    void,
    AxiosError<IUserLogoutFailureResponse>,
    void,
    unknown
  >({
    mutationFn: () => codeNowApi.Account.logout(auth.authToken),
    onSettled: () => {
      auth.removeAuthToken();
      navigate("/");
    },
  });
};
