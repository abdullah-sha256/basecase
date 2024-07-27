import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
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
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type TLoginFormData = {
  email: string;
  password: string;
};

type TLoginFormFieldNames = "email" | "password";

const loginSchema: ZodType<TLoginFormData> = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Please enter a password." }),
});

/**
 * Wrapper component for FormField to ensure typesafety with
 * login fields.
 */
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
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
                <LoginFormField
                  type="email"
                  placeholder="Email"
                  name="email"
                  register={register}
                  error={errors.email}
                  label="Email address"
                />
                <LoginFormField
                  type="password"
                  placeholder="Password"
                  name="password"
                  register={register}
                  error={errors.password}
                  label="Password"
                />
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
