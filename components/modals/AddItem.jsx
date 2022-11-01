import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import {
  Box,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { datastoreService } from "../../services/datastore.service";
import { LoadingButton } from "@mui/lab";
import { storageService } from "../../services/storage.service";
import { itemService } from "../../services";
import DeleteIcon from "@mui/icons-material/Delete";

const getInitialValues = (fields) => {
  const fieldNames = fields.map((field) => field.field_id);
  return fieldNames.reduce((a, v) => {
    return { ...a, [v]: "" };
  }, {});
};

export default function AddItem({
  open,
  setOpen,
  fields,
  datastoreId,
  projectId,
  getItems,
}) {
  const [statusOptions, setStatusOptions] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [loadingUploadFile, setLoadingUploadFile] = useState(false);
  const [itemId, setItemId] = useState("");

  const getStatus = async () => {
    const res = await datastoreService.getStatuses(datastoreId);
    if (res) {
      setStatusOptions(res);
    }
  };

  const createItemId = async () => {
    const res = await itemService.createItemId(datastoreId);
    if (res) {
      setItemId(res);
    }
  };

  useEffect(() => {
    getStatus();
    createItemId();
  }, [datastoreId]);

  const formik = useFormik({
    initialValues: getInitialValues(fields),
    onSubmit: async (values) => {
      Object.keys(values).forEach((key) => {
        if (values[key] === "") {
          delete values[key];
        }
      });
      console.log({ values });
      const newItemPl = {
        // need to get this from getActions (TODO: fix later after deployment)
        action_id: "634e76650102df2823294290",
        item: values,
        use_display_id: true,
        is_notify_to_sender: true,
        return_item_result: true,
        ensure_transaction: true,
        exec_children_post_procs: true,
      };
      await itemService.create(projectId, datastoreId, newItemPl);
      getItems();
      setOpen(false);
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setUploadFiles([]);
    setOpen(false);
  };

  const handleInputChange = (e, field, cb) => {
    cb(field.field_id, e.target.value);
  };

  const handleSelectStatus = (e, field, callback) => {
    callback(field.field_id, e.target.value);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleUploadFile = async (e, fieldId, callback, values) => {
    if (e.target.files.length === 0) return;
    setLoadingUploadFile(true);
    const file = e.target.files[0];
    const uploadFilePayload = {
      filename: file.name,
      contentTypeFile: file.type,
      filepath: `${datastoreId}/${itemId}/${fieldId}/${file.name}`,
      content: await toBase64(file),
      d_id: datastoreId,
      p_id: projectId,
      field_id: fieldId,
      item_id: itemId,
      display_order: 0,
    };

    const { data } = await storageService.createFile(uploadFilePayload);
    const newFileId = data?.file_id;
    setUploadFiles([...uploadFiles, data]);
    if (values[fieldId] === "") {
      callback(fieldId, [newFileId]);
    } else {
      callback(fieldId, [...values[fieldId], newFileId]);
    }
    setLoadingUploadFile(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Add new item</DialogTitle>
        <DialogContent>
          <Box>
            <Stack spacing={2} sx={{ paddingTop: "20px" }}>
              {fields
                .filter(
                  (field) =>
                    field.data_type !== "status" &&
                    field.data_type !== "users" &&
                    field.data_type !== "file"
                )
                .map((field) => {
                  return (
                    <TextField
                      key={field.field_id}
                      fullWidth
                      id={field.field_id}
                      name={field.field_id}
                      label={field.title}
                      value={formik.values.field_id}
                      onChange={(e) =>
                        handleInputChange(e, field, formik.setFieldValue)
                      }
                    />
                  );
                })}
              {fields
                .filter((field) => field.data_type === "file")
                .map((field) => {
                  return (
                    <Box key={field.field_id}>
                      <InputLabel>{field.title}</InputLabel>
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
                          onChange={(e) =>
                            handleUploadFile(
                              e,
                              field.field_id,
                              formik.setFieldValue,
                              formik.values
                            )
                          }
                        />
                      </LoadingButton>
                      <List sx={{ maxWidth: "max-content" }}>
                        {uploadFiles ? (
                          uploadFiles.map((file) => {
                            return (
                              <ListItem key={file.file_id}>
                                <ListItemButton
                                // onClick={() => handleDownloadFile(file)}
                                >
                                  <ListItemText
                                    primary={file.filename}
                                    sx={{ color: "blue" }}
                                  />
                                </ListItemButton>
                                <IconButton
                                // onClick={() => handleDeleteFile(file.file_id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </ListItem>
                            );
                          })
                        ) : (
                          <>No file selected</>
                        )}
                      </List>
                    </Box>
                  );
                })}
              {/* TODO: Filter User select */}
              {/* {fields
                .filter((field) => field.data_type === "users")
                .map((field) => {
                  return (
                    <Box key={field.field_id}>
                      <InputLabel id={field.field_id}>{field.title}</InputLabel>
                      <Select
                        labelId={field.field_id}
                        value={formik.values.field_id}
                        onChange={(e) => handleSelectUser(e)}
                        fullWidth
                      >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </Box>
                  );
                })} */}
              {fields
                .filter((field) => field.data_type === "status")
                .map((field) => {
                  const fieldId = field.field_id;
                  return (
                    <Box key={field.field_id}>
                      <InputLabel id={field.field_id}>{field.title}</InputLabel>
                      <Select
                        labelId={field.field_id}
                        value={formik.values[fieldId]}
                        onChange={(e) =>
                          handleSelectStatus(e, field, formik.setFieldValue)
                        }
                        fullWidth
                      >
                        {statusOptions &&
                          statusOptions.map((option) => (
                            <MenuItem
                              key={option.status_id}
                              value={option.status_id}
                            >
                              {option.displayed_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </Box>
                  );
                })}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create item
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
