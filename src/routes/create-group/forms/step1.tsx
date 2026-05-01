import {useFormContext} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Sparkle} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

export function Step1() {
    const {
        control,
        formState: {errors},
    } = useFormContext();

    return (
        <div className={"space-y-8"}>
            <div className={"space-y-2"}>
                <p className={"text-xl font-semibold"}>Before you start penetrating, we should get
                    to know each other better.</p>
            </div>

            {/* Group Name */}
            <FormField
                control={control}
                name="name"
                rules={{
                    required: "Group name is required",
                    maxLength: {
                        value: 63,
                        message: "Max length is 63."
                    },
                    minLength: {
                        value: 3,
                        message: "Min length is 2."
                    },
                    pattern: {
                        value: /^[A-Za-z0-9-]+$/,
                        message: "Invalid characters. Only letters, numbers, and dashes are allowed."
                    },
                }}
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={"flex flex-row items-center gap-1"}>Group Name <Sparkle
                            className={"size-2 text-primary"}/></FormLabel>
                        <FormControl>
                            <Input
                                className={errors["name"] ? "border-red-500 drop-shadow-md" : ""}
                                placeholder="ex: platform-team" {...field} />
                        </FormControl>
                        <FormMessage/>
                        <FormDescription>Your group's name. Group names must be unique.</FormDescription>
                    </FormItem>
                )}
            />

            {/* Company */}
            <FormField
                control={control}
                name="company"
                rules={{
                    required: "Company is required",
                    maxLength: {
                        value: 63,
                        message: "Max length is 63."
                    },
                    minLength: {
                        value: 3,
                        message: "Min length is 3."
                    },
                    pattern: {
                        value: /^[A-Za-z0-9.\-_]+(?:\s[A-Za-z0-9.\-_]+)*$/,
                        message: "Invalid characters. Only letters, numbers, periods, dashes, underscores, and single spaces are allowed."
                    },
                }}
                render={({field}) => (
                    <FormItem>
                        <FormLabel className={"flex flex-row items-center gap-1"}>Company <Sparkle
                            className={"size-2 text-primary"}/></FormLabel>
                        <FormControl>
                            <Input
                                className={errors["name"] ? "border-red-500 drop-shadow-md" : ""}
                                placeholder="ex: Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage/>
                        <FormDescription>Your company's name</FormDescription>
                    </FormItem>
                )}
            />
        </div>
    );
};
