import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WestIcon from "@mui/icons-material/West";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import EditMemInfo from "../components/Dialog/EditMemInfo";
import { tableCellClasses } from "@mui/material/TableCell";
import MoreTimeIcon from "@mui/icons-material/MoreTime";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ExtendServiceDialog from "../components/Dialog/ExtendServiceDialog";
import UpgradeServiceDialog from "../components/Dialog/UpgradeServiceDialog";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import RegisterPTDialog from "../components/Dialog/RegisterPTDialog";
import SelectPTDialog from "../components/Dialog/SelectPTDialog";
import SchedulePTMember from "../components/Dialog/SchedulePTMember";
import CreateResultDialog from "../components/Dialog/CreateResultDialog";
import ScheduleContainer from "../components/ScheduleContainer";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import api from "../components/axiosInterceptor";

const ToolButton = styled(Button)(() => ({
  textTransform: "none",
  backgroundColor: "#6e34d5",
  fontSize: 17,
  fontWeight: 400,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "white",
  borderRadius: 8,
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#4919a4",
  },
}));

const FieldContainer = styled(Box)(() => ({
  width: "20vw",
  display: "flex",
  flexGrow: 1,
  gap: 10,
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
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

const StatusButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  textAlign: "center",
  borderRadius: 8,
  width: "100%",
}));

const ScheduleTextContainer = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
  marginBottom: 10,
}));

const Content = ({ children, appointmentData, ...restProps }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
    <Box sx={{ px: 3 }}>
      {appointmentData.type === "PT" && (
        <ScheduleTextContainer>
          <Typography sx={{ fontWeight: "bold" }}>Trainer:</Typography>
          <Typography>
            {appointmentData.trainer.code} - {appointmentData.trainer?.name}
          </Typography>
        </ScheduleTextContainer>
      )}
      {appointmentData.type === "class" && (
        <Box>
          <ScheduleTextContainer>
            <Typography sx={{ fontWeight: "bold" }}>Class code:</Typography>
            <Typography>{appointmentData.aclass?.code}</Typography>
          </ScheduleTextContainer>
          <ScheduleTextContainer>
            <Typography sx={{ fontWeight: "bold" }}>Name:</Typography>
            <Typography>{appointmentData.aclass?.title}</Typography>
          </ScheduleTextContainer>
          <ScheduleTextContainer>
            <Typography sx={{ fontWeight: "bold" }}>Coach:</Typography>
            <Typography>
              {appointmentData.aclass?.coach?.code} -{" "}
              {appointmentData.aclass?.coach?.name}
            </Typography>
          </ScheduleTextContainer>
        </Box>
      )}
      {appointmentData.description && (
        <Typography>{appointmentData.description}</Typography>
      )}
    </Box>
  </AppointmentTooltip.Content>
);

const DetailMemberPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams(); // All API lay du lieu nguoi dung tu id member nay

  const [memInfo, setMemInfo] = useState({});
  const [membershipService, setMembershipService] = useState([]);
  const [trainerService, setTrainerService] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [selectedItem, setSelectedItem] = useState({});

  const getMemberInfo = async () => {
    try {
      const response = await api.get(`/customer/get-member-info/${id}`);
      setMemInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMembershipService = async () => {
    try {
      const response = await api.get(`/customer/get-membership-service-info/${id}`);
      setMembershipService(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getPTService = async () => {
    try {
      const response = await api.get(`/customer/get-pt-service-info/${id}`);
      setTrainerService(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getMemberSchedule = async () => {
    try {
      const response = await api.get(`/customer/get-member-schedule/${id}`);
      setSchedule(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMemberInfo();
    getMembershipService();
    getPTService();
    getMemberSchedule();
  }, []);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openExtendDialog, setOpenExtendDialog] = useState(false);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);
  const [openRegisterPTDialog, setOpenRegisterPTDialog] = useState(false);
  const [openSelectPTDialog, setOpenSelectPTDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openCreateResultDialog, setOpenCreateResultDialog] = useState(false);
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const handleCloseExtendDialog = () => {
    setOpenExtendDialog(false);
  };
  const handleCloseUpgradeDialog = () => {
    setOpenUpgradeDialog(false);
  };
  const handleCloseRegisterPTDialog = () => {
    setOpenRegisterPTDialog(false);
  };
  const handleCloseSelectPTDialog = () => {
    setOpenSelectPTDialog(false);
  };
  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
  };
  const handleCloseCreateResultDialog = () => {
    setOpenCreateResultDialog(false);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleEditInfo = () => {
    setContentAlert("Member information updated successfully!");
    setOpenEditDialog(true);
  };

  const handleExtendService = () => {
    setContentAlert("Member service extended successfully!");
    setOpenExtendDialog(true);
  };

  const handleUpgradeService = () => {
    setContentAlert("Member service upgraded successfully!");
    setOpenUpgradeDialog(true);
  };

  const handleRegisterPTService = () => {
    setContentAlert("Personal trainer service registered successfully!");
    setOpenRegisterPTDialog(true);
  };

  const handleClickSelectPTForMember = (item) => {
    setSelectedItem(item);
    setContentAlert("Personal trainer selected successfully!");
    setOpenSelectPTDialog(true);
  };

  const handleClickSchedule = (item) => {
    setSelectedItem(item);
    setOpenScheduleDialog(true);
  };

  const handleClickCreateResult = (item) => {
    setSelectedItem(item);
    setContentAlert("Workout results saved successfully!");
    setOpenCreateResultDialog(true);
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
          Member Details
        </Typography>
        <ToolButton
          sx={{ px: 3 }}
          startIcon={<WestIcon />}
          onClick={() => navigate("/customers/members")}
        >
          Back to List
        </ToolButton>
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "white",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Member Information
          </Typography>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<EditIcon />}
            onClick={handleEditInfo}
          >
            Edit
          </ToolButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            mx: 20,
            my: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 10 }}>
            <FieldContainer>
              <TitleField>Member code:</TitleField>
              <TextStyled>{memInfo.code}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleField>Name:</TitleField>
              <TextStyled>{memInfo.name}</TextStyled>
            </FieldContainer>
          </Box>
          <Box sx={{ display: "flex", gap: 10 }}>
            <FieldContainer>
              <TitleField>Email:</TitleField>
              <TextStyled>{memInfo.email}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleField>Phone number:</TitleField>
              <TextStyled>{memInfo.phone}</TextStyled>
            </FieldContainer>
          </Box>
          <Box sx={{ display: "flex", gap: 10 }}>
            <FieldContainer>
              <TitleField>Gender:</TitleField>
              <TextStyled>{memInfo.gender}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleField>Date of birth:</TitleField>
              <TextStyled>{dayjs(memInfo.dob).format("DD/MM/YYYY")}</TextStyled>
            </FieldContainer>
          </Box>
          <FieldContainer>
            <TitleField>Gym:</TitleField>
            <TextStyled>{memInfo.gym?.name}</TextStyled>
          </FieldContainer>
        </Box>
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "white",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Membership Service
          </Typography>
          {membershipService[0]?.status !== "Upcoming" &&
            membershipService[0]?.status !== "Expired" && (
              <Box display="flex" gap={2}>
                <ToolButton
                  sx={{ px: 3 }}
                  startIcon={<MoreTimeIcon />}
                  onClick={handleExtendService}
                >
                  Extend
                </ToolButton>
                {membershipService[0]?.isBestPackage === 0 && (
                  <ToolButton
                    sx={{ px: 3 }}
                    startIcon={<UpgradeIcon />}
                    onClick={handleUpgradeService}
                  >
                    Upgrade
                  </ToolButton>
                )}
              </Box>
            )}
        </Box>

        <TableContainer
          sx={{
            borderRadius: 4,
            overflowX: "auto",
            my: 3,
            border: "1px solid #ccc",
          }}
          component={Paper}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                  No.
                </StyledTableCell>
                <StyledTableCell>Membership Package</StyledTableCell>
                <StyledTableCell>Start Date</StyledTableCell>
                <StyledTableCell>Expired Date</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell sx={{ textAlign: "center" }}>
                  Status
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membershipService.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    height: "100%",
                    borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell>{item.membership?.name}</StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.startDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {dayjs(item.expiredDate).format("DD/MM/YYYY")}
                  </StyledTableCell>
                  <StyledTableCell>{item.amount} $</StyledTableCell>
                  <StyledTableCell>
                    <StatusButton
                      sx={{
                        ...(item.status === "Active" && {
                          color: "rgb(0, 182, 155) !important",
                          backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                          border: "1px solid rgb(0, 182, 155) !important",
                        }),
                        ...(item.status === "Expiring Soon" && {
                          color: "rgb(255, 167, 86) !important",
                          backgroundColor: "rgba(255, 167, 86, 0.2) !important",
                          border: "1px solid rgb(255, 167, 86) !important",
                        }),
                        ...(item.status === "Expired" && {
                          color: "rgb(239, 56, 38) !important",
                          backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                          border: "1px solid rgb(239, 56, 38) !important",
                        }),
                        ...(item.status === "Upcoming" && {
                          color: "rgb(186, 41, 255) !important",
                          backgroundColor: "rgba(186, 41, 255, 0.2) !important",
                          border: "1px solid rgb(186, 41, 255) !important",
                        }),
                      }}
                    >
                      {item.status}
                    </StatusButton>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "white",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Personal Trainer Service
          </Typography>
          {(trainerService.length === 0 ||
            trainerService[0]?.status === "Finished") && (
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<AddIcon />}
              onClick={handleRegisterPTService}
            >
              New Registration
            </ToolButton>
          )}
        </Box>

        {trainerService.length > 0 ? (
          <TableContainer
            sx={{
              borderRadius: 4,
              overflowX: "auto",
              my: 3,
              border: "1px solid #ccc",
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    No.
                  </StyledTableCell>
                  <StyledTableCell>PT Package</StyledTableCell>
                  <StyledTableCell>Sessions</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Start Date</StyledTableCell>
                  <StyledTableCell>End Date</StyledTableCell>
                  <StyledTableCell>Trainer</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    Status
                  </StyledTableCell>
                  <StyledTableCell sx={{ textAlign: "center" }}>
                    Results
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainerService.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      height: "100%",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{item.service?.name}</StyledTableCell>
                    <StyledTableCell>
                      {item.service.numSessions}
                    </StyledTableCell>
                    <StyledTableCell>{item.service.price} $</StyledTableCell>
                    <StyledTableCell>
                      {dayjs(item.startDate).format("DD/MM/YYYY")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {dayjs(item.expiredDate).format("DD/MM/YYYY")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.trainer === null ? (
                        <ToolButton
                          sx={{ px: 2 }}
                          onClick={() => handleClickSelectPTForMember(item)}
                          startIcon={<AddIcon />}
                        >
                          Add
                        </ToolButton>
                      ) : (
                        <>
                          {item.trainer?.code} - {item.trainer?.name}
                        </>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusButton
                        sx={{
                          ...(item.status === "Active" && {
                            color: "rgb(0, 182, 155) !important",
                            backgroundColor:
                              "rgba(0, 182, 155, 0.2) !important",
                            border: "1px solid rgb(0, 182, 155) !important",
                          }),
                          ...(item.status === "Finished" && {
                            color: "rgb(239, 56, 38) !important",
                            backgroundColor:
                              "rgba(239, 56, 38, 0.2) !important",
                            border: "1px solid rgb(239, 56, 38) !important",
                          }),
                          ...(item.status === "Upcoming" && {
                            color: "rgb(186, 41, 255) !important",
                            backgroundColor:
                              "rgba(186, 41, 255, 0.2) !important",
                            border: "1px solid rgb(186, 41, 255) !important",
                          }),
                        }}
                      >
                        {item.status}
                      </StatusButton>
                    </StyledTableCell>
                    <StyledTableCell>
                      {item.hasResult === 0 ? (
                        <ToolButton
                          sx={{ width: "100%", px: 2 }}
                          onClick={() => handleClickCreateResult(item)}
                        >
                          Create
                        </ToolButton>
                      ) : (
                        <ToolButton
                          onClick={() =>
                            navigate(`/training-results/detail/${item.resultId}`)
                          }
                          sx={{ width: "100%", px: 2 }}
                        >
                          View
                        </ToolButton>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="Training schedule">
                        <IconButton
                          onClick={() => handleClickSchedule(item)}
                          sx={{ color: "#6e34d5" }}
                        >
                          <EventIcon />
                        </IconButton>
                      </Tooltip>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TextStyled sx={{ textAlign: "center", my: 5 }}>
            Member has not used the personal trainer service
          </TextStyled>
        )}
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "#221551",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 25,
              color: "white",
              fontWeight: 600,
              mb: 3,
            }}
          >
            Schedule
          </Typography>
        </Box>
        <ScheduleContainer schedule={schedule} Content={Content} />
      </Box>

      <EditMemInfo
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        data={memInfo}
        setOpenAlert={setOpenAlert}
        getMemberInfo={getMemberInfo}
      />

      <ExtendServiceDialog
        openDialog={openExtendDialog}
        handleCloseDialog={handleCloseExtendDialog}
        data={membershipService}
        setOpenAlert={setOpenAlert}
        getMembershipService={getMembershipService}
      />

      <UpgradeServiceDialog
        openDialog={openUpgradeDialog}
        handleCloseDialog={handleCloseUpgradeDialog}
        data={membershipService}
        setOpenAlert={setOpenAlert}
        getMembershipService={getMembershipService}
      />

      <RegisterPTDialog
        openDialog={openRegisterPTDialog}
        handleCloseDialog={handleCloseRegisterPTDialog}
        setOpenAlert={setOpenAlert}
        getPTService={getPTService}
      />

      <SelectPTDialog
        openDialog={openSelectPTDialog}
        handleCloseDialog={handleCloseSelectPTDialog}
        memberPTServiceItem={selectedItem}
        gymId={memInfo?.gym?.id}
        setOpenAlert={setOpenAlert}
        getPTService={getPTService}
      />

      <SchedulePTMember
        openDialog={openScheduleDialog}
        handleCloseDialog={handleCloseScheduleDialog}
        data={selectedItem}
      />

      <CreateResultDialog
        openDialog={openCreateResultDialog}
        handleCloseDialog={handleCloseCreateResultDialog}
        memInfo={memInfo}
        ptServiceItem={selectedItem}
        setOpenAlert={setOpenAlert}
        getPTService={getPTService}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
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

export default DetailMemberPage;
