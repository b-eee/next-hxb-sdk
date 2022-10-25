import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, IconButton, Stack } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import { itemService } from "../services/item.service";
import { storageService } from "../services/storage.service";
import React, { useState, useEffect, SyntheticEvent, ChangeEvent } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ItemDetail(props) {
  const { fieldValues, selectedAction, datastoreId, itemId, projectId } = props;
  const [value, setValue] = useState(0);
  const [files, setFiles] = useState([]);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [fileChange, setFileChange] = useState();

  let changesParams = [];

  console.log({ selectedAction });

  const downloadFile = async (file) => {
    console.log(file);

    // const res = await storageService.getFile(file.file_id);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    const uploadFilePayload = {
      filename: file.name,
      contentTypeFile: file.type,
      filepath: `${datastoreId}/${itemId}/${selectedFieldId}/${file.name}`,
      content: await toBase64(file),
      d_id: datastoreId,
      p_id: projectId,
      field_id: selectedFieldId,
      item_id: itemId,
      display_order: 0,
    };
    await storageService.createFile(uploadFilePayload);

    const change = {
      x: 0,
      y: 0,
      title: "wand privew",
      id: "6351fddbc879b56423574d72",
      rowHeight: "item.rowHeight",
      cols: 5,
      rows: 1,
      dataType: "file",
      status: false,
      as_title: false,
      unique: false,
      value: ["63564640c7950de99bbc6c2f", "63565ecb919ed2784f4c601e"],
      tabindex: 10,
      show_img: false,
      idx: 4,
      errFiles: [],
      uploading: false,
      progressPercentage: 100,
      display_file: true,
      post_file_ids: ["63564640c7950de99bbc6c2f", "63565ecb919ed2784f4c601e"],
    };

    changesParams.push(change);
  };

  const handleSaveUpdateItem = async () => {
    const itemActionParameters = {
      action_id: selectedAction.a_id,
      rev_no: 11,
      history: {
        comment: "",
        datastore_id: datastoreId,
        item_id: itemId,
      },
      changes: changesParams,
    };

    console.log({ projectId, datastoreId, itemId, itemActionParameters });
    const data = await itemService.updateItem(
      projectId,
      datastoreId,
      itemId,
      itemActionParameters
    );
    return data;
  };

  useEffect(() => {
    const fileList = fieldValues?.filter((value) => value.dataType === "file");
    if (fileList) {
      setFiles(fileList[0].value);
      setSelectedFieldId(fileList[0].field_id);
    }
  }, [fieldValues]);

  return (
    <Box>
      <Box sx={{ width: "100%", minWidth: "270px" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Fields" {...a11yProps(0)} />
            <Tab label="Links" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          {fieldValues &&
            fieldValues.map((value) => {
              if (value.dataType !== "file") {
                return value.field_name === "user_id" ? (
                  <>
                    {value.value.map((item) => (
                      <Box key={item.user_id}>
                        <strong>{value.field_name}</strong>
                        <p>{item.user_name}</p>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Box key={value?.field_id}>
                    <strong>{value?.field_name}</strong>
                    {value.value && <p>{value.value}</p>}
                  </Box>
                );
              } else {
                return <></>;
              }
            })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {selectedAction.display_id === "UpdateItem" ? (
            <Stack sx={{ justifyContent: "flex-end" }}>
              <Button sx={{ textAlign: "right" }} component="label">
                Upload
                <input
                  hidden
                  multiple
                  type="file"
                  onChange={handleUploadFile}
                />
              </Button>
            </Stack>
          ) : (
            <></>
          )}
          <Stack spacing={2}>
            {files ? (
              files.map((file) => (
                <Box
                  key={file.file_id}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="outlined"
                      endIcon={<FileDownloadIcon />}
                      onClick={() => downloadFile(file)}
                    >
                      {file.filename}
                    </Button>
                    {selectedAction.display_id === "UpdateItem" ? (
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <>No File</>
            )}
          </Stack>
        </TabPanel>
      </Box>
      {selectedAction.display_id === "UpdateItem" ? (
        <Button
          color="primary"
          variant="contained"
          sx={{ width: "100%" }}
          onClick={handleSaveUpdateItem}
        >
          Save
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
}
