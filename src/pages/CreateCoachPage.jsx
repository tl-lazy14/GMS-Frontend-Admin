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
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import "../components/Quill.css";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import api from "../components/axiosInterceptor";
import { UserContext } from "../components/userContext";

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

const CreateCoachPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [listGyms, setListGyms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: null,
    image: "",
    level: "not-select",
    gym: user.role === 'GYM_MANAGER' ? user.gym?.id : "not-select",
    description: "",
    experience: "",
    expertise: "",
    certifications: "",
    achievements: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    image: "",
    level: "",
    gym: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "https://eagle-fits.onrender.com/gms/api/v1/gym/get-list-active-gym"
      );
      setListGyms(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
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
      setFormData({ ...formData, image: file.name });
      validateField("image", file.name);
    }
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      dob: newDate,
    }));
    validateField("dob", newDate);
  };

  const handleEditorChange = (name, value) => {
    const onlySpaceRegex = /^\s*$/;
    const strippedContent = value.replace(/<[^>]*>/g, "");
    if (
      value.trim() === "" ||
      onlySpaceRegex.test(strippedContent) ||
      value === "<p><br></p>"
    ) {
      setFormData({ ...formData, [name]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (
          // eslint-disable-next-line no-useless-escape
          !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ) {
          error = "Email is not valid.";
        }
        setErrors((prev) => ({ ...prev, email: error }));
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

      case "image":
        if (!value.trim()) {
          error = "Coach image is required.";
        }
        setErrors((prev) => ({ ...prev, image: error }));
        break;

      case "level":
        if (value === "not-select") {
          error = "Please select coach level.";
        }
        setErrors((prev) => ({ ...prev, level: error }));
        break;

      case "gym":
        if (value === "not-select") {
          error = "Please select a gym.";
        }
        setErrors((prev) => ({ ...prev, gym: error }));
        break;

      default:
        break;
    }

    return error;
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
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    const dobError = validateField("dob", formData.dob);
    const imageError = validateField("image", formData.image);
    const levelError = validateField("level", formData.level);
    const gymError = validateField("gym", formData.gym);

    // Kiểm tra xem có lỗi nào không
    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !dobError &&
      !imageError &&
      !levelError &&
      !gymError
    ) {
      setIsButtonDisabled(true);
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      const snapshot = await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      try {
        // eslint-disable-next-line no-unused-vars
        await api.post("/coach/add-coach", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: dayjs(formData.dob).format("YYYY-MM-DD"),
          imageUrl: downloadURL,
          level: formData.level,
          experience: formData.experience,
          expertise: formData.expertise,
          certification: formData.certifications,
          achievements: formData.achievements,
          description: formData.description,
          gymId: formData.gym,
          status: "Active",
        });
        setContentAlert(`New coach added successfully!`);
        setOpenAlert(true);
        setTimeout(() => {
          navigate("/coaches");
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
      <Typography
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          color: "#343c6a",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        Add New Coach
      </Typography>

      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", gap: 15 }}>
          <Box>
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
                    alt="coach img"
                    style={{
                      width: "25vw",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                </Badge>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "25vw",
                  height: "70vh",
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
                <TextStyled sx={{ color: "grey" }}>
                  Upload Coach Image
                </TextStyled>
              </Box>
            )}
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, textAlign: "center" }}>
              {errors.image}
            </TextStyled>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              width: "35vw",
            }}
          >
            <Box>
              <TitleField>Name *:</TitleField>
              <TextFieldItem
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                placeholder="Enter coach name"
                helperText={errors.name}
              />
            </Box>
            <Box>
              <TitleField>Email *:</TitleField>
              <TextFieldItem
                name="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                helperText={errors.email}
              />
            </Box>
            <Box>
              <TitleField>Phone number *:</TitleField>
              <TextFieldItem
                name="phone"
                autoComplete="off"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                helperText={errors.phone}
              />
            </Box>
            <Box>
              <TitleField>Date of Birth *</TitleField>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  name="dob"
                  value={formData.dob}
                  onChange={(newDate) => handleDateChange(newDate)}
                  inputFormat="DD/MM/YYYY"
                  maxDate={dayjs().subtract(18, "year")}
                  renderInput={(params) => (
                    <TextFieldItem
                      {...params}
                      autoComplete="off"
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
                {errors.dob}
              </TextStyled>
            </Box>
            <Box>
              <TitleField>Level *:</TitleField>
              <SelectItem
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <MenuItemStyled value="not-select">
                  Select coach level
                </MenuItemStyled>
                <MenuItemStyled value="Junior coach">
                  Junior coach
                </MenuItemStyled>
                <MenuItemStyled value="Senior coach">
                  Senior coach
                </MenuItemStyled>
              </SelectItem>
              <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
                {errors.level}
              </TextStyled>
            </Box>
            {user.role === "SENIOR_ADMIN" && (
              <Box>
                <TitleField>Gym *:</TitleField>
                <SelectItem
                  name="gym"
                  value={formData.gym}
                  onChange={handleChange}
                >
                  <MenuItemStyled value="not-select">
                    Select a gym
                  </MenuItemStyled>
                  {listGyms.map((item, idx) => (
                    <MenuItemStyled key={idx} value={item.id}>
                      {item.name}
                    </MenuItemStyled>
                  ))}
                </SelectItem>
                <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
                  {errors.gym}
                </TextStyled>
              </Box>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <TitleField>Description:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.description}
                theme="snow"
                onChange={(value) => handleEditorChange("description", value)}
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
                    ],
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            <TitleField>Work experience:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.experience}
                theme="snow"
                onChange={(value) => handleEditorChange("experience", value)}
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
                    ],
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            <TitleField>Expertise:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.expertise}
                theme="snow"
                onChange={(value) => handleEditorChange("expertise", value)}
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
                    ],
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            <TitleField>Certifications:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.certifications}
                theme="snow"
                onChange={(value) =>
                  handleEditorChange("certifications", value)
                }
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
                    ],
                  },
                }}
              />
            </Box>
          </Box>
          <Box>
            <TitleField>Achievements:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.achievements}
                theme="snow"
                onChange={(value) => handleEditorChange("achievements", value)}
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
                    ],
                  },
                }}
              />
            </Box>
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
            onClick={() => navigate("/coaches")}
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

export default CreateCoachPage;
