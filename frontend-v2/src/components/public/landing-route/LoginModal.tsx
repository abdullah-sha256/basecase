import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  useColorModeValue,
  Box,
  Stack,
  Checkbox,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import { useModalStore } from "../../../hooks/useModalStore";
import { FormField, IFormFieldProps } from "../../common/FormField";
import { useForm } from "react-hook-form";

type TLoginFormData = {
  email: string;
  password: string;
};

type TLoginFormFieldNames = "email" | "password";

const LoginFormField = (
  props: Omit<IFormFieldProps<TLoginFormFieldNames, TLoginFormData>, "name"> & {
    name: TLoginFormFieldNames;
  }
) => <FormField<TLoginFormFieldNames, TLoginFormData> {...props} />;

export function LoginModal() {
  const isModalOpen = useModalStore((state) => state.isLoginModalOpen);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TLoginFormData>();

  const onSubmit = async (data: TLoginFormData) => {
    console.log("Login submit success:", data);
  };

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
                Sign in to your account
              </Heading>
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <LoginFormField
                    type="email"
                    placeholder="Email"
                    name="email"
                    register={register}
                    error={errors.email}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <LoginFormField
                    type="password"
                    placeholder="Password"
                    name="password"
                    register={register}
                    error={errors.password}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox>Remember me</Checkbox>
                  </Stack>
                  <Button
                    bg={"red.500"}
                    color={"white"}
                    _hover={{
                      bg: "red.400",
                    }}
                    onClick={handleSubmit(onSubmit)}
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
