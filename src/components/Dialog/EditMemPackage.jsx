import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import api from "../axiosInterceptor";

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
  color: "#343c6a",
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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
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

const EditMemPackage = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  selectedPackage,
  getListMembershipPackage
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceMonth: "",
    thumbnail: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    priceMonth: "",
    thumbnail: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [status, setStatus] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedPackage) {
      setFormData({
        name: selectedPackage.name,
        description: selectedPackage.description,
        priceMonth: selectedPackage.priceMonth,
        thumbnail: selectedPackage.thumbnail,
      });
      setStatus(selectedPackage.status === "Active");
    }
  }, [selectedPackage, openDialog]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "priceMonth") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }
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

  const handleStatusChange = () => {
    setStatus(!status);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Package name is required.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "thumbnail":
        if (!value.trim()) {
          error = "Thumbnail is required.";
        }
        setErrors((prev) => ({ ...prev, thumbnail: error }));
        break;

      case "priceMonth":
        if (!value.toString().trim() || parseFloat(value) === 0) {
          error = "Monthly price is required.";
        }
        setErrors((prev) => ({ ...prev, priceMonth: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const nameError = validateField("name", formData.name);
    const thumbnailError = validateField("thumbnail", formData.thumbnail);
    const priceMonthError = validateField("priceMonth", formData.priceMonth);

    // Kiểm tra xem có lỗi nào không
    if (!nameError && !thumbnailError && !priceMonthError) {
      setIsButtonDisabled(true);
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      try {
        await api.put(`/service/edit-membership-package/${selectedPackage.id}`, {
          name: formData.name,
          description: formData.description,
          priceMonth: parseFloat(formData.priceMonth),
          thumbnail: selectedImage ? downloadURL : formData.thumbnail,
          status: status ? 'Active' : 'Inactive',
        });
        closeDialog();
        setOpenAlert(true);
        getListMembershipPackage();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      name: "",
      description: "",
      priceMonth: "",
      thumbnail: "",
      status: true,
    });
    setErrors({
      name: "",
      priceMonth: "",
      thumbnail: "",
    });
    setIsButtonDisabled(false);
    setSelectedImage(null);
    setStatus(true);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          py: 1,
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
        }}
      >
        Edit Membership Package
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeDialog}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <TitleField>Name *:</TitleField>
            <TextFieldItem
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter package name"
              autoComplete="off"
              helperText={errors.name}
            />
          </Box>
          <Box>
            <TitleField>Description:</TitleField>
            <TextFieldItem
              name="description"
              value={formData.description}
              multiline
              minRows={4}
              onChange={handleChange}
              placeholder="Enter description"
              autoComplete="off"
            />
          </Box>
          <Box>
            <TitleField>Monthly price (in $) *:</TitleField>
            <TextFieldItem
              name="priceMonth"
              value={formData.priceMonth}
              onChange={handleChange}
              placeholder="Enter monthly price"
              autoComplete="off"
              helperText={errors.priceMonth}
            />
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
          <Box>
            <TitleField>Thumbnail *:</TitleField>
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
                  width: "100%",
                  borderRadius: 16,
                }}
              />
            </Badge>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.thumbnail}
            </TextStyled>
          </Box>

          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              margin: "auto",
              mt: 2,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemPackage;
