import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import WestIcon from "@mui/icons-material/West";
import dayjs from "dayjs";
import QuillContent from "../components/QuillContent";
import ScheduleContainer from "../components/ScheduleContainer";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import AddScheduleDialog from "../components/Dialog/AddScheduleDialog";
import EditScheduleDialog from "../components/Dialog/EditScheduleDialog";
import api from "../components/axiosInterceptor";
import axios from "axios";

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

const TransImage = styled("img")(() => ({
  width: "23vw",
  borderRadius: 16,
  objectFit: "cover",
}));

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 15,
}));

const TitleFieldRow = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
}));

const TitleSection = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 23,
  fontWeight: 600,
  marginTop: 25,
  marginBottom: 20,
}));

const ScheduleTextContainer = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
  marginBottom: 10,
}));

const CoachDetailPage = () => {
  useScrollToTop();
  const { id } = useParams();

  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [listMembers, setListMembers] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState({});

  const getCoachInfo = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/coach/get-coach-info/${id}`);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCoachSchedule = async () => {
    try {
      const response = await api.get(`/coach/get-coach-schedule/${id}`);
      setSchedule(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListMembers = async () => {
    try {
      const response = await api.get(`/coach/get-list-member/${id}`);
      setListMembers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCoachInfo();
    getCoachSchedule();
    getListMembers();
  }, []);

  const Content = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <Box sx={{ px: 3 }}>
        {appointmentData.type === "PT" && (
          <ScheduleTextContainer>
            <Typography sx={{ fontWeight: "bold" }}>Member:</Typography>
            <Typography>
              {appointmentData.memberService?.member?.code} -{" "}
              {appointmentData.memberService?.member?.name}
            </Typography>
          </ScheduleTextContainer>
        )}
        {appointmentData.type === "class" && (
          <Box>
            <ScheduleTextContainer>
              <Typography sx={{ fontWeight: "bold" }}>Class:</Typography>
              <Typography>
                {appointmentData.aclass?.code} - {appointmentData.aclass?.title}
              </Typography>
            </ScheduleTextContainer>
            <ScheduleTextContainer>
              <Typography sx={{ fontWeight: "bold" }}>
                Number of participants:
              </Typography>
              <Typography>
                {appointmentData.aclass?.currentParticipants}
              </Typography>
            </ScheduleTextContainer>
          </Box>
        )}
        {appointmentData.description && (
          <Typography>{appointmentData.description}</Typography>
        )}

        {appointmentData.type !== "class" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            {dayjs().isBefore(dayjs(appointmentData.endDate)) && (
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => handleClickEditSchedule(appointmentData)}
                  sx={{ color: "#00b69b" }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleClickDeleteSchedule(appointmentData)}
                sx={{ color: "#ef3826" }}
                title="Delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </AppointmentTooltip.Content>
  );

  const handleClickAddSchedule = () => {
    setContentAlert("New schedule created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickEditSchedule = (item) => {
    setContentAlert("Schedule updated successfully!");
    setOpenEditDialog(true);
    setSelectedAppointment(item);
  };

  const handleClickDeleteSchedule = (item) => {
    setSelectedAppointment(item);
    setOpenDelDialog(true);
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

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const [openDelDialog, setOpenDelDialog] = useState(false);
  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
  };
  const handleConfirmDelDialog = async () => {
    // Xu ly xoa ban ghi coach schedule
    try {
      await api.delete(`/coach/delete-schedule/${selectedAppointment.id}`);
      setOpenDelDialog(false);
      setContentAlert("Schedule deleted successfully!");
      setOpenAlert(true);
      getCoachSchedule();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      id="main-section"
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
          Coach Details
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<WestIcon />}
            onClick={() => navigate("/coaches")}
          >
            Back
          </ToolButton>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<EditIcon />}
            onClick={() => navigate(`/coaches/edit/${id}`)}
          >
            Edit
          </ToolButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", width: "100%", gap: 5, my: 5 }}>
        <Box>
          <TransImage src={data.imageUrl} alt="trans img" />
          <Typography
            sx={{
              textAlign: "center",
              color: "#221551",
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 20,
              fontWeight: 500,
              my: 1,
            }}
          >
            {data.level}
          </Typography>
        </Box>

        <Box
          sx={{ width: "100%", fontFamily: "'Outfit Variable', sans-serif" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              boxSizing: "border-box",
            }}
          >
            <FieldContainer>
              <TitleFieldRow>Code:</TitleFieldRow>
              <TextStyled>{data.code}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Name:</TitleFieldRow>
              <TextStyled>{data.name}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Email:</TitleFieldRow>
              <TextStyled>{data.email}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Phone number:</TitleFieldRow>
              <TextStyled>{data.phone}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Date of birth:</TitleFieldRow>
              <TextStyled>{dayjs(data.dob).format("DD/MM/YYYY")}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Gym:</TitleFieldRow>
              <TextStyled>{data.gym?.name}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Status:</TitleFieldRow>
              <TextStyled>{data.status}</TextStyled>
            </FieldContainer>
          </Box>
          <QuillContent content={data.description} />
          <Box>
            <TitleSection>Work Experience:</TitleSection>
            <QuillContent content={data.experience} />
          </Box>
          <Box>
            <TitleSection>Expertise:</TitleSection>
            <QuillContent content={data.expertise} />
          </Box>
          <Box>
            <TitleSection>Certifications:</TitleSection>
            <QuillContent content={data.certification} />
          </Box>
          <Box>
            <TitleSection>Achievements:</TitleSection>
            <QuillContent content={data.achievements} />
          </Box>
        </Box>
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 25,
              color: "white",
              fontWeight: 600,
            }}
          >
            Schedule
          </Typography>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={handleClickAddSchedule}
          >
            Add schedule
          </ToolButton>
        </Box>
        <ScheduleContainer schedule={schedule} Content={Content} />
      </Box>

      <ConfirmDialog
        title="Delete Schedule"
        content="Are you sure you want to delete this schedule? This action cannot be undone."
        openDialog={openDelDialog}
        handleCloseDialog={handleCloseDelDialog}
        handleConfirm={handleConfirmDelDialog}
      />

      <AddScheduleDialog
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        setOpenAlert={setOpenAlert}
        currentListSchedules={schedule}
        listMembers={listMembers}
        getCoachSchedule={getCoachSchedule}
      />

      <EditScheduleDialog
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        setOpenAlert={setOpenAlert}
        currentListSchedules={schedule}
        selectedSchedule={selectedAppointment}
        setSelectedSchedule={setSelectedAppointment}
        listMembers={listMembers}
        getCoachSchedule={getCoachSchedule}
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

export default CoachDetailPage;
