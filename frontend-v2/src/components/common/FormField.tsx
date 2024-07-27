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

export interface IFormFieldProps<T extends Path<V>, V extends FieldValues> {
  type: HTMLInputTypeAttribute;
  placeholder: string;
  name: T;
  register: UseFormRegister<V>;
  error: FieldError | undefined;
  label: string;
  valueAsNumber?: boolean;
}

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
