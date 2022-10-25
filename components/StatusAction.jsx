import styled from "@emotion/styled";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const Wrapper = styled(Box)`
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const StatusAction = (props) => {
  const { itemActions, selectedAction, setSelectedAction } = props;

  const handleChange = (event) => {
    setSelectedAction(event.target.value);
  };

  return (
    <Wrapper>
      <Typography variant="h5" mb={1}>
        Action Status
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Actions</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedAction}
          label="Action"
          onChange={handleChange}
        >
          {itemActions &&
            itemActions.map((action) => (
              <MenuItem key={action.a_id} value={action}>
                {action.action_name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Wrapper>
  );
};

export default StatusAction;
