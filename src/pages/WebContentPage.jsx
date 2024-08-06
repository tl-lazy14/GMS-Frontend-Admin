import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "../components/Quill.css";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageSlider from "../components/ImageSlider";
import Slider from "react-slick";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { IntroPageBackdrop } from "../components/ImageBackdrop";
import EditPageIntroduction from "../components/Dialog/EditPageIntroduction";
import AddPageInfo from "../components/Dialog/AddPageInfo";
import EditPageInfo from "../components/Dialog/EditPageInfo";
import axios from "axios";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

const NextArrow = styled(ChevronRightIcon)(() => ({
  position: "absolute",
  right: 10,
  fontSize: 70,
  fontWeight: 900,
  color: "white",
  opacity: 0.5,
  transition: "0.3s",
  "&:hover": {
    color: "white",
    opacity: 1,
  },
}));

const PrevArrow = styled(ChevronLeftIcon)(() => ({
  position: "absolute",
  left: 10,
  fontSize: 70,
  fontWeight: 900,
  color: "white",
  opacity: 0.5,
  transition: "0.3s",
  zIndex: 1,
  "&:hover": {
    color: "white",
    opacity: 1,
  },
}));

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "#e8dcfc",
    color: "#343c6a",
    paddingLeft: 25,
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

const settingsPageIntro = {
  dots: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

const WebContentPage = () => {
  useScrollToTop();

  const [imageSlider, setImageSlider] = useState([]);
  const [pageIntroduction, setPageIntroduction] = useState([]);
  const [generalInfo, setGeneralInfo] = useState([]);
  const [selectedPage, setSelectedPage] = useState("Home Page");

  const [selectedIntroItem, setSelectedIntroItem] = useState({});
  const [selectedInfoItem, setSelectedInfoItem] = useState({});

  const getImageSlider = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/brand/get-image-slider"
      );
      const imageSliderResponse = JSON.parse(response.data.imageSlider);
      setImageSlider(imageSliderResponse);
    } catch (err) {
      console.log(err);
    }
  };

  const getListIntroPage = async () => {
    try {
      const response = await api.get("/content-website/get-list-intro-page");
      setPageIntroduction(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListGeneralInfoPage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/content-website/get-list-general-info",
        {
          params: {
            page: selectedPage,
          },
        }
      );
      setGeneralInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Call API lay du lieu
    getImageSlider();
    getListIntroPage();
  }, []);

  useEffect(() => {
    getListGeneralInfoPage();
  }, [selectedPage]);

  const handleAddImageSlider = async (event) => {
    if (event.target.files && event.target.files[0]) {
      try {
        const file = event.target.files[0];
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const newListImageSlider = [...imageSlider, downloadURL];
        await api.put("/brand/update-image-slider", {
          imageSlider: JSON.stringify(newListImageSlider),
        });
        setImageSlider(newListImageSlider);
        setContentAlert("Image added to slider successfully!");
        setOpenAlert(true);
      } catch (error) {
        console.error("Error adding image to slider:", error);
      }
    }
  };

  const handleRemoveImageSlider = async (index) => {
    const newListImg = imageSlider;
    newListImg.splice(index, 1);

    try {
      await api.put("/brand/update-image-slider", {
        imageSlider: JSON.stringify(newListImg),
      });
      setImageSlider(newListImg);
      setContentAlert("Image removed from slider successfully!");
      setOpenAlert(true);
    } catch (error) {
      console.error("Error removing image to slider:", error);
    }
  };

  const handleClickEditIntro = (item) => {
    setSelectedIntroItem(item);
    setContentAlert("Page introduction updated successfully!");
    setOpenEditIntroDialog(true);
  };

  const handleClickAddInfo = () => {
    setContentAlert("Information created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickEditInfo = (itemInfo) => {
    setSelectedInfoItem(itemInfo);
    setContentAlert("Information updated successfully!");
    setOpenEditDialog(true);
  };

  const handleClickDeleteInfo = (item) => {
    setSelectedInfoItem(item);
    setOpenDelDialog(true);
  };

  const handleConfirmDelete = async () => {
    // Xu ly xoa thong tin trang
    try {
      await api.delete(`/content-website/delete-general-info/${selectedInfoItem.id}`);
      getListGeneralInfoPage();
      setOpenDelDialog(false);
      setContentAlert("Information deleted successfully!");
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
  const [openEditIntroDialog, setOpenEditIntroDialog] = useState(false);
  const handleCloseEditIntroDialog = () => {
    setOpenEditIntroDialog(false);
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
      <Box sx={{ mb: 7 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            Image Slider
          </Typography>
          <Box display="flex" gap={2}>
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<AddPhotoAlternateIcon />}
              component="label"
            >
              Add image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAddImageSlider}
              />
            </ToolButton>
          </Box>
        </Box>

        {imageSlider && <ImageSlider images={imageSlider} />}

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {imageSlider?.map((img, index) => (
            <Grid item key={index} xs={4}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={img}
                  alt="gym"
                  style={{
                    width: "100%",
                    height: "30vh",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveImageSlider(index)}
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    transition: "0.2s",
                    "&:hover": {
                      color: "rgb(239, 56, 38)",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 7 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            Page Introduction
          </Typography>
        </Box>

        <Slider {...settingsPageIntro}>
          {pageIntroduction.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                width: "100%",
                backgroundImage: `url(${item.image})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center center",
                boxSizing: "border-box",
                px: 15,
                py: 10,
                height: "70vh",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IntroPageBackdrop />
              <Box
                sx={{
                  position: "relative",
                  maxWidth: "30vw",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: "white",
                    fontSize: 60,
                    fontWeight: 700,
                    fontFamily: "'Outfit Variable', sans-serif",
                    lineHeight: 1.3,
                  }}
                >
                  {item.title.toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    color: "white",
                    fontSize: 17,
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              <ToolButton
                onClick={() => handleClickEditIntro(item)}
                sx={{ px: 3, position: "absolute", right: 50, top: 30 }}
                startIcon={<EditIcon />}
              >
                Edit
              </ToolButton>
            </Box>
          ))}
        </Slider>
      </Box>

      <Box sx={{ mb: 5 }}>
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          General Information
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                color: "#343c6a",
                fontSize: 20,
                fontWeight: 500,
              }}
            >
              Select page:
            </Typography>
            <SelectItem
              sx={{ width: "15vw" }}
              value={selectedPage}
              onChange={(e) => {
                setSelectedPage(e.target.value);
              }}
            >
              <MenuItemStyled value="Home Page">Home Page</MenuItemStyled>
              <MenuItemStyled value="Free Trial Page">
                Free Trial Page
              </MenuItemStyled>
              <MenuItemStyled value="Gyms Page">Gyms Page</MenuItemStyled>
              <MenuItemStyled value="Coaches Page">Coaches Page</MenuItemStyled>
              <MenuItemStyled value="Classes Page">Classes Page</MenuItemStyled>
            </SelectItem>
          </Box>
          <Box sx={{ display: "flex" }}>
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<AddIcon />}
              onClick={handleClickAddInfo}
            >
              Add information
            </ToolButton>
          </Box>
        </Box>

        <InfoSectionContainer sx={{ boxSizing: "border-box", mt: 4 }}>
          {generalInfo.map((itemInfo, idx) => (
            <InfoItem key={idx} sx={{ p: 5, boxSizing: "border-box" }}>
              <Box sx={{ width: "32vw", marginTop: 3 }}>
                <InfoItemTitle>{itemInfo.title}</InfoItemTitle>
                <div
                  className="quill-content"
                  dangerouslySetInnerHTML={{ __html: itemInfo.description }}
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
                    onClick={() => handleClickEditInfo(itemInfo)}
                    sx={{ px: 3 }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ToolButton>
                  <ToolButton
                    onClick={() => handleClickDeleteInfo(itemInfo)}
                    sx={{ px: 3 }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </ToolButton>
                </Box>
              </Box>
              <img
                style={{ width: "35vw", objectFit: "cover", borderRadius: 20 }}
                src={itemInfo.image}
                alt="info img"
              />
            </InfoItem>
          ))}
        </InfoSectionContainer>
      </Box>

      <EditPageIntroduction
        openDialog={openEditIntroDialog}
        handleCloseDialog={handleCloseEditIntroDialog}
        setOpenAlert={setOpenAlert}
        selectedItem={selectedIntroItem}
        getListIntroPage={getListIntroPage}
      />

      <AddPageInfo
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        setOpenAlert={setOpenAlert}
        selectedPage={selectedPage}
        getListGeneralInfoPage={getListGeneralInfoPage}
      />

      <EditPageInfo
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        selectedItem={selectedInfoItem}
        getListGeneralInfoPage={getListGeneralInfoPage}
      />

      <ConfirmDialog
        title="Delete Information"
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

export default WebContentPage;
