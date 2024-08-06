import { Box, Tab, Tabs } from "@mui/material";
import { useScrollToTop } from "../utils/handleScroll";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import EditProfile from "../components/EditProfile";
import ChangePassword from "../components/ChangePassword";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TabStyled = styled(Tab)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  textTransform: 'none',
  fontSize: 17,
  fontWeight: 500,
}));

const SettingsPage = () => {
  useScrollToTop();

  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        height: "89.5vh",
        backgroundColor: "#f5f7fa",
        boxSizing: "border-box",
        px: 5,
        py: 5,
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 8,
          border: "1px solid #dedede",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", pt: 2, mx: 4 }}>
          <Tabs
            value={value}
            onChange={handleChangeTab}
            aria-label="My Tabs"
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              "& .Mui-selected": {
                color: "#6e34d5 !important",
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#6e34d5',
                borderRadius: '8px 8px 0 0',
                height: 3,
              },
            }}
          >
            <TabStyled label="Edit Profile" />
            <TabStyled label="Change Password" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <EditProfile />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ChangePassword />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default SettingsPage;
