import { useLocalStorage } from "usehooks-ts";
import { localStorageAuthKey } from "../constants/localStorageKeys";

export const useAuth = () => {
  const [authToken, setAuthToken, removeAuthToken] = useLocalStorage<
    string | undefined
  >(localStorageAuthKey, undefined);

  return {
    authToken,
    setAuthToken,
    removeAuthToken,
  };
};
