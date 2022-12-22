import { createClient } from "@hexabase/hexabase-js";

const baseUrl = `${process.env.URL}`;

export const workspaceService = {
  getWorkspaces,
  setWorkspace,
  createWorkspace,
};

// get all workspaces
async function getWorkspaces() {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { workspaces, error } = await hexabase.workspace.get();
  return workspaces;
}

// set workspace current id
async function setWorkspace(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const setCurrentWsPl = {
    workspace_id: id,
  };
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { data, error } = await hexabase.workspace.setCurrent(setCurrentWsPl);
  return data;
}

// create new workspace
async function createWorkspace(name) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { w_id, error } = await hexabase.workspace.create(name);
  return w_id;
}
