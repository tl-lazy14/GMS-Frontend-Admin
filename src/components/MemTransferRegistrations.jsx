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
import VisibilityIcon from "@mui/icons-material/Visibility";
import ConfirmDialog from "./Dialog/ConfirmDialog";
import DetailMemRegistration from "./Dialog/DetailMemRegistration";
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

const MemTransferRegistrations = () => {
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [listGyms, setListGyms] = useState([]);
  const [listPackages, setListPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedGym, setSelectedGym] = useState(
    user.role === "GYM_MANAGER" ? user?.gym : {}
  );
  const [selectedMembership, setSelectedMembership] = useState("all");
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

  const getListMembershipPackage = async () => {
    try {
      const response = await api.get("/service/get-all-membership-package");
      setListPackages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
    getListMembershipPackage();
  }, []);

  const getListData = async () => {
    try {
      const response = await api.get(
        "/customer/get-list-transfer-registration",
        {
          params: {
            membershipId:
              selectedMembership === "all" ? "all" : selectedMembership?.id,
            status: selectedStatus,
            gymId: selectedGym.id,
            keyword: searchTerm,
            page: page,
            pageSize: rowsPerPage,
          },
        }
      );
      setData(response.data.listItem);
      setTotalRecords(response.data.numItem);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListData();
  }, [
    selectedMembership,
    selectedStatus,
    selectedGym,
    searchTerm,
    page,
    rowsPerPage,
  ]);

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

  const handleClickPendingBtn = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleCloseMenuStatus = () => {
    setAnchorEl(null);
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
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const handleClickViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDetailDialog(true);
  };

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
  };
  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
  };
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const handleClickApprove = () => {
    setOpenApproveDialog(true);
    handleCloseMenuStatus();
  };

  const handleClickReject = () => {
    setOpenRejectDialog(true);
    handleCloseMenuStatus();
  };

  const handleApprove = async () => {
    // Xử lý approve dang ky
    try {
      await api.put(
        `/customer/handle-approve-member-registration/${selectedItem.id}`,
        {
          status: "Approved",
        }
      );
      setContentAlert(
        "The membership registration has been approved successfully."
      );
      setOpenApproveDialog(false);
      setOpenAlert(true);
      getListData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      await api.put(
        `/customer/handle-approve-member-registration/${selectedItem.id}`,
        {
          status: "Rejected",
        }
      );
      setContentAlert(
        "The membership registration has been rejected successfully."
      );
      setOpenRejectDialog(false);
      setOpenAlert(true);
      getListData();
    } catch (err) {
      console.log(err);
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
          Membership Registrations (Bank Transfer)
        </Typography>
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
            value={selectedMembership}
            onChange={(e) => {
              setSelectedMembership(e.target.value);
              setPage(0);
            }}
          >
            <MenuItemStyled value="all">All Memberships</MenuItemStyled>
            {listPackages.map((item) => (
              <MenuItemStyled key={item.id} value={item}>
                {item.name}
              </MenuItemStyled>
            ))}
          </SelectItem>
        </Box>

        <Box>
          <SelectItem
            sx={{ width: "10vw" }}
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(0);
            }}
          >
            <MenuItemStyled value="all">All Status</MenuItemStyled>
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
              <StyledTableCell>Membership</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>Expired Date</StyledTableCell>
              <StyledTableCell>Amount</StyledTableCell>
              <StyledTableCell>Registration Time</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Status
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
                  <StyledTableCell>{item.membership.name}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.startDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.endDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>{item.amount} $</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {item.status === "Pending" ? (
                      <Tooltip title="Click to set status" placement="right">
                        <StatusButton
                          sx={{
                            color: "rgb(255, 167, 86) !important",
                            backgroundColor:
                              "rgba(255, 167, 86, 0.2) !important",
                            border: "1px solid rgb(255, 167, 86) !important",
                          }}
                          onClick={(event) =>
                            handleClickPendingBtn(event, item)
                          }
                        >
                          {item.status}
                        </StatusButton>
                      </Tooltip>
                    ) : (
                      <StatusButton
                        sx={{
                          ...(item.status === "Approved" && {
                            color: "rgb(0, 182, 155) !important",
                            backgroundColor:
                              "rgba(0, 182, 155, 0.2) !important",
                            border: "1px solid rgb(0, 182, 155) !important",
                          }),
                          ...(item.status === "Rejected" && {
                            color: "rgb(239, 56, 38) !important",
                            backgroundColor:
                              "rgba(239, 56, 38, 0.2) !important",
                            border: "1px solid rgb(239, 56, 38) !important",
                          }),
                        }}
                      >
                        {item.status}
                      </StatusButton>
                    )}
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
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleClickViewDetails(item)}
                        sx={{ color: "#007bff" }}
                      >
                        <VisibilityIcon />
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
          onClick={handleClickApprove}
        >
          Approve
        </MenuItemStatus>
        <MenuItemStatus
          sx={{
            py: 1,
            "&:hover": {
              backgroundColor: "rgb(239, 56, 38)",
              color: "white",
            },
          }}
          onClick={handleClickReject}
        >
          Reject
        </MenuItemStatus>
      </Menu>

      <ConfirmDialog
        title="Approve Membership Registration"
        content="Are you sure you want to approve this membership registration? This action cannot be undone."
        openDialog={openApproveDialog}
        handleCloseDialog={handleCloseApproveDialog}
        handleConfirm={handleApprove}
      />

      <ConfirmDialog
        title="Reject Membership Registration"
        content="Are you sure you want to reject this membership registration? This action cannot be undone."
        openDialog={openRejectDialog}
        handleCloseDialog={handleCloseRejectDialog}
        handleConfirm={handleReject}
      />

      <DetailMemRegistration
        openDialog={openDetailDialog}
        handleCloseDialog={handleCloseDetailDialog}
        item={selectedItem}
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

export default MemTransferRegistrations;
