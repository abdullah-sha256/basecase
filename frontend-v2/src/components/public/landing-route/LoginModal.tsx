import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Box,
  Stack,
  Checkbox,
  Text,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { useModalStore } from "../../../hooks/useModalStore";

export function LoginModal() {
  const isModalOpen = useModalStore((state) => state.isLoginModalOpen);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isModalOpen}
        onClose={useModalStore((state) => state.closeLoginModal)}
        size={"lg"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              p={8}
            >
              <Heading size={"md"} marginBottom={8}>
                Sign in to your account{" "}
              </Heading>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input type="email" />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input type="password" />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                    <Text color={"blue.400"}>Forgot password?</Text>
                  </Stack>
                  <Button
                    bg={"red.500"}
                    color={"white"}
                    _hover={{
                      bg: "red.400",
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
