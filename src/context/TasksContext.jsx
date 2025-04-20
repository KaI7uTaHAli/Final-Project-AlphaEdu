import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const TasksContext = createContext();

export const useTasks = () => useContext(TasksContext);

export const TasksProvider = ({ children }) => {
  const [task, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get("/api/task");
      setTasks(response.data);
    } catch (error) {
      console.error("❌ Ошибка при загрузке задач", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await axiosInstance.post("/api/task", newTask);
      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("❌ Ошибка при добавлении задачи", error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axiosInstance.put(`/api/task/${id}`, updatedTask);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? { ...task, ...updatedTask } : task))
      );
    } catch (error) {
      console.error("❌ Ошибка при обновлении задачи", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axiosInstance.delete(`/api/task/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("❌ Ошибка при удалении задачи", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{ task, addTask, updateTask, deleteTask, loading }}
    >
      {children}
    </TasksContext.Provider>
  );
};