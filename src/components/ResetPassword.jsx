import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import WestIcon from "@mui/icons-material/West";
import axios from "axios";

const TextFieldItem = styled(TextField)(() => ({
  width: "100%",
  "& .MuiInputBase-input::placeholder": {
    color: "black",
    opacity: 0.8,
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Outfit Variable', sans-serif",
    backgroundColor: "#f7f8ff",
    fontSize: 19,
    color: "black",
    "& fieldset": {
      border: "1px solid black",
    },
    "&:hover fieldset": {
      border: "1px solid black",
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
  fontSize: 19,
  fontWeight: 600,
  marginBottom: 5,
}));

const BackButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "transparent",
  fontSize: 17,
  fontWeight: 400,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "black",
  width: "fit-content",
  margin: "auto",
  marginTop: 10,
  transition: "0.3s",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const ResetPassword = ({
  setContainer,
  setOpenAlert,
  setTypeAlert,
  setContentAlert,
  email,
}) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    reEnter: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    reEnter: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    reEnter: false,
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

  const handleSubmit = async () => {
    const newPswError = validateField("newPassword", formData.newPassword);
    const reEnterError = validateField("reEnter", formData.reEnter);

    if (newPswError !== "" || reEnterError !== "") {
      return;
    }

    if (formData.newPassword !== formData.reEnter) {
      setTypeAlert("error");
      setContentAlert("The re-entered password is incorrect!");
      setOpenAlert(true);
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      await axios.put("https://eagle-fits.onrender.com/gms/api/v1/auth/reset-password", {
        email: email,
        newPassword: formData.newPassword,
      });
      setTypeAlert("success");
      setContentAlert(
        "Password reset successful. Please log in with the new password!"
      );
      setOpenAlert(true);
      setContainer("login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ my: 7, width: "100%" }}>
      <Typography
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          color: "black",
          textAlign: "center",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        Reset Password
      </Typography>

      <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 2 }}>
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
            marginTop: 2,
            transition: "0.3s",
            "&:hover": {
              backgroundColor: "#4919a4",
            },
          }}
          onClick={handleSubmit}
        >
          Reset Password
        </Button>

        <BackButton
          variant="text"
          sx={{}}
          startIcon={<WestIcon />}
          onClick={() => setContainer("login")}
        >
          Back to Login
        </BackButton>
      </Box>
    </Box>
  );
};

export default ResetPassword;
