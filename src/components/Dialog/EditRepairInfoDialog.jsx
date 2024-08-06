import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../axiosInterceptor";

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
  color: "#343c6a",
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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 10,
}));

const EditRepairInfoDialog = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  selectedItem,
  getListEquipmentRepair,
}) => {
  const [formData, setFormData] = useState({
    issueDescription: "",
    repairDate: null,
    repairDescription: "",
    repairCost: 0,
  });

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        issueDescription: selectedItem.issueDescription,
        repairDate: dayjs(selectedItem.repairDate) || null,
        repairDescription: selectedItem.repairDescription,
        repairCost: selectedItem.repairCost,
      });
    }
  }, [selectedItem, openDialog]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "repairCost") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      repairDate: newDate,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/equipment/edit-repair/${selectedItem.id}`, {
        code: selectedItem.code,
        equipmentId: selectedItem.equipment.id,
        issueDescription: formData.issueDescription,
        repairDate: formData.repairDate ? dayjs(formData.repairDate).format("YYYY-MM-DD") : "not-select",
        repairDescription: formData.repairDescription,
        repairCost: formData.repairCost !== "" ? parseFloat(formData.repairCost) : 0,
      });
      closeDialog();
      setOpenAlert(true);
      getListEquipmentRepair();
    } catch (err) {
      console.log(err);
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      issueDescription: "",
      repairDate: null,
      repairDescription: "",
      repairCost: 0,
    });
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
        Edit equipment fault & repair information
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
            <TitleField>Equipment code:</TitleField>
            <TextStyled>{selectedItem?.code}</TextStyled>
          </FieldContainer>

          <FieldContainer>
            <TitleField>Equipment name:</TitleField>
            <TextStyled>{selectedItem?.equipment?.name}</TextStyled>
          </FieldContainer>

          <FieldContainer>
            <TitleField>Gym:</TitleField>
            <TextStyled>{selectedItem?.equipment?.gym?.name}</TextStyled>
          </FieldContainer>

          <Box>
            <TitleField>Issue description:</TitleField>
            <TextFieldItem
              name="issueDescription"
              value={formData.issueDescription}
              multiline
              minRows={4}
              onChange={handleChange}
              placeholder="Enter issue description"
              autoComplete="off"
            />
          </Box>
          <Box>
            <TitleField>Repair date *:</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formData.repairDate}
                onChange={(newDate) => handleDateChange(newDate)}
                inputFormat="DD/MM/YYYY"
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
          <Box>
            <TitleField>Repair description:</TitleField>
            <TextFieldItem
              name="repairDescription"
              value={formData.repairDescription}
              multiline
              minRows={4}
              onChange={handleChange}
              placeholder="Enter repair description"
              autoComplete="off"
            />
          </Box>
          <Box>
            <TitleField>Repair cost (in $):</TitleField>
            <TextFieldItem
              name="repairCost"
              value={formData.repairCost}
              onChange={handleChange}
              placeholder="Enter repair cost"
              autoComplete="off"
            />
          </Box>
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

export default EditRepairInfoDialog;
