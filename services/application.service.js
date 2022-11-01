import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";
import { createClient } from "@hexabase/hexabase-js";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${process.env.URL}`;
export const appService = {
  getAppAndDs,
  getTemplates,
  createApp,
  getApplication,
  updateProjectName,
};

async function getAppAndDs(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { appAndDs, error } =
    await hexabase.applications.getProjectsAndDatastores(id);
  return appAndDs;
}

//create project
async function createApp(createProjectParams) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { app, error } = await hexabase.applications.create(
    createProjectParams
  );
  return app?.project_id;
}

//get create application templates
async function getTemplates() {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { getTemplates, error } = await hexabase.applications.getTemplates();
  return getTemplates;
}

// get application
async function getApplication(projectId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { getApplications, error } = await hexabase.applications.get(projectId);
  return getApplications;
}

// update project name
async function updateProjectName(payload) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { data, error } = hexabase.applications.updateProjectName(payload);
  return data;
}
