import { Box } from "@chakra-ui/react";
import { useUserDetailsQuery } from "../../hooks/useUserDetailsQuery";

export const HomeRoute = () => {
  const userQuery = useUserDetailsQuery();

  if (userQuery.isLoading || userQuery.isError) {
    return <></>;
  }

  return (
    <>
      <Box as="section" bg="bg.surface">
        Hello, {userQuery.data?.username}!
      </Box>
    </>
  );
};
