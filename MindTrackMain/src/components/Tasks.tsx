import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  text: string;
  category: string;
  completed: boolean;
}

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Morning meditation", category: "wellness", completed: false },
    { id: "2", text: "Drink 8 glasses of water", category: "health", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("wellness");

  const categories = [
    { value: "wellness", label: "Wellness" },
    { value: "health", label: "Health" },
    { value: "personal", label: "Personal" },
    { value: "work", label: "Work" },
  ];

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error("Please enter a task");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      category,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Task added!");
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task deleted");
  };

  const categoryColors: Record<string, string> = {
    wellness: "bg-primary",
    health: "bg-accent",
    personal: "bg-secondary",
    work: "bg-muted",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tasks</h1>
        <p className="text-muted-foreground">
          Organize your wellness goals and daily activities
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
        <div className="flex gap-3">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a task..."
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTask} className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              No tasks yet. Add one to get started!
            </Card>
          ) : (
            tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 hover:shadow-soft transition-all ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                  />
                  <div className="flex-1">
                    <p
                      className={`${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.text}
                    </p>
                  </div>
                  <span
                    className={`${
                      categoryColors[task.category]
                    } px-3 py-1 rounded-full text-xs text-white`}
                  >
                    {categories.find((c) => c.value === task.category)?.label}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
