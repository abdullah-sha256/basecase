import {
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FcAssistant, FcCollaboration, FcDonate } from "react-icons/fc";
import { FeatureCard } from "./FeatureCard";
import { messages } from "../../../locale/en-CA";
import { FC } from "react";

/**
 * This component renders a feature section that includes a heading, a subheading,
 * and three feature cards. It is specifically built for the Landing Route.
 *
 * @returns {JSX.Element} The rendered features section.
 */
export const Features: FC = () => {
  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
        <Heading fontSize={{ base: "2xl", sm: "4xl" }} fontWeight={"bold"}>
          {messages.LANDING_ROUTE_FEATURE_SECTION_PRIMARY_HEADER}
        </Heading>
        <Text color={"gray.600"} fontSize={{ base: "sm", sm: "lg" }}>
          {messages.LANDING_ROUTE_FEATURE_SECTION_SECONDARY_HEADER}
        </Text>
      </Stack>

      <Container maxW={"5xl"} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <FeatureCard
            heading={messages.LANDING_ROUTE_FEATURE_SECTION_FIRST_CARD_HEADER}
            icon={<Icon as={FcAssistant} w={10} h={10} />}
            description={messages.LANDING_ROUTE_FEATURE_SECTION_FIRST_CARD_TEXT}
            href={"#"}
          />
          <FeatureCard
            heading={messages.LANDING_ROUTE_FEATURE_SECTION_SECOND_CARD_HEADER}
            icon={<Icon as={FcCollaboration} w={10} h={10} />}
            description={
              messages.LANDING_ROUTE_FEATURE_SECTION_SECOND_CARD_TEXT
            }
            href={"#"}
          />
          <FeatureCard
            heading={messages.LANDING_ROUTE_FEATURE_SECTION_THIRD_CARD_HEADER}
            icon={<Icon as={FcDonate} w={10} h={10} />}
            description={messages.LANDING_ROUTE_FEATURE_SECTION_THIRD_CARD_TEXT}
            href={"#"}
          />
        </Flex>
      </Container>
    </Box>
  );
};
