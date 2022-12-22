import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";
import { createClient } from "@hexabase/hexabase-js";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${process.env.URL}`;

export const datastoreService = {
  getFields,
  getField,
  getActions,
  getDetail,
  getStatuses,
};

async function initHxbClient() {
  const token = JSON.parse(localStorage.getItem("user")).token;
  const hexabase = token && (await createClient({ url: baseUrl, token }));
  return hexabase;
}

async function getFields(datastoreId, projectId) {
  const hexabase = await initHxbClient();
  const { dsFields, error } = await hexabase.datastore.getFields(
    datastoreId,
    projectId
  );
  return dsFields;
}

async function getDetail(datastoreId) {
  const hexabase = await initHxbClient();
  const { datastoreSetting, error } = await hexabase.datastore.getDetail(
    datastoreId
  );
  return datastoreSetting;
}

async function getField(fieldId, datastoreId) {
  const hexabase = await initHxbClient();
  const { dsField, error } = await hexabase.datastore.getField(
    fieldId,
    datastoreId
  );
  return dsField;
}

async function getActions(datastoreId) {
  const hexabase = await initHxbClient();
  const { dsActions, error } = await hexabase.datastore.getActions(
    datastoreId
  );
  return dsActions;
}

async function getStatuses(datastoreId) {
  const hexabase = await initHxbClient();
  const { dsStatuses, error } = await hexabase.datastore.getStatuses(
    datastoreId
  );
  return dsStatuses;
}
