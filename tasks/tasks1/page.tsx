"use client";

import { useEffect, useState } from "react";
import { Task } from "@/types/task";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${apiUrl}/tasks`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch(`${apiUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          priority: "MEDIUM",
          status: "TODO",
        }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa công việc này?")) return;
    try {
      await fetch(`${apiUrl}/tasks/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const toggleStatus = async (task: Task) => {
    const nextStatus =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
          ? "DONE"
          : "TODO";
    try {
      await fetch(`${apiUrl}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "text-red-600 bg-red-100";
      case "HIGH":
        return "text-orange-600 bg-orange-100";
      case "MEDIUM":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      default:
        return "bg-gray-300";
    }
  };

  const TaskColumn = ({
    title,
    columnTasks,
    bgColor,
  }: {
    title: string;
    columnTasks: Task[];
    bgColor: string;
  }) => (
    <div
      className={`rounded-2xl p-5 ${bgColor} h-full backdrop-blur-sm border border-white/20 shadow-inner transition-all duration-300`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-gray-600 shadow-sm">
            {columnTasks.length}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {columnTasks.map((task) => (
          <div
            key={task.id}
            className="group relative rounded-xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
          >
            <div className="mb-3 flex items-start justify-between">
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(
                  task.priority,
                )}`}
              >
                {task.priority}
              </span>
              <button
                onClick={() => toggleStatus(task)}
                className={`h-3 w-3 cursor-pointer rounded-full ring-gray-200 ring-offset-1 hover:ring-2 ${getStatusColor(
                  task.status,
                )}`}
                title="Đổi trạng thái"
              ></button>
            </div>

            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              {task.title}
            </h3>
            <p className="mb-4 line-clamp-2 text-sm text-gray-500">
              {task.description || "Không có mô tả"}
            </p>

            <div className="mt-auto flex items-center justify-between border-t pt-3 text-xs text-gray-400">
              <span>
                {new Date(task.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="absolute right-4 top-4 text-gray-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Quản lý công việc thông minh của bạn
            </p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isCreating ? "Đóng" : "+ Thêm công việc"}
          </button>
        </header>

        {isCreating && (
          <form
            onSubmit={handleCreateTask}
            className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Nhập tên công việc cần làm..."
              className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Lưu
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-10 text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-400">Chưa có công việc nào. Hãy tạo mới!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <TaskColumn
              title="Cần làm"
              columnTasks={tasks.filter((t) => t.status === "TODO")}
              bgColor="bg-gray-200/50"
            />
            <TaskColumn
              title="Đang thực hiện"
              columnTasks={tasks.filter((t) => t.status === "IN_PROGRESS")}
              bgColor="bg-blue-100/50"
            />
            <TaskColumn
              title="Đã xong"
              columnTasks={tasks.filter((t) => t.status === "DONE")}
              bgColor="bg-green-100/50"
            />
          </div>
        )}
      </div>
    </div>
  );
}
