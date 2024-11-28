"use client";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { PlusIcon } from "@heroicons/react/20/solid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Tooltip from "@mui/material/Tooltip";
import { nanoid } from "nanoid";
import { BoardData, Column, Task } from "@/app/_types/types";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Modal,
  TextField,
} from "@mui/material";

interface BoardProps {
  data: BoardData;
  setData: React.Dispatch<React.SetStateAction<BoardData>>;
  onDragEnd: (result: DropResult) => void;
  openTaskModal: (task: Task) => void;
  addTask: (columnId: string) => void;
  deleteTask: (taskId: string, columnId: string) => void;
}

const Board: React.FC<BoardProps> = ({
  data,
  setData,
  onDragEnd,
  openTaskModal,
  addTask,
  deleteTask,
}) => {
  const [expandedTasks, setExpandedTasks] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (event: React.MouseEvent, taskId: string) => {
    event.stopPropagation();
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  //for handling column name modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const handleAddColumn = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setNewColumnName("");
  };

  const addColumn = () => {
    if (newColumnName.trim() === "") return;
    const newColumnId = nanoid();
    const newColumn: Column = {
      id: newColumnId,
      title: newColumnName,
      taskIds: [],
    };

    setData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...prevData.columnOrder, newColumnId],
    }));
    handleModalClose();
  };

  const deleteColumn = (columnId: string) => {
    setData((prevData) => {
      const { [columnId]: _, ...newColumns } = prevData.columns;
      const newColumnOrder = prevData.columnOrder.filter(
        (id) => id !== columnId
      );

      const newTasks = { ...prevData.tasks };
      prevData.columns[columnId].taskIds.forEach((taskId) => {
        delete newTasks[taskId];
      });

      return {
        ...prevData,
        columns: newColumns,
        columnOrder: newColumnOrder,
        tasks: newTasks,
      };
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="relative w-fit mx-auto">
          <div className="flex flex-wrap justify-center sm:gap-1 sm:p-1 md:gap-3 md:p-2">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

              return (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div
                      className="bg-white p-4 m-2 w-full  md:w-80 rounded-lg shadow-md"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className="flex justify-between mb-2">
                        <h2 className="font-bold">{column.title}</h2>
                        <Tooltip title="Delete Column" arrow>
                          <button
                            onClick={() => deleteColumn(column.id)}
                            className="text-red-500 ml-auto"
                          >
                            <DeleteIcon
                              className="h-5 w-5"
                              style={{ height: "17px" }}
                            />
                          </button>
                        </Tooltip>
                        <Tooltip title="Add Task" arrow>
                          <button
                            className="text-[#642CA9] hover:text-[#4C1D95]"
                            onClick={() => addTask(column.id)}
                          >
                            <PlusIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      </div>
                      {tasks.map((task, index) => {
                        const isExpanded = expandedTasks[task.id];

                        return (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="bg-white p-4 mb-2 rounded shadow-md cursor-pointer hover:shadow-lg"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => openTaskModal(task)}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-semibold">
                                      {task.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      Due: {task.dueDate}
                                    </p>
                                    <p
                                      className={`text-xs ${
                                        task.priority === "high"
                                          ? "text-red-500"
                                          : task.priority === "medium"
                                          ? "text-yellow-500"
                                          : "text-green-500"
                                      }`}
                                    >
                                      Priority: {task.priority}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openTaskModal(task);
                                      }}
                                    >
                                      <EditIcon
                                        style={{
                                          color: "#642CA9",
                                          height: "15px",
                                          width: "15px",
                                        }}
                                      />
                                    </button>
                                    <button
                                      onClick={(e) => toggleExpand(e, task.id)}
                                    >
                                      {isExpanded ? (
                                        <ExpandLessIcon
                                          className="h-5 w-5"
                                          style={{ color: "#642CA9" }}
                                        />
                                      ) : (
                                        <ExpandMoreIcon
                                          className="h-5 w-5"
                                          style={{ color: "#642CA9" }}
                                        />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {isExpanded && (
                                  <div className="relative">
                                    <p className="text-sm text-gray-600">
                                      {task.description}
                                    </p>
                                    <div className="flex space-x-1 mt-1">
                                      {task.tags.map((tag) => (
                                        <span
                                          key={tag}
                                          className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>

                                    <button
                                      className="absolute  bottom-2 right-[0.75px] text-red-500 

                                  "
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTask(task.id, column.id);
                                      }}
                                    >
                                      <DeleteIcon
                                        className="h-10 w-5"
                                        style={{ paddingTop: "5px" }}
                                      />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
          <div className="absolute top-[-1] left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-2">
            <Tooltip title="Add Column" arrow>
              <button className="" onClick={handleAddColumn}>
                <AddCircleIcon className="h-6 w-6" />
              </button>
            </Tooltip>
          </div>
        </div>
      </DragDropContext>
      <Dialog open={modalOpen} onClose={handleModalClose} fullWidth>
        <DialogTitle>Add New Column</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Column Name"
            type="text"
            fullWidth
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={addColumn} color="primary">
            Add Column
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Board;
