import { Button, Container, Heading, Stack, Text } from "@chakra-ui/react";
import { messages } from "../../../locale/en-CA";

export const HeroSection = () => {
  return (
    <Container py={{ base: "16", md: "24" }}>
      <Stack spacing={{ base: "8", md: "10" }}>
        <Stack spacing={{ base: "4", md: "5" }} align="center">
          <Heading size={{ base: "sm", md: "md" }}>
            {messages.LANDING_ROUTE_HERO_SECTION_PRIMARY_HEADER}
          </Heading>
          <Text color="fg.muted" maxW="2xl" textAlign="center" fontSize="xl">
            {messages.LANDING_ROUTE_HERO_SECTION_SECONDARY_HEADER}
          </Text>
        </Stack>
        <Stack
          spacing="3"
          direction={{ base: "column", sm: "row" }}
          justify="center"
        >
          <Button variant="secondary" size="xl">
            {messages.LANDING_ROUTE_HERO_SECTION_SECONDARY_BUTTON_TEXT}
          </Button>
          <Button size="xl">
            {messages.LANDING_ROUTE_HERO_SECTION_PRIMARY_BUTTON_TEXT}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};
