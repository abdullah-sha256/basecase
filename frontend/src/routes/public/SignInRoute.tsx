import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useModalStore } from "../../hooks/useModalStore";
import { messages } from "../../locale/en-CA";

/**
 * The app's root public route. The marketing landing page now lives in the
 * standalone Astro site (landing/); this route only signs users in.
 *
 * Opens the login modal on mount, and offers a button to reopen it if the
 * user dismisses the modal.
 */
export const SignInRoute = () => {
  const openLoginModal = useModalStore((state) => state.openLoginModal);

  useEffect(() => {
    openLoginModal();
  }, [openLoginModal]);

  return (
    <Box as="section" bg="bg.surface">
      <Container maxW="md" paddingY={24} textAlign="center">
        <Heading size="md" marginBottom={4}>
          {messages.SIGN_IN_ROUTE_HEADING}
        </Heading>
        <Text color="fg.muted" marginBottom={8}>
          {messages.SIGN_IN_ROUTE_SUBHEADING}
        </Text>
        <Button onClick={openLoginModal}>
          {messages.SIGN_IN_ROUTE_BUTTON_TEXT}
        </Button>
      </Container>
    </Box>
  );
};
