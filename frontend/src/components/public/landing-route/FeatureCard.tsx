import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FC, ReactElement } from "react";
import { messages } from "../../../locale/en-CA";

/**
 * Interface defining the properties needed
 * to render the FeatureCard component.
 */
interface ICardProps {
  /** The heading text to render in the card */
  heading: string;
  /** The description text to render in the card */
  description: string;
  /** The icon to display in the card */
  icon: ReactElement;
  /** The URL to navigate to when the button is clicked */
  href: string;
}

/**
 * A card component that displays an icon, heading, description, and a button.
 *
 * @param {ICardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered card component.
 */
export const FeatureCard: FC<ICardProps> = ({
  heading,
  description,
  icon,
  href,
}) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
    >
      <Stack align={"start"} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"full"}
          bg={useColorModeValue("gray.100", "gray.700")}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={"sm"}>
            {description}
          </Text>
        </Box>
        <Button
          variant={"link"}
          colorScheme={"blue"}
          size={"sm"}
          as="a"
          href={href}
        >
          {messages.LANDING_ROUTE_FEATURE_CARD_LEARN_MORE_TEXT}
        </Button>
      </Stack>
    </Box>
  );
};
