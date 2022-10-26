import { createClient } from "@hexabase/hexabase-js";
const baseUrl = `${process.env.URL}`;

export const storageService = {
  getFile,
  createFile,
  // deleteFile,
};

async function createFile(uploadFilePayload) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const data = await hexabase.storage.createFile(uploadFilePayload);
  return data;
}
// get detail datastore_item
async function getFile(getDownloadFileId) {
  const user = JSON.parse(localStorage.getItem("user"));
  const hexabase = await createClient({ url: baseUrl, token: user.token });
  const { file, error } = await hexabase.storage?.getFile(getDownloadFileId);
  return file;
}

// // get detail datastore_item
// async function createFile(payload: ItemFileAttachmentPl) {
//     const hexabase = await initHxbClient()
//     const {data, error} = await hexabase.storage.createFile(payload)
//     return data
// }

// // get detail datastore_item
// async function deleteFile(fileId: string) {
//     const hexabase = await initHxbClient()
//     const {data, error} = await hexabase.storage.delete(fileId)
//     return data
// }
