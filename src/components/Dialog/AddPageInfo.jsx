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
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
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

const AddPageInfo = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  selectedPage,
  getListGeneralInfoPage,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  useEffect(() => {
    setFormData({
      title: "",
      content: "",
      image: "",
    });
    setErrors({
      title: "",
      content: "",
      image: "",
    });
  }, [openDialog]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, image: file.name });
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
      setFormData({ ...formData, content: "" });
    } else {
      setFormData({ ...formData, content: value });
    }

    validateField("content", value);
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

      case "content":
        const strippedContent = value.replace(/<[^>]*>/g, "");
        if (
          value.trim() === "" ||
          onlySpaceRegex.test(strippedContent) ||
          value === "<p><br></p>"
        ) {
          error = "Content is required.";
        }
        setErrors((prev) => ({ ...prev, content: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const titleError = validateField("title", formData.title);
    const imageError = validateField("image", formData.image);
    const contentError = validateField("content", formData.content);

    // Kiểm tra xem có lỗi nào không
    if (!titleError && !imageError && !contentError) {
      setIsButtonDisabled(true);
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      const snapshot = await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      try {
        await api.post("/content-website/add-general-info", {
          title: formData.title,
          description: formData.content,
          image: downloadURL,
          page: selectedPage,
        });
        setOpenAlert(true);
        getListGeneralInfoPage();
        closeDialog();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    setFormData({
      title: "",
      content: "",
      image: "",
    });
    setErrors({
      title: "",
      content: "",
      image: "",
    });
    setSelectedImage(null);
    setIsButtonDisabled(false);
    handleCloseDialog();
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
        Create New Information
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
                value={formData.content}
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
              {errors.content}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Image *:</TitleField>
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
                <TextStyled sx={{ color: "grey" }}>Upload image</TextStyled>
              </Box>
            )}
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

export default AddPageInfo;
