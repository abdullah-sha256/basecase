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
import { messages } from "../../../locale/en-CA";
import codeNowApi from "../../../apis/codeNowApi";

export type TLoginFormData = {
  username: string;
  password: string;
};

type TLoginFormFieldNames = "username" | "password";

const loginSchema: ZodType<TLoginFormData> = z.object({
  username: z.string().min(1, {
    message: messages.LOGIN_MODAL_USERNAME_FIELD_EMPTY_USERNAME_TEXT,
  }),
  password: z.string().min(1, {
    message: messages.LOGIN_MODAL_PASSWORD_FIELD_EMPTY_PASSWORD_TEXT,
  }),
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
    const temp = await codeNowApi.Account.login(data);
    console.log(temp);
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
                {messages.LOGIN_MODAL_HEADING}
              </Heading>
              <Stack spacing={4}>
                <LoginFormField
                  type="text"
                  placeholder={messages.LOGIN_MODAL_USERNAME_FIELD_PLACEHOLDER}
                  name="username"
                  register={register}
                  error={errors.username}
                  label={messages.LOGIN_MODAL_USERNAME_FIELD_LABEL}
                />
                <LoginFormField
                  type="password"
                  placeholder={messages.LOGIN_MODAL_PASSWORD_FIELD_PLACEHOLDER}
                  name="password"
                  register={register}
                  error={errors.password}
                  label={messages.LOGIN_MODAL_PASSWORD_FIELD_LABEL}
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
                    {messages.LOGIN_MODAL_SIGN_IN_BUTTON_TEXT}
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
