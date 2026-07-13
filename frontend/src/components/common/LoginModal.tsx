import * as Dialog from "@radix-ui/react-dialog";
import { useModalStore } from "../../hooks/useModalStore";
import { FormField, IFormFieldProps } from "./FormField";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { messages } from "../../locale/en-CA";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import { useAppStore } from "../../hooks/useAppStore";

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
 * A Radix Dialog styled as a basecase terminal window. Manages the login
 * form submission, form validation, and displays success or error messages
 * based on the login attempt.
 *
 * @returns {React.ReactElement} - A React element representing the login modal.
 */
export const LoginModal = () => {
  const modalStore = useModalStore();
  const appStore = useAppStore();
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

  const onOpenChange = (open: boolean) => {
    // The retry-auth modal is sticky: the user must log back in.
    if (!open && !appStore.shouldRetryAuth) {
      modalStore.closeLoginModal();
    }
  };

  const errorMessages = loginMutation.error?.response?.data.non_field_errors;

  const modalTitle = appStore.shouldRetryAuth
    ? messages.LOGIN_MODAL_RETRY_HEADING
    : messages.LOGIN_MODAL_STANDARD_HEADING;

  return (
    <Dialog.Root open={modalStore.isLoginModalOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-base-950/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-base-700 bg-base-900 shadow-2xl shadow-black/50 focus:outline-none">
          {/* terminal title bar */}
          <div className="flex items-center gap-2 border-b border-base-700 bg-base-800/80 px-4 py-2.5">
            <span
              className="h-3 w-3 rounded-full bg-traffic-red"
              aria-hidden="true"
            ></span>
            <span
              className="h-3 w-3 rounded-full bg-traffic-yellow"
              aria-hidden="true"
            ></span>
            <span
              className="h-3 w-3 rounded-full bg-traffic-green"
              aria-hidden="true"
            ></span>
            <span className="ml-3 text-xs text-base-400">basecase — login</span>
          </div>

          <div className="p-6">
            <Dialog.Title className="mb-4 text-sm font-bold text-base-100">
              <span className="text-term-400" aria-hidden="true">
                ${" "}
              </span>
              {modalTitle}
            </Dialog.Title>

            {loginMutation.isSuccess && (
              <div
                role="status"
                className="mb-4 rounded-md border border-term-500/40 bg-term-500/10 px-3 py-2 text-sm text-term-300"
              >
                ✔ {messages.LOGIN_MODAL_SUCCESS_TEXT}
              </div>
            )}
            {loginMutation.isError && (
              <div
                role="alert"
                className="mb-4 rounded-md border border-traffic-red/40 bg-traffic-red/10 px-3 py-2 text-sm text-traffic-red"
              >
                {errorMessages ? (
                  errorMessages.map((errorMessage: string, index: number) => (
                    <div key={"login-error-" + index}>✘ {errorMessage}</div>
                  ))
                ) : (
                  <div>✘ {loginMutation.error.message}</div>
                )}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
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
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-2 rounded-md bg-term-500 px-4 py-2.5 font-semibold text-base-950 shadow-glow-term-sm transition hover:bg-term-400 disabled:opacity-60"
              >
                {loginMutation.isPending
                  ? "authenticating..."
                  : `$ ${messages.LOGIN_MODAL_SIGN_IN_BUTTON_TEXT.toLowerCase()}`}
              </button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
