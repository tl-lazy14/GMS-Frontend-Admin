import { Box, Button, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import EastIcon from "@mui/icons-material/East";
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
}));

const ProceedButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "#6e38d5",
  fontSize: 19,
  fontWeight: 400,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "white",
  width: "fit-content",
  margin: "auto",
  borderRadius: 30,
  marginTop: 10,
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#4919a4",
  },
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

const ForgotPassword = ({
  setContainer,
  setOpenAlert,
  setTypeAlert,
  setContentAlert,
  setEmailForReset,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    code: "",
  });
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
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

      case "code":
        if (!value.trim()) {
          error = "Verification code is required.";
        } else if (!/^\d{6}$/.test(value)) {
          error = "Verification code must be 6 digits.";
        }
        setErrors((prev) => ({ ...prev, code: error }));
        break;

      default:
        break;
    }
    return error;
  };

  const handleSendVerificationCode = async () => {
    const emailError = validateField("email", formData.email);

    if (emailError === "") {
      try {
        await axios.post(
          "https://eagle-fits.onrender.com/gms/api/v1/auth/forgot-password",
          { email: formData.email }
        );
        setEmailForReset(formData.email);
        setTypeAlert("success");
        setContentAlert(
          "We've sent the verification code to your email address. Please check your inbox."
        );
        setOpenAlert(true);
        setFormData({ ...formData, code: "" });
        setErrors({ ...errors, code: "" });
        setShowVerificationInput(true);
      } catch (err) {
        setTypeAlert("error");
        setContentAlert("Email does not exist in the system!");
        setOpenAlert(true);
      }
    }
  };

  const handleVerifyCode = async () => {
    const codeError = validateField("code", formData.code);

    if (codeError === "") {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.post("https://eagle-fits.onrender.com/gms/api/v1/auth/verify-code", {
          email: formData.email,
          code: formData.code,
        });
        setContainer("reset-password");
      } catch (err) {
        setTypeAlert("error");
        setContentAlert("The verification code is incorrect.");
        setOpenAlert(true);
        return;
      }
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
        Forgot Password
      </Typography>

      <Typography
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          color: "#666",
          fontSize: 17,
          my: 1,
        }}
      >
        Enter your email, and we will send a 6-digit verification code to that
        address. It will be valid for 1 minute. Check your email and enter the
        code to proceed.
      </Typography>

      <Box sx={{ my: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        {showVerificationInput === false && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TitleField>Email *</TitleField>
            <TextFieldItem
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              helperText={errors.email}
              autoComplete="off"
            />
            <ProceedButton sx={{ px: 5 }} onClick={handleSendVerificationCode}>
              Get Code
            </ProceedButton>
            <BackButton
              variant="text"
              sx={{}}
              startIcon={<WestIcon />}
              onClick={() => setContainer("login")}
            >
              Back to Login
            </BackButton>
          </Box>
        )}

        {showVerificationInput === true && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TitleField>Verification Code *</TitleField>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextFieldItem
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter verification code"
                helperText={errors.code}
                autoComplete="off"
              />
            </Box>
            <ProceedButton
              sx={{ px: 5 }}
              endIcon={<EastIcon />}
              onClick={handleVerifyCode}
            >
              Next
            </ProceedButton>
            <BackButton
              variant="text"
              startIcon={<WestIcon />}
              onClick={() => setShowVerificationInput(false)}
            >
              Back to Email
            </BackButton>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPassword;
