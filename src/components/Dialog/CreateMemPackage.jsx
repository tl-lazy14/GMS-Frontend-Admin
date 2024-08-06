import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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

const CreateMemPackage = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  getListMembershipPackage,
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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
      setFormData({ ...formData, thumbnail: file.name });
      validateField("thumbnail", file.name);
    }
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
        if (!value.trim() || parseFloat(value) === 0) {
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
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      const snapshot = await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      try {
        await api.post("/service/add-membership-package", {
          name: formData.name,
          description: formData.description,
          priceMonth: parseFloat(formData.priceMonth),
          thumbnail: downloadURL,
          status: "Active",
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
    });
    setErrors({
      name: "",
      priceMonth: "",
      thumbnail: "",
    });
    setSelectedImage(null);
    setIsButtonDisabled(false);
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
        Create New Membership Package
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
            <TitleField>Thumbnail *:</TitleField>
            {selectedImage ? (
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
                    src={URL.createObjectURL(selectedImage)}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      borderRadius: 16,
                    }}
                  />
                </Badge>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  borderRadius: 4,
                  border: "2px dashed #ccc",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  "&:hover": {
                    border: `2px dashed #6e34d5`,
                  },
                }}
                onClick={() => {
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = "image/*";
                  fileInput.onchange = handleImageChange;
                  fileInput.click();
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "grey" }} />
                <TextStyled sx={{ color: "grey" }}>Upload thumbnail</TextStyled>
              </Box>
            )}
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

export default CreateMemPackage;
