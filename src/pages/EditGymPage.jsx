import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Badge,
  Grid,
  Typography,
  Snackbar,
  Alert,
  Switch,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import axios from "axios";
import api from "../components/axiosInterceptor";

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 8,
  color: "#343c6a",
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

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
    borderRadius: 16,
    "& fieldset": {
      border: "1px solid #d0d7de !important",
      borderRadius: 16,
    },
    "&:hover fieldset": {
      border: "1px solid #d0d7de !important",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5 !important",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "17px",
    fontFamily: "'Outfit Variable', sans-serif",
    color: "#ea2c3e",
    lineHeight: 1.4,
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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(24px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : "theme.palette.grey[600]",
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
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

const EditGymPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    thumbnail: "",
    operatingTime: {
      Monday: { open: "", close: "" },
      Tuesday: { open: "", close: "" },
      Wednesday: { open: "", close: "" },
      Thursday: { open: "", close: "" },
      Friday: { open: "", close: "" },
      Saturday: { open: "", close: "" },
      Sunday: { open: "", close: "" },
    },
    listImage: [],
    amenity: [],
    status: "Active",
  });
  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
    thumbnail: "",
    operatingTime: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(true);

  const getGymInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2002/gms/api/v1/gym/get-gym/${id}`
      );

      const gyms = {
        ...response.data,
        operatingTime: JSON.parse(response.data.operatingTime),
        listImage: JSON.parse(response.data.listImage),
        amenity: JSON.parse(response.data.amenity),
      };

      const formattedOperatingTime = {};
      for (const day in gyms.operatingTime) {
        const [open, close] = gyms.operatingTime[day].split(" - ");
        formattedOperatingTime[day] = {
          open: dayjs(open, "HH:mm"),
          close: dayjs(close, "HH:mm"),
        };
      }

      setFormData({
        ...gyms,
        operatingTime: formattedOperatingTime,
      });
      setStatus(gyms.status === "Active");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGymInfo();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, thumbnail: URL.createObjectURL(file) });
      validateField("thumbnail", file.name);
    }
  };

  const handleAddImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const newImageUrl = URL.createObjectURL(file);

      setFormData((prevFormData) => ({
        ...prevFormData,
        listImage: [...prevFormData.listImage, newImageUrl],
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prevFormData) => {
      const newListImg = [...prevFormData.listImage];
      newListImg.splice(index, 1);
      return {
        ...prevFormData,
        listImage: newListImg,
      };
    });
  };

  const handleTimeChange = (day, type, value) => {
    setFormData({
      ...formData,
      operatingTime: {
        ...formData.operatingTime,
        [day]: { ...formData.operatingTime[day], [type]: value },
      },
    });
  };

  const handleStatusChange = () => {
    setStatus(!status);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Gym name is required.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "address":
        if (!value.trim()) {
          error = "Gym address is required.";
        }
        setErrors((prev) => ({ ...prev, address: error }));
        break;

      case "phone":
        if (!value.trim()) {
          error = "Contact phone number is required.";
        } else if (!/^0\d{9,}$/.test(value)) {
          error =
            "Contact phone number must start with 0 and have at least 10 digits.";
        }
        setErrors((prev) => ({ ...prev, phone: error }));
        break;

      case "thumbnail":
        if (!value.trim()) {
          error = "Thumbnail is required.";
        }
        setErrors((prev) => ({ ...prev, thumbnail: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...formData.amenity];
    updatedAmenities[index] = value;
    setFormData({ ...formData, amenity: updatedAmenities });
  };

  const handleAddAmenity = () => {
    setFormData({ ...formData, amenity: [...formData.amenity, ""] });
  };

  const handleDeleteAmenity = (index) => {
    const updatedAmenities = formData.amenity.filter((_, i) => i !== index);
    setFormData({ ...formData, amenity: updatedAmenities });
  };

  // Alert
  const [contentAlert, setContentAlert] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleSubmit = async () => {
    const nameError = validateField("name", formData.name);
    const thumbnailError = validateField("thumbnail", formData.thumbnail);
    const addressError = validateField("address", formData.address);
    const phoneError = validateField("phone", formData.phone);

    let operatingTimeError = "";

    days.forEach((day) => {
      const openTime = formData.operatingTime[day].open;
      const closeTime = formData.operatingTime[day].close;

      if (!openTime || !closeTime) {
        operatingTimeError = "Operating time is required for all days.";
      } else if (dayjs(closeTime).isBefore(dayjs(openTime))) {
        operatingTimeError = "Close time cannot be before open time.";
      }
    });
    setErrors((prev) => ({ ...prev, operatingTime: operatingTimeError }));

    if (
      !nameError &&
      !thumbnailError &&
      !addressError &&
      !phoneError &&
      !operatingTimeError
    ) {
      setIsButtonDisabled(true);
      const nonEmptyAmenities = formData.amenity.filter(
        (amenity) => amenity.trim() !== ""
      );

      let downloadURL = "";
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      const uploadedImages = [];
      for (const img of formData.listImage) {
        if (img.startsWith("blob:")) {
          // Nếu ảnh là một file mới được chọn
          const response = await fetch(img);
          const blob = await response.blob();
          const imgRef = ref(storage, `images/${Date.now()}-${blob.name}`);
          const imgSnapshot = await uploadBytes(imgRef, blob);
          const imgURL = await getDownloadURL(imgSnapshot.ref);
          uploadedImages.push(imgURL);
        } else {
          // Nếu ảnh đã có sẵn URL từ Firebase
          uploadedImages.push(img);
        }
      }

      const formattedOperatingTime = {};
      for (const day in formData.operatingTime) {
        const { open, close } = formData.operatingTime[day];
        formattedOperatingTime[day] = `${open.format("HH:mm")} - ${close.format(
          "HH:mm"
        )}`;
      }

      try {
        await api.put(`/gym/edit-gym/${id}`, {
          name: formData.name,
          address: formData.address,
          description: formData.description,
          phone: formData.phone,
          thumbnail: selectedImage ? downloadURL : formData.thumbnail,
          operatingTime: JSON.stringify(formattedOperatingTime),
          listImage: JSON.stringify(uploadedImages),
          amenity: JSON.stringify(nonEmptyAmenities),
          status: status ? "Active" : "Inactive",
        });
        setContentAlert("Gym information updated successfully!");
        setOpenAlert(true);
        setTimeout(() => {
          navigate("/gyms");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <Box
      sx={{
        minHeight: "89.5vh",
        backgroundColor: "#f5f7fa",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          color: "#343c6a",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        Edit Gym Information
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 4 }}>
        <Box>
          <TitleField>Gym name *:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="name"
            multiline
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter gym name"
            helperText={errors.name}
          />
        </Box>
        <Box>
          <TitleField>Description:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="description"
            multiline
            minRows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
        </Box>
        <Box>
          <TitleField>Address *:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="address"
            multiline
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter gym address"
            helperText={errors.address}
          />
        </Box>
        <Box>
          <TitleField>Contact phone number *:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter contact phone number"
            helperText={errors.phone}
          />
        </Box>

        <Box>
          <TitleField>Thumbnail *:</TitleField>
          <Box>
            <Badge
              overlap="rectangular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              badgeContent={
                <IconButton
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = handleImageChange;
                    fileInput.click();
                  }}
                  sx={{
                    backgroundColor: "#6e34d5 !important",
                    color: "white !important",
                    p: 0.75,
                  }}
                >
                  <EditIcon sx={{ fontSize: 23 }} />
                </IconButton>
              }
            >
              <img
                src={formData.thumbnail}
                alt="thumbnail"
                style={{
                  width: "35vw",
                  height: 320,
                  objectFit: "cover",
                  borderRadius: 16,
                }}
              />
            </Badge>
          </Box>
          <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
            {errors.thumbnail}
          </TextStyled>
        </Box>

        <Box>
          <TitleField>Operating time *:</TitleField>
          {days.map((day) => (
            <Box
              key={day}
              sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
            >
              <TextStyled sx={{ width: "7vw" }}>{day}:</TextStyled>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={formData.operatingTime[day].open}
                  onChange={(newValue) =>
                    handleTimeChange(day, "open", newValue)
                  }
                  maxTime={formData.operatingTime[day].close}
                  renderInput={(params) => (
                    <TextFieldItem
                      {...params}
                      sx={{ width: "20vw" }}
                      placeholder="Open time"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                />
                <TimePicker
                  value={formData.operatingTime[day].close}
                  onChange={(newValue) =>
                    handleTimeChange(day, "close", newValue)
                  }
                  minTime={formData.operatingTime[day].open}
                  renderInput={(params) => (
                    <TextFieldItem
                      {...params}
                      sx={{ width: "20vw" }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          ))}
          <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
            {errors.operatingTime}
          </TextStyled>
        </Box>

        <Box>
          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2, mb: 4 }}
          >
            <TitleField>Images:</TitleField>
            <ToolButton
              startIcon={<AddPhotoAlternateIcon />}
              component="label"
              sx={{ px: 3 }}
            >
              Add Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAddImage}
              />
            </ToolButton>
          </Box>
          <Grid container spacing={2}>
            {formData.listImage.map((img, index) => (
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
                    onClick={() => handleRemoveImage(index)}
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

        <Box>
          <TitleField>Amenities:</TitleField>
          {formData.amenity.map((amenity, index) => (
            <Box key={index} display="flex" alignItems="center" gap={1} mb={2}>
              <TextFieldItem
                sx={{ width: "20vw" }}
                value={amenity}
                onChange={(e) => handleAmenityChange(index, e.target.value)}
                placeholder="Enter amenity name"
              />
              <IconButton
                onClick={() => handleDeleteAmenity(index)}
                aria-label="delete"
                sx={{
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  },
                }}
              >
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Box>
          ))}

          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={handleAddAmenity}
          >
            Add amenity
          </ToolButton>
        </Box>

        <Box>
          <TitleField>Status *:</TitleField>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <IOSSwitch checked={status} onChange={handleStatusChange} />
            <StatusButton
              sx={{
                px: 3,
                ...(status && {
                  color: "rgb(0, 182, 155) !important",
                  backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                  border: "1px solid rgb(0, 182, 155) !important",
                }),
                ...(!status && {
                  color: "rgb(239, 56, 38) !important",
                  backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                  border: "1px solid rgb(239, 56, 38) !important",
                }),
              }}
            >
              {status ? "Active" : "Inactive"}
            </StatusButton>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            mt: 5,
            mb: 3,
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "white",
              border: "1px solid #aaa",
              color: "#221515",
              textTransform: "none",
              width: "10vw",
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#eee",
              },
            }}
            disabled={isButtonDisabled}
            onClick={() => navigate("/gyms")}
          >
            Cancel
          </Button>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "10vw",
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>

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

export default EditGymPage;
