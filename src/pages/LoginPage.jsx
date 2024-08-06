import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import BG from "../assets/background-login.jpg";
import Logo from "../assets/logo1.png";
import { useState, useEffect } from "react";
import LoginContainer from "../components/LoginContainer";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate } from "react-router-dom";

const NameProduct = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 68,
  color: "white",
  textTransform: "uppercase",
  fontWeight: 700,
}));

const LoginPage = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const [container, setContainer] = useState("login");
  const [openAlert, setOpenAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("");
  const [contentAlert, setContentAlert] = useState("");
  const [emailForReset, setEmailForReset] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            position: "relative",
            boxSizing: "border-box",
            width: "73vw",
            height: "100vh",
            backgroundImage: `url(${BG})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
            }}
          >
            <NameProduct>Eaglefit</NameProduct>
            <NameProduct>Gym Management System</NameProduct>
          </Box>
        </Box>

        <Box
          sx={{
            p: 4,
            boxSizing: "border-box",
            width: "27vw",
            position: "relative",
          }}
        >
          <img src={Logo} width={150} alt="logo" />

          {container === "login" && (
            <LoginContainer
              setContainer={setContainer}
              setOpenAlert={setOpenAlert}
              setTypeAlert={setTypeAlert}
              setContentAlert={setContentAlert}
            />
          )}
          {container === "forgot-password" && (
            <ForgotPassword
              setContainer={setContainer}
              setOpenAlert={setOpenAlert}
              setTypeAlert={setTypeAlert}
              setContentAlert={setContentAlert}
              setEmailForReset={setEmailForReset}
            />
          )}
          {container === "reset-password" && (
            <ResetPassword
              setContainer={setContainer}
              setOpenAlert={setOpenAlert}
              setTypeAlert={setTypeAlert}
              setContentAlert={setContentAlert}
              email={emailForReset}
            />
          )}

          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 17,
              color: "#221551",
              textAlign: "center",
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            © Eaglefit 2024
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={typeAlert === "success" ? "success" : "error"}
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

export default LoginPage;
