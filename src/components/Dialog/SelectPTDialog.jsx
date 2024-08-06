import {
  Autocomplete,
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
import { useEffect, useState } from "react";
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

const AutocompleteItem = styled(Autocomplete)(() => ({
  width: "100%",
  "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root']": {
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
  "& .MuiAutocomplete-option": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 17,
  },
  "& .MuiFormHelperText-root": {
    fontSize: "17px",
    fontFamily: "'Outfit Variable', sans-serif",
    color: "#ea2c3e",
    lineHeight: 1.4,
  },
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
  fontSize: "16px",
  lineHeight: 1.5,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
}));

const SelectPTDialog = ({
  openDialog,
  handleCloseDialog,
  gymId,
  memberPTServiceItem,
  setOpenAlert,
  getPTService
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState("not-select");
  const [listTrainers, setListTrainers] = useState([]);
  const [error, setError] = useState("");

  const getListPT = async () => {
    try {
      const response = await api.get(`/coach/get-all-coach/${gymId}`);
      setListTrainers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListPT();
  }, [openDialog]);

  const validateField = (value) => {
    let errorText = "";
    if (value === "not-select" || value === null) {
      errorText = "Please select a personal trainer for the member";
    }
    setError(errorText);
    return errorText;
  };

  const handleChange = (event, newValue) => {
    setSelectedTrainer(newValue);
    validateField(newValue);
  };

  const handleSubmit = async () => {
    const selectPTError = validateField(selectedTrainer);
    if (!selectPTError) {
      // Xu ly chon PT cho hoi vien
      try {
        await api.put(`/customer/select-pt/${memberPTServiceItem.id}`, {
          coachId: selectedTrainer.id
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
    setSelectedTrainer("not-select");
    setError("");
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
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
        Select Personal Trainer For Member
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
            <AutocompleteItem
              value={selectedTrainer}
              onChange={handleChange}
              options={listTrainers}
              getOptionLabel={(option) =>
                option.code !== undefined
                  ? `${option.code} - ${option.name}`
                  : ""
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  <img
                    src={option.imageUrl}
                    alt={option.name}
                    style={{
                      width: 170,
                      height: 230,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <Box>
                    <TextStyled>
                      {option.code} - {option.name}
                    </TextStyled>
                    <TextStyled sx={{ color: "#6e34d5" }}>
                      {option.level}
                    </TextStyled>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextFieldItem
                  {...params}
                  placeholder="Select a personal trainer"
                  variant="outlined"
                />
              )}
            />
            <ErrorText>{error}</ErrorText>
          </Box>
          {(selectedTrainer !== "not-select" && selectedTrainer !== null) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <img
                src={selectedTrainer?.imageUrl}
                alt={selectedTrainer?.name}
                style={{
                  width: "15vw",
                  height: "45vh",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, boxSizing: 'border-box' }}>
                <FieldContainer>
                  <TitleField>Code:</TitleField>
                  <TextStyled>{selectedTrainer?.code}</TextStyled>
                </FieldContainer>
                <FieldContainer>
                  <TitleField>Name:</TitleField>
                  <TextStyled>{selectedTrainer?.name}</TextStyled>
                </FieldContainer>
                <FieldContainer>
                  <TitleField>Email:</TitleField>
                  <TextStyled>{selectedTrainer?.email}</TextStyled>
                </FieldContainer>
                <FieldContainer>
                  <TitleField>Phone number:</TitleField>
                  <TextStyled>{selectedTrainer?.phone}</TextStyled>
                </FieldContainer>
                <FieldContainer>
                  <TitleField>Level:</TitleField>
                  <TextStyled>{selectedTrainer?.level}</TextStyled>
                </FieldContainer>
              </Box>
            </Box>
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
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SelectPTDialog;
