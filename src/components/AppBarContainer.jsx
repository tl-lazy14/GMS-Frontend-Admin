import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import { UserContext } from "./userContext";

const PageName = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#343c6a",
  fontSize: 30,
  fontWeight: 600,
}));

const AppBarContainer = ({ pageName }) => {
  const { user } = useContext(UserContext);

  return (
    <AppBar
      sx={{
        backgroundColor: "white",
        boxSizing: "border-box",
        boxShadow: "none",
        width: "100%",
        py: 0.85,
        px: 2,
        height: "10.5vh",
        borderBottom: "2px solid #e6eff5",
      }}
      position="sticky"
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <PageName
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {pageName}
        </PageName>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/*
          <NotificationsIcon
            sx={{ color: "#6e34d5", fontSize: 30, mr: 2, cursor: "pointer" }}
          />
          */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                color: "#343c6a",
                fontSize: 17,
                fontWeight: 500,
                textAlign: "right",
              }}
            >
              {user?.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                color: "#565656",
                fontSize: 15,
                textAlign: "right",
              }}
            >
              {user?.role === 'SENIOR_ADMIN' ? 'High-level Admin' : `Gym Manager (${user?.gym?.name})`}
            </Typography>
          </Box>
          <Avatar
            alt="avatar"
            src={user?.avatar}
            sx={{ width: 53, height: 53 }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarContainer;
