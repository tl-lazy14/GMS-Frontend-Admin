import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useScrollToTop } from "../utils/handleScroll";
import { styled } from "@mui/material/styles";
import { useContext, useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  BarChart,
  LineChart,
  PieChart,
  pieArcLabelClasses,
} from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { tableCellClasses } from "@mui/material/TableCell";
import dayjs from "dayjs";
import { formatCurrency } from "../utils/formatString";
import { UserContext } from "../components/userContext";
import axios from "axios";
import api from "../components/axiosInterceptor";

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    paddingLeft: 20,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 8,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #8287A6",
    borderRadius: 8,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #8287A6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const SelectYearItem = styled(Select)(() => ({
  width: "10vw",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 20,
    backgroundColor: "#6e34d5",
    color: "white",
    borderRadius: 8,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
    borderRadius: 8,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 18,
}));

const TitleSection = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
  fontWeight: 500,
}));

const TextStatCardStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  lineHeight: 1.3,
  color: "white",
}));

const ValueStatCardStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 23,
  fontWeight: 600,
  color: "white",
}));

const StatCard = styled(Box)(() => ({
  display: "flex",
  boxSizing: "border-box",
  gap: 10,
  borderRadius: 8,
  justifyContent: "space-between",
  alignItems: "center",
  flexGrow: 1,
}));

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 10,
  justifyContent: "center",
}));

const TitleFieldRow = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 18,
  fontWeight: 500,
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
  },
}));

const ValueStatStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 35,
  fontWeight: 700,
  color: "#6e34d5",
}));

