import Link from "next/link";

import { StudentTable } from "@/components/student-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const students = await prisma.student.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  const tableData = students.map((student) => ({
    id: student.id,
    studentNumber: student.studentNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    middleName: student.middleName,
    age: student.age,
    address: student.address,
    gradeLevel: student.gradeLevel,
  }));

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl text-slate-900">
              Student Records
            </CardTitle>
            <CardDescription>Manage student information.</CardDescription>
          </div>
          <Link href="/students/new" className={buttonVariants({})}>
            Add Student
          </Link>
        </CardHeader>
        <CardContent>
          <StudentTable students={tableData} />
        </CardContent>
      </Card>
    </main>
  );
}
