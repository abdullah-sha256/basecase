import { useMutation, UseMutationResult } from "@tanstack/react-query";
import codeNowApi from "../apis/codeNowApi";
import {
  IUserLoginFailureResponse,
  IUserLoginSuccessResponse,
} from "../models/account";
import { TLoginFormData } from "../components/public/landing-route/LoginModal";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useModalStore } from "./useModalStore";
import { protectedRoutes } from "../constants/routes";
import { useAuth } from "./useAuth";

/**
 * Custom hook for handling user login via a mutation.
 *
 * @returns
 */
export const useLoginMutation = (): UseMutationResult<
  IUserLoginSuccessResponse,
  AxiosError<IUserLoginFailureResponse>,
  TLoginFormData,
  unknown
> => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalStore = useModalStore();
  const auth = useAuth();

  return useMutation<
    IUserLoginSuccessResponse,
    AxiosError<IUserLoginFailureResponse>,
    TLoginFormData,
    unknown
  >({
    mutationFn: codeNowApi.Account.login,
    onSuccess: (data: IUserLoginSuccessResponse) => {
      auth.setAuthToken(data.token);
      modalStore.closeLoginModal();

      // Send them back to the page they tried to visit when they were
      // redirected to the landing page. Use { replace: true } so we don't create
      // another entry in the history stack for the login page.  This means that
      // when they get to the protected page and click the back button, they
      // won't end up back on the login page, which is also really nice for the
      // user experience.
      navigate(location.state?.from?.pathname || protectedRoutes.home, {
        replace: true,
      });
    },
  });
};
