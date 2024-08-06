import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "./axiosInterceptor";
import { UserContext } from "./userContext";

const TextFieldItem = styled(TextField)(() => ({
  width: "100%",
  "& .MuiInputBase-input::placeholder": {
    color: "black",
    opacity: 0.6,
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "#f6f8fa",
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

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
  color: "#343c6a",
}));

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    reEnter: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    reEnter: "",
  });
  const [showPassword, setShowPassword] = useState({
    currentPassword: "",
    newPassword: "",
    reEnter: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleShowPassword = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "currentPassword":
        if (!value.trim()) {
          error = "Please enter your current password!";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        setErrors((prev) => ({ ...prev, currentPassword: error }));
        break;

      case "newPassword":
        if (!value.trim()) {
          error = "Please enter your new password!";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        setErrors((prev) => ({ ...prev, newPassword: error }));
        break;

      case "reEnter":
        if (!value.trim()) {
          error = "Please re-enter the new password!";
        }
        setErrors((prev) => ({ ...prev, reEnter: error }));
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
    const currentPswError = validateField(
      "currentPassword",
      formData.currentPassword
    );
    const newPswError = validateField("newPassword", formData.newPassword);
    const reEnterError = validateField("reEnter", formData.reEnter);

    if (currentPswError !== "" || newPswError !== "" || reEnterError !== "") {
      return;
    }

    if (formData.newPassword !== formData.reEnter) {
      setTypeAlert("error");
      setContentAlert("The re-entered new password is incorrect!");
      setOpenAlert(true);
      return;
    }

    try {
      await api.put(`/auth/change-password/${user.id}`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setTypeAlert("success");
      setContentAlert("Password changed successfully! Please log in again.");
      setOpenAlert(true);
      setIsButtonDisabled(true);
      // Log out, quay ve trang dang nhap
      setTimeout(async () => {
        try {
          await api.post(`/auth/logout`, user.id, { withCredentials: true });
          logout();
          navigate("/login");
        } catch (error) {
          console.error(error);
        }
      }, 3000);
    } catch (err) {
      setTypeAlert("error");
      setContentAlert(err.response.data.error);
      setOpenAlert(true);
      return;
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "40%",
          margin: "auto",
        }}
      >
        <Box>
          <TitleField>Current Password *</TitleField>
          <TextFieldItem
            name="currentPassword"
            type={showPassword.currentPassword ? "text" : "password"}
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleShowPassword("currentPassword")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.currentPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.currentPassword}
          />
        </Box>

        <Box>
          <TitleField>New Password *</TitleField>
          <TextFieldItem
            name="newPassword"
            type={showPassword.newPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleShowPassword("newPassword")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.newPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.newPassword}
          />
        </Box>

        <Box>
          <TitleField>Re-enter New Password *</TitleField>
          <TextFieldItem
            name="reEnter"
            type={showPassword.reEnter ? "text" : "password"}
            value={formData.reEnter}
            onChange={handleChange}
            placeholder="Re-enter your new password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleShowPassword("reEnter")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword.reEnter ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.reEnter}
          />
        </Box>

        <Button
          sx={{
            textTransform: "none",
            backgroundColor: "#6e38d5",
            fontSize: 19,
            fontWeight: 400,
            fontFamily: "'Outfit Variable', sans-serif",
            color: "white",
            width: "15vw",
            borderRadius: 6,
            alignSelf: "center",
            marginTop: 2,
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#4919a4",
            },
          }}
          onClick={handleSubmit}
          disabled={isButtonDisabled}
        >
          Reset Password
        </Button>
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

export default ChangePassword;
