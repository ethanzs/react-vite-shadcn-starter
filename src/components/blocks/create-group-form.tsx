import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {Rocket, Sparkle} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PostRegisterOrganization} from "@/lib/api.ts";
import {sleep} from "@/lib/utils.ts";
import {Label} from "@/components/ui/label.tsx";
import {logger} from "@/lib/logger.ts";

const log = logger.child("create-group-form")

type CreateGroupFormProps = {
    setOpen?: (open: boolean) => void
}

export const CreateGroupForm = ({setOpen}: CreateGroupFormProps) => {
    const queryClient = useQueryClient();

    const form = useForm({
        mode: "onSubmit",
        criteriaMode: "all",
    });

    const createGroup = useMutation({
        mutationKey: ["createGroup"],
        mutationFn: async (data: any) => {
            await sleep(1000);

            const response = await PostRegisterOrganization(data["name"])

            if (!response.ok) throw new Error()

            return await response.json()
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(
                {
                    queryKey: ["me"],
                    refetchType: "all",
                },
            )
            setOpen?.(false)
        },
        onError: (error) => log.error("createGroup mutation failed", error),
    })

    const onSubmit = async (data: any) => {
        createGroup.mutate(data);
    }

    const groupName = form.watch("name")

    return <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
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
                                    className={form.formState.errors["name"] ? "border-red-500 drop-shadow-md" : ""}
                                    placeholder="ex: Acme Inc." {...field} />
                            </FormControl>
                            <FormMessage/>
                            <FormDescription>Your company's name</FormDescription>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    rules={{
                        required: "Organization name is required",
                        maxLength: {
                            value: 63,
                            message: "Max length is 63."
                        },
                        minLength: {
                            value: 3,
                            message: "Min length is 3."
                        },
                        pattern: {
                            value: /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/,
                            message: "Invalid characters. Only letters, numbers, and single spaces are allowed."
                        },
                    }}
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className={"flex flex-row items-center gap-1"}>Group Name <Sparkle
                                className={"size-2 text-primary"}/></FormLabel>
                            <FormControl>
                                <Input
                                    className={form.formState.errors["name"] ? "border-red-500 drop-shadow-md" : ""}
                                    placeholder="ex: Powerful Penetrators" {...field} />
                            </FormControl>
                            <FormMessage/>
                            <FormDescription>This will be your Group's display name.</FormDescription>
                        </FormItem>
                    )}
                />
                <div className="space-y-2">
                    <Label htmlFor={"id"}>Group Identifier</Label>
                    <Input
                        id="id"
                        className="read-only:bg-muted"
                        readOnly
                        value={groupName?.replace(/\s+/g, " ").trim().replace(/\s/g, "-").toLowerCase()}
                        placeholder="Group Id"
                        type="text"
                    />
                </div>
                <div className={"flex w-full flex-row justify-end"}>
                    <Button disabled={form.formState.isSubmitting || createGroup.isPending} type={"submit"}
                            className={"w-full sm:w-auto"}>
                        <Rocket/> Create Group
                    </Button>
                </div>
            </form>
        </Form>
    </>
}
