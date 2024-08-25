import {
  Alert,
  Badge,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { convertToEmbedUrl } from "../utils/formatString";
import api from "../components/axiosInterceptor";
import axios from "axios";

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
  color: "white",
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

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 16,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
    borderRadius: 16,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const EditExercisePage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams();

  const [listCategories, setListCategories] = useState([]);

  const getListCategory = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/exercise/get-list-category`);
      setListCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    url: '',
    categoryId: "not-select",
    level: "not-select",
  });
  const [errors, setErrors] = useState({
    title: "",
    thumbnail: "",
    url: "",
    category: "",
    level: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const getExerciseInfo = async () => {
    try {
      const response = await api.get(`/exercise/get-exercise/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        thumbnail: response.data.thumbnail,
        url: response.data.youtubeUrl,
        categoryId: response.data.exerciseCategory.id || "not-select",
        level: response.data.level || "not-select",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListCategory();
    getExerciseInfo();
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

  const validateField = (field, value) => {
    let error = "";
    const youtubeUrlPattern =
      /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    switch (field) {
      case "title":
        if (!value.trim()) {
          error = "Title is required.";
        }
        setErrors((prev) => ({ ...prev, title: error }));
        break;

      case "thumbnail":
        if (!value.trim()) {
          error = "Thumbnail is required.";
        }
        setErrors((prev) => ({ ...prev, thumbnail: error }));
        break;

      case "url":
        if (!value.trim()) {
          error = "Exercise video URL is required.";
        } else if (!youtubeUrlPattern.test(value.trim())) {
          error = "Please enter a valid YouTube video URL.";
        }
        setErrors((prev) => ({ ...prev, url: error }));
        break;

      case "categoryId":
        if (value === "not-select") {
          error = "Please select a category.";
        }
        setErrors((prev) => ({ ...prev, category: error }));
        break;

      case "level":
        if (value === "not-select") {
          error = "Please select level.";
        }
        setErrors((prev) => ({ ...prev, level: error }));
        break;

      default:
        break;
    }

    return error;
  };

  // Alert
  const [typeAlert, setTypeAlert] = useState("success");
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
    const titleError = validateField("title", formData.title);
    const thumbnailError = validateField("thumbnail", formData.thumbnail);
    const urlError = validateField("url", formData.url);
    const categoryError = validateField("categoryId", formData.categoryId);
    const levelError = validateField("level", formData.level);

    // Kiểm tra xem có lỗi nào không
    if (
      !titleError &&
      !thumbnailError &&
      !urlError &&
      !categoryError &&
      !levelError
    ) {
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      try {
        // eslint-disable-next-line no-unused-vars
        const response = await api.put(`/exercise/edit-exercise/${id}`, {
          title: formData.title,
          description: formData.description,
          thumbnail: selectedImage ? downloadURL : formData.thumbnail,
          url: formData.url,
          categoryId: formData.categoryId,
          level: formData.level,
        });
        setTypeAlert("success");
        setContentAlert("Exercise updated successfully!");
        setOpenAlert(true);
        setIsButtonDisabled(true);
        setTimeout(() => {
          navigate("/exercise-library");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Edit Exercise
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 4 }}>
        <Box>
          <TitleField>Title *:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="title"
            multiline
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            helperText={errors.title}
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
          <TitleField>Thumbnail *:</TitleField>
          {formData.thumbnail ? (
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
          ) : (
            <Box
              sx={{
                width: "35vw",
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
              <TextStyled sx={{ color: "grey" }}>Upload Thumbnail</TextStyled>
            </Box>
          )}
          <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
            {errors.thumbnail}
          </TextStyled>
        </Box>

        <Box>
          <TitleField>Youtube video URL *:</TitleField>
          <TextFieldItem
            sx={{ width: "40vw" }}
            name="url"
            multiline
            value={formData.url}
            onChange={handleChange}
            placeholder="Paste YouTube video URL here"
            helperText={errors.url}
          />
          {formData.url && (
            <Box sx={{ mt: 2 }}>
              <iframe
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  borderRadius: 16,
                  width: "40vw",
                  height: "45vh",
                }}
                src={convertToEmbedUrl(formData.url)}
                title={formData.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          )}
        </Box>

        <Box>
          <TitleField>Category *:</TitleField>
          <SelectItem
            sx={{ width: "25vw" }}
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <MenuItemStyled value="not-select">Select category</MenuItemStyled>
            {listCategories?.map((item, idx) => (
              <MenuItemStyled key={idx} value={item.id}>
                {item.name}
              </MenuItemStyled>
            ))}
          </SelectItem>
          <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
            {errors.category}
          </TextStyled>
        </Box>

        <Box>
          <TitleField>Level *:</TitleField>
          <SelectItem
            sx={{ width: "25vw" }}
            name="level"
            value={formData.level}
            onChange={handleChange}
          >
            <MenuItemStyled value="not-select">Select level</MenuItemStyled>
            <MenuItemStyled value="Beginner">Beginner</MenuItemStyled>
            <MenuItemStyled value="Intermediate">Intermediate</MenuItemStyled>
            <MenuItemStyled value="Advanced">Advanced</MenuItemStyled>
          </SelectItem>
          <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
            {errors.level}
          </TextStyled>
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
            onClick={() => navigate("/exercise-library")}
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
          severity={typeAlert === "error" ? "error" : "success"}
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

export default EditExercisePage;
