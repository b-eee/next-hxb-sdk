import styled from "@emotion/styled";
import {
  Backdrop,
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
import { Spinner } from "../../components";
import ProjectSidebar from "../../components/ProjectSidebar";
import { CircularProgress } from "@mui/material";

const baseUrl = "https://hxb-graph.hexabase.com/graphql";

const Content = styled(Box)`
  min-height: calc(100vh - 80px);
  display: flex;
  background-color: #eeeeee;
`;

// const LeftContainer = styled(Box)`
//   width: 240px;
//   border-right: 1px solid rgb(231, 235, 240);
//   background-color: #ffffff;
//   display: flex;
// `;

const RightContainer = styled(Box)`
  flex: 1;
`;

// const RowContainer = styled(Stack)`
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: center;
// `;

const WorkspaceDetail = (props) => {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [datastores, setDatastores] = useState([]);
  const [selectedDs, setSelectedDs] = useState();
  const [isChange, setIsChange] = useState(false);
  const [loadingApp, setLoadingApp] = useState(false);

  // const openPopover = Boolean(anchorEl);
  // const id = open ? "simple-popover" : undefined;

  const router = useRouter();
  const { wsId } = router.query;

  const getAppAndDs = async () => {
    setLoadingApp(true);
    if (wsId) {
      try {
        const result = await appService.getAppAndDs(wsId);
        if (result) {
          setProjects(result);
          setIsChange(false);
        }
      } catch (err) {
        console.alert("err happened");
      }
      setLoadingApp(false);
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

  if (loadingApp) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: 1201 }}
        open={open}
        onClick={() => null}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <div className="card">
        <Content>
          <ProjectSidebar
            projects={projects}
            datastores={datastores}
            projectId={projectId}
            setProjectId={setProjectId}
            setSelectedDs={setSelectedDs}
            getAppAndDs={getAppAndDs}
          />
          <RightContainer>
            {selectedDs && (
              <Item datastore={selectedDs} projectId={projectId} />
            )}
          </RightContainer>
        </Content>
      </div>
    );
  }
};

export default WorkspaceDetail;
