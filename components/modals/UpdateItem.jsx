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
}) {
  const [fieldValues, setFieldValues] = useState();
  const [itemDetail, setItemDetail] = useState();
  const [updateItemChanges, setUpdateItemChanges] = useState([]);
  const [filesUpload, setFilesUpload] = useState([]);

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

    const res = await itemService.getItemDetail(
      datastore_id,
      selectedItemId,
      projectId,
      itemDetailParams
    );

    let arr;
    if (res && res?.field_values) {
      setItemDetail(res);
      arr = Object.entries(res?.field_values).map((item) => item[1]);
    }
    setFieldValues(arr);
  };

  useEffect(() => {
    getItemDetail();
  }, [selectedItemId]);

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

    setUpdateItemChanges((prevState) => [...prevState, objectChange]);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadFile = async (e, fieldId) => {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let map = new Map();

    updateItemChanges.forEach((change, index) => {
      map.set(change.id, change);
    });

    const arr = Array.from(map.values());

    const updateItemPl = {
      action_id: action.action_id,
      changes: arr,
      history: {
        item_id: selectedItemId,
        datastore_id,
        comment: "",
      },
      rev_no: itemDetail.rev_no,
    };

    console.log({
      projectId,
      datastore_id,
      itemId: selectedItemId,
      updateItemPl,
    });

    await itemService.updateItem(
      projectId,
      datastore_id,
      selectedItemId,
      updateItemPl
    );

    setOpen(false);
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
            Sound
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 3, p: 6 }}
      >
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
                    {value.value.map((item) => (
                      <Grid item xs={12} sm={6} key={item.user_id}>
                        <InputLabel>{value.field_name}</InputLabel>
                        <TextField
                          fullWidth
                          name={value.field_id}
                          //   value={item.user_name}
                          defaultValue={item.user_name}
                          id={value.field_id}
                          type="text"
                          onChange={(e) =>
                            getUpdateItemChanges(null, null, value.field_id, e)
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
                      //   value={value.value}
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
                  <Button sx={{ textAlign: "right" }} component="label">
                    Upload
                    <input
                      hidden
                      multiple
                      type="file"
                      onChange={(e) => handleUploadFile(e, value.field_id)}
                    />
                  </Button>
                  <List sx={{ maxWidth: "max-content" }}>
                    {value.value &&
                      value.value.map((file) => {
                        return (
                          <ListItem key={file.file_id}>
                            <ListItemButton>
                              <ListItemText
                                primary={file.filename}
                                sx={{ color: "blue" }}
                              />
                            </ListItemButton>
                            <IconButton>
                              <DeleteIcon />
                            </IconButton>
                          </ListItem>
                        );
                      })}
                  </List>
                </Grid>
              ))}
        </Grid>
        <Button sx={{ mt: 3, mb: 2, mr: 2 }}>Cancel</Button>
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Save
        </Button>
      </Box>
    </Dialog>
  );
}
