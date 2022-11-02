import React, { useState } from "react";
import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import AddProject from "./modals/AddProject";
import EditProject from "./modals/EditProject";

const LeftContainer = styled(Box)`
  width: 240px;
  border-right: 1px solid rgb(231, 235, 240);
  background-color: #ffffff;
  display: flex;
`;

const RowContainer = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ProjectSidebar = ({
  projects,
  projectId,
  setProjectId,
  datastores,
  setSelectedDs,
  setIsChange,
  getAppAndDs,
}) => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);

  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClickAddProject = () => {
    setOpenAddProjectModal(true);
  };

  const handleClickEditProjectIcon = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickEditProject = () => {
    setOpenEditProjectModal(true);
    setAnchorEl(null);
  };

  const handleSelectProject = (event) => {
    setProjectId(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCollapseButtonClick = () => {
    setOpenCollapse(!openCollapse);
  };

  const handleDsClick = (id) => {
    const res = datastores.filter((ds) => ds.datastore_id === id);
    setSelectedDs(res[0]);
  };

  return (
    <LeftContainer>
      <Stack sx={{ width: "100%" }}>
        <RowContainer sx={{ padding: "10px" }}>
          <Typography>Projects</Typography>
          <IconButton aria-label="Add Project" onClick={handleClickAddProject}>
            <AddCircleIcon />
          </IconButton>
        </RowContainer>
        <RowContainer sx={{ padding: "10px", gap: "10px" }}>
          <FormControl fullWidth>
            <Select onChange={handleSelectProject} value={projectId}>
              {projects &&
                projects.map((project) => (
                  <MenuItem
                    key={project.application_id}
                    value={project.application_id}
                  >
                    {project.name || "untitled"}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <IconButton
            aria-describedby={id}
            onClick={handleClickEditProjectIcon}
            disabled={!!!projectId}
          >
            <MoreVertIcon />
          </IconButton>
          <Popover
            id={id}
            open={openPopover}
            anchorEl={openPopover}
            anchorReference="anchorPosition"
            anchorPosition={{ top: 220, left: 400 }}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <List>
              <ListItem sx={{ padding: 0 }}>
                <ListItemButton onClick={handleClickEditProject}>
                  Update
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>
        </RowContainer>
        <Stack direction="column">
          <ListItemButton onClick={handleCollapseButtonClick}>
            <ListItemText primary="datastore" />
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCollapse} timeout="auto" unmountOnExit>
            {datastores &&
              datastores.map((ds) => {
                return (
                  <List
                    component="div"
                    disablePadding
                    key={ds.datastore_id}
                    onClick={() => handleDsClick(ds.datastore_id)}
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={ds.name} />
                    </ListItemButton>
                  </List>
                );
              })}
          </Collapse>
        </Stack>
      </Stack>
      <AddProject
        open={openAddProjectModal}
        setOpen={setOpenAddProjectModal}
        setIsChange={setIsChange}
        getAppAndDs={getAppAndDs}
      />
      <EditProject
        open={openEditProjectModal}
        setOpen={setOpenEditProjectModal}
        projects={projects}
        projectId={projectId}
        getAppAndDs={getAppAndDs}
      />
    </LeftContainer>
  );
};

export default ProjectSidebar;
