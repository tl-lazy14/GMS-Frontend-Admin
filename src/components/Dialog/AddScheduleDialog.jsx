import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../axiosInterceptor";
import { useParams } from "react-router-dom";

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
      border: "1px solid #d0d7de !important",
      borderRadius: 16,
    },
    "&:hover fieldset": {
      border: "1px solid #d0d7de !important",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5 !important",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "17px",
    fontFamily: "'Outfit Variable', sans-serif",
    color: "#ea2c3e",
    lineHeight: 1.4,
  },
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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "#343c6a",
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

const AddScheduleDialog = ({
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  currentListSchedules,
  listMembers,
  getCoachSchedule
}) => {
  const { id } = useParams();

  const [formData, setFormData] = useState({
    type: "not-select",
    title: "",
    date: dayjs(),
    startTime: "",
    endTime: "",
    description: "",
    member: "not-select",
  });
  const [errors, setErrors] = useState({
    type: "",
    time: "",
    member: "",
  });
  const [isCheckedAllDay, setIsCheckedAllDay] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      title:
        name === "type"
          ? value === "busy"
            ? "Absent/Busy"
            : "Personal Training"
          : prevFormData.title,
    }));
    if (value === "PT") setIsCheckedAllDay(false);
    validateField(name, value);
  };

  const handleDateChange = (newDate) => {
    setFormData({ ...formData, date: newDate });
  };

  const handleTimeChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAutocompleteChange = (event, newValue) => {
    setFormData({ ...formData, member: newValue });
    validateField("member", newValue);
  };

  const handleCheckBox = (event) => {
    const checked = event.target.checked;
    setIsCheckedAllDay(checked);
    if (checked) {
      setFormData({
        ...formData,
        title: "Absent All Day",
        startTime: dayjs("00:01", "HH:mm"),
        endTime: dayjs("23:59", "HH:mm"),
      });
    } else {
      setFormData({
        ...formData,
        title: "Absent/Busy",
        startTime: null,
        endTime: null,
      });
    }
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "type":
        if (value === "not-select") {
          error = "Please select type schedule.";
        }
        setErrors((prev) => ({ ...prev, type: error }));
        break;

      case "member":
        if (value === "not-select" || value === null) {
          error = "Please select a member.";
        }
        setErrors((prev) => ({ ...prev, member: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const typeError = validateField("type", formData.type);
    const memberError = validateField("member", formData.member);

    let timeError = "";
    if (!formData.startTime || !formData.endTime) {
      timeError = "Please select start time & end time.";
    } else if (dayjs(formData.endTime).isBefore(dayjs(formData.startTime))) {
      timeError = "End time cannot be before start time.";
    }
    setErrors((prev) => ({ ...prev, time: timeError }));

    // Kiểm tra xem có lỗi nào không
    if (!typeError && !timeError) {
      if (formData.type === "PT" && memberError) {
        return;
      }

      const startDate = dayjs(formData.date).format("YYYY-MM-DD") + "T" + dayjs(formData.startTime).format("HH:mm:ss");
      const endDate = dayjs(formData.date).format("YYYY-MM-DD") + "T" + dayjs(formData.endTime).format("HH:mm:ss");

      const startDateFormatted = dayjs(formData.date).format("YYYY-MM-DD") + " " + dayjs(formData.startTime).format("HH:mm:ss");
      const endDateFormatted = dayjs(formData.date).format("YYYY-MM-DD") + " " + dayjs(formData.endTime).format("HH:mm:ss");

      const overlapping = currentListSchedules.find((schedule) => {
        const existingStart = dayjs(schedule.startDate);
        const existingEnd = dayjs(schedule.endDate);
        return (
          (dayjs(startDate).isBefore(existingEnd) && dayjs(endDate).isAfter(existingStart)) ||
          (dayjs(startDate).isSame(existingStart) && dayjs(endDate).isSame(existingEnd))
        );
      });

      if (overlapping) {
        const startTimeOverlapped = dayjs(overlapping.startDate);
        const endTimeOverlapped = dayjs(overlapping.endDate);
        setErrors((prev) => ({ ...prev, time: `Overlapping schedule: ${overlapping.title} (${startTimeOverlapped.format('HH:mm')} - ${endTimeOverlapped.format('HH:mm')} ${startTimeOverlapped.format('DD/MM/YYYY')})` }));
        return;
      } else {
        // Xu ly add schedule
        try {
          await api.post(`/coach/add-schedule/${id}`, {
            title: formData.title,
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            type: formData.type,
            description: formData.description,
            memberId: formData.member.id,
          });
          closeDialog();
          setOpenAlert(true);
          getCoachSchedule();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      type: "not-select",
      title: "",
      date: dayjs(),
      startTime: "",
      endTime: "",
      description: "",
      member: "not-select",
    });
    setErrors({
      type: "",
      time: "",
      member: "",
    });
    setIsCheckedAllDay(false);
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
        Add New Schedule
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
            <TitleField>Schedule type *:</TitleField>
            <SelectItem
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <MenuItemStyled value="not-select">
                Select schedule type
              </MenuItemStyled>
              <MenuItemStyled value="busy">Absent/Busy</MenuItemStyled>
              <MenuItemStyled value="PT">Personal Training</MenuItemStyled>
            </SelectItem>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.type}
            </TextStyled>
          </Box>

          {formData.type === "busy" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                sx={{
                  color: "#343c6a",
                  "&.Mui-checked": {
                    color: "#343c6a",
                  },
                  "& .MuiSvgIcon-root": { fontSize: 28 },
                }}
                checked={isCheckedAllDay}
                onChange={handleCheckBox}
                inputProps={{ "aria-label": "controlled" }}
              />
              <TextStyled>All Day</TextStyled>
            </Box>
          )}

          <Box>
            <TitleField>Date *:</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                name="date"
                value={formData.date}
                onChange={(newDate) => handleDateChange(newDate)}
                inputFormat="DD/MM/YYYY"
                disablePast
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    autoComplete="off"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <TitleField>Start time *:</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={formData.startTime}
                onChange={(newValue) => handleTimeChange("startTime", newValue)}
                maxTime={formData.endTime}
                readOnly={isCheckedAllDay}
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    placeholder="Start time"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>
          <Box>
            <TitleField>End time *:</TitleField>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={formData.endTime}
                onChange={(newValue) => handleTimeChange("endTime", newValue)}
                minTime={formData.startTime}
                readOnly={isCheckedAllDay}
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    placeholder="End time"
                    onKeyDown={(e) => {
                      e.preventDefault();
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.time}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Note:</TitleField>
            <TextFieldItem
              name="description"
              minRows={2}
              multiline
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter note about schedule"
            />
          </Box>
          {formData.type === "PT" && (
            <Box>
              <TitleField>Member *:</TitleField>
              <AutocompleteItem
                value={formData.member}
                onChange={handleAutocompleteChange}
                options={listMembers}
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
                    <TextStyled
                      sx={{ color: "#343c6a", fontSize: 16.5, py: 1 }}
                    >
                      {option.code} - {option.name}
                    </TextStyled>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextFieldItem
                    {...params}
                    placeholder="Select member"
                    variant="outlined"
                  />
                )}
              />
              <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
                {errors.member}
              </TextStyled>
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

export default AddScheduleDialog;
