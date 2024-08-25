import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Button,
  Menu,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import AddFaultyInfoDialog from "../components/Dialog/AddFaultyInfoDialog";
import EditRepairInfoDialog from "../components/Dialog/EditRepairInfoDialog";
import { UserContext } from "../components/userContext";
import axios from "axios";
import api from "../components/axiosInterceptor";

const TextFieldItem = styled(TextField)(() => ({
  "& .MuiInputBase-input::placeholder": {
    color: "black",
    opacity: 0.6,
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 8,
    "& fieldset": {
      border: "1px solid #d0d7de",
      borderRadius: 8,
    },
    "&:hover fieldset": {
      border: "1px solid #d0d7de",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5 !important",
    },
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
  },
}));

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "#e8dcfc",
    color: "#343c6a",
    borderRadius: 8,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #8287A6",
    borderRadius: 8,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #8287A6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const ToolButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "#6e34d5",
  fontSize: 17,
  fontWeight: 400,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "white",
  borderRadius: 8,
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#4919a4",
  },
}));

const StatusButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  textAlign: "center",
  borderRadius: 8,
  width: "100%",
}));

const MenuItemStatus = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  transition: "0.1s",
}));

const FaultyEquipmentPage = () => {
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [listGyms, setListGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedGym, setSelectedGym] = useState(
    user.role === "GYM_MANAGER" ? user?.gym : {}
  );
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [selectedItem, setSelectedItem] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "https://eagle-fits.onrender.com/gms/api/v1/gym/get-list-active-gym"
      );
      setListGyms(response.data);
      if (user.role === "SENIOR_ADMIN") setSelectedGym(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
  }, []);

  const getListEquipmentRepair = async () => {
    try {
      const response = await api.get("/equipment/get-list-repair", {
        params: {
          status: selectedStatus,
          gymId: selectedGym.id,
          keyword: searchTerm,
          page: page,
          pageSize: rowsPerPage,
        },
      });
      setData(response.data.listItem);
      setTotalRecords(response.data.numItem);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListEquipmentRepair();
  }, [selectedStatus, selectedGym, searchTerm, page, rowsPerPage]);

  const getDataExport = async () => {
    try {
      const response = await api.get("/equipment/export-list-repair", {
        params: {
          status: selectedStatus,
          gymId: selectedGym?.id,
        },
      });
      setDataExport(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataExport();
  }, [selectedStatus, selectedGym, data]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExport = () => {
    const headers = [
      "No.",
      "Code",
      "Name",
      "Gym",
      "Issue description",
      "Repair date",
      "Repair description",
      "Repair cost",
      "Repair Status",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...dataExport.map((item, index) => [
        index + 1,
        `"${item.code}"`,
        `"${item.equipment.name}"`,
        `"${selectedGym.name}"`,
        `"${item.issueDescription}"`,
        `"${dayjs(item.repairDate).format("DD/MM/YYYY")}"`,
        `"${item.repairDescription}"`,
        `"${item.repairCost} $"`,
        `"${item.status}"`,
      ]),
    ];

    // Tạo file CSV và tải xuống
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `faulty-repair-equipment-${selectedGym.name
        ?.toLowerCase()
        .replace(/\s/g, "_")}-${selectedStatus.toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("success");
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
  };

  const handleClickAdd = () => {
    setTypeAlert("success");
    setContentAlert("Repair record created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickEdit = (item) => {
    setSelectedItem(item);
    setTypeAlert("success");
    setContentAlert("Repair record updated successfully!");
    setOpenEditDialog(true);
  };

  const handleClickDel = (item) => {
    setSelectedItem(item);
    setOpenDelDialog(true);
  };

  const handleConfirmDelete = async () => {
    // Xu ly xoa thong tin thiet bi hong
    try {
      await api.delete(`/equipment/delete-repair/${selectedItem.id}`);
      setOpenDelDialog(false);
      setTypeAlert("success");
      setContentAlert("The repair record has been deleted successfully!");
      setOpenAlert(true);
      getListEquipmentRepair();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickStatusBtn = (event, item) => {
    setSelectedItem(item);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuStatus = () => {
    setAnchorEl(null);
  };

  const handleSetRepairStatus = async (value) => {
    if (value === selectedItem.status) {
      handleCloseMenuStatus();
      return;
    } else {
      // Call API set repair status moi cho ban ghi
      try {
        await api.put(`/equipment/handle-repair-status/${selectedItem.id}`, {
          status: value
        });
        handleCloseMenuStatus();
        setContentAlert(
          `The repair record has been set to ${
            value === "Completed"
              ? "Completed"
              : value === "In progress"
              ? "In progress"
              : "Pending"
          } successfully!`
        );
        setOpenAlert(true);
        getListEquipmentRepair();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "89.5vh",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Equipment Faulty and Repair Management
        </Typography>
        <TextFieldItem
          sx={{ width: "30vw" }}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by equipment code or name"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 27, marginRight: 0.5 }} />
              </InputAdornment>
            ),
            endAdornment:
              searchTerm !== "" ? (
                <InputAdornment position="end">
                  <CancelIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setSearchTerm("");
                      if (page !== 0) setPage(0);
                    }}
                  />
                </InputAdornment>
              ) : null,
          }}
        />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", my: 4 }}>
          <Box
            sx={{
              backgroundColor: "#e8dcfc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 57,
              height: 57,
              border: "1px solid #8287A6",
              borderRadius: 2,
            }}
          >
            <FilterAltIcon sx={{ color: "#6e34d5", fontSize: 35 }} />
          </Box>

          <Box>
            <SelectItem
              sx={{ width: "13vw" }}
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItemStyled value="all">All Repair Status</MenuItemStyled>
              <MenuItemStyled value="Pending">Pending</MenuItemStyled>
              <MenuItemStyled value="In progress">In progress</MenuItemStyled>
              <MenuItemStyled value="Completed">Completed</MenuItemStyled>
            </SelectItem>
          </Box>

          {user.role === "SENIOR_ADMIN" && (
            <Box>
              <SelectItem
                sx={{ width: "25vw" }}
                value={selectedGym}
                onChange={(e) => {
                  setSelectedGym(e.target.value);
                  setPage(0);
                }}
              >
                {listGyms.map((item) => (
                  <MenuItemStyled key={item.id} value={item}>
                    {item.name}
                  </MenuItemStyled>
                ))}
              </SelectItem>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={handleClickAdd}
          >
            Add
          </ToolButton>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Export
          </ToolButton>
        </Box>
      </Box>

      <TableContainer
        sx={{ borderRadius: 0, overflowX: "auto" }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                No.
              </StyledTableCell>
              <StyledTableCell>Code</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Issue</StyledTableCell>
              <StyledTableCell>Repair date</StyledTableCell>
              <StyledTableCell>Repair description</StyledTableCell>
              <StyledTableCell>Repair cost</StyledTableCell>
              <StyledTableCell sx={{ width: "7vw" }}>
                Repair status
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    height: "100%",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    {page * rowsPerPage + index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{item.code}</StyledTableCell>
                  <StyledTableCell>{item.equipment.name}</StyledTableCell>
                  <StyledTableCell>{item.issueDescription}</StyledTableCell>
                  <StyledTableCell>
                    {item.repairDate
                      ? dayjs(item.repairDate).format("DD/MM/YYYY")
                      : ""}
                  </StyledTableCell>
                  <StyledTableCell>{item?.repairDescription}</StyledTableCell>
                  <StyledTableCell>
                    {item.repairCost ? `${item.repairCost} $` : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Set repair status" placement="right">
                      <StatusButton
                        sx={{
                          color:
                            item.status === "In progress"
                              ? "rgb(255, 167, 86) !important"
                              : item.status === "Completed"
                              ? "rgb(0, 182, 155) !important"
                              : "rgb(239, 56, 38) !important",
                          backgroundColor:
                            item.status === "In progress"
                              ? "rgba(255, 167, 86, 0.2) !important"
                              : item.status === "Completed"
                              ? "rgba(0, 182, 155, 0.2) !important"
                              : "rgba(239, 56, 38, 0.2) !important",
                          border:
                            item.status === "In progress"
                              ? "1px solid rgb(255, 167, 86) !important"
                              : item.status === "Completed"
                              ? "1px solid rgb(0, 182, 155) !important"
                              : "1px solid rgb(239, 56, 38) !important",
                        }}
                        onClick={(event) => handleClickStatusBtn(event, item)}
                      >
                        {item.status}
                      </StatusButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottom: "none",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleClickEdit(item)}
                        sx={{ color: "#00b69b" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleClickDel(item)}
                        sx={{ color: "#ef3826" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography
                    sx={{
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 19,
                    }}
                    padding={4}
                  >
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length > 0 && (
        <TablePagination
          sx={{
            boxShadow:
              "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
            "& .MuiTablePagination-toolbar": {
              backgroundColor: "white",
            },
            "& .MuiTablePagination-selectLabel": {
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 17,
            },
            "& .MuiTablePagination-select": {
              // CSS cho select element của TablePagination
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 16,
              color: "#6e34d5",
            },
            "& .MuiTablePagination-displayedRows": {
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 16,
              color: "#6e34d5",
            },
            "& .MuiTablePagination-actions": {
              color: "#6e34d5",
            },
          }}
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenuStatus}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            width: "10vw",
          },
        }}
      >
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(0, 182, 155)",
              color: "white",
            },
          }}
          onClick={() => handleSetRepairStatus("Completed")}
        >
          Completed
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(255, 167, 86)",
              color: "white",
            },
          }}
          onClick={() => handleSetRepairStatus("In progress")}
        >
          In progress
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(239, 56, 38)",
              color: "white",
            },
          }}
          onClick={() => handleSetRepairStatus("Pending")}
        >
          Pending
        </MenuItemStatus>
      </Menu>

      <ConfirmDialog
        title="Delete Equipment Faulty & Repair Info"
        content="Are you sure you want to delete this record? This action cannot be undone."
        openDialog={openDelDialog}
        handleCloseDialog={handleCloseDelDialog}
        handleConfirm={handleConfirmDelete}
      />

      <AddFaultyInfoDialog
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        selectedGym={selectedGym}
        setTypeAlert={setTypeAlert}
        setOpenAlert={setOpenAlert}
        setContentAlert={setContentAlert}
        getListEquipmentRepair={getListEquipmentRepair}
      />

      <EditRepairInfoDialog
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        selectedItem={selectedItem}
        getListEquipmentRepair={getListEquipmentRepair}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={typeAlert === "success" ? "success" : "error"}
          variant="filled"
          sx={{
            maxWidth: "35vw",
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            fontWeight: 400,
          }}
        >
          {contentAlert}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FaultyEquipmentPage;
