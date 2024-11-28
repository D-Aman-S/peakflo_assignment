import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Task } from "../_types/types";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedTask, setEditedTask] = React.useState<Task | null>(task);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedTask((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setEditedTask((prev) => (prev ? { ...prev, tags } : null));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          name="title"
          value={editedTask?.title || ""}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={editedTask?.description || ""}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          margin="dense"
          label="Due Date"
          name="dueDate"
          type="date"
          value={editedTask?.dueDate || ""}
          onChange={handleChange}
          fullWidth
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />

        <TextField
          margin="dense"
          label="Status"
          name="status"
          value={editedTask?.status || ""}
          onChange={handleChange}
          select
          fullWidth
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          label="Priority"
          name="priority"
          value={editedTask?.priority || "low"}
          onChange={handleChange}
          select
          fullWidth
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>

        <TextField
          margin="dense"
          label="Tags (comma-separated)"
          name="tags"
          value={editedTask?.tags.join(", ") || ""}
          onChange={handleTagsChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
