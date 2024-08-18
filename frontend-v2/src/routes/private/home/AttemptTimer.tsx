import { CircularProgress, Heading, Box } from "@chakra-ui/react";
import { addSeconds, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { useAttemptStore } from "../../../hooks/useAttemptStore";
import {
  computeProblemAttemptTimeLeft,
  computeProblemAttemptTimePercentage,
} from "../../../constants/utils";
import { TProblemDifficulty } from "../../../models/problem";

export const AttemptTimer = ({
  attemptTime,
  difficulty,
}: {
  attemptTime: number;
  difficulty: TProblemDifficulty;
}) => {
  const [remainingTime, setRemainingTime] = useState<number>(
    computeProblemAttemptTimeLeft(attemptTime, difficulty)
  );
  const attemptStore = useAttemptStore();

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = computeProblemAttemptTimeLeft(attemptTime, difficulty);
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        attemptStore.setIsTimeUp(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attemptTime]);

  const formattedTime = intervalToDuration({
    start: new Date(0),
    end: addSeconds(new Date(0), remainingTime),
  });

  const renderTimeRemainingText = () => {
    const seconds = formattedTime.seconds ?? 0;
    const minutes = formattedTime.minutes ?? 0;

    if (remainingTime > 0) return `${minutes} Minutes ${seconds} Seconds`;

    return "Time's up!";
  };

  return (
    <Box>
      <CircularProgress
        value={computeProblemAttemptTimePercentage(attemptTime, difficulty)}
        size="20rem"
        color="gray.500"
      ></CircularProgress>
      <Heading mt={8} textAlign={"center"}>
        {renderTimeRemainingText()}
      </Heading>
      <Heading size={"md"} textAlign={"right"} mt={2}>
        {remainingTime > 0 && "Remaining"}
      </Heading>
    </Box>
  );
};
