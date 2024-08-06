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
import ReactQuill from "react-quill";
import "../Quill.css";
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

const EditPageInfo = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  selectedItem,
  getListGeneralInfoPage
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [errors, setErrors] = useState({
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
      setErrors({
        title: "",
        description: "",
        image: "",
      });
      setSelectedImage(null);
    }
  }, [selectedItem, openDialog]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, image: URL.createObjectURL(file) });
      validateField("image", file.name);
    }
  };

  const handleEditorChange = (value) => {
    const onlySpaceRegex = /^\s*$/;
    const strippedContent = value.replace(/<[^>]*>/g, "");
    if (
      value.trim() === "" ||
      onlySpaceRegex.test(strippedContent) ||
      value === "<p><br></p>"
    ) {
      setFormData({ ...formData, description: "" });
    } else {
      setFormData({ ...formData, description: value });
    }

    validateField("description", value);
  };

  const validateField = (field, value) => {
    let error = "";
    const onlySpaceRegex = /^\s*$/;
    switch (field) {
      case "title":
        if (!value.trim()) {
          error = "Title is required.";
        }
        setErrors((prev) => ({ ...prev, title: error }));
        break;

      case "image":
        if (!value.trim()) {
          error = "Image is required.";
        }
        setErrors((prev) => ({ ...prev, image: error }));
        break;

      case "description":
        const strippedContent = value.replace(/<[^>]*>/g, "");
        if (
          value.trim() === "" ||
          onlySpaceRegex.test(strippedContent) ||
          value === "<p><br></p>"
        ) {
          error = "Content is required.";
        }
        setErrors((prev) => ({ ...prev, description: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const titleError = validateField("title", formData.title);
    const imageError = validateField("image", formData.image);
    const contentError = validateField("description", formData.description);

    // Kiểm tra xem có lỗi nào không
    if (!titleError && !imageError && !contentError) {
      setIsButtonDisabled(true);
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      try {
        await api.put(`/content-website/edit-general-info/${selectedItem.id}`, {
          title: formData.title,
          description: formData.description,
          image: selectedImage ? downloadURL : formData.image,
          page: selectedItem.page
        });
        getListGeneralInfoPage();
        closeDialog();
        setOpenAlert(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      title: "",
      description: "",
      image: "",
    });
    setErrors({
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
        Edit Information
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
            <TitleField>Title *:</TitleField>
            <TextFieldItem
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              autoComplete="off"
              helperText={errors.title}
            />
          </Box>
          <Box>
            <TitleField>Content *:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill quill-info"
                value={formData.description}
                theme="snow"
                onChange={handleEditorChange}
                modules={{
                  toolbar: {
                    container: [
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                    ],
                  },
                }}
              />
            </Box>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.description}
            </TextStyled>
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
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.image}
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

export default EditPageInfo;
