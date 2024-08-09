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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import React from "react";
import { useModalStore } from "../../../hooks/useModalStore";
import { FormField, IFormFieldProps } from "../../common/FormField";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { messages } from "../../../locale/en-CA";
import { useLoginMutation } from "../../../hooks/useLoginMutation";
import { useAppStore } from "../../../hooks/useAppStore";

/**
 * Type for login form data.
 *
 * @property {string} username - The username entered by the user.
 * @property {string} password - The password entered by the user.
 */
export type TLoginFormData = {
  username: string;
  password: string;
};

/**
 * Type for login form field names.
 *
 * @remarks
 * This type ensures that only valid field names can be used in the form.
 */
type TLoginFormFieldNames = "username" | "password";

/**
 * Zod schema for validating the login form data.
 *
 * @remarks
 * This schema ensures that both the username and password are not empty.
 */
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

/**
 * LoginModal component for rendering the login modal with form handling.
 *
 * @remarks
 * This component manages the login form submission, form validation, and displays success or error messages based on the login attempt.
 *
 * @returns {React.ReactElement} - A React element representing the login modal.
 */
export const LoginModal = () => {
  const modalStore = useModalStore();
  const appStore = useAppStore();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const loginMutation = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (loginFormData: TLoginFormData) => {
    loginMutation.mutate(loginFormData);
  };

  const closeModal = () => {
    if (!appStore.shouldRetryAuth) {
      modalStore.closeLoginModal();
    }
  };

  const errorMessages = loginMutation.error?.response?.data.non_field_errors;

  const modalTitle = appStore.shouldRetryAuth
    ? messages.LOGIN_MODAL_RETRY_HEADING
    : messages.LOGIN_MODAL_STANDARD_HEADING;

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={modalStore.isLoginModalOpen}
        onClose={closeModal}
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
              <Heading size={"sm"} marginBottom={4}>
                {modalTitle}
              </Heading>
              {loginMutation.isSuccess && (
                <Alert status="success" marginBottom={4}>
                  <AlertIcon />
                  {messages.LOGIN_MODAL_SUCCESS_TEXT}
                </Alert>
              )}
              {loginMutation.isError && (
                <Alert status="error" marginBottom={4}>
                  <AlertIcon />
                  {errorMessages?.map((errorMessage: string, index: number) => (
                    <div key={"login-error-" + index}>{errorMessage}</div>
                  ))}
                </Alert>
              )}
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
                    isLoading={loginMutation.isPending}
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
};
