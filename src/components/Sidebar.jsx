import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assets/logo2.png";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import SportsIcon from "@mui/icons-material/Sports";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ClassIcon from "@mui/icons-material/Class";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ArticleIcon from "@mui/icons-material/Article";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import TransformIcon from "@mui/icons-material/Transform";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WebIcon from "@mui/icons-material/Web";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmDialog from "./Dialog/ConfirmDialog";
import api from "./axiosInterceptor";
import { UserContext } from "./userContext";

const MenuItemBtn = styled(ListItemButton)({
  padding: "12px 25px 12px 35px",
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#221551",
  },
});

const Sidebar = ({ setPageName }) => {
  const [openState, setOpenState] = useState({
    customers: false,
    services: false,
    equipment: false,
  });
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (key) => {
    setOpenState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleMenuItemClick = (path, name) => {
    navigate(path);
    setPageName(name);
  };

  const getActiveMenuItemStyle = (path) => {
    return location.pathname.startsWith(path)
      ? { bgcolor: "#6e34d5 !important" }
      : {};
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const { user, logout } = useContext(UserContext);

  const handleConfirmLogout = async () => {
    await api.post("/auth/logout", user.id, { withCredentials: true });
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <Drawer
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#273142",
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pt: 2,
            pb: 1,
          }}
        >
          <img src={Logo} width={150} alt="logo" />
        </Box>

        <List
          sx={{
            width: "17.5vw",
            bgcolor: "#273142",
            color: "white",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: 0,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "transparent",
            },
          }}
          component="nav"
        >
          <MenuItemBtn
            onClick={() => handleMenuItemClick("/dashboard", "Dashboard")}
            sx={getActiveMenuItemStyle("/dashboard")}
          >
            <ListItemIcon>
              <DashboardIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>

          <MenuItemBtn onClick={() => handleClick("customers")}>
            <ListItemIcon>
              <GroupsIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Customers"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
            {openState.customers ? <ExpandLess /> : <ExpandMore />}
          </MenuItemBtn>
          <Collapse in={openState.customers} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <MenuItemBtn
                onClick={() =>
                  handleMenuItemClick("/customers/members", "Members")
                }
                sx={getActiveMenuItemStyle("/customers/members")}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Members"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
              </MenuItemBtn>
              <MenuItemBtn
                onClick={() =>
                  handleMenuItemClick(
                    "/customers/non-member-customers",
                    "Non-member Customers"
                  )
                }
                sx={getActiveMenuItemStyle("/customers/non-member-customers")}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Non-member Customers"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
              </MenuItemBtn>
              <MenuItemBtn
                onClick={() =>
                  handleMenuItemClick(
                    "/customers/registrations",
                    "Registrations"
                  )
                }
                sx={getActiveMenuItemStyle("/customers/registrations")}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Registrations"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
              </MenuItemBtn>
            </List>
          </Collapse>

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() => handleMenuItemClick("/gyms", "Gyms")}
              sx={getActiveMenuItemStyle("/gyms")}
            >
              <ListItemIcon>
                <PlaceIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Gyms"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          <MenuItemBtn
            onClick={() => handleMenuItemClick("/coaches", "Coaches")}
            sx={getActiveMenuItemStyle("/coaches")}
          >
            <ListItemIcon>
              <SportsIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Coaches"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>

          {user?.role === "SENIOR_ADMIN" && (
            <>
              <MenuItemBtn onClick={() => handleClick("services")}>
                <ListItemIcon>
                  <LocalOfferIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Services"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
                {openState.services ? <ExpandLess /> : <ExpandMore />}
              </MenuItemBtn>
              <Collapse in={openState.services} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <MenuItemBtn
                    onClick={() =>
                      handleMenuItemClick(
                        "/services/membership",
                        "Membership Service"
                      )
                    }
                    sx={getActiveMenuItemStyle("/services/membership")}
                    style={{ paddingLeft: "32px" }}
                  >
                    <ListItemIcon>
                      <FormatListBulletedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Membership"
                      primaryTypographyProps={{
                        fontFamily: "'Outfit Variable', sans-serif",
                        fontSize: 17,
                      }}
                    />
                  </MenuItemBtn>
                  <MenuItemBtn
                    onClick={() =>
                      handleMenuItemClick(
                        "/services/personal-trainers",
                        "Personal Trainer Service"
                      )
                    }
                    sx={getActiveMenuItemStyle("/services/personal-trainer")}
                    style={{ paddingLeft: "32px" }}
                  >
                    <ListItemIcon>
                      <FormatListBulletedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Personal Trainer"
                      primaryTypographyProps={{
                        fontFamily: "'Outfit Variable', sans-serif",
                        fontSize: 17,
                      }}
                    />
                  </MenuItemBtn>
                  <MenuItemBtn
                    onClick={() =>
                      handleMenuItemClick(
                        "/services/service-information",
                        "Service Information"
                      )
                    }
                    sx={getActiveMenuItemStyle("/services/service-information")}
                    style={{ paddingLeft: "32px" }}
                  >
                    <ListItemIcon>
                      <FormatListBulletedIcon sx={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Service Information"
                      primaryTypographyProps={{
                        fontFamily: "'Outfit Variable', sans-serif",
                        fontSize: 17,
                      }}
                    />
                  </MenuItemBtn>
                </List>
              </Collapse>
            </>
          )}

          <MenuItemBtn
            onClick={() => handleMenuItemClick("/classes", "Classes")}
            sx={getActiveMenuItemStyle("/classes")}
          >
            <ListItemIcon>
              <ClassIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Classes"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() =>
                handleMenuItemClick("/gym-managers", "Gym Managers")
              }
              sx={getActiveMenuItemStyle("/gym-managers")}
            >
              <ListItemIcon>
                <SupervisorAccountIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Gym Managers"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() =>
                handleMenuItemClick("/brand-info", "Brand Information")
              }
              sx={getActiveMenuItemStyle("/brand-info")}
            >
              <ListItemIcon>
                <BrandingWatermarkIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Brand Information"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() => handleMenuItemClick("/articles", "Articles")}
              sx={getActiveMenuItemStyle("/articles")}
            >
              <ListItemIcon>
                <ArticleIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Articles"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() =>
                handleMenuItemClick("/exercise-library", "Exercise Library")
              }
              sx={getActiveMenuItemStyle("/exercise-library")}
            >
              <ListItemIcon>
                <VideoLibraryIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Exercise Library"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          <MenuItemBtn
            onClick={() =>
              handleMenuItemClick("/training-results", "Training Results")
            }
            sx={getActiveMenuItemStyle("/training-results")}
          >
            <ListItemIcon>
              <TransformIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Training Results"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>

          <MenuItemBtn onClick={() => handleClick("equipment")}>
            <ListItemIcon>
              <FitnessCenterIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Equipment"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
            {openState.equipment ? <ExpandLess /> : <ExpandMore />}
          </MenuItemBtn>
          <Collapse in={openState.equipment} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <MenuItemBtn
                onClick={() =>
                  handleMenuItemClick("/equipment/info", "Equipment Info")
                }
                sx={getActiveMenuItemStyle("/equipment/info")}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Equipment Info"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
              </MenuItemBtn>
              <MenuItemBtn
                onClick={() =>
                  handleMenuItemClick(
                    "/equipment/faulty-management",
                    "Faulty Equipment Management"
                  )
                }
                sx={getActiveMenuItemStyle("/equipment/faulty-management")}
                style={{ paddingLeft: "32px" }}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Faulty Equipment Management"
                  primaryTypographyProps={{
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  }}
                />
              </MenuItemBtn>
            </List>
          </Collapse>

          {user?.role === "SENIOR_ADMIN" && (
            <MenuItemBtn
              onClick={() =>
                handleMenuItemClick("/website-content", "Website Content")
              }
              sx={getActiveMenuItemStyle("/website-content")}
            >
              <ListItemIcon>
                <WebIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary="Website Content"
                primaryTypographyProps={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 17,
                }}
              />
            </MenuItemBtn>
          )}

          <Divider sx={{ borderTop: "1px solid #ccc" }} />

          <MenuItemBtn
            onClick={() => handleMenuItemClick("/settings", "Settings")}
            sx={getActiveMenuItemStyle("/settings")}
          >
            <ListItemIcon>
              <SettingsIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>

          <MenuItemBtn onClick={() => setOpenLogoutDialog(true)}>
            <ListItemIcon>
              <LogoutIcon sx={{ color: "white" }} />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 17,
              }}
            />
          </MenuItemBtn>
        </List>
      </Drawer>

      <ConfirmDialog
        title="Confirm Logout"
        content="Are you sure you want to log out? Any unsaved changes will be lost."
        openDialog={openLogoutDialog}
        handleCloseDialog={handleCloseLogoutDialog}
        handleConfirm={handleConfirmLogout}
      />
    </Box>
  );
};

export default Sidebar;
