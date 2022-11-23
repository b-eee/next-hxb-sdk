import { BehaviorSubject } from "rxjs";
import getConfig from "next/config";
import Router from "next/router";
import { createClient } from "@hexabase/hexabase-js";

const baseUrl = `${process.env.URL}`;
export const itemService = {
  getItems,
  getItemDetail,
  getFields,
  updateItem,
  create,
  createItemId,
};

async function getItems(datastoreId, projectId, getItemsParameters) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { dsItems, error } = await hexabase.item.get(
    getItemsParameters,
    datastoreId,
    projectId
  );
  return dsItems;
}

async function getItemDetail(datastoreId, itemId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { itemDetails, error } = await hexabase.item.getItemDetail(
    datastoreId,
    itemId
  );
  return itemDetails;
}

async function getFields(datastoreId, projectId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { dsFields, error } = await hexabase.datastore.getFields(
    datastoreId,
    projectId
  );
  return dsFields;
}

async function updateItem(projectId, datastoreId, itemId, payload) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { data, error } = await hexabase.item.update(
    projectId,
    datastoreId,
    itemId,
    payload
  );
  return data;
}

async function create(projectId, datastoreId, newItemPl) {
  console.log(newItemPl);
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { itemNew, error } = await hexabase.item.create(
    projectId,
    datastoreId,
    newItemPl
  );
  return itemNew;
}

async function createItemId(datastoreId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { item_id, error } = await hexabase.item.createItemId(datastoreId);
  return item_id;
}
