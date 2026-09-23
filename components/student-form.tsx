"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { createStudent, updateStudent } from "@/app/actions/student-actions";
import type {
  StudentFormInput,
  StudentFormValues,
} from "@/lib/validators/student";
import { studentFormSchema } from "@/lib/validators/student";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StudentFormProps = {
  mode: "create" | "edit";
  studentId?: number;
  initialValues?: Partial<StudentFormValues>;
};

const defaultValues: StudentFormInput = {
  studentNumber: "",
  firstName: "",
  lastName: "",
  middleName: "",
  age: 1,
  address: "",
  gradeLevel: "",
};

export function StudentForm({
  mode,
  studentId,
  initialValues,
}: StudentFormProps) {
  const router = useRouter();
  const [stateMessage, setStateMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<StudentFormInput, unknown, StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      middleName: initialValues?.middleName ?? "",
    },
  });

  const onSubmit: SubmitHandler<StudentFormValues> = (values) => {
    setStateMessage("");

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createStudent(values)
          : await updateStudent(studentId as number, values);

      if (!result.success) {
        setStateMessage(result.message);
        return;
      }

      router.push("/");
      router.refresh();
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="studentNumber">Student Number</Label>
        <Input id="studentNumber" {...form.register("studentNumber")} />
        {form.formState.errors.studentNumber ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.studentNumber.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...form.register("firstName")} />
          {form.formState.errors.firstName ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.firstName.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...form.register("lastName")} />
          {form.formState.errors.lastName ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.lastName.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" {...form.register("middleName")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...form.register("age", { valueAsNumber: true })}
          />
          {form.formState.errors.age ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.age.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...form.register("address")} />
        {form.formState.errors.address ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.address.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="gradeLevel">Grade Level</Label>
        <Input id="gradeLevel" {...form.register("gradeLevel")} />
        {form.formState.errors.gradeLevel ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.gradeLevel.message}
          </p>
        ) : null}
      </div>

      {stateMessage ? (
        <p className="text-sm text-red-600">{stateMessage}</p>
      ) : null}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create Student"
              : "Update Student"}
        </Button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
