import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import api from "../components/axiosInterceptor";

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

const ErrorText = styled(Typography)(() => ({
  fontSize: "17px",
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
  paddingLeft: 14,
}));

const GymManagerAdd = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const [listGyms, setListGyms] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: null,
    address: "",
    gymManaged: "not-select",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gymManaged: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, dob: newDate });
    validateField("dob", newDate);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces.";
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

      case "password":
        if (!value.trim()) {
          error = "Default password is required.";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        setErrors((prev) => ({ ...prev, password: error }));
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

      case "gymManaged":
        if (value === "not-select") {
          error = "Please select a gym.";
        }
        setErrors((prev) => ({ ...prev, gymManaged: error }));
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
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);
    const phoneError = validateField("phone", formData.phone);
    const dobError = validateField("dob", formData.dob);
    const gymManagedError = validateField("gymManaged", formData.gymManaged);

    // Kiểm tra xem có lỗi nào không
    if (
      !nameError &&
      !phoneError &&
      !emailError &&
      !passwordError &&
      !dobError &&
      !gymManagedError
    ) {
      try {
        await api.post("/user/create-user", {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          dob: dayjs(formData.dob).format("YYYY-MM-DD"),
          address: formData.address,
          gymId: formData.gymManaged,
        });
        setIsButtonDisabled(true);
        setTypeAlert("success");
        setContentAlert("New gym manager created successfully!");
        setOpenAlert(true);
        setTimeout(() => {
          navigate("/gym-managers");
        }, 2000);
      } catch (err) {
        setTypeAlert("error");
        setContentAlert(err.response.data.error);
        setOpenAlert(true);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Add New Gym Manager
        </Typography>
      </Box>

      <Box>
        <Grid container rowSpacing={3} columnSpacing={5}>
          <Grid item xs={6}>
            <Box>
              <TitleField>Name *</TitleField>
              <TextFieldItem
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                helperText={errors.name}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Phone Number *</TitleField>
              <TextFieldItem
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                helperText={errors.phone}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Email *</TitleField>
              <TextFieldItem
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                helperText={errors.email}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Default Password *</TitleField>
              <TextFieldItem
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter default password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText={errors.password}
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
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
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <ErrorText>{errors.dob}</ErrorText>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Address</TitleField>
              <TextFieldItem
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <TitleField>Gym Managed *</TitleField>
              <SelectItem
                name="gymManaged"
                value={formData.gymManaged}
                onChange={handleChange}
              >
                <MenuItemStyled value="not-select">Select a gym</MenuItemStyled>
                {listGyms?.map((item) => (
                  <MenuItemStyled key={item.id} value={item.id}>
                    {item.name}
                  </MenuItemStyled>
                ))}
              </SelectItem>
              <ErrorText>{errors.gymManaged}</ErrorText>
            </Box>
          </Grid>
        </Grid>

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
            onClick={() => navigate("/gym-managers")}
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

export default GymManagerAdd;
