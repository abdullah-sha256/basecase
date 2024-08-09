import { useLocalStorage } from "usehooks-ts";
import { localStorageKeys } from "../constants/localStorageKeys";

interface IAuth {
  /**
   * The current auth token stored in localStorage.
   * Can be undefined if no token is present.
   */
  authToken: string | undefined;

  /**
   * Function to update the auth token in localStorage.
   */
  setAuthToken: (token: string | undefined) => void;

  /**
   * Function to remove the auth token from localStorage.
   */
  removeAuthToken: () => void;
}

/**
 * Custom hook for managing the authentication token using localStorage.
 *
 * @returns {IUseAuth}
 */
export const useAuth = (): IAuth => {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<
    string | undefined
  >(localStorageKeys.authToken, undefined);

  return {
    authToken,
    setAuthToken,
    removeAuthToken,
  };
};
