import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 15,
}));

const NameField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const ValueField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const DetailMemRegistration = ({ openDialog, handleCloseDialog, item }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          p: 1,
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
          my: 1,
          textAlign: "center",
        }}
      >
        Membership Registration Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FieldContainer>
            <NameField>Name:</NameField>
            <ValueField>{item?.name}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Email:</NameField>
            <ValueField>{item?.email}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Phone number:</NameField>
            <ValueField>{item?.phone}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Gender:</NameField>
            <ValueField sx={{ textTransform: 'capitalize' }}>{item?.gender}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Date of birth:</NameField>
            <ValueField>
              {item?.dob
                ? dayjs(item.dob).format("DD/MM/YYYY")
                : ""}
            </ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Membership package:</NameField>
            <ValueField>{item?.membership?.name}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Start date:</NameField>
            <ValueField>
              {item?.startDate
                ? dayjs(item.startDate).format("DD/MM/YYYY")
                : ""}
            </ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Expired date:</NameField>
            <ValueField>
              {item?.endDate ? dayjs(item.endDate).format("DD/MM/YYYY") : ""}
            </ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Amount:</NameField>
            <ValueField>{item?.amount} $</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Gym:</NameField>
            <ValueField>{item?.gym?.name}</ValueField>
          </FieldContainer>
          <FieldContainer>
            <NameField>Registration time:</NameField>
            <ValueField>
              {item?.createdAt
                ? dayjs(item.createdAt).format("HH:mm DD/MM/YYYY")
                : ""}
            </ValueField>
          </FieldContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 18,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              mt: 3,
              mb: 1,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailMemRegistration;
