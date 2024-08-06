import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tableCellClasses } from "@mui/material/TableCell";
import CreatePTPackage from "../components/Dialog/CreatePTPackage";
import EditPTPackage from "../components/Dialog/EditPTPackage";
import api from "../components/axiosInterceptor";

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

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
  },
}));

const PTServicePage = () => {
  useScrollToTop();

  const [dataPackages, setDataPackages] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState({});

  const getListPTPackages = async () => {
    try {
      const response = await api.get("/service/get-all-pt-package");
      setDataPackages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListPTPackages();
  }, []);

  const handleClickAddPackage = () => {
    setContentAlert("New personal trainer package created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickDelete = async (item) => {
    try {
      await api.delete(`/service/delete-pt-package/${item.id}`);
      setContentAlert("Personal trainer package deleted successfully!");
      setOpenAlert(true);
      getListPTPackages();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickEditPackage = (item) => {
    setSelectedPackage(item);
    setContentAlert("Personal trainer package updated successfully!");
    setOpenEditDialog(true);
  };

  const [openAlert, setOpenAlert] = useState(false);
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

  return (
    <Box
      id="main-section"
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
          Personal Trainer Packages Management
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={handleClickAddPackage}
          >
            Create
          </ToolButton>
        </Box>
      </Box>

      <TableContainer
        sx={{ borderRadius: 0, overflowX: "auto", mt: 5 }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                No.
              </StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Duration</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Number of sessions
              </StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Number of registrations
              </StyledTableCell>
              <StyledTableCell sx={{ textAlign: "center" }}>
                Status
              </StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataPackages.length > 0 ? (
              dataPackages.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    height: "100%",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{item.name}</StyledTableCell>
                  <StyledTableCell>
                    {item.duration} {item.duration > 1 ? "months" : "month"}
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    {item.numSessions}
                  </StyledTableCell>
                  <StyledTableCell>{item.price} $</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    {item.numRegistrations}
                  </StyledTableCell>
                  <StyledTableCell>
                    <StatusButton
                      sx={{
                        ...(item.status === "Active" && {
                          color: "rgb(0, 182, 155) !important",
                          backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                          border: "1px solid rgb(0, 182, 155) !important",
                        }),
                        ...(item.status === "Inactive" && {
                          color: "rgb(239, 56, 38) !important",
                          backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                          border: "1px solid rgb(239, 56, 38) !important",
                        }),
                      }}
                    >
                      {item.status}
                    </StatusButton>
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
                        onClick={() => handleClickEditPackage(item)}
                        sx={{ color: "#00b69b" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {item.numRegistrations === 0 && (
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleClickDelete(item)}
                          sx={{ color: "#ef3826" }}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
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
                    No packages found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CreatePTPackage
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        setOpenAlert={setOpenAlert}
        getListPTPackages={getListPTPackages}
      />

      <EditPTPackage
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        selectedPackage={selectedPackage}
        getListPTPackages={getListPTPackages}
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

export default PTServicePage;
