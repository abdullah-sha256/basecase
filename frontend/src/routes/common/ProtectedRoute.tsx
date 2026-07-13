import { Navigate, useLocation } from "react-router-dom";
import { ReactElement } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useAppStore } from "../../hooks/useAppStore";
import ProtectedNavbar from "../../components/common/ProtectedNavbar";

/**
 * Wrapper component for protecting routes that require authentication.
 *
 * @returns
 */
export const ProtectedRoute = (props: {
  children: ReactElement;
}): ReactElement => {
  const location = useLocation();
  const auth = useAuth();
  const appStore = useAppStore();

  if (!auth.authToken && !appStore.shouldRetryAuth) {
    // Redirect them to the landing page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return (
    <>
      <ProtectedNavbar />
      {props.children}
    </>
  );
};
