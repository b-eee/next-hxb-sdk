import React, { forwardRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Grid,
  InputLabel,
  ListItemButton,
  TextField,
} from "@mui/material";
import { itemService } from "../../services/item.service";
import { storageService } from "../../services/storage.service";
import { datastoreService } from "../../services/datastore.service";
import { Spinner } from "..";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateItem({
  open,
  setOpen,
  datastore,
  projectId,
  selectedItemId,
  fields,
  action,
  getItems,
}) {
  const [fieldValues, setFieldValues] = useState();
  const [itemDetail, setItemDetail] = useState();
  const [updateItemChanges, setUpdateItemChanges] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);

  const { datastore_id } = datastore;

  const handleClose = () => {
    setOpen(false);
    setUpdateItemChanges([]);
  };

  const getItemDetail = async () => {
    const itemDetailParams = {
      include_lookups: true,
      use_display_id: true,
      return_number_value: true,
      format: "",
      include_linked_items: true,
    };

    setLoadingData(true);
    const res = await itemService.getItemDetail(
      datastore_id,
      selectedItemId,
      projectId,
      itemDetailParams
    );
    setLoadingData(false);

    let arr;
    if (res && res?.field_values) {
      setItemDetail(res);
      arr = Object.entries(res?.field_values).map((item) => item[1]);
    }
    setFieldValues(arr);
  };

  useEffect(() => {
    getItemDetail();
  }, [datastore_id, selectedItemId, projectId]);

  useEffect(() => {
    const files = fieldValues?.filter((value) => value.dataType === "file");
    if (files && files[0].value !== null) {
      setTempFiles(files[0].value);
    }
  }, [fieldValues]);

  const getUpdateItemChanges = async (
    uploadFieldId,
    newFileId,
    textFieldId,
    event
  ) => {
    const keyArr = Object.keys(fieldValues);
    const keyFile = keyArr.find((i) => fieldValues[i].dataType === "file");
    let fileIds = [];
    if (keyFile) {
      const objectHasFile = fieldValues[keyFile];
      fileIds =
        (objectHasFile.value && objectHasFile.value.map((i) => i.file_id)) ||
        [];
    }

    const fieldSettings = await datastoreService.getDetail(datastore_id);
    const field = fields.find(
      (value) =>
        value.display_id === uploadFieldId || value.display_id === textFieldId
    );

    const idx = fieldSettings.fields.find(
      (s) => s.id === field.field_id
    ).field_index;

    const fieldIdLayout = fieldSettings.field_layout.find(
      (f) => f.id === field.field_id
    );

    const fieldId = fields.find((f) => f.field_id === field.field_id);

    const tabindex = (fieldIdLayout.row + 1) * 10 + fieldIdLayout.col;
    let objectChange = {};
    if (field.data_type === "file") {
      objectChange = {
        as_title: fieldId.as_title,
        cols: fieldIdLayout.size_x,
        dataType: "file",
        id: field.field_id,
        idx,
        rowHeight: "item.rowHeight",
        rows: fieldIdLayout.size_y,
        status: false,
        tabindex,
        title: itemDetail?.title,
        unique: fieldId.unique,
        x: fieldIdLayout.col,
        y: fieldIdLayout.row,
        post_file_ids: [...fileIds, newFileId],
        value: [...fileIds, newFileId],
      };
    } else {
      objectChange = {
        as_title: fieldId.as_title,
        cols: fieldIdLayout.size_x,
        dataType: field.data_type,
        id: field.field_id,
        idx,
        rowHeight: "item.rowHeight",
        rows: fieldIdLayout.size_y,
        status: false,
        tabindex,
        title: itemDetail?.title,
        unique: fieldId.unique,
        value: event.target.value,
        x: fieldIdLayout.col,
        y: fieldIdLayout.row,
      };
    }

    setUpdateItemChanges([...updateItemChanges, objectChange]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadFile = async (e, fieldId) => {
    if (e.target.files.length === 0) return;
    setLoadingUploadFile(true);
    const file = e.target.files[0];
    const uploadFilePayload = {
      filename: file.name,
      contentTypeFile: file.type,
      filepath: `${datastore_id}/${selectedItemId}/${fieldId}/${file.name}`,
      content: await toBase64(file),
      d_id: datastore_id,
      p_id: projectId,
      field_id: fieldId,
      item_id: selectedItemId,
      display_order: 0,
    };
    const { data } = await storageService.createFile(uploadFilePayload);
    const newFileId = data?.file_id;
    await getUpdateItemChanges(fieldId, newFileId, e);
    setTempFiles([...tempFiles, data]);
    setLoadingUploadFile(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let map = new Map();

    updateItemChanges.forEach((change, index) => {
      map.set(change.id, change);
    });

    const arr = Array.from(map.values());

    await itemService.updateItem(projectId, datastore_id, selectedItemId, {
      changes: arr,
      history: {
        comment: "",
        datastore_id: datastore_id,
        action_id: action.action_id,
      },
      rev_no: itemDetail.rev_no,
    });
    await getItemDetail();
    await getItems();

    setOpen(false);
  };

  const handleDeleteFile = async (fileId) => {
    if (!fileId) return;
    setLoadingData(true);
    await storageService.deleteFile({ fileId });
    getItemDetail();
    setLoadingData(false);
  };

  const handleDownloadFile = async (file) => {
    // Only work for image file
    const res = await storageService.getFile(file.file_id);
    if (!file || !res) return;
    const formattedRes = `/${res.data.split("/").slice(2).join("/")}`;

    if (res) {
      let a = document.createElement("a");
      a.href = `data:${file.contentType};base64,${formattedRes}`; //Image Base64 Goes here
      a.download = res.filename; //File name Here
      a.click(); //Downloaded file
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Update Item
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3, p: 6 }}
      >
        {loadingData && <Spinner />}
        {!loadingData && (
          <Grid container spacing={2}>
            {fieldValues &&
              fieldValues
                .filter(
                  (value) =>
                    value.dataType !== "status" && value.dataType !== "file"
                )
                .map((value) => {
                  return value.field_name === "user_id" ? (
                    <>
                      {value.value &&
                        value.value.map((item) => (
                          <Grid item xs={12} sm={6} key={item.user_id}>
                            <InputLabel>{value.field_name}</InputLabel>
                            <TextField
                              fullWidth
                              name={value.field_id}
                              defaultValue={item.user_name}
                              id={value.field_id}
                              type="text"
                              onChange={(e) =>
                                getUpdateItemChanges(
                                  null,
                                  null,
                                  value.field_id,
                                  e
                                )
                              }
                            />
                          </Grid>
                        ))}
                    </>
                  ) : (
                    <Grid item xs={12} sm={6} key={value.field_id}>
                      <InputLabel>{value.field_name}</InputLabel>
                      <TextField
                        fullWidth
                        name={value.field_id}
                        id={value.field_id}
                        defaultValue={value.value}
                        onChange={(e) =>
                          getUpdateItemChanges(null, null, value.field_id, e)
                        }
                      />
                    </Grid>
                  );
                })}
            {fieldValues &&
              fieldValues
                .filter((value) => value.dataType === "file")
                .map((value) => (
                  <Grid item xs={12} key={value.field_id}>
                    <InputLabel>{value.field_name}</InputLabel>
                    <LoadingButton
                      sx={{ textAlign: "right" }}
                      component="label"
                      variant="contained"
                      loading={loadingUploadFile}
                    >
                      Upload
                      <input
                        hidden
                        type="file"
                        onChange={(e) => handleUploadFile(e, value.field_id)}
                      />
                    </LoadingButton>
                    <List sx={{ maxWidth: "max-content" }}>
                      {tempFiles &&
                        tempFiles.map((file) => {
                          return (
                            <ListItem key={file.file_id}>
                              <ListItemButton
                                onClick={() => handleDownloadFile(file)}
                              >
                                <ListItemText
                                  primary={file.filename}
                                  sx={{ color: "blue" }}
                                />
                              </ListItemButton>
                              <IconButton
                                onClick={() => handleDeleteFile(file.file_id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItem>
                          );
                        })}
                    </List>
                  </Grid>
                ))}
          </Grid>
        )}
        <Button sx={{ mt: 3, mb: 2, mr: 2 }} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Save
        </Button>
      </Box>
    </Dialog>
  );
}
