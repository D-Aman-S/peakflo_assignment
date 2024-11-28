"use client";
import { useState, useEffect, SetStateAction, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task, Column, BoardData } from "@/app/_types/types";
import initialData from "../_types/data";
import TaskModal from "../_components/TaskModal";
import Board from "../_components/Board";
import Notification from "../_components/Notifications";
import LoadingSpinner from "../_components/LoadingSpinner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  //---------------------------gettng local storage data---------------------------//
  const [data, setData] = useState<BoardData>(initialData);
  useEffect(() => {
    const fetchData = () => {
      const savedData =
        typeof window !== "undefined"
          ? localStorage.getItem("boardData")
          : null;
      const nData = savedData ? JSON.parse(savedData) : initialData;
      setData(nData);
      setLoading(false);
    };
    fetchData();
  }, []);

  //---------------------------Snackbar state andd functions---------------------------//
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  //---------------------------Drag and Drop functions---------------------------//
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };
  //---------------------------Task utility functions---------------------------//
  const addTask = (columnId: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: "New Task",
      description: "",
      status: columnId,
      dueDate: "",
      priority: "low",
      tags: [],
    };
    const newTasks = { ...data.tasks, [newTaskId]: newTask };

    const newColumn = {
      ...data.columns[columnId],
      taskIds: [...data.columns[columnId].taskIds, newTaskId],
    };

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: newColumn,
      },
    });
  };
  function deleteTasks(taskId: string, columnId: string): void {
    const newTasks = { ...data.tasks };
    delete newTasks[taskId];

    const newTaskIds = data.columns[columnId].taskIds.filter(
      (id) => id !== taskId
    );
    const newColumn = {
      ...data.columns[columnId],
      taskIds: newTaskIds,
    };

    setData({
      ...data,
      tasks: newTasks,
      columns: {
        ...data.columns,
        [columnId]: newColumn,
      },
    });

    setSnackbar({
      open: true,
      message: "Task deleted successfully",
      severity: "success",
    });
  }

  //---------------------------Task Dialog's functions---------------------------//
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const saveTask = (updatedTask: Task) => {
    setData((prevData) => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [updatedTask.id]: updatedTask,
      },
    }));

    setModalOpen(false);
    setSnackbar({
      open: true,
      message: "Task updated successfully",
      severity: "success",
    });
  };

  //to continuously check for data and update local storeage
  useEffect(() => {
    if (!loading && typeof window !== "undefined") {
      localStorage.setItem("boardData", JSON.stringify(data));
    }
  }, [data, loading]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <div className="min-h-screen bg-[#FFDDE1] p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Project Board</h1>
      <Board
        data={data}
        setData={setData}
        onDragEnd={onDragEnd}
        openTaskModal={openTaskModal}
        addTask={addTask}
        deleteTask={deleteTasks}
      />
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
      />
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as "success" | "error"}
        onClose={closeSnackbar}
      />
    </div>
  );
}
