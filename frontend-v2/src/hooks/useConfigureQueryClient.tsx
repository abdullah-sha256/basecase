import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useModalStore } from "./useModalStore";
import { useAppStore } from "./useAppStore";
import { useAuth } from "./useAuth";

export const useConfigureQueryClient = () => {
  const modalStore = useModalStore();
  const appStore = useAppStore();
  const auth = useAuth();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if ((error as AxiosError).response?.status === 401) {
          modalStore.openLoginModal();
          appStore.setshouldRetryAuth(true);
          auth.removeAuthToken();
        }
      },
    }),
  });

  return queryClient;
};
