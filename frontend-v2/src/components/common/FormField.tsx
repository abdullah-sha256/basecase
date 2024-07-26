import { HTMLInputTypeAttribute } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@chakra-ui/react";

export interface IFormFieldProps<T extends Path<V>, V extends FieldValues> {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  name: T;
  register: UseFormRegister<V>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
}

export function FormField<T extends Path<V>, V extends FieldValues>({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}: IFormFieldProps<T, V>): React.ReactElement {
  return (
    <>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </>
  );
}
