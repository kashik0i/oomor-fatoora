"use client";

// RHF
import { useFormContext } from "react-hook-form";
import { ComponentProps } from "react";

// ShadCn
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

type FormCheckboxProps = {
    name: string;
    label: string;
} & Omit<ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange">;

const FormCheckbox = ({ name, label, ...props }: FormCheckboxProps) => {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...props}
                        />
                    </FormControl>
                    <FormLabel className="font-normal">{label}</FormLabel>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormCheckbox;
