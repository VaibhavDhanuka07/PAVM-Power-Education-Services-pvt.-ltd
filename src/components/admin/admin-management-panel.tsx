"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type UniversityOption = {
  id: string;
  name: string;
  slug: string;
  location: string;
  mode_supported: string[];
  logo: string | null;
  description: string;
};

type CourseOption = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  sector_id: string;
  mode_id: string;
  sector?: { id: string; name: string; slug?: string } | null;
  mode?: { id: string; name: string } | null;
};

type AssignmentOption = {
  id: string;
  university_id: string;
  course_id: string;
  fees: number;
  duration: string;
  university?: { id?: string; name?: string } | null;
  course?: { id?: string; name?: string } | null;
};

type SimpleOption = {
  id: string;
  name: string;
};

type Props = {
  universities: UniversityOption[];
  courses: CourseOption[];
  assignments: AssignmentOption[];
  sectors: SimpleOption[];
  modes: SimpleOption[];
};

type UniversityDraft = {
  id: string;
  name: string;
  slug: string;
  location: string;
  mode_supported: string;
  logo: string;
  description: string;
};

type CourseDraft = {
  id: string;
  name: string;
  slug: string;
  duration: string;
  sector_id: string;
  mode_id: string;
  description: string;
};

type AssignmentDraft = {
  id: string;
  university_id: string;
  course_id: string;
  fees: string;
  duration: string;
};

