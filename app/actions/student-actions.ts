"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type {
  StudentActionState,
  StudentFormValues,
} from "@/lib/validators/student";
import { studentFormSchema } from "@/lib/validators/student";

function getValidationState(
  values: StudentFormValues,
):
  | { success: true; data: StudentFormValues }
  | { success: false; state: StudentActionState } {
  const parsed = studentFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      state: {
        success: false,
        message: "Please fix the highlighted fields.",
        errors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

function getDatabaseErrorState(error: unknown): StudentActionState {
  if (
    typeof error === "object" &&
    error &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return {
      success: false,
      message: "Student number already exists.",
    };
  }

  return {
    success: false,
    message: "Something went wrong while saving. Please try again.",
  };
}

export async function createStudent(
  values: StudentFormValues,
): Promise<StudentActionState> {
  const validated = getValidationState(values);
  if (!validated.success) {
    return validated.state;
  }

  try {
    await prisma.student.create({
      data: validated.data,
    });
    revalidatePath("/");
    return {
      success: true,
      message: "Student created.",
    };
  } catch (error) {
    return getDatabaseErrorState(error);
  }
}

export async function updateStudent(
  id: number,
  values: StudentFormValues,
): Promise<StudentActionState> {
  const validated = getValidationState(values);
  if (!validated.success) {
    return validated.state;
  }

  try {
    await prisma.student.updateMany({
      data: validated.data,
    });
    return {
      success: true,
      message: "Student updated.",
    };
  } catch (error) {
    return getDatabaseErrorState(error);
  }
}

export async function deleteStudent(id: number) {
  await prisma.student.delete({
    where: {
      id,
    },
  });

  revalidatePath("/");
}
