"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { deleteStudent } from "@/app/actions/student-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentRow = {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  age: number;
  address: string;
  gradeLevel: string;
};

type StudentTableProps = {
  students: StudentRow[];
};

type SortKey = "studentNumber" | "name" | "age" | "address" | "gradeLevel";
type SortDirection = "asc" | "desc";

type Filters = {
  studentNumber: string;
  name: string;
  age: string;
  address: string;
  gradeLevel: string;
};

export function StudentTable({ students }: StudentTableProps) {
  const [isPending, startTransition] = useTransition();
  const [sortKey, setSortKey] = useState<SortKey>("studentNumber");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<Filters>({
    studentNumber: "",
    name: "",
    age: "",
    address: "",
    gradeLevel: "",
  });

  const getDisplayName = (student: StudentRow) =>
    `${student.lastName}, ${student.firstName}${student.middleName ? ` ${student.middleName}` : ""}`;

  const onDelete = (id: number) => {
    startTransition(async () => {
      await deleteStudent(id);
    });
  };

  const filteredAndSortedStudents = useMemo(() => {
    const filtered = students.filter((student) => {
      const name = getDisplayName(student).toLowerCase();

      return (
        student.studentNumber
          .toLowerCase()
          .includes(filters.studentNumber.toLowerCase()) &&
        name.includes(filters.name.toLowerCase()) &&
        String(student.age).includes(filters.age.trim()) &&
        student.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        student.gradeLevel.includes(filters.gradeLevel)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortKey === "name") {
        comparison = getDisplayName(a).localeCompare(
          getDisplayName(b),
          undefined,
          {
            numeric: true,
            sensitivity: "base",
          },
        );
      } else if (sortKey === "age") {
        comparison = a.age - b.age;
      } else {
        comparison = String(a[sortKey]).localeCompare(
          String(b[sortKey]),
          undefined,
          {
            numeric: true,
            sensitivity: "case",
          },
        );
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filters, sortDirection, sortKey, students]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getSortLabel = (key: SortKey) => {
    if (sortKey !== key) {
      return "Sort";
    }

    return sortDirection === "asc" ? "ASC" : "DESC";
  };

  if (students.length === 0) {
    return (
      <p className="text-sm text-slate-600">
        No student records yet. Click Add Student to create one.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          value={filters.studentNumber}
          onChange={(event) => setFilter("studentNumber", event.target.value)}
          placeholder="Filter Student #"
          aria-label="Filter by student number"
        />
        <Input
          value={filters.name}
          onChange={(event) => setFilter("name", event.target.value)}
          placeholder="Filter Name"
          aria-label="Filter by name"
        />
        <Input
          value={filters.age}
          onChange={(event) => setFilter("age", event.target.value)}
          placeholder="Filter Age"
          aria-label="Filter by age"
        />
        <Input
          value={filters.address}
          onChange={(event) => setFilter("address", event.target.value)}
          placeholder="Filter Address"
          aria-label="Filter by address"
        />
        <Input
          value={filters.gradeLevel}
          onChange={(event) => setFilter("gradeLevel", event.target.value)}
          placeholder="Filter Grade Level"
          aria-label="Filter by grade level"
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
                  onClick={() => toggleSort("studentNumber")}
                >
                  Student #
                  <span className="text-[10px] text-slate-500">
                    {getSortLabel("studentNumber")}
                  </span>
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
                  onClick={() => toggleSort("name")}
                >
                  Name
                  <span className="text-[10px] text-slate-500">
                    {getSortLabel("name")}
                  </span>
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
                  onClick={() => toggleSort("age")}
                >
                  Age
                  <span className="text-[10px] text-slate-500">
                    {getSortLabel("age")}
                  </span>
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
                  onClick={() => toggleSort("name")}
                >
                  Address
                  <span className="text-[10px] text-slate-500">
                    {getSortLabel("address")}
                  </span>
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-700"
                  onClick={() => toggleSort("gradeLevel")}
                >
                  Grade Level
                  <span className="text-[10px] text-slate-500">
                    {getSortLabel("gradeLevel")}
                  </span>
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.studentNumber}
                </TableCell>
                <TableCell>{getDisplayName(student)}</TableCell>
                <TableCell>{student.age}</TableCell>
                <TableCell>{student.address}</TableCell>
                <TableCell>{student.gradeLevel}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/students/${student.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(student.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredAndSortedStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-slate-500"
                >
                  No matching students for the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
