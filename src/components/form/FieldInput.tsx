"use client";

import * as React from "react";
import type {
  Control,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";

type FieldInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: React.ReactNode;
  description?: React.ReactNode;
  rules?: RegisterOptions<TFieldValues, TName>;
  inputProps?: Omit<InputProps, "name" | "defaultValue">;
};

export function FieldInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  rules,
  inputProps,
}: FieldInputProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">{label}</FormLabel>
          <FormControl>
            <Input {...field} {...inputProps} value={field.value ?? ""} />
          </FormControl>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
