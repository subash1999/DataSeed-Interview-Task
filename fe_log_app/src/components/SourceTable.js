import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import {
  getSourceUpdateStatus,
  markAsUpdated,
} from "../redux/slices/sourceSlice";
import {
  useDeleteSourceMutation,
  useGetAllSourcesQuery,
} from "../services/sourceService";
import ConfirmModal from "./ConfirmModal";
import { useDispatch } from "react-redux";
import { deleteSource } from "../redux/slices/sourceSlice";
import NotificationManager from "react-notifications/lib/NotificationManager";
import EditSourceModalForm from "./EditSourceModalForm";

const columns = [
  { isIndex: true, id: "sn", label: "SN", minWidth: 50 },
  { isIndex: false, id: "name", label: "Name", minWidth: 100 },
  { isIndex: false, id: "description", label: "Description", minWidth: 150 },
  { isIndex: false, id: "logs_count", label: "Logs Count", minWidth: 100 },
];

const SourceTable = () => {
  const sourceUpdateStatus = useSelector(getSourceUpdateStatus);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [sourceToEdit, setSourceToEdit] = useState({});

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  function getQueryFilter() {
    return {
      page_size: pageSize,
      page: page + 1,
      search: searchTerm,
      sourceUpdateStatus: sourceUpdateStatus,
    };
  }

  const handlePageSizeChange = (event) => {
    setPageSize(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const { data, isError, isLoading } = useGetAllSourcesQuery(getQueryFilter());

  const [deleteSourceMutation, { isDeleting }] = useDeleteSourceMutation();
  const dispatch = useDispatch();
  const deleteSourceConfirm = async (source) => {
    try {
      const response = await deleteSourceMutation(source.id).unwrap();
      NotificationManager.warning(
        `Deleted`,
        `Source '${source["name"]}' deleted successfully.`,
        4000
      );
      //   dispatch(deleteSource(source.id));
      dispatch(markAsUpdated());
    } catch (err) {
      debugger;

      dispatch(markAsUpdated());
      let msg = "";
      if (!err?.status) {
        // isLoading: true until timeout occurs
        msg = "No Server Response";
      } else if (err.status === 400) {
        msg = err.data.error;
      } else if (err.status === 401) {
        msg = err.data.error;
      } else if (err.status === 404) {
        msg = err?.data?.detail ? err?.data?.detail : "URL not found";
      } else {
        msg = "Failed";
      }
      NotificationManager.error(
        `Error deleting source '${source["name"]}'`,
        `${msg}`,
        4000
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const rows = data.results;

  return (
    <>
      <div>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <FontAwesomeIcon icon={faSearch} />
              </InputAdornment>
            ),
          }}
        />
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
                <TableCell key="actionColumn" style={{ minWidth: "100px" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.isIndex ? index + 1 : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key="actionColumn_rowid">
                        <ButtonGroup>
                          <Button
                            variant="info"
                            onClick={() => {
                              setSourceToEdit(row);
                              handleShowEditModal();
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>{" "}
                          <ConfirmModal
                            onConfirm={() => {
                              deleteSourceConfirm(row);
                            }}
                            body={
                              "Are you sure you want to delete source '" +
                              row["name"] +
                              "'? All the realted logs will also be deleted."
                            }
                            confirmText="Confirm Delete"
                            title="Deleting Source"
                            confirmBSVarient="danger"
                          >
                            <Button variant="danger">
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </ConfirmModal>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.count}
          rowsPerPage={pageSize}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
        />
      </div>
      <EditSourceModalForm
        show={showEditModal}
        onHide={handleCloseEditModal}
        source={sourceToEdit}
      ></EditSourceModalForm>
    </>
  );
};

export default SourceTable;
