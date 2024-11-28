import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Notification = ({
  message,
  severity,
  open,
  onClose,
}: {
  message: string;
  severity: "success" | "error" | "warning" | "info";
  open: boolean;
  onClose: () => void;
}) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
    <Alert onClose={onClose} severity={severity} variant="filled">
      {message}
    </Alert>
  </Snackbar>
);

export default Notification;
