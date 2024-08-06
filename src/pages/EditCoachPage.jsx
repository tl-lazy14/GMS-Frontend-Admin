import {
  Alert,
  Badge,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 15,
  alignItems: "center",
}));

const TitleFieldRow = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
  fontWeight: 500,
  color: "#343c6a",
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

const EditCoachPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams();

  const [listGyms, setListGyms] = useState([]);
  const [formData, setFormData] = useState({});
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
  const [dataLoaded, setDataLoaded] = useState(false);

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/gym/get-list-active-gym"
      );
      setListGyms(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const { user } = useContext(UserContext);

  const getCoachInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:2002/gms/api/v1/coach/get-coach-info/${id}`);
      setFormData({
        ...response.data,
        gymId: response.data.gym.id,
      });
      setDataLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
    getCoachInfo();
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
      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
      validateField("imageUrl", file.name);
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

  const handleStatusChange = () => {
    setFormData({
      ...formData,
      status: formData.status === "Active" ? "Inactive" : "Active",
    });
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

      case "imageUrl":
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

      case "gymId":
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
    const imageError = validateField("imageUrl", formData.imageUrl);
    const levelError = validateField("level", formData.level);
    const gymError = validateField("gymId", formData.gymId);

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
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      try {
        // eslint-disable-next-line no-unused-vars
        await api.put(`/coach/edit-coach/${id}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: dayjs(formData.dob).format("YYYY-MM-DD"),
          imageUrl: selectedImage ? downloadURL : formData.imageUrl,
          level: formData.level,
          experience: formData.experience,
          expertise: formData.expertise,
          certification: formData.certification,
          achievements: formData.achievements,
          description: formData.description,
          gymId: formData.gymId,
          status: formData.status,
        });
        setContentAlert(`Coach info updated successfully!`);
        setOpenAlert(true);
        setTimeout(() => {
          navigate(`/coaches/detail/${id}`);
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
        Edit Coach Information
      </Typography>

      <Box sx={{ my: 4 }}>
        {dataLoaded && (
          <Box sx={{ display: "flex", gap: 15 }}>
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
                  src={formData.imageUrl}
                  alt="coach img"
                  style={{
                    width: "25vw",
                    objectFit: "cover",
                    borderRadius: 16,
                  }}
                />
              </Badge>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "35vw",
              }}
            >
              <FieldContainer>
                <TitleFieldRow>Code:</TitleFieldRow>
                <TextStyled>{formData.code}</TextStyled>
              </FieldContainer>
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
                    name="gymId"
                    value={formData.gymId}
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
              <Box>
                <TitleField>Status *:</TitleField>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <IOSSwitch
                    checked={formData.status === "Active"}
                    onChange={handleStatusChange}
                  />
                  <StatusButton
                    sx={{
                      px: 3,
                      ...(formData.status === "Active" && {
                        color: "rgb(0, 182, 155) !important",
                        backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                        border: "1px solid rgb(0, 182, 155) !important",
                      }),
                      ...(formData.status === "Inactive" && {
                        color: "rgb(239, 56, 38) !important",
                        backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                        border: "1px solid rgb(239, 56, 38) !important",
                      }),
                    }}
                  >
                    {formData.status}
                  </StatusButton>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {dataLoaded && (
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
                  value={formData.certification}
                  theme="snow"
                  onChange={(value) =>
                    handleEditorChange("certification", value)
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
                  onChange={(value) =>
                    handleEditorChange("achievements", value)
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
              onClick={() => navigate(`/coaches/detail/${id}`)}
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

export default EditCoachPage;
