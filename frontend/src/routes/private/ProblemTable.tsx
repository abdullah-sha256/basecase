import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Link,
  Text,
  Progress,
  Button,
} from "@chakra-ui/react";
import { IAttempt, IProblem, TProblemDifficulty } from "../../models/problem";
import { formatDistance } from "date-fns";
import React from "react";
import { messages } from "../../locale/en-CA";

interface IProblemTableProps {
  problems: IProblem[];
}

// Map difficulty levels to their corresponding styles and labels
const difficultyStyles = {
  easy: {
    color: "green.600",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_EASY,
  },
  medium: {
    color: "yellow.600",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_MEDIUM,
  },
  hard: {
    color: "red.600",
    label: messages.PROBLEMS_TABLE_DIFFICULTY_HARD,
  },
};

/**
 * ProblemTable component displays a list of coding problems with various details.
 *
 * @param problems - Array of problem objects to display in the table.
 *
 * @returns JSX.Element representing the table of problems.
 */
export const ProblemTable: React.FC<IProblemTableProps> = ({ problems }) => {
  const textStyle = { fontWeight: 700 };

  /**
   * Renders the difficulty text with appropriate styling.
   *
   * @param difficulty - The difficulty level of the problem.
   *
   * @returns JSX.Element with styled difficulty label.
   */
  const renderDifficultyText = (
    difficulty: TProblemDifficulty
  ): JSX.Element => {
    const { color, label } = difficultyStyles[difficulty];
    return (
      <Text color={color} {...textStyle}>
        {label}
      </Text>
    );
  };

  /**
   * Renders the last attempted time as a formatted string.
   *
   * @param lastAttempt - The last attempt object, if any.
   *
   * @returns JSX.Element displaying the formatted last attempt time.
   */
  const renderLastAttemptText = (
    lastAttempt: IAttempt | undefined
  ): JSX.Element => {
    const text =
      lastAttempt && lastAttempt.timestamp
        ? formatDistance(lastAttempt.timestamp, new Date(), {
            addSuffix: true,
          })
            .charAt(0)
            .toUpperCase() +
          formatDistance(lastAttempt.timestamp, new Date(), {
            addSuffix: true,
          }).slice(1)
        : "";
    return <Text {...textStyle}>{text}</Text>;
  };

  /**
   * Renders a progress bar indicating the confidence level based on last attempt.
   *
   * @param lastAttempt - The last attempt object, if any.
   *
   * @returns JSX.Element with a progress bar, indeterminate if in progress.
   */
  const renderConfidenceBar = (
    lastAttempt: IAttempt | undefined
  ): JSX.Element => (
    <Progress
      value={lastAttempt ? undefined : 0}
      isIndeterminate={!!lastAttempt}
    />
  );

  /**
   * Renders the action button for attempting or resuming a problem.
   *
   * @param lastAttempt - The last attempt object, if any.
   *
   * @returns JSX.Element with an action button, "Resume" if in progress, otherwise "Attempt".
   */
  const renderAction = (lastAttempt: IAttempt | undefined): JSX.Element => (
    <Button
      variant="ghost"
      pl={0}
      _hover={{
        color: "red.300",
      }}
      _active={{
        color: "red.300",
      }}
    >
      {lastAttempt
        ? messages.PROBLEMS_TABLE_ACTION_BUTTON_RESUME
        : messages.PROBLEMS_TABLE_ACTION_BUTTON_ATTEMPT}
    </Button>
  );

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>
              <Text {...textStyle}>
                {messages.PROBLEMS_TABLE_PROBLEM_HEADER}
              </Text>
            </Th>
            <Th>
              <Text {...textStyle}>
                {messages.PROBLEMS_TABLE_DIFFICULTY_HEADER}
              </Text>
            </Th>
            <Th>
              <Text {...textStyle}>
                {messages.PROBLEMS_TABLE_CONFIDENCE_HEADER}
              </Text>
            </Th>
            <Th>
              <Text {...textStyle}>
                {messages.PROBLEMS_TABLE_LAST_ATTEMPTED_HEADER}
              </Text>
            </Th>
            <Th>
              <Text {...textStyle}>
                {messages.PROBLEMS_TABLE_ACTION_HEADER}
              </Text>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {problems.map((problem) => (
            <Tr key={problem.id}>
              <Td>
                <Link {...textStyle}>{problem.name}</Link>
              </Td>
              <Td>{renderDifficultyText(problem.difficulty)}</Td>
              <Td>{renderConfidenceBar(problem.last_attempt)}</Td>
              <Td>{renderLastAttemptText(problem.last_attempt)}</Td>
              <Td>{renderAction(problem.last_attempt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ProblemTable;
