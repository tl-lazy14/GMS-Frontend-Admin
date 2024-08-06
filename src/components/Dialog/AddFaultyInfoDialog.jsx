import {
  Autocomplete,
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
import api from "../axiosInterceptor";
import dayjs from "dayjs";

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
  color: "white",
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

const AddFaultyInfoDialog = ({
  openDialog,
  handleCloseDialog,
  selectedGym,
  setTypeAlert,
  setOpenAlert,
  setContentAlert,
  getListEquipmentRepair,
}) => {
  const [listEquipments, setListEquipments] = useState([]);
  const [formData, setFormData] = useState({
    selectedEquipment: "not-select",
    issueDescription: "",
    repairDate: null,
    repairDescription: "",
    repairCost: "",
    gym: selectedGym.name,
  });
  const [errors, setErrors] = useState("");

  const getAllEquipmentWithCode = async () => {
    try {
      const response = await api.get(
        `/equipment/get-all-equipment-code/${selectedGym.id}`
      );
      setListEquipments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      gym: selectedGym.name,
    }));
  }, [selectedGym]);

  useEffect(() => {
    getAllEquipmentWithCode();
  }, [openDialog]);

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

  const handleChangeAutocomplete = (event, newValue) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedEquipment: newValue,
    }));
    validateField(newValue);
  };

  const validateField = (value) => {
    let errorText = "";
    if (value === "not-select" || value === null) {
      errorText = "Please select the faulty equipment.";
    }
    setErrors(errorText);
    return errorText;
  };

  const handleSubmit = async () => {
    const selectedEquipmentError = validateField(formData.selectedEquipment);

    // Kiểm tra xem có lỗi nào không
    if (!selectedEquipmentError) {
      try {
        await api.post("/equipment/add-repair", {
          code: formData.selectedEquipment.code,
          equipmentId: formData.selectedEquipment.equipment.id,
          issueDescription: formData.issueDescription || "",
          repairDate: formData.repairDate ? dayjs(formData.repairDate).format("YYYY-MM-DD") : "not-select",
          repairDescription: formData.repairDescription || "",
          repairCost: formData.repairCost !== "" ? parseFloat(formData.repairCost) : 0,
        });
        closeDialog();
        setOpenAlert(true);
        getListEquipmentRepair();
      } catch (err) {
        setTypeAlert("error");
        setContentAlert(err.response.data.error);
        setOpenAlert(true);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      selectedEquipment: "not-select",
      issueDescription: "",
      repairDate: null,
      repairDescription: "",
      repairCost: "",
      gym: selectedGym.name,
    });
    setErrors("");
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
        Create new equipment fault information
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
          <Box>
            <AutocompleteItem
              value={formData.selectedEquipment}
              onChange={handleChangeAutocomplete}
              options={listEquipments}
              getOptionLabel={(option) =>
                option.code !== undefined
                  ? `${option.code} - ${option.equipment?.name}`
                  : ""
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  <TextStyled sx={{ color: "#343c6a", fontSize: 16.5, py: 1 }}>
                    {option.code} - {option.equipment?.name}
                  </TextStyled>
                </Box>
              )}
              renderInput={(params) => (
                <TextFieldItem
                  multiline
                  {...params}
                  placeholder="Select the faulty equipment"
                  variant="outlined"
                />
              )}
            />
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors}
            </TextStyled>
          </Box>

          <Box>
            <TitleField>Gym:</TitleField>
            <TextFieldItem
              value={selectedGym.name}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>

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

export default AddFaultyInfoDialog;
