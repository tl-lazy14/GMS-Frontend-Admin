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
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import axios from "axios";
import { UserContext } from "../components/userContext";
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

const MembersPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [dataExport, setDataExport] = useState([]);
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
      const response = await api.get("/customer/get-list-member", {
        params: {
          membershipId: selectedMembership,
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

  const getDataExport = async () => {
    try {
      const response = await api.get("/customer/export-list-member", {
        params: {
          membershipId: selectedMembership,
          status: selectedStatus,
          gymId: selectedGym.id,
        },
      });
      setDataExport(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListData();
  }, [
    selectedGym,
    selectedMembership,
    selectedStatus,
    searchTerm,
    page,
    rowsPerPage,
  ]);

  useEffect(() => {
    getDataExport();
  }, [selectedMembership, selectedStatus, selectedGym, data]);

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

  const handleClickViewDetails = (item) => {
    navigate(`/customers/members/details/${item.id}`);
  };

  const handleClickAdd = () => {
    navigate(`/customers/members/create/${selectedGym.id}`);
  };

  const handleExport = () => {
    // Tạo tiêu đề cột
    const headers = [
      "No.",
      "Member code",
      "Name",
      "Email",
      "Phone number",
      "Gender",
      "Date of birth",
      "Membership package",
      "Start date",
      "Expired date",
      "Amount",
      "Gym",
      "Status",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...dataExport.map((item, index) => [
        index + 1,
        `"${item.memberCode}"`,
        `"${item.name}"`,
        `"${item.email}"`,
        `"${item.phone}"`,
        `"${item.gender}"`,
        `"${dayjs(item.dob).format("DD/MM/YYYY")}"`,
        `"${item.membership.name}"`,
        `"${dayjs(item.startDate).format("DD/MM/YYYY")}"`,
        `"${dayjs(item.expiredDate).format("DD/MM/YYYY")}"`,
        `"${item.amount} $"`,
        `"${selectedGym.name}"`,
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
      `members-${selectedGym.name}-${selectedMembership}-${selectedStatus}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Members List
        </Typography>
        <TextFieldItem
          sx={{ width: "35vw" }}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by member code, name, email or phone number"
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
              value={selectedMembership}
              onChange={(e) => {
                setSelectedMembership(e.target.value);
                setPage(0);
              }}
            >
              <MenuItemStyled value="all">All Memberships</MenuItemStyled>
              {listPackages.map((item) => (
                <MenuItemStyled key={item.id} value={item.id}>
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
              <MenuItemStyled value="Active">Active</MenuItemStyled>
              <MenuItemStyled value="Expiring Soon">
                Expiring Soon
              </MenuItemStyled>
              <MenuItemStyled value="Expired">Expired</MenuItemStyled>
              <MenuItemStyled value="Upcoming">Upcoming</MenuItemStyled>
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

        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<PersonAddIcon />}
            onClick={handleClickAdd}
          >
            Create
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
              <StyledTableCell>Member Code</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Membership</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>Expired Date</StyledTableCell>
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
                  <StyledTableCell>{item.memberCode}</StyledTableCell>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.email}</StyledTableCell>
                  <StyledTableCell>{item.phone}</StyledTableCell>
                  <StyledTableCell>{item.membership.name}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.startDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.expiredDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    <StatusButton
                      sx={{
                        ...(item.status === "Active" && {
                          color: "rgb(0, 182, 155) !important",
                          backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                          border: "1px solid rgb(0, 182, 155) !important",
                        }),
                        ...(item.status === "Expiring Soon" && {
                          color: "rgb(255, 167, 86) !important",
                          backgroundColor: "rgba(255, 167, 86, 0.2) !important",
                          border: "1px solid rgb(255, 167, 86) !important",
                        }),
                        ...(item.status === "Expired" && {
                          color: "rgb(239, 56, 38) !important",
                          backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                          border: "1px solid rgb(239, 56, 38) !important",
                        }),
                        ...(item.status === "Upcoming" && {
                          color: "rgb(186, 41, 255) !important",
                          backgroundColor: "rgba(186, 41, 255, 0.2) !important",
                          border: "1px solid rgb(186, 41, 255) !important",
                        }),
                      }}
                    >
                      {item.status}
                    </StatusButton>
                  </StyledTableCell>
                  <StyledTableCell>
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
    </Box>
  );
};

export default MembersPage;
