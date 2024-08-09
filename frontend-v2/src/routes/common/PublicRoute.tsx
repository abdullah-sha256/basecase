import { Navigate } from "react-router-dom";
import { ReactElement } from "react";
import { useAuth } from "../../hooks/useAuth";
import PublicNavbar from "../../components/common/PublicNavbar";
import { protectedRoutes } from "../../constants/routes";

/**
 * Wrapper component for public routes.
 *
 * @returns
 */
export const PublicRoute = (props: {
  children: ReactElement;
}): ReactElement => {
  const auth = useAuth();

  if (auth.authToken) {
    return <Navigate to={protectedRoutes.home} />;
  }
  return (
    <>
      <PublicNavbar />
      {props.children}
    </>
  );
};
