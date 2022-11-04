import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { appService } from "../../services";
import { Spinner } from "..";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";
import PropTypes from "prop-types";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function AddProject({
  open,
  setOpen,
  setIsChange,
  getAppAndDs,
}) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const [projectName, setProjectName] = useState("");

  const getTemplates = async () => {
    setLoading(true);
    const res = await appService.getTemplates();
    if (res) {
      setTemplates(res);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      getTemplates();
    }
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePrName = (e) => {
    setProjectName(e.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("projectName") === "") return;
    const createProjectPl = {
      name: {
        en: data.get("projectName"),
        ja: data.get("projectName"),
      },
      tp_id: data.get("templates"),
    };
    await appService.createApp(createProjectPl);
    setIsChange(true);
    await getAppAndDs();
    setOpen(false);
  };

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Add Project</DialogTitle>
          <DialogContent>
            <Stack spacing={4}>
              <FormControl>
                <TextField
                  autoFocus
                  margin="dense"
                  id="projectName"
                  name="projectName"
                  label="Project Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  onChange={(e) => handleChangePrName(e)}
                />
              </FormControl>
              <FormControl>
                <FormLabel id="templates">Template</FormLabel>
                <RadioGroup
                  aria-labelledby="templates"
                  defaultValue=""
                  name="templates"
                >
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="Blank"
                  />
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="project template"
                      >
                        {templates?.categories?.map((category, index) => (
                          <Tab
                            key={category.category}
                            label={category.category}
                            {...a11yProps(index)}
                          />
                        ))}
                      </Tabs>
                    </Box>
                    {templates &&
                      templates.categories &&
                      templates.categories.map((category, index) => (
                        <TabPanel
                          value={value}
                          key={category.category}
                          index={index}
                        >
                          <FormControl>
                            {category.templates.map((temp) => (
                              <Stack
                                direction="row"
                                spacing={6}
                                alignItems="center"
                                key={temp.tp_id}
                              >
                                <FormControlLabel
                                  value={temp.tp_id}
                                  control={<Radio />}
                                  label={temp.name}
                                />
                                <span>{temp.description}</span>
                              </Stack>
                            ))}
                          </FormControl>
                        </TabPanel>
                      ))}
                  </Box>
                </RadioGroup>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!!!projectName}>
              Add Project
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    );
  }
}
