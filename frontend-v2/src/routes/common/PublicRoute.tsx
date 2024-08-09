import { Navigate } from "react-router-dom";
import { ReactElement } from "react";
import { useAuth } from "../../hooks/useAuth";
import PublicNavbar from "../../components/common/PublicNavbar";

export const PublicRoute = (props: {
  children: ReactElement;
}): ReactElement => {
  const auth = useAuth();

  if (auth.authToken) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <PublicNavbar />
      {props.children}
    </>
  );
};
