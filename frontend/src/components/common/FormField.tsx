import { HTMLInputTypeAttribute, useId } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

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
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm text-base-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="w-full rounded-md border border-base-700 bg-base-950/60 px-3 py-2 text-base-100 placeholder:text-base-400 focus:border-term-500 focus:ring-1 focus:ring-term-500 focus:outline-none aria-invalid:border-traffic-red"
        {...register(name, { valueAsNumber })}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-traffic-red">
          {error.message}
        </p>
      )}
    </div>
  );
}
