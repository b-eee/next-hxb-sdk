import styled from "@emotion/styled";
import {
  IconButton,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { itemService } from "../services/item.service";
import ItemDetail from "./ItemDetail";
import StatusAction from "./StatusAction";

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Header = styled(Box)`
  height: 64px;
  border-left: 5px solid rgb(37, 39, 51);
  padding: 0 10px;
  display: flex;
  align-items: center;
  background-color: rgb(241, 241, 241);
  border-bottom: 1px solid #eeeeee;
`;

const BodyContainer = styled(Box)`
  display: flex;
  min-height: calc(100vh - 60px - 64px - 20px);
`;
const ItemDetailContainer = styled.div`
  display: none;
  background-color: #ffffff;
  border-left: 1px solid #eeeeee;
  transition: all 0.2s;
  position: relative;

  ${({ active }) => active && `display: flex`}
`;

const ItemDetailList = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  border-right: 1px solid #eeeeee;
`;

const Item = ({ datastore, projectId }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState();
  const [fields, setFields] = useState();
  const [activeItemDetail, setActiveItemDetail] = useState(false);
  const [fieldValues, setFieldValues] = useState();
  const [selectedItemId, setSelectedItemId] = useState("");
  const [itemActions, setItemActions] = useState([]);
  const [selectedAction, setSelectedAction] = useState("");

  const { datastore_id } = datastore;

  let itemFields = [];

  const getItems = async () => {
    setLoading(true);
    const params = {
      use_or_condition: false,
      sort_field_id: "",
      page: 1,
      per_page: 20,
    };
    const res = await itemService.getItems(datastore_id, projectId, params);
    setItems(res?.items);
    setLoading(false);
  };

  useEffectOnce(() => {
    getFields();
  });

  const getFields = async () => {
    const res = await itemService.getFields(datastore_id, projectId);
    const idArray = Object.keys(res?.fields);
    idArray.map((item) =>
      itemFields.push({
        title: res?.fields[item].name,
        data_type: res?.fields[item].dataType,
        field_id: res?.fields[item].field_id,
        display_id: res?.fields[item].display_id,
      })
    );
    setFields(itemFields);
  };

  const getItemDetail = async (
    datastore_id,
    itemId,
    projectId,
    itemDetailParams
  ) => {
    const res = await itemService.getItemDetail(
      datastore_id,
      itemId,
      projectId,
      itemDetailParams
    );

    let actions;
    if (res && res?.item_actions) {
      actions = Object.entries(res && res?.item_actions).map((item) => item[1]);
    }

    setItemActions(actions);

    let arr;
    if (res && res?.field_values) {
      arr = Object.entries(res && res?.field_values).map((item) => item[1]);
    }
    setFieldValues(arr);
  };

  useEffect(() => {
    const itemDetailParams = {
      include_lookups: true,
      use_display_id: true,
      return_number_value: true,
      format: "",
      include_linked_items: true,
    };

    getItemDetail(datastore_id, selectedItemId, projectId, itemDetailParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId]);

  useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastore_id, projectId]);

  const handleClickItemRow = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleActiveItemDetail = () => {
    setActiveItemDetail(true);
  };

  return (
    <Wrapper>
      <Header>{datastore.name}</Header>
      <BodyContainer>
        <TableContainer component={Paper} sx={{ flex: 1 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields &&
                  fields
                    .filter((i) => i.data_type !== "file")
                    .map((item) => (
                      <TableCell key={item.field_id}>{item.title}</TableCell>
                    ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items &&
                items.map((item) => (
                  <TableRow
                    key={item.i_id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      handleClickItemRow(item.i_id);
                      handleActiveItemDetail();
                    }}
                  >
                    {fields &&
                      fields
                        .filter((i) => i.data_type !== "file")
                        .map((field) => (
                          <TableCell key={field.field_id}>
                            {item[field.field_id]}
                          </TableCell>
                        ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <ItemDetailContainer active={activeItemDetail}>
          <IconButton
            sx={{
              position: "absolute",
              top: "5px",
              right: "10px",
              zIndex: 2,
            }}
            aria-label="close"
            onClick={() => setActiveItemDetail(false)}
          >
            <CloseIcon />
          </IconButton>
          <ItemDetailList>
            <ItemDetail
              fieldValues={fieldValues}
              selectedAction={selectedAction}
              datastoreId={datastore_id}
              itemId={selectedItemId}
              projectId={projectId}
            />
          </ItemDetailList>
          <StatusAction
            itemActions={itemActions}
            setSelectedAction={setSelectedAction}
            selectedAction={selectedAction}
          />
        </ItemDetailContainer>
      </BodyContainer>
    </Wrapper>
  );
};

export default Item;
