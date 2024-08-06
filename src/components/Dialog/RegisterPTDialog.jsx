import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../axiosInterceptor";
import { useParams } from "react-router-dom";

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

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 16,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
    borderRadius: 16,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const ErrorText = styled(FormHelperText)(() => ({
  fontSize: "16px",
  lineHeight: 1.5,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
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

const RegisterPTDialog = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  getPTService,
}) => {
  const { id } = useParams();
  const [listPackages, setListPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("not-select");
  const [startDate, setStartDate] = useState(dayjs());
  const [error, setError] = useState("");

  const getListPackages = async () => {
    try {
      const response = await api.get("/service/get-active-pt-package");
      setListPackages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListPackages();
  }, [openDialog]);

  const validateField = (value) => {
    let errorText = "";
    if (value === "not-select") {
      errorText = "Please select a PT service package";
    }
    setError(errorText);
    return errorText;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedPackage(value);
    validateField(value);
  };

  const handleDateChange = (newDate) => {
    setStartDate(newDate);
  };

  const handleSubmit = async () => {
    const selectPackageError = validateField(selectedPackage);
    if (!selectPackageError) {
      try {
        await api.post(`/customer/register-pt-service/${id}`, {
          packageId: selectedPackage.id,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          endDate: dayjs(startDate)
            .add(selectedPackage.duration, "month")
            .format("YYYY-MM-DD"),
          cost: selectedPackage.price,
        });
        closeDialog();
        setOpenAlert(true);
        getPTService();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setSelectedPackage("not-select");
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
        Register Personal Trainer Service
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TitleField>PT Package: </TitleField>
            <SelectItem value={selectedPackage} onChange={handleChange}>
              <MenuItemStyled value="not-select">
                Select your PT service package
              </MenuItemStyled>
              {listPackages.map((item) => (
                <MenuItemStyled key={item.id} value={item}>
                  {item.name} ({item.numSessions} sessions/{item.duration}{" "}
                  months)
                </MenuItemStyled>
              ))}
            </SelectItem>
            <ErrorText>{error}</ErrorText>
          </Box>
          {selectedPackage !== "not-select" && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>Number of sessions:</TitleField>
              <TextStyled>{selectedPackage.numSessions}</TextStyled>
            </FieldContainer>
          )}
          {selectedPackage !== "not-select" && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>Duration:</TitleField>
              <TextStyled>{selectedPackage.duration} months</TextStyled>
            </FieldContainer>
          )}
          <Box>
            <TitleField>PT service start date *</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={startDate}
                onChange={(newDate) => handleDateChange(newDate)}
                inputFormat="DD/MM/YYYY"
                minDate={dayjs()}
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          {selectedPackage !== "not-select" && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>PT service end date:</TitleField>
              <TextStyled>
                {dayjs(startDate)
                  .add(selectedPackage.duration, "month")
                  .format("DD/MM/YYYY")}
              </TextStyled>
            </FieldContainer>
          )}
          {selectedPackage !== "not-select" && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>Price:</TitleField>
              <TextStyled sx={{ fontSize: 40, fontWeight: 700 }}>
                {selectedPackage.price}
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
            Register
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterPTDialog;
