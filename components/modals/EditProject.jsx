import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { appService } from "../../services/application.service";

export default function EditProject({
  open,
  setOpen,
  projects,
  projectId,
  getAppAndDs,
}) {
  let curretProjectName = "";

  const [projectName, setProjectName] = useState(curretProjectName);
  const handleClose = () => {
    setProjectName(curretProjectName);
    setOpen(false);
  };

  useEffect(() => {
    if (projects && projectId) {
      curretProjectName = projects.filter(
        (project) => project.application_id === projectId
      )[0].name;

      setProjectName(curretProjectName);
    }
  }, [projects, projectId]);

  const handleUpdateProject = async () => {
    const updatePjParam = {
      payload: {
        project_id: projectId,
        project_name: {
          en: projectName,
          ja: projectName,
        },
      },
    };
    await appService.updateProjectName(updatePjParam);
    getAppAndDs();
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Project Settings</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateProject} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
