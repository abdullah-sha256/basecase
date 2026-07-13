import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Skeleton,
  Progress,
} from "@chakra-ui/react";
import { ProblemTable } from "./ProblemTable";
import {
  IProblem,
  ProblemCategory,
  ProblemCategoryToLabel,
  TProblemCategory,
} from "../../models/problem";
import { useListProblemQuery } from "../../hooks/useListProblemQuery";
import { useMemo } from "react";
import { messages } from "../../locale/en-CA";

/**
 * ProblemAccordionItem component represents a single accordion item
 * for a specific problem category. It displays a table of problems
 * within the category.
 *
 * @param category - The problem category being displayed.
 * @param problems - Array of problems within the given category.
 * @param isLoading - Boolean indicating if the problems are still loading.
 * @returns JSX.Element for the accordion item.
 */
const ProblemAccordionItem = ({
  category,
  problems,
  isLoading,
}: {
  category: TProblemCategory;
  problems: IProblem[];
  isLoading: boolean;
}) => (
  <Skeleton isLoaded={!isLoading}>
    <AccordionItem
      bgColor={"gray.800"}
      border={"solid"}
      borderColor={"gray.500"}
      borderRadius={4}
      key={category}
      marginBottom={6}
    >
      <AccordionButton>
        <Box as="span" flex="3" textAlign="left">
          <Text fontWeight={700}>{ProblemCategoryToLabel[category]}</Text>
        </Box>
        <Box as="span" flex="1" textAlign="right">
          <Text fontWeight={700} marginRight={8} color={"gray.500"}>
            {messages.PROBLEMS_CONTAINER_COMPLETED_COUNT.replace(
              "{total}",
              problems.length.toString()
            )}
          </Text>
        </Box>
        <Box as="span" flex="1" textAlign="right">
          <Progress size={"sm"} value={0} marginRight={8} />
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel p={0}>
        <ProblemTable problems={problems} />
      </AccordionPanel>
    </AccordionItem>
  </Skeleton>
);

/**
 * ProblemsContainer component fetches and displays categorized problems
 * within an accordion. Each category of problems is represented by an
 * accordion item.
 *
 * @returns
 */
export const ProblemsContainer = () => {
  const { data: problems, isLoading, isError } = useListProblemQuery();

  const categories: TProblemCategory[] = Object.values(ProblemCategory);

  // Memoize the filtered problems by category
  const categorizedProblems = useMemo(
    () =>
      categories.reduce((acc, category) => {
        acc[category] = problems
          ? problems.filter((problem) => problem.category === category)
          : [];
        return acc;
      }, {} as Record<TProblemCategory, IProblem[]>),
    [categories, problems]
  );

  // TODO: Error views
  if (isError) {
    return null;
  }

  return (
    <Accordion allowMultiple>
      {categories.map((category) => (
        <ProblemAccordionItem
          key={category}
          category={category}
          problems={categorizedProblems[category]}
          isLoading={isLoading}
        />
      ))}
    </Accordion>
  );
};
