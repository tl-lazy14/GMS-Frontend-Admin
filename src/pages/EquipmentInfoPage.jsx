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
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EquipmentCategoryDialog from "../components/Dialog/EquipmentCategoryDialog";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import DetailEquipmentDialog from "../components/Dialog/DetailEquipmentDialog";
import AddEquipmentDialog from "../components/Dialog/AddEquipmentDialog";
import EditEquipmentDialog from "../components/Dialog/EditEquipmentDialog";
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

const EquipmentInfoPage = () => {
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [dataExport, setDataExport] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [listGyms, setListGyms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedGym, setSelectedGym] = useState(
    user.role === "GYM_MANAGER" ? user?.gym : {}
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [selectedItem, setSelectedItem] = useState({});

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

  const getListCategory = async () => {
    try {
      const response = await api.get("/equipment/get-all-category");
      console.log(response.data);
      setListCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListEquipment = async () => {
    try {
      const response = await api.get("/equipment/get-list-equipment", {
        params: {
          categoryId: selectedCategory,
          gymId: selectedGym.id,
          keyword: searchTerm,
          page: page,
          pageSize: rowsPerPage,
        },
      });
      const equipments = response.data.listEquipment;
      const formattedEquipment = equipments.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.equipmentCategory,
        image: item.imageUrl,
        manufacturer: item.manufacturer,
        totalQuantity: item.totalQuantity,
        availableQuantity: item.availableQuantity,
        faultyMaintenanceQuantity: item.underMaintenanceQuantity,
        purchaseDate: item.purchaseDate,
        warrantyExpiration: item.warrantyExpiration,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        gym: item.gym,
        listCode: item.listCode.split("-"),
      }));
      setData(formattedEquipment);
      setTotalRecords(response.data.numEquipment);
    } catch (err) {
      console.log(err);
    }
  };

  const getDataExport = async () => {
    try {
      const response = await api.get("/equipment/export-list-equipment", {
        params: {
          categoryId: selectedCategory === "all" ? "all" : selectedCategory.id,
          gymId: selectedGym?.id,
        },
      });
      setDataExport(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
    getListCategory();
  }, []);

  useEffect(() => {
    getListEquipment();
  }, [selectedCategory, selectedGym, searchTerm, page, rowsPerPage]);

  useEffect(() => {
    getDataExport();
  }, [selectedCategory, selectedGym, data]);

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
      "Name",
      "Category",
      "Manufacturer",
      "Total quantity",
      "Available quantity",
      "Faulty/Maintenance quantity",
      "Purchase date",
      "Warranty expiration",
      "Unit price",
      "Total price",
      "Gym",
      "List of equipment code",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...dataExport.map((item, index) => [
        index + 1,
        `"${item.name}"`,
        `"${item.equipmentCategory.name}"`,
        `"${item.manufacturer}"`,
        `"${item.totalQuantity}"`,
        `"${item.availableQuantity}"`,
        `"${item.underMaintenanceQuantity}"`,
        `"${dayjs(item.purchaseDate).format("DD/MM/YYYY")}"`,
        `"${dayjs(item.warrantyExpiration).format("DD/MM/YYYY")}"`,
        `"${item.unitPrice} $"`,
        `"${item.totalPrice} $"`,
        `"${selectedGym.name}"`,
        `"${item.listCode}"`,
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
      `equipment-${selectedGym.name
        ?.toLowerCase()
        .replace(/\s/g, "_")}-${selectedCategory}.csv`
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
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
  };
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };

  const handleClickAdd = () => {
    setTypeAlert("success");
    setContentAlert("New equipment added successfully!");
    setOpenAddDialog(true);
  };

  const handleClickViewDetail = (item) => {
    setSelectedItem(item);
    setOpenDetailDialog(true);
  };

  const handleClickEdit = (item) => {
    setSelectedItem(item);
    setTypeAlert("success");
    setContentAlert("Equipment info updated successfully!");
    setOpenEditDialog(true);
  };

  const handleClickDel = (item) => {
    setSelectedItem(item);
    setOpenDelDialog(true);
  };

  const handleClickManageCategories = () => {
    setOpenCategoryDialog(true);
  };

  const handleConfirmDelete = async () => {
    // Xu ly xoa thong tin thiet bi
    try {
      await api.delete(`/equipment/delete-equipment/${selectedItem.id}`);
      setOpenDelDialog(false);
      setTypeAlert("success");
      setContentAlert("Equipment deleted successfully!");
      setOpenAlert(true);
      getListEquipment();
      getListCategory();
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
          Equipment List
        </Typography>
        <TextFieldItem
          sx={{ width: "30vw" }}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by equipment name"
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
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(0);
              }}
            >
              <MenuItemStyled value="all">All Categories</MenuItemStyled>
              {listCategories.map((item) => (
                <MenuItemStyled key={item.id} value={item.id}>
                  {item.name}
                </MenuItemStyled>
              ))}
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
          {user.role === "SENIOR_ADMIN" && (
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<CategoryIcon />}
              onClick={handleClickManageCategories}
            >
              Manage categories
            </ToolButton>
          )}
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
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Manufacturer</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>Unit price</StyledTableCell>
              <StyledTableCell>Total price</StyledTableCell>
              <StyledTableCell>Purchase date</StyledTableCell>
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
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>{item.category.name}</StyledTableCell>
                  <StyledTableCell>{item.manufacturer}</StyledTableCell>
                  <StyledTableCell>{item.totalQuantity}</StyledTableCell>
                  <StyledTableCell>{item.unitPrice} $</StyledTableCell>
                  <StyledTableCell>{item.totalPrice} $</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.purchaseDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderBottom: "none",
                    }}
                  >
                    <Tooltip title="View detail">
                      <IconButton
                        onClick={() => handleClickViewDetail(item)}
                        sx={{ color: "#007bff" }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
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

      <EquipmentCategoryDialog
        data={listCategories}
        openDialog={openCategoryDialog}
        handleCloseDialog={handleCloseCategoryDialog}
        setOpenAlert={setOpenAlert}
        setTypeAlert={setTypeAlert}
        setContentAlert={setContentAlert}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        getListCategory={getListCategory}
      />

      <ConfirmDialog
        title="Delete Equipment Info"
        content="Are you sure you want to delete this equipment? This action cannot be undone."
        openDialog={openDelDialog}
        handleCloseDialog={handleCloseDelDialog}
        handleConfirm={handleConfirmDelete}
      />

      <DetailEquipmentDialog
        openDialog={openDetailDialog}
        handleCloseDialog={handleCloseDetailDialog}
        item={selectedItem}
      />

      <AddEquipmentDialog
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        selectedGym={selectedGym}
        listCategories={listCategories}
        setOpenAlert={setOpenAlert}
        getListEquipment={getListEquipment}
        getListCategory={getListCategory}
      />

      <EditEquipmentDialog
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        listCategories={listCategories}
        setOpenAlert={setOpenAlert}
        selectedItem={selectedItem}
        getListEquipment={getListEquipment}
        getListCategory={getListCategory}
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

export default EquipmentInfoPage;
