import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
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
import { ImageBackdrop } from "../components/ImageBackdrop";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateMemPackage from "../components/Dialog/CreateMemPackage";
import EditMemPackage from "../components/Dialog/EditMemPackage";
import CategoryIcon from "@mui/icons-material/Category";
import BenefitsManageDialog from "../components/Dialog/BenefitsManageDialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
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
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
}));

const PackageItem = styled(Box)(() => ({
  position: "relative",
  backgroundColor: "#fefefe",
  color: "#555",
  borderRadius: 20,
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  transition: "0.3s",
  zIndex: 2,
  cursor: "pointer",
  "&:hover .package-item-background-img": {
    opacity: 1,
    zIndex: -1,
  },
  "&:hover": {
    color: "white",
    "& .package-item-divider": {
      borderTopColor: "#88dbdf",
    },
    "& .backdrop-package": {
      display: "block",
      borderRadius: 20,
    },
    "& .amount-package": {
      color: "white",
    },
  },
}));

const PackageItemBackgroundImg = styled("img")(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  objectFit: "cover",
  height: "100%",
  opacity: 0,
  overflow: "hidden",
  transition: "opacity 0.3s",
  borderRadius: 20,
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 18,
  color: "#221551",
  border: "1px solid #ccc",
  borderTop: "none",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e38d5",
    color: "white",
    fontSize: 19,
    "&:first-child": {
      borderLeft: "1px solid #6e38d5",
    },
    "&:last-child": {
      borderRight: "none",
    },
  },
}));

