import { Box, Tab, Tabs } from "@mui/material";
import { useScrollToTop } from "../utils/handleScroll";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import MemTransferRegistrations from "../components/MemTransferRegistrations";
import FreeTrialRegistrations from "../components/FreeTrialRegistrations";

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
  textTransform: "none",
  color: 'white',
  width: '20vw',
  backgroundColor: '#6e34d5',
  fontSize: 17,
  fontWeight: 500,
}));

const RegistrationsPage = () => {
  useScrollToTop();

  const [value, setValue] = useState(() => {
    const currentTab = sessionStorage.getItem('tabRegistrations');
    return currentTab ? parseInt(currentTab) : 0;
  });

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    sessionStorage.setItem('tabRegistrations', newValue);
  };

  return (
    <Box
      sx={{
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ backgroundColor: "white", outline: "1px solid #ddd", }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="My Tabs"
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            "& .Mui-selected": {
              color: "#88dbdf !important",
              backgroundColor: "#221551 !important"
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#88dbdf",
              height: 3,
            },
          }}
        >
          <TabStyled sx={{ py: 2.5, }} label="Membership (Bank Transfer)" />
          <TabStyled label="Free Trial" />
        </Tabs>
      </Box>
      <Box
        sx={{
          backgroundColor: "#f5f7fa",
          minHeight: "70.5vh",
          boxSizing: 'border-box',
        }}
      >
        <TabPanel value={value} index={0}>
          <MemTransferRegistrations />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <FreeTrialRegistrations />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default RegistrationsPage;
