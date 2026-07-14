import * as Accordion from "@radix-ui/react-accordion";
import { ProblemTable } from "./ProblemTable";
import {
  IProblem,
  ProblemCategory,
  ProblemCategoryToLabel,
  TProblemCategory,
} from "../../../models/problem";
import { useListProblemQuery } from "../../../hooks/useListProblemQuery";
import { useMemo } from "react";
import { messages } from "../../../locale/en-CA";

/**
 * Chevron icon that rotates when the accordion item is open.
 */
const AccordionChevron = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-4 w-4 shrink-0 text-base-400 transition-transform duration-200 group-data-[state=open]:rotate-180"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);

/**
 * ProblemAccordionItem component represents a single accordion item
 * for a specific problem category. It displays a table of problems
 * within the category.
 *
 * @param category - The problem category being displayed.
 * @param problems - Array of problems within the given category.
 * @returns JSX.Element for the accordion item.
 */
const ProblemAccordionItem = ({
  category,
  problems,
}: {
  category: TProblemCategory;
  problems: IProblem[];
}) => (
  <Accordion.Item
    value={category}
    className="mb-4 overflow-hidden rounded-xl border border-base-700 bg-base-900/70 transition hover:border-base-600"
  >
    <Accordion.Header>
      <Accordion.Trigger className="group flex w-full items-center gap-4 px-5 py-4 text-left">
        <span className="flex-1 font-bold text-base-100">
          {ProblemCategoryToLabel[category]}
        </span>
        <span className="text-sm font-bold text-base-400">
          {messages.PROBLEMS_CONTAINER_COMPLETED_COUNT.replace(
            "{total}",
            problems.length.toString()
          )}
        </span>
        <span
          className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-base-700 sm:block"
          aria-hidden="true"
        >
          {/* progress fill — completed tracking lands with the attempt flow */}
          <span className="block h-full w-0 bg-term-500"></span>
        </span>
        <AccordionChevron />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content className="border-t border-base-700/70">
      <ProblemTable problems={problems} />
    </Accordion.Content>
  </Accordion.Item>
);

/**
 * Pulsing placeholder rows shown while the problem list loads.
 */
const ProblemsSkeleton = () => (
  <div role="status" aria-label="Loading problems">
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="mb-4 h-[58px] animate-pulse rounded-xl border border-base-700 bg-base-800/60"
      ></div>
    ))}
  </div>
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

  if (isLoading) {
    return <ProblemsSkeleton />;
  }

  return (
    <Accordion.Root type="multiple">
      {categories.map((category) => (
        <ProblemAccordionItem
          key={category}
          category={category}
          problems={categorizedProblems[category]}
        />
      ))}
    </Accordion.Root>
  );
};
