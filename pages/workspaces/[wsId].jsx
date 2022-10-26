import styled from "@emotion/styled";
import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import { appService } from "../../services/application.service";
import Item from "../../components/Item";
import AddProject from "../../components/modals/AddProject";
import EditProject from "../../components/modals/EditProject";
import UpdateItem from "../../components/modals/UpdateItem";

const baseUrl = "https://hxb-graph.hexabase.com/graphql";

const WorkspaceDetail = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [openCollapse, setOpenCollapse] = useState(false);
  const [datastores, setDatastores] = useState([]);
  const [selectedDs, setSelectedDs] = useState();
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [isChange, setIsChange] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openPopover = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const router = useRouter();
  const { wsId } = router.query;

  const Content = styled(Box)`
    min-height: calc(100vh - 80px);
    display: flex;
    background-color: #eeeeee;
  `;

  const LeftContainer = styled(Box)`
    width: 240px;
    border-right: 1px solid rgb(231, 235, 240);
    background-color: #ffffff;
    display: flex;
  `;

  const RightContainer = styled(Box)`
    flex: 1;
  `;

  const RowContainer = styled(Stack)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `;

  const getAppAndDs = async () => {
    const result = await appService.getAppAndDs(wsId);
    if (result) {
      setProjects(result);
      setIsChange(false);
    }
  };

  useEffect(() => {
    getAppAndDs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsId, isChange]);

  useEffect(() => {
    const result = projects?.filter(
      (project) => project.application_id === projectId
    );
    if (result && result[0]) setDatastores(result[0].datastores);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, projects]);

  const handleSelectProject = (event) => {
    setProjectId(event.target.value);
  };

  const handleButtonClick = () => {
    setOpenCollapse(!openCollapse);
  };

  const handleDsClick = (id) => {
    const res = datastores.filter((ds) => ds.datastore_id === id);
    setSelectedDs(res[0]);
  };

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

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="card">
      <Content>
        <LeftContainer>
          <Stack sx={{ width: "100%" }}>
            <RowContainer sx={{ padding: "10px" }}>
              <Typography>Projects</Typography>
              <IconButton
                aria-label="Add Project"
                onClick={handleClickAddProject}
              >
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
                aria-aria-describedby={id}
                onClick={handleClickEditProjectIcon}
              >
                <MoreVertOutlinedIcon />
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
              <ListItemButton onClick={handleButtonClick}>
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
        </LeftContainer>
        <RightContainer>
          {selectedDs && <Item datastore={selectedDs} projectId={projectId} />}
        </RightContainer>
      </Content>
      <AddProject
        open={openAddProjectModal}
        setOpen={setOpenAddProjectModal}
        setIsChange={setIsChange}
        getAppAndDs={getAppAndDs}
      />
      <EditProject
        open={openEditProjectModal}
        setOpen={setOpenEditProjectModal}
      />
      {/* {selectedDs && selectedItemId && (
        <UpdateItem
          open={openUpdateItemModal}
          selectedItemId={selectedItemId}
          setOpen={setOpenUpdateItemModal}
          datastore={selectedDs}
          projectId={projectId}
        />
      )} */}
    </div>
  );
};

export default WorkspaceDetail;
