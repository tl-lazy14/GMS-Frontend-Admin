import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TablePagination,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate } from "react-router-dom";
import api from "../components/axiosInterceptor";

const TextFieldItem = styled(TextField)(() => ({
  width: "100%",
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
      border: "2px solid #6e34d5",
    },
  },
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

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
  },
}));

const GymManagersPage = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const [gymManagers, setGymManagers] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState({});
  const [totalRecords, setTotalRecords] = useState(0);

  const getListGymManagers = async () => {
    try {
      const response = await api.get("/user/get-list-gym-managers", {
        params: {
          keyword: searchTerm,
          page: page,
        },
      });
      setGymManagers(response.data.listUsers);
      setTotalRecords(response.data.numUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataExport = async () => {
    try {
      const response = await api.get("/user/export-list-gym-managers");
      setDataExport(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGymManagers();
  }, [searchTerm, page]);

  useEffect(() => {
    getDataExport();
  }, [gymManagers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickAdd = () => {
    navigate("/gym-managers/add");
  };

  const handleClickEdit = (item) => {
    navigate(`/gym-managers/edit/${item.id}`);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleExport = () => {
    // Tạo tiêu đề cột
    const headers = [
      "No.",
      "Name",
      "Email",
      "Phone number",
      "Date of Birth",
      "Address",
      "Gym Managed",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...dataExport.map((manager, index) => [
        index + 1,
        `"${manager.fullName}"`,
        `"${manager.email}"`,
        `"${manager.phone}"`,
        `"${dayjs(manager.dob).format("DD/MM/YYYY")}"`,
        `"${manager.address}"`,
        `"${manager.gym.name}"`,
      ]),
    ];

    // Tạo file CSV và tải xuống
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "gym-managers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Delete dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleConfirmDialog = async () => {
    // Xu ly xoa ban ghi selectedItem
    try {
      await api.delete(`/user/delete-user/${selectedItem.id}`);
      setOpenDialog(false);
      setOpenAlert(true);
      getListGymManagers();
    } catch (err) {
      console.log(err);
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
          Gym Managers List
        </Typography>
        <Box display="flex" gap={2}>
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          my: 4,
        }}
      >
        <TextFieldItem
          sx={{ width: "30vw" }}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name, email or phone number"
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
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Date of Birth</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Gym Managed</StyledTableCell>
              <StyledTableCell sx={{ pr: 3, textAlign: "center" }}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gymManagers.length > 0 ? (
              gymManagers.map((manager, index) => (
                <TableRow
                  key={manager.id}
                  sx={{
                    height: "100%",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    {page * 10 + index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{manager.fullName}</StyledTableCell>
                  <StyledTableCell>{manager.email}</StyledTableCell>
                  <StyledTableCell>{manager.phone}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(manager.dob).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>{manager.address}</StyledTableCell>
                  <StyledTableCell>{manager.gym?.name}</StyledTableCell>
                  <StyledTableCell
                    sx={{
                      pr: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottom: "none",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleClickEdit(manager)}
                        sx={{ color: "#00b69b" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleClickDelete(manager)}
                        sx={{ color: "#ef3826" }}
                        title="Delete"
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
      {gymManagers.length > 0 && (
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
          rowsPerPageOptions={[10]}
          component="div"
          count={totalRecords}
          rowsPerPage={10}
          page={page}
          onPageChange={handlePageChange}
        />
      )}
      <ConfirmDialog
        title="Delete Gym Manager"
        content="Are you sure you want to delete this gym manager? This action cannot be undone."
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleConfirm={handleConfirmDialog}
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
          severity="success"
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
          Gym manager deleted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GymManagersPage;
