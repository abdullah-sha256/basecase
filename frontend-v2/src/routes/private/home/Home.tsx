import { Box, Container, Heading } from "@chakra-ui/react";
import { ProblemsContainer } from "./ProblemsContainer";

export const HomeRoute = () => {
  return (
    <>
      <Box as="section" bg="bg.surface" marginBottom={20}>
        <Container marginTop={20}>
          <Heading size={"md"} marginBottom={8}>
            All Problems
          </Heading>
          <ProblemsContainer />
        </Container>
      </Box>
    </>
  );
};
