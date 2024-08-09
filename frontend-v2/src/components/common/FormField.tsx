import { HTMLInputTypeAttribute } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";

/**
 * IFormFieldProps interface defines the props for the FormField component.
 *
 * @template T - The type of the field name.
 * @template V - The type of the field values.
 */
export interface IFormFieldProps<T extends Path<V>, V extends FieldValues> {
  /**
   * The type attribute specifies the type of `<input>` element.
   * For example, "text", "number", "email", etc.
   */
  type: HTMLInputTypeAttribute;

  /**
   * The placeholder attribute provides a hint to the user of what can be entered in the input field.
   */
  placeholder: string;

  /**
   * The name attribute associates the `<input>` with a specific form field.
   */
  name: T;

  /**
   * The register function from react-hook-form is used to register the input field into the form.
   */
  register: UseFormRegister<V>;

  /**
   * The error object contains information about field validation errors, if any.
   */
  error: FieldError | undefined;

  /**
   * The label is the text that describes the input field.
   */
  label: string;

  /**
   * If true, the value entered in the input will be cast to a number.
   */
  valueAsNumber?: boolean;
}

/**
 * FormField component is a reusable form input field with validation handling, designed to work with react-hook-form.
 *
 * @template T - The type of the field name.
 * @template V - The type of the field values.
 *
 * @param {IFormFieldProps<T, V>} props - The props to configure the FormField component.
 *
 * @returns {React.ReactElement} - A React element representing the form field.
 */
export function FormField<T extends Path<V>, V extends FieldValues>({
  type,
  placeholder,
  name,
  register,
  error,
  label,
  valueAsNumber,
}: IFormFieldProps<T, V>): React.ReactElement {
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
}