export function AdminManagementPanel({ universities, courses, assignments, sectors, modes }: Props) {
  const router = useRouter();

  const [universitySearch, setUniversitySearch] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [assignmentSearch, setAssignmentSearch] = useState("");

  const [editingUniversityId, setEditingUniversityId] = useState<string | null>(null);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);

  const [universityDraft, setUniversityDraft] = useState<UniversityDraft | null>(null);
  const [courseDraft, setCourseDraft] = useState<CourseDraft | null>(null);
  const [assignmentDraft, setAssignmentDraft] = useState<AssignmentDraft | null>(null);

  const [busyKey, setBusyKey] = useState<string>("");
  const [status, setStatus] = useState<{
    universities?: string;
    courses?: string;
    assignments?: string;
  }>({});

  const universityNameById = useMemo(
    () => new Map(universities.map((item) => [item.id, item.name])),
    [universities],
  );
  const courseNameById = useMemo(() => new Map(courses.map((item) => [item.id, item.name])), [courses]);

  const filteredUniversities = useMemo(() => {
    const q = universitySearch.trim().toLowerCase();
    if (!q) return universities;
    return universities.filter((item) =>
      [item.name, item.slug, item.location, item.mode_supported.join(", ")].join(" ").toLowerCase().includes(q),
    );
  }, [universities, universitySearch]);

  const filteredCourses = useMemo(() => {
    const q = courseSearch.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((item) =>
      [item.name, item.slug, item.duration, item.sector?.name ?? "", item.mode?.name ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [courses, courseSearch]);

  const filteredAssignments = useMemo(() => {
    const q = assignmentSearch.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter((item) => {
      const universityName = item.university?.name ?? universityNameById.get(item.university_id) ?? "";
      const courseName = item.course?.name ?? courseNameById.get(item.course_id) ?? "";
      return [universityName, courseName, item.duration, String(item.fees)].join(" ").toLowerCase().includes(q);
    });
  }, [assignments, assignmentSearch, universityNameById, courseNameById]);

  async function runMutation(
    section: "universities" | "courses" | "assignments",
    key: string,
    task: () => Promise<void>,
    successMessage: string,
  ) {
    setBusyKey(key);
    setStatus((prev) => ({ ...prev, [section]: "" }));
    try {
      await task();
      setStatus((prev) => ({ ...prev, [section]: successMessage }));
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setStatus((prev) => ({ ...prev, [section]: message }));
    } finally {
      setBusyKey("");
    }
  }

  async function requestJson(url: string, method: "PUT" | "DELETE", body: Record<string, unknown>) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(json.error || "Request failed");
  }

  function beginUniversityEdit(item: UniversityOption) {
    setEditingUniversityId(item.id);
    setUniversityDraft({
      id: item.id,
      name: item.name,
      slug: item.slug,
      location: item.location,
      mode_supported: item.mode_supported.join(", "),
      logo: item.logo ?? "",
      description: item.description,
    });
  }

  function beginCourseEdit(item: CourseOption) {
    setEditingCourseId(item.id);
    setCourseDraft({
      id: item.id,
      name: item.name,
      slug: item.slug,
      duration: item.duration,
      sector_id: item.sector_id,
      mode_id: item.mode_id,
      description: item.description,
    });
  }

  function beginAssignmentEdit(item: AssignmentOption) {
    setEditingAssignmentId(item.id);
    setAssignmentDraft({
      id: item.id,
      university_id: item.university_id,
      course_id: item.course_id,
      fees: String(item.fees),
      duration: item.duration,
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Manage Universities</h2>
          <Input
            value={universitySearch}
            onChange={(event) => setUniversitySearch(event.target.value)}
            placeholder="Search universities..."
            className="w-full md:max-w-xs"
          />
        </div>
        {status.universities ? <p className="mb-3 text-sm text-slate-600">{status.universities}</p> : null}
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {filteredUniversities.map((item) => {
            const isEditing = editingUniversityId === item.id && universityDraft?.id === item.id;
            return (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                {isEditing && universityDraft ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={universityDraft.name}
                        onChange={(event) => setUniversityDraft({ ...universityDraft, name: event.target.value })}
                        placeholder="University name"
                      />
                      <Input
                        value={universityDraft.slug}
                        onChange={(event) => setUniversityDraft({ ...universityDraft, slug: event.target.value })}
                        placeholder="Slug"
                      />
                      <Input
                        value={universityDraft.location}
                        onChange={(event) => setUniversityDraft({ ...universityDraft, location: event.target.value })}
                        placeholder="Location"
                      />
                      <Input
                        value={universityDraft.mode_supported}
                        onChange={(event) =>
                          setUniversityDraft({ ...universityDraft, mode_supported: event.target.value })
                        }
                        placeholder="Modes (comma separated)"
                      />
                      <Input
                        value={universityDraft.logo}
                        onChange={(event) => setUniversityDraft({ ...universityDraft, logo: event.target.value })}
                        placeholder="Logo URL"
                        className="md:col-span-2"
                      />
                    </div>
                    <Textarea
                      value={universityDraft.description}
                      onChange={(event) => setUniversityDraft({ ...universityDraft, description: event.target.value })}
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyKey === `university-save-${item.id}`}
                        onClick={() =>
                          runMutation(
                            "universities",
                            `university-save-${item.id}`,
                            () => requestJson("/api/admin/universities", "PUT", universityDraft),
                            "University updated successfully.",
                          )
                        }
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUniversityId(null);
                          setUniversityDraft(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.location}</p>
                      <p className="text-xs text-slate-500">{item.slug}</p>
                      <p className="mt-1 text-xs text-slate-600">Modes: {item.mode_supported.join(", ") || "-"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => beginUniversityEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={busyKey === `university-delete-${item.id}`}
                        onClick={() => {
                          if (!window.confirm(`Delete ${item.name}? This will also remove linked course mappings.`)) return;
                          runMutation(
                            "universities",
                            `university-delete-${item.id}`,
                            () => requestJson("/api/admin/universities", "DELETE", { id: item.id }),
                            "University deleted successfully.",
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredUniversities.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              No universities found for this search.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Manage Courses</h2>
          <Input
            value={courseSearch}
            onChange={(event) => setCourseSearch(event.target.value)}
            placeholder="Search courses..."
            className="w-full md:max-w-xs"
          />
        </div>
        {status.courses ? <p className="mb-3 text-sm text-slate-600">{status.courses}</p> : null}
        <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
          {filteredCourses.map((item) => {
            const isEditing = editingCourseId === item.id && courseDraft?.id === item.id;
            return (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                {isEditing && courseDraft ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={courseDraft.name}
                        onChange={(event) => setCourseDraft({ ...courseDraft, name: event.target.value })}
                        placeholder="Course name"
                      />
                      <Input
                        value={courseDraft.slug}
                        onChange={(event) => setCourseDraft({ ...courseDraft, slug: event.target.value })}
                        placeholder="Slug"
                      />
                      <Input
                        value={courseDraft.duration}
                        onChange={(event) => setCourseDraft({ ...courseDraft, duration: event.target.value })}
                        placeholder="Duration"
                      />
                      <Select
                        value={courseDraft.mode_id}
                        onChange={(event) => setCourseDraft({ ...courseDraft, mode_id: event.target.value })}
                      >
                        {modes.map((mode) => (
                          <option key={mode.id} value={mode.id}>
                            {mode.name}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={courseDraft.sector_id}
                        onChange={(event) => setCourseDraft({ ...courseDraft, sector_id: event.target.value })}
                        className="md:col-span-2"
                      >
                        {sectors.map((sector) => (
                          <option key={sector.id} value={sector.id}>
                            {sector.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <Textarea
                      value={courseDraft.description}
                      onChange={(event) => setCourseDraft({ ...courseDraft, description: event.target.value })}
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyKey === `course-save-${item.id}`}
                        onClick={() =>
                          runMutation(
                            "courses",
                            `course-save-${item.id}`,
                            () => requestJson("/api/admin/courses", "PUT", courseDraft),
                            "Course updated successfully.",
                          )
                        }
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingCourseId(null);
                          setCourseDraft(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">
                        {item.mode?.name ?? "-"} | {item.sector?.name ?? "-"} | {item.duration}
                      </p>
                      <p className="text-xs text-slate-500">{item.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => beginCourseEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={busyKey === `course-delete-${item.id}`}
                        onClick={() => {
                          if (!window.confirm(`Delete ${item.name}? This removes linked mappings and ratings.`)) return;
                          runMutation(
                            "courses",
                            `course-delete-${item.id}`,
                            () => requestJson("/api/admin/courses", "DELETE", { id: item.id }),
                            "Course deleted successfully.",
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredCourses.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              No courses found for this search.
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Manage Course Fees by University</h2>
          <Input
            value={assignmentSearch}
            onChange={(event) => setAssignmentSearch(event.target.value)}
            placeholder="Search assignments..."
            className="w-full md:max-w-xs"
          />
        </div>
        {status.assignments ? <p className="mb-3 text-sm text-slate-600">{status.assignments}</p> : null}
        <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
          {filteredAssignments.map((item) => {
            const isEditing = editingAssignmentId === item.id && assignmentDraft?.id === item.id;
            const universityName = item.university?.name ?? universityNameById.get(item.university_id) ?? "Unknown university";
            const courseName = item.course?.name ?? courseNameById.get(item.course_id) ?? "Unknown course";
            return (
              <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                {isEditing && assignmentDraft ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Select
                        value={assignmentDraft.university_id}
                        onChange={(event) =>
                          setAssignmentDraft({ ...assignmentDraft, university_id: event.target.value })
                        }
                      >
                        {universities.map((university) => (
                          <option key={university.id} value={university.id}>
                            {university.name}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={assignmentDraft.course_id}
                        onChange={(event) => setAssignmentDraft({ ...assignmentDraft, course_id: event.target.value })}
                      >
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>
                            {course.name}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        min="0"
                        value={assignmentDraft.fees}
                        onChange={(event) => setAssignmentDraft({ ...assignmentDraft, fees: event.target.value })}
                        placeholder="Fees"
                      />
                      <Input
                        value={assignmentDraft.duration}
                        onChange={(event) => setAssignmentDraft({ ...assignmentDraft, duration: event.target.value })}
                        placeholder="Duration"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={busyKey === `assignment-save-${item.id}`}
                        onClick={() =>
                          runMutation(
                            "assignments",
                            `assignment-save-${item.id}`,
                            () =>
                              requestJson("/api/admin/assignments", "PUT", {
                                ...assignmentDraft,
                                fees: Number(assignmentDraft.fees || 0),
                              }),
                            "Course fee mapping updated successfully.",
                          )
                        }
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingAssignmentId(null);
                          setAssignmentDraft(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{universityName}</p>
                      <p className="text-sm text-slate-600">{courseName}</p>
                      <p className="text-xs text-slate-500">
                        Fees: {item.fees === 0 ? "Contact for Fees" : `Rs ${Number(item.fees).toLocaleString("en-IN")}`} | {item.duration}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => beginAssignmentEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        disabled={busyKey === `assignment-delete-${item.id}`}
                        onClick={() => {
                          if (!window.confirm("Delete this university-course fee mapping?")) return;
                          runMutation(
                            "assignments",
                            `assignment-delete-${item.id}`,
                            () => requestJson("/api/admin/assignments", "DELETE", { id: item.id }),
                            "Course fee mapping deleted successfully.",
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredAssignments.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              No course fee mappings found for this search.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
