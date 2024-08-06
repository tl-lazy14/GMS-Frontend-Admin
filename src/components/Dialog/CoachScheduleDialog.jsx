import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ScheduleContainer from "../ScheduleContainer";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";

const ScheduleTextContainer = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
  marginBottom: 10,
}));

const CoachScheduleContent = ({ children, appointmentData, ...restProps }) => (
  <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
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
            <Typography>{appointmentData.aclass?.currentParticipants}</Typography>
          </ScheduleTextContainer>
        </Box>
      )}
      {appointmentData.description && (
        <Typography>{appointmentData.description}</Typography>
      )}
    </Box>
  </AppointmentTooltip.Content>
);

const CoachScheduleDialog = ({ openDialog, handleCloseDialog, data }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          py: 1,
          borderRadius: 4,
          backgroundColor: '#f5f7fa'
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
        }}
      >
        Coach Schedule / {data?.coach?.code} - {data?.coach?.name}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseDialog}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Box>
          <ScheduleContainer
            schedule={data.schedule}
            Content={CoachScheduleContent}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CoachScheduleDialog;
