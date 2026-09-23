import { StudentForm } from "@/components/student-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewStudentPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Card className="border-slate-200 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Add Student</CardTitle>
          <CardDescription>Create a new student record.</CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm mode="create" />
        </CardContent>
      </Card>
    </main>
  );
}
