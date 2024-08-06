import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import dayjs from "dayjs";
import api from "../axiosInterceptor";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
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

const TextFieldItem = styled(TextField)(() => ({
  width: "100%",
  "& .MuiInputBase-input::placeholder": {
    color: "black",
    opacity: 0.6,
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 16,
    "& fieldset": {
      border: "1px solid #d0d7de",
      borderRadius: 16,
    },
    "&:hover fieldset": {
      border: "1px solid #d0d7de",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "17px",
    fontFamily: "'Outfit Variable', sans-serif",
    color: "#ea2c3e",
    lineHeight: 1.4,
  },
}));

const ErrorText = styled(FormHelperText)(() => ({
  fontSize: "17px",
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
}));

const ExtendServiceDialog = ({
  openDialog,
  handleCloseDialog,
  data,
  setOpenAlert,
  getMembershipService,
}) => {
  const [durationExtend, setDurationExtend] = useState(1);
  const [newExpiredDate, setNewExpiredDate] = useState(
    dayjs(data[0]?.expiredDate).add(1, "month")
  );
  const [error, setError] = useState("");

  const validateField = (value) => {
    let errorText = "";
    if (!value) {
      errorText = "Extension duration is required!";
    }
    setError(errorText);
    return errorText;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    if (
      value !== "" &&
      (!/^\d+$/.test(value) ||
        parseInt(value, 10) < 1 ||
        parseInt(value, 10) > 60)
    ) {
      return;
    }
    setDurationExtend(value);
    setNewExpiredDate(dayjs(data[0]?.expiredDate).add(value, "month"));
    validateField(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === ".") {
      event.preventDefault();
    }
  };

  const handleSubmit = async () => {
    const durationServiceError = validateField(durationExtend);
    if (!durationServiceError) {
      try {
        await api.put(`/customer/extend-service/${data[0]?.id}`, {
          newEndDate: dayjs(newExpiredDate).format("YYYY-MM-DD"),
          cost: data[0]?.membership?.priceMonth * durationExtend,
        });
        closeDialog();
        setOpenAlert(true);
        getMembershipService();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setDurationExtend(1);
    setNewExpiredDate(dayjs(data[0]?.expiredDate).add(1, "month"));
    setError("");
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          py: 1,
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
        }}
      >
        Extend Membership Service
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeDialog}
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FieldContainer>
            <TitleField>Membership Package:</TitleField>
            <TextStyled>{data[0]?.membership.name}</TextStyled>
          </FieldContainer>
          <FieldContainer>
            <TitleField>Start Date:</TitleField>
            <TextStyled>
              {dayjs(data[0]?.startDate).format("DD/MM/YYYY")}
            </TextStyled>
          </FieldContainer>
          <FieldContainer>
            <TitleField>Current Expirated Date:</TitleField>
            <TextStyled>
              {dayjs(data[0]?.expiredDate).format("DD/MM/YYYY")}
            </TextStyled>
          </FieldContainer>
          <FieldContainer sx={{ alignItems: "center", gap: 2 }}>
            <TitleField>Extension Duration: </TitleField>
            <TextFieldItem
              autoComplete="off"
              sx={{ width: "8vw" }}
              type="number"
              value={durationExtend}
              onChange={handleChange}
              inputProps={{
                min: 1,
                max: 60,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { textAlign: "center" },
              }}
              onKeyDown={handleKeyDown}
            />
            <TextStyled>months</TextStyled>
          </FieldContainer>
          <ErrorText>{error}</ErrorText>
          <FieldContainer>
            <TitleField>New Expirated Date:</TitleField>
            <TextStyled>
              {dayjs(newExpiredDate).format("DD/MM/YYYY")}
            </TextStyled>
          </FieldContainer>
          {durationExtend && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>Amount:</TitleField>
              <TextStyled sx={{ fontSize: 40, fontWeight: 700 }}>
                {data[0]?.membership?.priceMonth * durationExtend}
              </TextStyled>
              <TextStyled sx={{ fontSize: 28, fontWeight: 500 }}>$</TextStyled>
            </FieldContainer>
          )}
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              margin: "auto",
              mt: 2,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={handleSubmit}
          >
            Extend Service
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExtendServiceDialog;
