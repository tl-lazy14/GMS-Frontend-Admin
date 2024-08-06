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
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DateCalendarDialog from "./Dialog/DateCalendarDialog";
import { UserContext } from "./userContext";
import axios from "axios";
import api from "./axiosInterceptor";

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

const MenuItemStatus = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  transition: "0.1s",
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

const FreeTrialRegistrations = () => {
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
  const [selectedContactStatus, setSelectedContactStatus] = useState("all");
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState("all");

  const [selectedItem, setSelectedItem] = useState({});
  const [anchorElContact, setAnchorElContact] = useState(null);
  const [anchorElApproval, setAnchorElApproval] = useState(null);

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/gym/get-list-active-gym"
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

  const getListData = async () => {
    try {
      const response = await api.get("/customer/get-list-trial-registration", {
        params: {
          contactStatus: selectedContactStatus,
          approvalStatus: selectedApprovalStatus,
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

  const getDataExport = async () => {
    try {
      const response = await api.get(
        "/customer/export-list-trial-registration",
        {
          params: {
            contactStatus: selectedContactStatus,
            approvalStatus: selectedApprovalStatus,
            gymId: selectedGym.id,
          },
        }
      );
      setDataExport(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListData();
  }, [
    selectedGym,
    selectedApprovalStatus,
    selectedContactStatus,
    searchTerm,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    getDataExport();
  }, [selectedApprovalStatus, selectedContactStatus, selectedGym, data]);

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

  const handleClickApprovalBtn = (event, item) => {
    setSelectedItem(item);
    setAnchorElApproval(event.currentTarget);
  };

  const handleClickContactBtn = (event, item) => {
    setSelectedItem(item);
    setAnchorElContact(event.currentTarget);
  };

  const handleCloseMenuApproval = () => {
    setAnchorElApproval(null);
  };

  const handleCloseMenuContact = () => {
    setAnchorElContact(null);
  };

  const handleExport = () => {
    const headers = [
      "No.",
      "Name",
      "Phone number",
      "Gym",
      "Preferred contact time",
      "Registration time",
      "Contact status",
      "Trial date",
      "Approval status",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...dataExport.map((item, index) => [
        index + 1,
        `"${item.name}"`,
        `"${item.phone}"`,
        `"${selectedGym.name}"`,
        `"${item.timeContact}"`,
        `"${dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}"`,
        `"${item.statusContact}"`,
        `"${dayjs(item.preferredDate).format("DD/MM/YYYY")}"`,
        `"${item.statusApprove}"`,
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
      `free-trial-${selectedGym.name
        .toLowerCase()
        .replace(
          /\s/g,
          "_"
        )}-${selectedContactStatus.toLowerCase()}-${selectedApprovalStatus.toLowerCase()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickSelectDate = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleSetContactStatus = async (value) => {
    if (value === selectedItem.statusContact) {
      handleCloseMenuContact();
      return;
    } else {
      try {
        await api.put(`/customer/handle-contact-trial/${selectedItem.id}`, {
          status: value,
        });
        handleCloseMenuContact();
        getListData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSetApprovalStatus = async (value) => {
    if (value === selectedItem.statusApprove) {
      handleCloseMenuApproval();
      return;
    } else {
      try {
        await api.put(`/customer/handle-approve-trial/${selectedItem.id}`, {
          status: value,
        });
        handleCloseMenuApproval();
        setContentAlert(
          `The free-trial registration has been set to ${
            value === "Approved"
              ? "Approved"
              : value === "Pending"
              ? "Pending"
              : "Rejected"
          } successfully.`
        );
        setOpenAlert(true);
        getListData();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box
      sx={{
        boxSizing: "border-box",
        px: 2,
        py: 1,
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
          Free Trial Registrations
        </Typography>
        <TextFieldItem
          sx={{ width: "30vw" }}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by name or phone number"
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
              value={selectedContactStatus}
              onChange={(e) => {
                setSelectedContactStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItemStyled value="all">All Contact Status</MenuItemStyled>
              <MenuItemStyled value="Uncontacted">Uncontacted</MenuItemStyled>
              <MenuItemStyled value="Contacted">Contacted</MenuItemStyled>
            </SelectItem>
          </Box>

          <Box>
            <SelectItem
              sx={{ width: "14vw" }}
              value={selectedApprovalStatus}
              onChange={(e) => {
                setSelectedApprovalStatus(e.target.value);
                setPage(0);
              }}
            >
              <MenuItemStyled value="all">All Approval Status</MenuItemStyled>
              <MenuItemStyled value="Approved">Approved</MenuItemStyled>
              <MenuItemStyled value="Pending">Pending</MenuItemStyled>
              <MenuItemStyled value="Rejected">Rejected</MenuItemStyled>
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

        <ToolButton
          sx={{ px: 3 }}
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
        >
          Export
        </ToolButton>
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
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Preferred Contact Time</StyledTableCell>
              <StyledTableCell>Registration Time</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Contact Status
              </StyledTableCell>
              <StyledTableCell>Trial Date</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Approval
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
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
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.phone}</StyledTableCell>
                  <StyledTableCell>{item.timeContact}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Set contact status" placement="right">
                      <StatusButton
                        sx={{
                          color:
                            item.statusContact === "Uncontacted"
                              ? "rgb(98, 38, 239) !important"
                              : "rgb(186, 41, 255) !important",
                          backgroundColor:
                            item.statusContact === "Uncontacted"
                              ? "rgba(98, 38, 239, 0.2) !important"
                              : "rgba(186, 41, 255, 0.2) !important",
                          border:
                            item.statusContact === "Uncontacted"
                              ? "1px solid rgb(98, 38, 239) !important"
                              : "1px solid rgb(186, 41, 255) !important",
                        }}
                        onClick={(event) => handleClickContactBtn(event, item)}
                      >
                        {item.statusContact}
                      </StatusButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.preferredDate
                      ? dayjs(item.preferredDate).format("DD/MM/YYYY")
                      : "Not chosen"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Set approval status" placement="right">
                      <StatusButton
                        sx={{
                          color:
                            item.statusApprove === "Pending"
                              ? "rgb(255, 167, 86) !important"
                              : item.statusApprove === "Approved"
                              ? "rgb(0, 182, 155) !important"
                              : "rgb(239, 56, 38) !important",
                          backgroundColor:
                            item.statusApprove === "Pending"
                              ? "rgba(255, 167, 86, 0.2) !important"
                              : item.statusApprove === "Approved"
                              ? "rgba(0, 182, 155, 0.2) !important"
                              : "rgba(239, 56, 38, 0.2) !important",
                          border:
                            item.statusApprove === "Pending"
                              ? "1px solid rgb(255, 167, 86) !important"
                              : item.statusApprove === "Approved"
                              ? "1px solid rgb(0, 182, 155) !important"
                              : "1px solid rgb(239, 56, 38) !important",
                        }}
                        onClick={(event) => handleClickApprovalBtn(event, item)}
                      >
                        {item.statusApprove}
                      </StatusButton>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      pr: 3,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottom: "none",
                    }}
                  >
                    <Tooltip title="Set Trial Date">
                      <IconButton
                        onClick={() => handleClickSelectDate(item)}
                        sx={{ color: "#007bff" }}
                      >
                        <EditCalendarIcon />
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
        anchorEl={anchorElContact}
        open={Boolean(anchorElContact)}
        onClose={handleCloseMenuContact}
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
              backgroundColor: "rgb(98, 38, 239)",
              color: "white",
            },
          }}
          onClick={() => handleSetContactStatus("Uncontacted")}
        >
          Uncontacted
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(186, 41, 255)",
              color: "white",
            },
          }}
          onClick={() => handleSetContactStatus("Contacted")}
        >
          Contacted
        </MenuItemStatus>
      </Menu>

      <Menu
        anchorEl={anchorElApproval}
        open={Boolean(anchorElApproval)}
        onClose={handleCloseMenuApproval}
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
          onClick={() => handleSetApprovalStatus("Approved")}
        >
          Approve
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(255, 167, 86)",
              color: "white",
            },
          }}
          onClick={() => handleSetApprovalStatus("Pending")}
        >
          Pending
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(239, 56, 38)",
              color: "white",
            },
          }}
          onClick={() => handleSetApprovalStatus("Rejected")}
        >
          Reject
        </MenuItemStatus>
      </Menu>

      <DateCalendarDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        item={selectedItem}
        setOpenAlert={setOpenAlert}
        setContentAlert={setContentAlert}
        getListData={getListData}
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
          {contentAlert}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FreeTrialRegistrations;
