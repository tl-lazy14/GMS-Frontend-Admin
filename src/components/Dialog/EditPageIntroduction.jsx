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

const EditPageIntroduction = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  selectedItem,
  getListIntroPage,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title,
        description: selectedItem.description,
        image: selectedItem.image,
      });
      setSelectedImage(null);
    }
  }, [selectedItem, openDialog]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async () => {
    setIsButtonDisabled(true);
    let downloadURL;
    if (selectedImage) {
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      const snapshot = await uploadBytes(storageRef, selectedImage);
      downloadURL = await getDownloadURL(snapshot.ref);
    }

    try {
      await api.put(`/content-website/edit-intro-page/${selectedItem.id}`, {
        description: formData.description,
        image: selectedImage ? downloadURL : formData.image
      });
      getListIntroPage();
      closeDialog();
      setOpenAlert(true);
    } catch (err) {
      console.log(err);
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      title: "",
      description: "",
      image: "",
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
      maxWidth="md"
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
        Edit Page Introduction
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
            <TitleField>Title:</TitleField>
            <TextFieldItem
              value={formData.title}
              InputProps={{
                readOnly: true,
              }}
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
              placeholder="Enter page description"
              autoComplete="off"
            />
          </Box>
          <Box>
            <TitleField>Image *:</TitleField>
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
                src={formData.image}
                alt="thumbnail"
                style={{
                  width: "100%",
                  borderRadius: 16,
                }}
              />
            </Badge>
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

export default EditPageIntroduction;
