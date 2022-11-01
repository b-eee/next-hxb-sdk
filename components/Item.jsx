import React, { useEffect, useState } from "react";
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
  Box,
  Button,
} from "@mui/material";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { itemService } from "../services/item.service";
import { datastoreService } from "../services/datastore.service";
import UpdateItem from "./modals/UpdateItem";
import { Spinner } from ".";
import AddItem from "./modals/AddItem";

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
  justify-content: space-between;
`;

const BodyContainer = styled(Box)`
  display: flex;
  min-height: calc(100vh - 60px - 64px - 20px);
`;

const Item = ({ datastore, projectId }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState();
  const [fields, setFields] = useState();
  const [itemId, setItemId] = useState("");
  const [action, setAction] = useState([]);
  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const [openUpdateItemModal, setOpenUpdateItemModal] = useState(false);

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
    if (res) {
      const idArray = Object.keys(res?.fields);
      idArray.map((item) =>
        itemFields.push({
          title: res?.fields[item].name,
          data_type: res?.fields[item].dataType,
          field_id: res?.fields[item].field_id,
          display_id: res?.fields[item].display_id,
          as_title: res?.fields[item].as_title,
          unique: res?.fields[item].unique,
        })
      );
      setFields(itemFields);
    }
  };

  const getActions = async () => {
    const res = await datastoreService.getActions(datastore_id);
    setAction(res[0]);
  };

  useEffect(() => {
    getItems();
    getActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datastore_id, projectId]);

  if (loading) {
    return <Spinner />;
  } else {
    return (
      <Wrapper>
        <Header>
          <span>{datastore.name}</span>
          <Button
            variant="contained"
            onClick={() => setOpenAddItemDialog(true)}
          >
            Add new item
          </Button>
        </Header>
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
                        setItemId(item.i_id);
                        setOpenUpdateItemModal(true);
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
        </BodyContainer>
        {datastore && fields && (
          <UpdateItem
            open={openUpdateItemModal}
            fields={fields}
            selectedItemId={itemId}
            setOpen={setOpenUpdateItemModal}
            datastore={datastore}
            projectId={projectId}
            action={action}
            setAction={setAction}
            getItems={getItems}
          />
        )}
        <AddItem
          datastoreId={datastore_id}
          fields={fields}
          open={openAddItemDialog}
          setOpen={setOpenAddItemDialog}
          selectedItemId={itemId}
          projectId={projectId}
          getItems={getItems}
        />
      </Wrapper>
    );
  }
};

export default Item;
