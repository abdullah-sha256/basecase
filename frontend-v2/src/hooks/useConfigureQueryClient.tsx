import { QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useModalStore } from "./useModalStore";
import { useAppStore } from "./useAppStore";
import { useAuth } from "./useAuth";
import { useShallow } from "zustand/react/shallow";

/**
 * Custom hook to configure and return a `QueryClient` instance for React Query.
 *
 * @remarks
 * This hook sets up a `QueryClient` with a custom `QueryCache` that handles errors globally.
 *
 * @returns {QueryClient} A configured `QueryClient` instance.
 */
export const useConfigureQueryClient = (): QueryClient => {
  const { openLoginModal } = useModalStore(
    useShallow((state) => ({ openLoginModal: state.openLoginModal }))
  );
  const { setShouldRetryAuth } = useAppStore(
    useShallow((state) => ({ setShouldRetryAuth: state.setShouldRetryAuth }))
  );
  const auth = useAuth();

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      /**
       * Handles errors globally for all queries.
       *
       * @param error - The error object thrown by a query.
       */
      onError: (error) => {
        if ((error as AxiosError).response?.status === 401) {
          openLoginModal();
          setShouldRetryAuth(true);
          auth.removeAuthToken();
        }
      },
    }),
  });

  return queryClient;
};
