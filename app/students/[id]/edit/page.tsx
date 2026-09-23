import { notFound } from "next/navigation";

import { StudentForm } from "@/components/student-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type EditStudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = await params;
  const studentId = Number(id);

  if (!Number.isInteger(studentId)) {
    notFound();
  }

  const student = await prisma.student.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Edit Student</CardTitle>
          <CardDescription>Update the student record details.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm
            mode="edit"
            studentId={student.id}
            initialValues={{
              studentNumber: student.studentNumber,
              firstName: student.firstName,
              lastName: student.lastName,
              middleName: student.middleName ?? "",
              age: student.age,
              address: student.address,
              gradeLevel: student.gradeLevel,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}
