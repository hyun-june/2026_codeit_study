import { useState } from "react";

const tasksData = [
  { id: 1, task: "Walk the dog" },
  { id: 2, task: "Water the plants" },
  { id: 3, task: "Wash the dishes" },
];

export default function Home() {
  const [tasks, setTasks] = useState<{ id: number; task: string }[]>(tasksData);

  const [input, setInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const addTask = () => {
    if (input.trim().length === 0) return;
    const newId = Math.max(...tasks.map((item) => Number(item.id))) + 1;
    setTasks((prev) => [...prev, { id: newId, task: input }]);
    setInput("");
  };

  const deleteTask = (id: number) => {
    const newTasks = tasks.filter((item) => item.id !== id);
    setTasks(newTasks);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Add your task"
          onChange={handleChange}
          value={input}
        />
        <div>
          <button onClick={addTask}>Submit</button>
        </div>
      </div>
      <ul>
        {tasks.map((task) => (
          <TaskItem item={task} key={task.id} onDelete={deleteTask} />
        ))}
      </ul>
    </div>
  );
}

const TaskItem = ({
  item,
  onDelete,
}: {
  item: { id: number; task: string };
  onDelete: (id: number) => void;
}) => {
  const { id, task } = item;
  return (
    <li>
      <span>{task}</span>
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
};
