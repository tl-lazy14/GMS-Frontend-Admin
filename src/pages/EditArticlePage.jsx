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
import ReactQuill from "react-quill";
import "../components/Quill.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

const listCategories = [
  "News & Events",
  "Workout Knowledge",
  "Exercises",
  "Nutrition",
  "Health Guides",
  "Workout Stories",
];

const parseTagString = (tagString) => {
  // Kiểm tra xem tagString có rỗng không
  if (!tagString || tagString.trim() === "") {
    return [];
  }
  const tags = tagString.split("/");
  return tags.filter((tag) => tag.trim() !== "");
};

const EditArticlePage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    category: "not-select",
    tags: [],
  });
  const [errors, setErrors] = useState({
    title: "",
    thumbnail: "",
    content: "",
    category: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getArticle = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/article/get-article/${id}`);
      setFormData((prevFormData) => ({
        ...prevFormData,
        title: response.data.title,
        thumbnail: response.data.thumbnail,
        category: response.data.category || "not-select",
        tags: parseTagString(response.data.tags),
        content: response.data.content,
      }));
      setDataLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getArticle();
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

      case "thumbnail":
        if (!value.trim()) {
          error = "Thumbnail is required.";
        }
        setErrors((prev) => ({ ...prev, thumbnail: error }));
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

      case "category":
        if (value === "not-select") {
          error = "Please select a category.";
        }
        setErrors((prev) => ({ ...prev, category: error }));
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

  const handleTagChange = (index, value) => {
    if (value.includes("/")) {
      return; // Don't allow '/' character in tags
    }
    const updatedTags = [...formData.tags];
    updatedTags[index] = value;
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleAddTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ""] });
  };

  const handleDeleteTag = (index) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = async () => {
    const titleError = validateField("title", formData.title);
    const thumbnailError = validateField("thumbnail", formData.thumbnail);
    const contentError = validateField("content", formData.content);
    const categoryError = validateField("category", formData.category);

    // Kiểm tra xem có lỗi nào không
    if (!titleError && !thumbnailError && !contentError && !categoryError) {
      const nonEmptyTags = formData.tags.filter((tag) => tag.trim() !== "");
      const tagsString = nonEmptyTags.join("/");

      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      // Tìm tất cả các chuỗi base64 trong nội dung
      const base64Images =
        formData.content.match(/src="data:image\/[^;]+;base64[^"]+"/g) || [];
      let updatedContent = formData.content;
      // Upload từng ảnh base64 và thay thế bằng URL từ Firebase
      for (const base64Image of base64Images) {
        const base64String = base64Image.match(/src="([^"]+)"/)[1];
        const response = await fetch(base64String);
        const blob = await response.blob();
        const fileName = `image_${Date.now()}.png`; // Hoặc đặt tên khác theo ý muốn
        const imageRef = ref(storage, `images/${fileName}`);
        const imageSnapshot = await uploadBytes(imageRef, blob);
        const imageURL = await getDownloadURL(imageSnapshot.ref);

        // Thay thế chuỗi base64 bằng URL Firebase trong nội dung
        updatedContent = updatedContent.replace(base64String, imageURL);
      }

      try {
        // eslint-disable-next-line no-unused-vars
        const response = await api.put(`/article/edit-article/${id}`, {
          title: formData.title,
          thumbnail: selectedImage ? downloadURL : formData.thumbnail,
          content: updatedContent,
          category: formData.category,
          tags: tagsString,
          status: "no-need",
        });
        setTypeAlert("success");
        setContentAlert("Article updated successfully!");
        setOpenAlert(true);
        setIsButtonDisabled(true);
        setTimeout(() => {
          navigate(`/articles/detail/${id}`);
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
          Edit Article
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 4 }}>
        {dataLoaded && (
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
        )}

        {dataLoaded && (
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
        )}

        {dataLoaded && (
          <Box>
            <TitleField>Content *:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                
                value={formData.content}
                theme="snow"
                name="content"
                onChange={handleEditorChange}
                modules={{
                  toolbar: {
                    container: [
                      [{ header: "1" }, { header: "2" }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                      ["link", "image", "video"],
                    ],
                  },
                }}
              />
            </Box>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.content}
            </TextStyled>
          </Box>
        )}

        {dataLoaded && (
          <Box>
            <TitleField>Category *:</TitleField>
            <SelectItem
              sx={{ width: "25vw" }}
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItemStyled value="not-select">
                Select category
              </MenuItemStyled>
              {listCategories.map((item, idx) => (
                <MenuItemStyled key={idx} value={item}>
                  {item}
                </MenuItemStyled>
              ))}
            </SelectItem>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.category}
            </TextStyled>
          </Box>
        )}

        {dataLoaded && (
          <Box>
            <TitleField>Tags:</TitleField>
            {formData.tags.map((tag, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={1}
                mb={2}
              >
                <TextFieldItem
                  sx={{ width: "20vw" }}
                  value={tag}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                  placeholder="Enter tag"
                />
                <IconButton
                  onClick={() => handleDeleteTag(index)}
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
              onClick={handleAddTag}
            >
              Add tag
            </ToolButton>
          </Box>
        )}

        {dataLoaded && (
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
              onClick={() => navigate(-1)}
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
        )}
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

export default EditArticlePage;
