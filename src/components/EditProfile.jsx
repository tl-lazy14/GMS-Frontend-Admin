import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "./Dialog/ConfirmDialog";
import { UserContext } from "./userContext";
import api from "./axiosInterceptor";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  transition: "0.1s",
  "&:hover": {
    backgroundColor: "#6e34d5",
    color: "white",
  },
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
    backgroundColor: "#f6f8fa",
    color: "#343c6a",
    borderRadius: 16,
    "& fieldset": {
      border: "1px solid #d0d7de",
      borderRadius: 16,
    },
    "&:hover fieldset": {
      border: "1px solid #d0d7de",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "17px",
    fontFamily: "'Outfit Variable', sans-serif",
    color: "#ea2c3e",
    lineHeight: 1.4,
  },
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
  color: "#343c6a",
}));

const ErrorText = styled(Typography)(() => ({
  fontSize: "17px",
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
}));

const EditProfile = () => {
  const { user, setUser } = useContext(UserContext);

  // Ban dau phai la rong het, sau khi call API lay profile hien tai moi set
  const [profileData, setProfileData] = useState({});
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    dob: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setProfileData({
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      dob: dayjs(user?.dob),
      address: user?.address,
      avatar: user?.avatar,
      role: user?.role === "SENIOR_ADMIN" ? "High-level Admin" : "Gym Manager",
      managedGym: user?.role !== "SENIOR_ADMIN" ? user?.gym?.name : '',
    });
  }, [user]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUploadAvatar = async (file) => {
    setSelectedImage(file);
    setProfileData({ ...profileData, avatar: URL.createObjectURL(file) });
    handleCloseMenu();
  };

  const handleRemoveAvatar = async () => {
    setSelectedImage(null);
    setProfileData({ ...profileData, avatar: "" });
    handleCloseMenu();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (newDate) => {
    setProfileData({ ...profileData, dob: newDate });
    validateField("dob", newDate);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!/^0\d{9,}$/.test(value)) {
          error = "Phone number must start with 0 and have at least 10 digits.";
        }
        setErrors((prev) => ({ ...prev, phone: error }));
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required.";
        }
        setErrors((prev) => ({ ...prev, dob: error }));
        break;

      default:
        break;
    }
    return error;
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Confirm Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleConfirmDialog = async () => {
    try {
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }
      // eslint-disable-next-line no-unused-vars
      const response = await api.put(`/user/edit-profile/${user.id}`, {
        name: profileData.name,
        phone: profileData.phone,
        dob: dayjs(profileData.dob).format("YYYY-MM-DD"),
        address: profileData.address,
        avatar: selectedImage ? downloadURL : profileData.avatar,
      });
      setUser(response.data);
      setSelectedImage(null);
      setOpenDialog(false);
      setOpenAlert(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = () => {
    const nameError = validateField("name", profileData.name);
    const phoneError = validateField("phone", profileData.phone);
    const dobError = validateField("dob", profileData.dob);

    if (nameError === "" && phoneError === "" && dobError === "") {
      setOpenDialog(true);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 10, py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton
              onClick={handleAvatarClick}
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
          <Avatar
            src={profileData.avatar}
            alt="User Avatar"
            sx={{ width: 150, height: 150 }}
          />
        </Badge>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItemStyled
            onClick={() => {
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = "image/*";
              fileInput.onchange = (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                  handleUploadAvatar(file);
                }
              };
              fileInput.click();
            }}
          >
            Upload a photo
          </MenuItemStyled>
          <MenuItemStyled onClick={handleRemoveAvatar}>
            Remove photo
          </MenuItemStyled>
        </Menu>
      </Box>

      <Box>
        <Grid container rowSpacing={3} columnSpacing={5}>
          <Grid item xs={6}>
            <Box>
              <TitleField>Your Name</TitleField>
              <TextFieldItem
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                helperText={errors.name}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Phone Number</TitleField>
              <TextFieldItem
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                helperText={errors.phone}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Email</TitleField>
              <TextFieldItem
                value={profileData.email}
                InputProps={{
                  readOnly: true,
                }}
                disabled
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <TitleField>Date of Birth</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="dob"
                value={profileData.dob}
                onChange={(newDate) => handleDateChange(newDate)}
                inputFormat="DD/MM/YYYY"
                maxDate={dayjs().subtract(18, "year")}
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <ErrorText>{errors.dob}</ErrorText>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Address</TitleField>
              <TextFieldItem
                name="address"
                value={profileData.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </Box>
          </Grid>
          {user.role !== "SENIOR_ADMIN" && (
            <Grid item xs={6}>
              <Box>
                <TitleField>Managed Gym</TitleField>
                <TextFieldItem
                  value={profileData.managedGym}
                  InputProps={{
                    readOnly: true,
                  }}
                  disabled
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              color: "white",
              textTransform: "none",
              width: "10vw",
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
              },
            }}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      </Box>

      <ConfirmDialog
        title="Confirm profile update"
        content="Are you sure you want to update your profile information? This action will save the changes you've made."
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
          Update profile successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
