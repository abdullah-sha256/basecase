import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Container,
  Center,
  Button,
  ModalFooter,
  Link,
  Text,
} from "@chakra-ui/react";
import { useModalStore } from "../../../hooks/useModalStore";
import { AttemptTimer } from "./AttemptTimer";
import {
  ArrowForwardIcon,
  ExternalLinkIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { useAttemptStore } from "../../../hooks/useAttemptStore";
import { useShallow } from "zustand/react/shallow";

export const AttemptModal = () => {
  const { closeAttemptModal, isAttemptModalOpen } = useModalStore(
    useShallow((state) => ({
      closeAttemptModal: state.closeAttemptModal,
      isAttemptModalOpen: state.isAttemptModalOpen,
    }))
  );
  const { attempt, problem, resetAttempt, isTimeUp } = useAttemptStore(
    useShallow((state) => ({
      attempt: state.attempt,
      problem: state.problem,
      isTimeUp: state.isTimeUp,
      resetAttempt: state.reset,
    }))
  );

  if (problem === undefined || attempt === undefined) {
    return null;
  }

  const getHeader = () => {
    return (
      <Text>
        Attempting{" "}
        <Link
          href={"https://leetcode.com/problems/" + problem?.lc_id + "/"}
          color={"white"}
          isExternal
        >
          {problem?.name} <ExternalLinkIcon mx="2px" />
        </Link>
      </Text>
    );
  };

  const getSize = () => {
    return "full";
  };

  const getBody = () => {
    const attemptTime = Date.parse(attempt.timestamp);
    return (
      <Container mt={12}>
        <Center>
          <AttemptTimer
            attemptTime={attemptTime}
            difficulty={problem.difficulty}
          />
        </Center>
        <Center>
          <Button rightIcon={<ArrowForwardIcon />} mt={24} size={"lg"}>
            {isTimeUp ? "Continue" : "Complete Problem"}
          </Button>
        </Center>
      </Container>
    );
  };

  const getFooter = () => {
    return (
      !isTimeUp && (
        <Button leftIcon={<SmallCloseIcon />} mt={24} mr={8} colorScheme="gray">
          Forfeit
        </Button>
      )
    );
  };

  return (
    <>
      <Modal
        isOpen={isAttemptModalOpen}
        onClose={() => {
          closeAttemptModal();
          resetAttempt();
        }}
        size={getSize()}
        isCentered
        returnFocusOnClose={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getHeader()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{getBody()}</ModalBody>
          <ModalFooter>{getFooter()}</ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
