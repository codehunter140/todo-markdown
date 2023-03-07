"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

enum CheckStatus {
  InProgress = "in progress",
  Done = "done",
}

type TodoItem = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export default function Home() {
  const [todoList, setTodoItems] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const savedTodoList = localStorage.getItem("todoList");
    if (savedTodoList) {
      setTodoItems(JSON.parse(savedTodoList));
    }

    const savedMarkdown = localStorage.getItem("markdown");
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    }
  }, []);

  const handleAddTodo = () => {
    const newTodoItem = {
      id: Date.now(),
      title,
      description,
      completed: false,
    };

    const updatedToDoItems = [...todoList, newTodoItem];
    localStorage.setItem("todoList", JSON.stringify(updatedToDoItems));
    setTodoItems(updatedToDoItems);
    setTitle("");
    setDescription("");
  };

  const handleSaveMarkdown = () => {
    localStorage.setItem("markdown", markdown);
  };

  const handleToggleComplete = (id: number) => {
    const updatedToDoItems = todoList.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    localStorage.setItem("todoList", JSON.stringify(updatedToDoItems));
    setTodoItems(updatedToDoItems);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-col w-1/2 p-4">
          <textarea
            placeholder="Enter markdown..."
            className="px-2 py-1 border border-gray-300 rounded h-48 resize-none w-full"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSaveMarkdown}
            >
              Save
            </button>
          </div>
        </div>
        <div className="flex flex-col w-1/2 p-4">
          <textarea
            placeholder="Enter task title..."
            className="mb-2 px-2 py-1 border border-gray-300 rounded w-full h-12 resize-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Enter task description (optional)..."
            className="mb-2 px-2 py-1 border border-gray-300 rounded w-full h-24 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddTodo}
          >
            Save
          </button>
          <div className="mt-4">
            {todoList.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-2 px-2 py-1 border border-gray-300 rounded"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={item.completed}
                  onChange={() => handleToggleComplete(item.id)}
                />
                <div className="flex-grow">{item.title}</div>
                <div
                  className={`text-sm ${
                    item.completed ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  {item.completed ? CheckStatus.Done : CheckStatus.InProgress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 mx-10 self-center">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
