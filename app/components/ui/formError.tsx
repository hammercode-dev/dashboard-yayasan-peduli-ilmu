import { type FieldErrors } from "react-hook-form";

type FormErrorProps<T extends FieldErrors> = {
  name: keyof T;
  errors: T;
};

export function FormError<T extends FieldErrors>({ name, errors }: FormErrorProps<T>) {
  const error = errors[name];
  if (!error) return null;

  return <span className="text-xs text-red-500">{error.message?.toString()}</span>;
}
