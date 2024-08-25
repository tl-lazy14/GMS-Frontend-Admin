import { Alert, Box, Button, Snackbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../components/Quill.css";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import AddPageInfo from "../components/Dialog/AddPageInfo";
import EditPageInfo from "../components/Dialog/EditPageInfo";
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

const InfoSectionContainer = styled(Box)(() => ({
  width: "100%",
  backgroundColor: "#f7f8ff",
  display: "flex",
  flexDirection: "column",
  gap: 50,
}));

const InfoItem = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "white",
  gap: 20,
  borderRadius: 16,
  border: "1px solid #ccc",
}));

const InfoItemTitle = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  fontSize: 45,
  lineHeight: 1.3,
  wordSpacing: 8,
}));

const infoService = [
  {
    id: "sdg",
    title: "Unlimited group classes",
    content:
      "<p>Enjoy endless joy with over 50 copyright group classes from Lesmills such as Body Combat, Body Jam, RPM, SH'Bam and exclusive programs designed by California. New versions are constantly updated every month.</p>",
    image:
      "https://firebasestorage.googleapis.com/v0/b/datn-fa8ff.appspot.com/o/images%2Fpexels-olly-3768730.jpg?alt=media&token=00d71578-c82a-4d0a-ba58-4da20fef7684",
  },
  {
    id: "sdghs",
    title: "The essence of Indian Yoga",
    content:
      "<p>Practice authentic Yoga under the guidance of Indian Yoga Masters. Achieve perfect balance by building strength, flexibility, and body suppleness while completely relaxing all senses and freeing the mind.</p>",
    image:
      "https://firebasestorage.googleapis.com/v0/b/datn-fa8ff.appspot.com/o/images%2Fpexels-cottonbro-4056535.jpg?alt=media&token=4ca82154-7dba-4f98-acd0-218ab0ea4a5f",
  },
  {
    id: "g1sdh5",
    title: "Personal trainers always accompany you",
    content:
      '<p>When you purchase the coaching service at Eaglefit, you not only buy their time, but you also buy their knowledge, skills, mindset, and care for you. You will have a coach who designs the most suitable training plan for you, guides you on the right training methods, pushes you every time you want to back down, and takes direct responsibility for your good results.</p><p>However, due to the superior quality but limited quantity, the coaching service of Eaglefit is often "sold out". Register now to get advice and find your companion on the journey of self-transformation!</p>',
    image:
      "https://firebasestorage.googleapis.com/v0/b/datn-fa8ff.appspot.com/o/images%2Fpexels-scottwebb-136405.jpg?alt=media&token=eef131d3-e48d-4ef6-be39-5c07c78ab814",
  },
];

const ServiceInfoPage = () => {
  useScrollToTop();

  const [data, setData] = useState([]);

  const [selectedItem, setSelectedItem] = useState({});

  const getListServiceInfo = async () => {
    try {
      const response = await axios.get(
        "https://eagle-fits.onrender.com/gms/api/v1/content-website/get-list-general-info",
        {
          params: {
            page: "Service Page",
          },
        }
      );
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListServiceInfo();
  }, []);

  useEffect(() => {
    // Call API lay du lieu cac thong tin dich vu
    setData(infoService);
  }, []);

  const handleClickAdd = () => {
    setContentAlert("New service information created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDelDialog(true);
  };

  const handleClickEditPackage = (item) => {
    setSelectedItem(item);
    setContentAlert("Service information updated successfully!");
    setOpenEditDialog(true);
  };

  const handleConfirmDelete = async () => {
    // Xu ly xoa thong tin dich vu
    try {
      await api.delete(
        `/content-website/delete-general-info/${selectedItem.id}`
      );
      getListServiceInfo();
      setOpenDelDialog(false);
      setContentAlert("Service information deleted successfully!");
      setOpenAlert(true);
    } catch (error) {
      console.error("Error removing image to slider:", error);
    }
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
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
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
          Service Information Management
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={handleClickAdd}
          >
            Add
          </ToolButton>
        </Box>
      </Box>

      <InfoSectionContainer sx={{ boxSizing: "border-box", my: 5 }}>
        {data.map((item, idx) => (
          <InfoItem key={idx} sx={{ p: 5, boxSizing: "border-box" }}>
            <Box sx={{ width: "32vw", marginTop: 3 }}>
              <InfoItemTitle>{item.title}</InfoItemTitle>
              <div
                className="quill-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
                style={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  marginTop: 20,
                  color: "#3b4555",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              />
              <Box sx={{ display: "flex", gap: 2, my: 3 }}>
                <ToolButton
                  onClick={() => handleClickEditPackage(item)}
                  sx={{ px: 3 }}
                  startIcon={<EditIcon />}
                >
                  Edit
                </ToolButton>
                <ToolButton
                  onClick={() => handleClickDelete(item)}
                  sx={{ px: 3 }}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </ToolButton>
              </Box>
            </Box>
            <img
              style={{ width: "35vw", objectFit: "cover", borderRadius: 20 }}
              src={item.image}
              alt="info img"
            />
          </InfoItem>
        ))}
      </InfoSectionContainer>

      <AddPageInfo
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        setOpenAlert={setOpenAlert}
        selectedPage="Service Page"
        getListGeneralInfoPage={getListServiceInfo}
      />

      <EditPageInfo
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        selectedItem={selectedItem}
        getListGeneralInfoPage={getListServiceInfo}
      />

      <ConfirmDialog
        title="Delete Service Information"
        content="Are you sure you want to delete this information? This action cannot be undone."
        openDialog={openDelDialog}
        handleCloseDialog={handleCloseDelDialog}
        handleConfirm={handleConfirmDelete}
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

export default ServiceInfoPage;
