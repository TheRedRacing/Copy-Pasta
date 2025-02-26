"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "./ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function HeaderAdd() {
    return (
        <AddDialog>
            <Button size={'sm'}>Add new</Button>
        </AddDialog>
    )
}

export function EmptyAdd() {
    return (
        <AddDialog>
            <button
                type="button"
                className="relative flex-1 w-full h-full rounded-lg border-2 border-dashed border-zinc-300 p-24 text-center hover:border-zinc-400 focus:outline-none"
            >
                <div className="text-center">
                    <h3 className="mt-2 text-sm font-semibold text-zinc-900">
                        No data available
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500">
                        Click the button below to add a new row.
                    </p>
                    <div className="mt-4">
                        <div className={cn(buttonVariants({ variant: "default", size: "default" }))}>
                            Add new row
                        </div>
                    </div>
                </div>
            </button>
        </AddDialog>
    )
}

interface AddDialogProps {
    children: React.ReactNode
}

const formSchema = z.object({
    text: z.string().min(2, "You must enter at least 2 characters"),
    isPrivate: z.boolean().optional(),
})

function AddDialog({ children }: AddDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: "",
            isPrivate: false,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const clipboardText = localStorage.getItem('clipboardTexts') || '[]';
        const clipboard = JSON.parse(clipboardText);
        const nextId = clipboard.length;
        clipboard.unshift({ id: nextId + 1, text: values.text, isPrivate: values.isPrivate });
        localStorage.setItem('clipboardTexts', JSON.stringify(clipboard));
        form.reset();
        setIsOpen(false);
        window.location.reload();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>
                                Add a new row ?
                            </DialogTitle>
                        </DialogHeader>
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPrivate"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between gap-10 rounded-lg border border-zinc-300 p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base font-medium">
                                            Hide row ?
                                        </FormLabel>
                                        <FormDescription className="">
                                            The row will be hide and you need to click on the eye to see it.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" size={'form'}>
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit" size={'form'}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}