const DashboardPage = () => {
  useScrollToTop();
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    new Array(currentYear - 2020 + 1),
    (val, index) => 2020 + index
  );
  const customize = {
    legend: { hidden: true },
  };
  const { user } = useContext(UserContext);

  const [listGyms, setListGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(
    user?.role === "GYM_MANAGER" ? user?.gym?.id : "all"
  );
  const [dashboardData, setDashboardData] = useState({});
  const [monthlyMemGrowth, setMonthlyMemGrowth] = useState([]);
  const [selectedYearMonthlyMemGrowth, setSelectedYearMonthlyMemGrowth] =
    useState(currentYear);
  const [newMemToday, setNewMemToday] = useState([]);
  const [pageNewMemToday, setPageNewMemToday] = useState(0);
  const [totalNewMemToday, setTotalNewMemToday] = useState(0);
  const [newMembersByMonth, setNewMembersByMonth] = useState([]);
  const [selectedYearNewMembersByMonth, setSelectedYearNewMembersByMonth] =
    useState(currentYear);
  const [nonMemCustomersByMonth, setNonMemCustomersByMonth] = useState([]);
  const [
    selectedYearNonMemCustomersByMonth,
    setSelectedYearNonMemCustomersByMonth,
  ] = useState(currentYear);
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [selectedYearRevenueByMonth, setSelectedYearRevenueByMonth] =
    useState(currentYear);
  const [repairCostsByMonth, setRepairCostsByMonth] = useState([]);
  const [selectedYearRepairCostsByMonth, setSelectedYearRepairCostsByMonth] =
    useState(currentYear);
  const [coachesRanking, setCoachesRanking] = useState([]);
  const [pageCoachesRanking, setPageCoachesRanking] = useState(0);
  const [totalCoaches, setTotalCoaches] = useState(0);

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "https://eagle-fits.onrender.com/gms/api/v1/gym/get-list-active-gym"
      );
      setListGyms(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
  }, []);

  const getGeneralData = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/general-dashboard-data/${selectedGym}`
      );
      setDashboardData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGeneralData();
  }, [selectedGym]);

  const getMonthlyMemGrowth = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/member-growth-rate/${selectedGym}/${selectedYearMonthlyMemGrowth}`
      );
      setMonthlyMemGrowth(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMonthlyMemGrowth();
  }, [selectedGym, selectedYearMonthlyMemGrowth]);

  const getListNewMembersToday = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/get-new-member-today/${selectedGym}/${pageNewMemToday}`
      );
      setNewMemToday(response.data.listItem);
      setTotalNewMemToday(response.data.numItem);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListNewMembersToday();
  }, [selectedGym, pageNewMemToday]);

  const getDataNewMemberByMonth = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/new-member-by-month/${selectedGym}/${selectedYearNewMembersByMonth}`
      );
      setNewMembersByMonth(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataNewMemberByMonth();
  }, [selectedGym, selectedYearNewMembersByMonth]);

  const getDataNonMemCustomerByMonth = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/non-mem-customer-by-month/${selectedGym}/${selectedYearNonMemCustomersByMonth}`
      );
      setNonMemCustomersByMonth(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataNonMemCustomerByMonth();
  }, [selectedGym, selectedYearNonMemCustomersByMonth]);

  const getDataRevenueByMonth = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/revenue-by-month/${selectedGym}/${selectedYearRevenueByMonth}`
      );
      setRevenueByMonth(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataRevenueByMonth();
  }, [selectedGym, selectedYearRevenueByMonth]);

  const getDataEquipmentRepairCostByMonth = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/equipment-repair-cost-by-month/${selectedGym}/${selectedYearRepairCostsByMonth}`
      );
      setRepairCostsByMonth(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDataEquipmentRepairCostByMonth();
  }, [selectedGym, selectedYearRepairCostsByMonth]);

  const getListCoachesRanking = async () => {
    try {
      const response = await api.get(
        `/gym/dashboard/get-coaches-ranking/${selectedGym}/${pageCoachesRanking}`
      );
      setCoachesRanking(response.data.listItem);
      setTotalCoaches(response.data.numItem);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListCoachesRanking();
  }, [selectedGym, pageCoachesRanking]);

  const handlePageNewMemTodayChange = (event, newPage) => {
    setPageNewMemToday(newPage);
  };

  const handlePageCoachesRankingChange = (event, newPage) => {
    setPageCoachesRanking(newPage);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "89.5vh",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Dashboard Page
        </Typography>

        {user?.role === "SENIOR_ADMIN" && (
          <Box>
            <SelectItem
              value={selectedGym}
              onChange={(e) => {
                setSelectedGym(e.target.value);
                setPageNewMemToday(0);
                setPageCoachesRanking(0);
              }}
            >
              <MenuItemStyled value="all">All Gyms (Total)</MenuItemStyled>
              {listGyms.map((item) => (
                <MenuItemStyled key={item.id} value={item.id}>
                  {item.name}
                </MenuItemStyled>
              ))}
            </SelectItem>
          </Box>
        )}
      </Box>

      <Box sx={{ my: 4 }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
            <StatCard sx={{ backgroundColor: "#2196f3", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextStatCardStyled>Total Members</TextStatCardStyled>
                <ValueStatCardStyled>
                  {dashboardData.numMembers}
                </ValueStatCardStyled>
              </Box>
              <GroupsIcon
                sx={{
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 50,
                  p: 1,
                  fontSize: 30,
                }}
              />
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
            <StatCard sx={{ backgroundColor: "#4caf50", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextStatCardStyled>Total Visitors</TextStatCardStyled>
                <ValueStatCardStyled>
                  {dashboardData.numNonMemCustomers}
                </ValueStatCardStyled>
              </Box>
              <PersonIcon
                sx={{
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 50,
                  p: 1,
                  fontSize: 30,
                }}
              />
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
            <StatCard sx={{ backgroundColor: "#ffb300", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextStatCardStyled>Total Equipment</TextStatCardStyled>
                <ValueStatCardStyled>
                  {dashboardData.numEquipment}
                </ValueStatCardStyled>
              </Box>
              <FitnessCenterIcon
                sx={{
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 50,
                  p: 1,
                  fontSize: 30,
                }}
              />
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
            <StatCard sx={{ backgroundColor: "#ff5722", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextStatCardStyled>Total Revenue</TextStatCardStyled>
                <ValueStatCardStyled>
                  {formatCurrency(dashboardData.revenue || "")} $
                </ValueStatCardStyled>
              </Box>
              <AttachMoneyIcon
                sx={{
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 50,
                  p: 1,
                  fontSize: 30,
                }}
              />
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ display: "flex" }}>
            <StatCard sx={{ backgroundColor: "#9c27b0", p: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <TextStatCardStyled>Total Profit</TextStatCardStyled>
                <ValueStatCardStyled>
                  {formatCurrency(dashboardData.profit || "")} $
                </ValueStatCardStyled>
              </Box>
              <TrendingUpIcon
                sx={{
                  color: "white",
                  border: "2px solid white",
                  borderRadius: 50,
                  p: 1,
                  fontSize: 30,
                }}
              />
            </StatCard>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", mt: 3, gap: 1.5 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
            }}
          >
            <TitleSection>Number of Members by Membership Package</TitleSection>
            <Box sx={{ my: 3 }}>
              <PieChart
                series={[
                  {
                    data: dashboardData.numMembersByMemPackage || [],
                    valueFormatter: (item) => `${item.value} members`,
                    arcLabel: (item) =>
                      `${Math.round(
                        (item.value / dashboardData.numMembers) * 100
                      )}%`,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                  },
                }}
                width={435}
                height={220}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 17,
                    },
                    markGap: 10,
                  },
                }}
              />
            </Box>
            <FieldContainer>
              <TitleFieldRow>Total:</TitleFieldRow>
              <TextStyled>{dashboardData.numMembers} members</TextStyled>
            </FieldContainer>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TitleSection>Monthly Membership Growth Rate</TitleSection>
              <SelectYearItem
                value={selectedYearMonthlyMemGrowth}
                onChange={(e) => {
                  setSelectedYearMonthlyMemGrowth(e.target.value);
                }}
              >
                {years.map((year) => (
                  <MenuItemStyled key={year} value={year}>
                    Year {year}
                  </MenuItemStyled>
                ))}
              </SelectYearItem>
            </Box>

            <Box>
              <LineChart
                dataset={monthlyMemGrowth}
                xAxis={[
                  {
                    label: "Month",
                    scaleType: "point",
                    dataKey: "month",
                    valueFormatter: (value) => value.toString(),
                  },
                ]}
                yAxis={[
                  {
                    label: "Growth Rate (%)",
                  },
                ]}
                series={[
                  {
                    dataKey: "growthRate",
                    label: "Monthly membership growth rate",
                    area: true,
                    valueFormatter: (value) => `${value.toString()}%`,
                  },
                ]}
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
                      fontFamily: "'Outfit Variable', sans-serif",
                    },
                  },
                }}
                width={670}
                margin={{ top: 25, left: 50, right: 15 }}
                height={310}
                grid={{ vertical: true, horizontal: true }}
                {...customize}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            backgroundColor: "white",
            borderRadius: 4,
            p: 2,
            border: "1px solid #ccc",
          }}
        >
          <TitleSection>New Members Today</TitleSection>
          <Box sx={{ m: 2, border: "1px solid #ccc" }}>
            <TableContainer
              sx={{ borderRadius: 0, overflowX: "auto" }}
              component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                      No.
                    </StyledTableCell>
                    <StyledTableCell>Member Code</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone Number</StyledTableCell>
                    <StyledTableCell>Membership</StyledTableCell>
                    <StyledTableCell>Start Date</StyledTableCell>
                    <StyledTableCell>Expired Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newMemToday.length > 0 ? (
                    newMemToday.map((item, index) => (
                      <StyledTableRow
                        key={item.id}
                        sx={{
                          height: "100%",
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                      >
                        <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                          {pageNewMemToday * 5 + index + 1}
                        </StyledTableCell>
                        <StyledTableCell>{item.memberCode}</StyledTableCell>
                        <StyledTableCell>{item.name}</StyledTableCell>
                        <StyledTableCell>{item.email}</StyledTableCell>
                        <StyledTableCell>{item.phone}</StyledTableCell>
                        <StyledTableCell>
                          {item.membership.name}
                        </StyledTableCell>
                        <StyledTableCell>
                          {dayjs(item.startDate).format("DD/MM/YYYY")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {dayjs(item.expiredDate).format("DD/MM/YYYY")}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography
                          sx={{
                            fontFamily: "'Outfit Variable', sans-serif",
                            fontSize: 19,
                          }}
                          padding={4}
                        >
                          No new member today
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {newMemToday.length > 0 && (
              <TablePagination
                sx={{
                  boxShadow:
                    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                  "& .MuiTablePagination-toolbar": {
                    backgroundColor: "white",
                  },
                  "& .MuiTablePagination-selectLabel": {
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 17,
                  },
                  "& .MuiTablePagination-select": {
                    // CSS cho select element của TablePagination
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 16,
                    color: "#6e34d5",
                  },
                  "& .MuiTablePagination-displayedRows": {
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 16,
                    color: "#6e34d5",
                  },
                  "& .MuiTablePagination-actions": {
                    color: "#6e34d5",
                  },
                }}
                rowsPerPageOptions={[5]}
                component="div"
                count={totalNewMemToday}
                rowsPerPage={5}
                page={pageNewMemToday}
                onPageChange={handlePageNewMemTodayChange}
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", mt: 3, gap: 2 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TitleSection>Number of New Members by Month</TitleSection>
              <SelectYearItem
                value={selectedYearNewMembersByMonth}
                onChange={(e) => {
                  setSelectedYearNewMembersByMonth(e.target.value);
                }}
              >
                {years.map((year) => (
                  <MenuItemStyled key={year} value={year}>
                    Year {year}
                  </MenuItemStyled>
                ))}
              </SelectYearItem>
            </Box>

            <Box>
              <BarChart
                dataset={newMembersByMonth}
                xAxis={[
                  { label: "Month", scaleType: "band", dataKey: "month" },
                ]}
                yAxis={[
                  {
                    label: "Number of new members",
                  },
                ]}
                series={[
                  {
                    dataKey: "value",
                    label: "Number of new members",
                    color: "#2196f3",
                    valueFormatter: (value) => `${value.toString()} members`,
                  },
                ]}
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
                      fontFamily: "'Outfit Variable', sans-serif",
                    },
                  },
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translate(-15px, 0)",
                  },
                }}
                width={500}
                margin={{ top: 30, left: 70, right: 10 }}
                height={310}
                grid={{ horizontal: true }}
                {...customize}
              />
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TitleSection>
                Number of Non-member Customers by Month
              </TitleSection>
              <SelectYearItem
                value={selectedYearNonMemCustomersByMonth}
                onChange={(e) => {
                  setSelectedYearNonMemCustomersByMonth(e.target.value);
                }}
              >
                {years.map((year) => (
                  <MenuItemStyled key={year} value={year}>
                    Year {year}
                  </MenuItemStyled>
                ))}
              </SelectYearItem>
            </Box>

            <Box>
              <BarChart
                dataset={nonMemCustomersByMonth}
                xAxis={[
                  { label: "Month", scaleType: "band", dataKey: "month" },
                ]}
                yAxis={[
                  {
                    label: "Number of non-member customers",
                  },
                ]}
                series={[
                  {
                    dataKey: "value",
                    label: "Number of non-member customers",
                    color: "#4caf50",
                    valueFormatter: (value) => `${value.toString()} customers`,
                  },
                ]}
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
                      fontFamily: "'Outfit Variable', sans-serif",
                    },
                  },
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translate(-20px, 0)",
                  },
                }}
                width={540}
                margin={{ top: 30, left: 80, right: 10 }}
                height={310}
                grid={{ horizontal: true }}
                {...customize}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", mt: 3 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TitleSection>Revenue by Month</TitleSection>
              <SelectYearItem
                value={selectedYearRevenueByMonth}
                onChange={(e) => {
                  setSelectedYearRevenueByMonth(e.target.value);
                }}
              >
                {years.map((year) => (
                  <MenuItemStyled key={year} value={year}>
                    Year {year}
                  </MenuItemStyled>
                ))}
              </SelectYearItem>
            </Box>

            <Box>
              <BarChart
                dataset={revenueByMonth}
                xAxis={[
                  {
                    label: "Month",
                    scaleType: "band",
                    dataKey: "month",
                    categoryGapRatio: 0.3,
                  },
                ]}
                yAxis={[
                  {
                    label: "Revenue ($)",
                  },
                ]}
                series={[
                  {
                    dataKey: "membershipRevenue",
                    label: "Membership service revenue",
                    valueFormatter: (value) => `${formatCurrency(value)} $`,
                  },
                  {
                    dataKey: "ptRevenue",
                    label: "PT service revenue",
                    valueFormatter: (value) => `${formatCurrency(value)} $`,
                  },
                  {
                    dataKey: "nonMemCustomerRevenue",
                    label: "Non-member customer revenue",
                    valueFormatter: (value) => `${formatCurrency(value)} $`,
                  },
                  {
                    dataKey: "totalRevenue",
                    label: "Total revenue of month",
                    valueFormatter: (value) => `${formatCurrency(value)} $`,
                  },
                ]}
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
                      fontFamily: "'Outfit Variable', sans-serif",
                    },
                  },
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translate(-35px, 0)",
                  },
                }}
                width={1100}
                margin={{ top: 30, left: 95, right: 10 }}
                height={350}
                grid={{ horizontal: true }}
                {...customize}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", mt: 3, gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 4,
                p: 2,
                border: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <TitleSection sx={{ textAlign: "center" }}>
                Total Equipment Purchase Cost
              </TitleSection>
              <ValueStatStyled>
                {formatCurrency(dashboardData.totalEquipmentPurchaseCost)} $
              </ValueStatStyled>
            </Box>
            <Box
              sx={{
                backgroundColor: "white",
                borderRadius: 4,
                p: 2,
                border: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <TitleSection sx={{ textAlign: "center" }}>
                Total Equipment Maintenance/Repair Cost
              </TitleSection>
              <ValueStatStyled>
                {formatCurrency(dashboardData.totalEquipmentRepairCost)} $
              </ValueStatStyled>
            </Box>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TitleSection>
                Equipment Maintenance/Repair Costs by Month
              </TitleSection>
              <SelectYearItem
                value={selectedYearRepairCostsByMonth}
                onChange={(e) => {
                  setSelectedYearRepairCostsByMonth(e.target.value);
                }}
              >
                {years.map((year) => (
                  <MenuItemStyled key={year} value={year}>
                    Year {year}
                  </MenuItemStyled>
                ))}
              </SelectYearItem>
            </Box>

            <Box>
              <LineChart
                dataset={repairCostsByMonth}
                xAxis={[
                  {
                    label: "Month",
                    scaleType: "point",
                    dataKey: "month",
                    valueFormatter: (value) => value.toString(),
                  },
                ]}
                yAxis={[
                  {
                    label: "Cost ($)",
                  },
                ]}
                series={[
                  {
                    dataKey: "cost",
                    curve: "linear",
                    connectNulls: true,
                    color: "#CE93D8",
                    area: true,
                    label: "Maintenance & Repair Cost",
                    valueFormatter: (value) => `${formatCurrency(value)} $`,
                  },
                ]}
                sx={{
                  [`.${axisClasses.root}`]: {
                    [`.${axisClasses.tickLabel}, .${axisClasses.label}`]: {
                      fontFamily: "'Outfit Variable', sans-serif",
                    },
                  },
                  [`.${axisClasses.left} .${axisClasses.label}`]: {
                    transform: "translate(-25px, 0)",
                  },
                }}
                width={820}
                margin={{ top: 25, left: 90, right: 20 }}
                height={310}
                grid={{ vertical: true, horizontal: true }}
                {...customize}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", mt: 3, gap: 1.5 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
            }}
          >
            <TitleSection>Number of Coaches by Level</TitleSection>
            <Box>
              <PieChart
                series={[
                  {
                    data: dashboardData.numCoachesByLevel || [],
                    valueFormatter: (item) => `${item.value} coaches`,
                    arcLabel: (item) =>
                      `${Math.round(
                        (item.value / dashboardData.numCoaches) * 100
                      )}%`,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                margin={{ left: 100, top: 60 }}
                sx={{
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontFamily: "'Outfit Variable', sans-serif",
                    fontSize: 18,
                    fontWeight: 500,
                  },
                }}
                width={400}
                height={290}
                slotProps={{
                  legend: {
                    labelStyle: {
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 17,
                    },
                    direction: "row",
                    position: { vertical: "top", horizontal: "middle" },
                    markGap: 10,
                    itemGap: 20,
                  },
                }}
              />
            </Box>
            <FieldContainer>
              <TitleFieldRow>Total:</TitleFieldRow>
              <TextStyled>{dashboardData.numCoaches} coaches</TextStyled>
            </FieldContainer>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 4,
              p: 2,
              border: "1px solid #ccc",
            }}
          >
            <TitleSection>Coaches Ranking</TitleSection>
            <Box sx={{ m: 2, border: "1px solid #ccc" }}>
              <TableContainer
                sx={{ borderRadius: 0, overflowX: "auto" }}
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                        Rank
                      </StyledTableCell>
                      <StyledTableCell>Code</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Level</StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Members
                      </StyledTableCell>
                      <StyledTableCell sx={{ textAlign: "center" }}>
                        Classes
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {coachesRanking.map((item, index) => (
                      <StyledTableRow
                        key={item.id}
                        sx={{
                          height: "100%",
                          borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        }}
                      >
                        <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                          {pageCoachesRanking * 3 +
                            index +
                            1}
                        </StyledTableCell>
                        <StyledTableCell>{item.code}</StyledTableCell>
                        <StyledTableCell>{item.name}</StyledTableCell>
                        <StyledTableCell>{item.level}</StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {item.numMembersTrained}
                        </StyledTableCell>
                        <StyledTableCell sx={{ textAlign: "center" }}>
                          {item.numClassesTaught}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {coachesRanking.length > 0 && (
                <TablePagination
                  sx={{
                    boxShadow:
                      "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)",
                    "& .MuiTablePagination-toolbar": {
                      backgroundColor: "white",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 17,
                    },
                    "& .MuiTablePagination-select": {
                      // CSS cho select element của TablePagination
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 16,
                      color: "#6e34d5",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 16,
                      color: "#6e34d5",
                    },
                    "& .MuiTablePagination-actions": {
                      color: "#6e34d5",
                    },
                  }}
                  rowsPerPageOptions={[3]}
                  component="div"
                  count={totalCoaches}
                  rowsPerPage={3}
                  page={pageCoachesRanking}
                  onPageChange={handlePageCoachesRankingChange}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
