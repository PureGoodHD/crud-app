import { z } from "zod";

export const studentFormSchema = z.object({
  studentNumber: z.string().trim().min(1, "Student numbers is required."),
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Lost name is required."),
  middleName: z.string().trim().min(1, "Middle name is required."),
  age: z.coerce.number().int(),
  address: z.string().trim().min(1, "Address is required."),
  gradeLevel: z.string().trim().min(1, "Grade level is required."),
});

export type StudentFormInput = z.input<typeof studentFormSchema>;
export type StudentFormValues = z.infer<typeof studentFormSchema>;

export type StudentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
