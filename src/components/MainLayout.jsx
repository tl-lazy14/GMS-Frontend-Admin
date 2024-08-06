import { Alert, Box, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppBarContainer from "./AppBarContainer";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./userContext";

const pageNames = {
  "/dashboard": "Dashboard",
  "/customers/members": "Members",
  "/customers/non-member-customers": "Non-member Customers",
  "/customers/registrations": "Registrations",
  "/gyms": "Gyms",
  "/coaches": "Coaches",
  "/services/membership": "Membership Service",
  "/services/personal-trainers": "Personal Trainer Service",
  "/services/service-information": "Service Information",
  "/classes": "Classes",
  "/gym-managers": "Gym Managers",
  "/brand-info": "Brand Information",
  "/articles": "Articles",
  "/exercise-library": "Exercise Library",
  "/training-results": "Training Results",
  "/equipment/info": "Equipment Info",
  "/equipment/faulty-management": "Faulty Equipment Management",
  "/website-content": "Website Content",
  "/settings": "Settings",
};

const LayoutContainer = styled(Box)({
  display: "flex",
  height: "100vh",
});

const SidebarContainer = styled(Box)({
  flexShrink: 0,
  height: "100vh",
  overflowY: "auto",
  width: "17.5vw",
});

const ContentContainer = styled(Box)({
  flex: 1,
  height: "100vh",
  overflowY: "auto",
});

const MainLayout = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
  };

  useEffect(() => {
    const hasJustLoggedIn = localStorage.getItem('hasJustLoggedIn');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!user || !isLoggedIn) {
        navigate('/login');
    } else if (hasJustLoggedIn) {
        setOpenAlert(true);
        localStorage.removeItem("hasJustLoggedIn");
    }
}, [navigate, user]);

  const getPageNameFromPath = (path) => {
    const entries = Object.entries(pageNames);
    for (const [key, value] of entries) {
      if (path.startsWith(key)) {
        return value;
      }
    }
    return "Dashboard"; // Mặc định trả về "Dashboard" nếu không tìm thấy
  };

  const [pageName, setPageName] = useState(
    getPageNameFromPath(location.pathname)
  );

  return (
    <Box>
      <LayoutContainer>
        <SidebarContainer>
          <Sidebar setPageName={setPageName} />
        </SidebarContainer>
        <ContentContainer>
          <AppBarContainer pageName={pageName} />
          <Outlet />
        </ContentContainer>
      </LayoutContainer>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 18,
            textAlign: 'center',
            display: "flex",
            alignItems: "center",
            fontWeight: 400,
          }}
        >
          Login Successful!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainLayout;