const MembershipPage = () => {
  useScrollToTop();

  const [dataPackages, setDataPackages] = useState([]);
  const [dataBenefits, setDataBenefits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tempDataPackages, setTempDataPackages] = useState([]);

  const [selectedPackage, setSelectedPackage] = useState({});

  const getListBenefit = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/service/get-all-benefit"
      );
      setDataBenefits(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListMembershipPackage = async () => {
    try {
      const response = await api.get("/service/get-all-membership-package");
      const memberships = response.data;
      const formattedMemberships = memberships.map((membership) => ({
        id: membership.id,
        name: membership.name,
        thumbnail: membership.thumbnail,
        priceMonth: membership.priceMonth,
        description: membership.description,
        totalMembers: membership.totalMembers,
        status: membership.status,
        benefits: membership.benefits.map((benefit) => ({
          benefit: {
            id: benefit.id,
            description: benefit.description,
          },
          included: benefit.included,
        })),
      }));
      setDataPackages(formattedMemberships);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListMembershipPackage();
    getListBenefit();
  }, []);

  const handleClickAddPackage = () => {
    setTypeAlert("success");
    setContentAlert("New membership package created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickDelete = async (item) => {
    // Xu ly xoa goi hoi vien
    try {
      await api.delete(`/service/delete-membership-package/${item.id}`);
      setTypeAlert("success");
      setContentAlert("Membership package deleted successfully!");
      setOpenAlert(true);
      getListMembershipPackage();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickEditPackage = (item) => {
    setSelectedPackage(item);
    setTypeAlert("success");
    setContentAlert("Membership package updated successfully!");
    setOpenEditDialog(true);
  };

  const handleClickManageBenefits = () => {
    setOpenBenefitDialog(true);
  };

  const handleEditClick = () => {
    setTempDataPackages(dataPackages);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempDataPackages([]);
  };

  const handleCheckboxChange = (packageId, benefitId, checked) => {
    const updatedPackages = tempDataPackages.map((pkg) => {
      if (pkg.id === packageId) {
        return {
          ...pkg,
          benefits: pkg.benefits.map((benefit) =>
            benefit.benefit.id === benefitId
              ? { ...benefit, included: checked }
              : benefit
          ),
        };
      }
      return pkg;
    });
    setTempDataPackages(updatedPackages);
  };

  const extractBenefits = (packages) => {
    return packages.map((pkg) => ({
      id: pkg.id,
      benefits: pkg.benefits.map((benefit) => ({
        id: benefit.benefit.id,
        description: benefit.benefit.description,
        included: benefit.included,
      })),
    }));
  };

  const handleSave = async () => {
    // Call API de update voi du lieu gui la tempDataPackages
    const extractedData = extractBenefits(tempDataPackages);
    await api.put("/service/update-benefit-membership", extractedData);
    getListMembershipPackage();
    setIsEditing(false);
    setTempDataPackages([]);
    setTypeAlert("success");
    setContentAlert(
      "Changes saved! The membership benefits table has been successfully updated."
    );
    setOpenAlert(true);
  };

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
  const [openBenefitDialog, setOpenBenefitDialog] = useState(false);
  const handleCloseBenefitDialog = () => {
    setOpenBenefitDialog(false);
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
          Membership Packages Management
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          my: 5,
        }}
      >
        <Grid container columnSpacing={5} rowSpacing={10}>
          {dataPackages.map((item, idx) => (
            <Grid
              item
              key={idx}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <PackageItem
                sx={{
                  p: 4,
                  flexGrow: 1,
                }}
              >
                <PackageItemBackgroundImg
                  className="package-item-background-img"
                  src={item.thumbnail}
                  alt="thumbnail"
                />
                <ImageBackdrop
                  className="backdrop-package"
                  sx={{ display: "none", zIndex: -1 }}
                />
                <Typography
                  sx={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {item.name.toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    color: "#221551",
                    fontSize: 60,
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontWeight: 700,
                  }}
                  className="amount-package"
                >
                  <Typography
                    sx={{
                      fontSize: 35,
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontWeight: 700,
                      marginRight: 0.8,
                    }}
                  >
                    $
                  </Typography>{" "}
                  {item.priceMonth}
                  <Typography
                    sx={{
                      fontSize: 25,
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    /month
                  </Typography>
                </Typography>
                <Divider
                  className="package-item-divider"
                  sx={{ borderTop: "2px solid #555" }}
                />
                <Typography
                  sx={{
                    fontSize: 17,
                    fontFamily: "'Outfit Variable', sans-serif",
                    marginTop: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {item.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={() => handleClickEditPackage(item)}
                      sx={{ color: "#00b69b" }}
                    >
                      <EditIcon sx={{ fontSize: 30 }} />
                    </IconButton>
                  </Tooltip>
                  {item.totalMembers === 0 && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleClickDelete(item)}
                        sx={{ color: "#ef3826" }}
                        title="Delete"
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </PackageItem>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextStyled
                  sx={{
                    color: "#343c6a",
                    fontWeight: 500,
                    textAlign: "center",
                    fontSize: 19,
                  }}
                >
                  Total members: {item.totalMembers}
                </TextStyled>
                <StatusButton
                  sx={{
                    width: "8vw",
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
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 10, mb: 5 }}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Membership Packages Benefits
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<EditIcon />}
            onClick={isEditing ? handleCancelClick : handleEditClick}
          >
            {isEditing ? "Cancel" : "Edit table"}
          </ToolButton>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<CategoryIcon />}
            onClick={handleClickManageBenefits}
          >
            Manage Benefits
          </ToolButton>
        </Box>
      </Box>

      <Box sx={{ position: "relative" }}>
        <TableContainer>
          <Table sx={{ backgroundColor: "white" }}>
            <TableHead>
              <TableRow>
                <StyledTableCell />
                {dataPackages.map((item) => (
                  <StyledTableCell key={item.id} align="center">
                    {item.name}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataBenefits.map((benefit) => (
                <TableRow key={benefit.id}>
                  <StyledTableCell
                    sx={{ width: "50vh" }}
                    component="th"
                    scope="row"
                  >
                    {benefit.description}
                  </StyledTableCell>
                  {isEditing
                    ? tempDataPackages.map((item) => (
                        <StyledTableCell
                          key={`${item.id}-${benefit.id}`}
                          align="center"
                        >
                          <Checkbox
                            sx={{
                              color: "#6e34d5",
                              "&.Mui-checked": {
                                color: "#6e34d5",
                              },
                            }}
                            checked={
                              !!item.benefits.find(
                                (b) => b.benefit.id === benefit.id
                              )?.included
                            }
                            onChange={(e) =>
                              handleCheckboxChange(
                                item.id,
                                benefit.id,
                                e.target.checked
                              )
                            }
                          />
                        </StyledTableCell>
                      ))
                    : dataPackages.map((item) => (
                        <StyledTableCell
                          key={`${item.id}-${benefit.id}`}
                          align="center"
                        >
                          {item.benefits.find(
                            (b) => b.benefit.id === benefit.id
                          )?.included && (
                            <CheckCircleIcon
                              sx={{ color: "#28a745", fontSize: 25 }}
                            />
                          )}
                        </StyledTableCell>
                      ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isEditing && (
          <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
            <ToolButton sx={{ px: 5 }} onClick={handleSave}>
              Save
            </ToolButton>
          </Box>
        )}
      </Box>

      <CreateMemPackage
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        setOpenAlert={setOpenAlert}
        getListMembershipPackage={getListMembershipPackage}
      />

      <EditMemPackage
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        selectedPackage={selectedPackage}
        getListMembershipPackage={getListMembershipPackage}
      />

      <BenefitsManageDialog
        data={dataBenefits}
        openDialog={openBenefitDialog}
        handleCloseDialog={handleCloseBenefitDialog}
        setOpenAlert={setOpenAlert}
        setTypeAlert={setTypeAlert}
        setContentAlert={setContentAlert}
        getListBenefit={getListBenefit}
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

export default MembershipPage;
