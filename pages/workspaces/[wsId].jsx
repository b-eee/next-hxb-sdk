import styled from "@emotion/styled";
import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
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

const baseUrl = "https://hxb-graph.hexabase.com/graphql";

const WorkspaceDetail = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [openCollapse, setOpenCollapse] = useState(false);
  const [datastores, setDatastores] = useState([]);
  const [selectedDs, setSelectedDs] = useState();
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);

  const router = useRouter();
  const { wsId } = router.query;
  console.log({ wsId });

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
    console.log({ result });
    if (result) {
      setProjects(result);
    }
  };

  useEffect(() => {
    getAppAndDs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsId]);

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
              <MoreVertOutlinedIcon />
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
    </div>
  );
};

export default WorkspaceDetail;
