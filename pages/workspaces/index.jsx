import Link from "next/link";
import { workspaceService, appService } from "../../services";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { createClient } from "@hexabase/hexabase-js";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
} from "@mui/material";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function Workspaces() {
  let url = `${window.location.origin.toString()}`;
  const [workspaces, setWorkspaces] = useState(null);
  const [wsCurrent, setWsCurrent] = useState(null);
  const [appDs, setAppDs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getAppAndDsData = async (id) => {
    const appAndDs = await appService.getAppAndDs(id);
    if (appAndDs) {
      setAppDs(appAndDs);
      return appAndDs;
    }
  };

  const getWorkspaces = async () => {
    const resWorkspaces = await workspaceService.getWorkspaces();
    setWorkspaces(resWorkspaces.workspaces);
    setWsCurrent(resWorkspaces.current_workspace_id);
  };

  const resetWorkspace = async (wid) => {
    setWorkspaces({
      ...workspaces,
      current_workspace_id: wid,
    });
  };

  const setCurrentWs = async (wsId) => {
    return await workspaceService.setWorkspace(wsId);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = async (e) => {
    resetWorkspace(e.target.value);
    const data = await setCurrentWs(wsCurrent);
    if (data.success) {
      setWsCurrent(e.target.value);
    }
  };

  useEffect(() => {
    getWorkspaces();
  }, []);

  useEffect(() => {
    getAppAndDsData(wsCurrent);
  }, [wsCurrent]);

  return (
    <div className="card">
      <h4 className="card-header">Application in workspace</h4>
      <div className="current-id-ws">
        <div>
          <span> workspace:</span>
          <select
            value={workspaces?.current_workspace_id}
            onChange={(e) => handleChange(e)}
          >
            {workspaces &&
              workspaces &&
              workspaces.map((ws) => {
                return (
                  <option value={ws.workspace_id}> {ws.workspace_name}</option>
                );
              })}
          </select>
        </div>
      </div>
      <hr />
      <div>
        {/* <table className="table-body">
          <thead>
            <tr>
              <th>application id</th>
              <th>display id</th>
              <th>name</th>
              <th>datastores</th>
            </tr>
          </thead>
          <tbody>
            {appDs &&
              appDs.map((as) => {
                return (
                  <tr>
                    <td>{as.application_id}</td>
                    <td>{as.display_id}</td>
                    <td>{as.name}</td>
                    <td>
                      {as.datastores &&
                        as.datastores.map((ds) => {
                          return (
                            <ul>
                              <li>
                                <Link
                                  href={`${url}/pj/${as.application_id}/ds/${ds.datastore_id}`}
                                >
                                  {ds.name}
                                </Link>
                                : {ds.datastore_id}
                              </li>
                            </ul>
                          );
                        })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            {appDs && (
              <TableBody>
                {(rowsPerPage > 0
                  ? workspaces?.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : workspaces
                )?.map((workspace) => (
                  <TableRow
                    key={workspace.workspace_id}
                    hover
                    sx={{ cursor: "pointer" }}
                  >
                    <Link href={`/workspaces/${workspace.workspace_id}`}>
                      <TableCell component="th" scope="row">
                        {workspace.workspace_name}
                      </TableCell>
                    </Link>
                  </TableRow>
                ))}
              </TableBody>
            )}

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={workspaces?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Workspaces;
