import {
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
}));

const CreatePTPackage = ({ openDialog, handleCloseDialog, setOpenAlert, getListPTPackages }) => {
  const [formData, setFormData] = useState({
    name: "",
    duration: 1,
    numSessions: 1,
    price: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    duration: "",
    numSessions: "",
    price: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "price") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    } else if (
      (name === "duration" || name === "numSessions") &&
      value !== "" &&
      (!/^\d+$/.test(value) || parseInt(value, 10) < 1)
    ) {
      return;
    }
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === ".") {
      event.preventDefault();
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

      case "duration":
        if (!value) {
          error = "Duration is required.";
        }
        setErrors((prev) => ({ ...prev, duration: error }));
        break;

      case "numSessions":
        if (!value) {
          error = "Number of sessions is required.";
        }
        setErrors((prev) => ({ ...prev, numSessions: error }));
        break;

      case "price":
        if (!value.trim() || parseFloat(value) === 0) {
          error = "Price is required.";
        }
        setErrors((prev) => ({ ...prev, price: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const nameError = validateField("name", formData.name);
    const durationError = validateField("duration", formData.duration);
    const numSessionsError = validateField("numSessions", formData.numSessions);
    const priceError = validateField("price", formData.price);

    // Kiểm tra xem có lỗi nào không
    if (!nameError && !durationError && !numSessionsError && !priceError) {
      try {
        await api.post("/service/add-pt-package", {
          name: formData.name,
          duration: formData.duration,
          numSessions: formData.numSessions,
          price: parseFloat(formData.price),
          status: "Active",
        });
        closeDialog();
        setOpenAlert(true);
        getListPTPackages();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      name: "",
      duration: 1,
      numSessions: 1,
      price: "",
    });
    setErrors({
      name: "",
      duration: "",
      numSessions: "",
      price: "",
    });
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
        Create New Personal Trainer Package
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
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <TitleField>Duration (in months) *:</TitleField>
                <TextFieldItem
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  inputProps={{
                    min: 1,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { textAlign: "center" },
                  }}
                  onKeyDown={handleKeyDown}
                />
              </Box>
              <Box>
                <TitleField>Number of sessions *:</TitleField>
                <TextFieldItem
                  name="numSessions"
                  type="number"
                  value={formData.numSessions}
                  onChange={handleChange}
                  inputProps={{
                    min: 1,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { textAlign: "center" },
                  }}
                  onKeyDown={handleKeyDown}
                />
              </Box>
            </Box>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.duration}
            </TextStyled>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.numSessions}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Price (in $) *:</TitleField>
            <TextFieldItem
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter package price"
              autoComplete="off"
              helperText={errors.price}
            />
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
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePTPackage;
