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
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "./userContext";
import { useNavigate } from "react-router-dom";

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

const LoginContainer = ({ setContainer, setOpenAlert, setTypeAlert, setContentAlert }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(UserContext);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
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
          error = "Password is required.";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long.";
        }
        setErrors((prev) => ({ ...prev, password: error }));
        break;

      default:
        break;
    }
    return error;
  };

  const handleSubmit = async () => {
    const emailError = validateField("email", formData.email);
    const passwordError = validateField("password", formData.password);

    if (passwordError === "" && emailError === "") {
      try {
        const response = await axios.post(`https://eagle-fits.onrender.com/gms/api/v1/auth/login`, { 
            email: formData.email,
            password: formData.password, 
        });
        const user = response.data;
        localStorage.setItem('hasJustLoggedIn', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        login(user.user);
        document.cookie = `accessToken=${user.accessToken}`;
        document.cookie = `refreshToken=${user.refreshToken}`;
        console.log(user.accessToken);
        navigate('/dashboard');
    } catch (err) {
        setOpenAlert(true);
        setTypeAlert("error");
        setContentAlert("Email or password is incorrect!");
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
        Login
      </Typography>

      <Box
        sx={{ my: 3, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box>
          <TitleField>Email *</TitleField>
          <TextFieldItem
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            helperText={errors.email}
            autoComplete="off"
          />
        </Box>

        <Box>
          <TitleField>Password *</TitleField>
          <TextFieldItem
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
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

        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 17,
            color: "#6e34d5",
            width: "fit-content",
            cursor: "pointer",
            alignSelf: "end",
            "&: hover": {
              textDecoration: "underline",
            },
          }}
          onClick={() => setContainer('forgot-password')}
        >
          Forgot password?
        </Typography>

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
          Sign in
        </Button>
      </Box>
    </Box>
  );
};

export default LoginContainer;
