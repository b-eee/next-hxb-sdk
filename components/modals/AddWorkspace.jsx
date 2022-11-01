import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel } from "@mui/material";
import { workspaceService } from "../../services";

export default function AddWorkspace({ open, setOpen, getWorkspaces }) {
  const [wsName, setWsName] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddNewWs = async () => {
    await workspaceService.createWorkspace({ name: wsName });
    getWorkspaces();
    setOpen(false);
  };

  const handleChangeWsName = (e) => {
    setWsName(e.target.value);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create A New Workspace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create new workspace here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Workspace name"
            type="email"
            fullWidth
            variant="standard"
            required
            onChange={(e) => handleChangeWsName(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleAddNewWs}
            disabled={!wsName}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
