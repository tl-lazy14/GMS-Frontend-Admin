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
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CoachScheduleDialog from "./CoachScheduleDialog";
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

const CreateClassDialog = ({
  openDialog,
  handleCloseDialog,
  selectedGym,
  selectedCategory,
  listCoaches,
  setOpenAlert,
  getListClass,
  getListCoach,
  getListCategory
}) => {
  const [formData, setFormData] = useState({
    title: "",
    date: dayjs(),
    startTime: null,
    endTime: null,
    coach: "not-select",
    description: "",
    maxParticipants: 10,
    category: "",
    gym: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    time: "",
    coach: "",
    maxParticipants: "",
  });
  const [openScheduleDialog, setScheduleDialog] = useState(false);
  const handleCloseScheduleDialog = () => {
    setScheduleDialog(false);
  };

  const getCategory = async () => {
    try {
      const response = await api.get(`/class/get-category/${selectedCategory}`);
      setFormData((prevData) => ({
        ...prevData,
        category: response.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      gym: selectedGym.name,
    }));
  }, [selectedGym, openDialog]);

  useEffect(() => {
    getCategory();
  }, [selectedCategory, openDialog]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (
      name === "maxParticipants" &&
      value !== "" &&
      (!/^\d+$/.test(value) || parseInt(value, 10) < 1)
    ) {
      return;
    }
    setFormData({ ...formData, [name]: value });
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
    setFormData({ ...formData, coach: newValue });
    validateField("coach", newValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === ".") {
      event.preventDefault();
    }
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "title":
        if (!value.trim()) {
          error = "Class title is required.";
        }
        setErrors((prev) => ({ ...prev, title: error }));
        break;

      case "coach":
        if (value === "not-select" || value === null) {
          error = "Please select a coach.";
        }
        setErrors((prev) => ({ ...prev, coach: error }));
        break;

      case "maxParticipants":
        if (!value) {
          error = "Max participants is required.";
        }
        setErrors((prev) => ({ ...prev, maxParticipants: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const titleError = validateField("title", formData.title);
    const coachError = validateField("coach", formData.coach);
    const maxParticipantsError = validateField(
      "maxParticipants",
      formData.maxParticipants
    );

    let timeError = "";
    if (!formData.startTime || !formData.endTime) {
      timeError = "Please select start time & end time.";
    } else if (dayjs(formData.endTime).isBefore(dayjs(formData.startTime))) {
      timeError = "End time cannot be before start time.";
    }
    setErrors((prev) => ({ ...prev, time: timeError }));

    // Kiểm tra xem có lỗi nào không
    if (!titleError && !coachError && !maxParticipantsError && !timeError) {
      const startDate =
        dayjs(formData.date).format("YYYY-MM-DD") +
        "T" +
        dayjs(formData.startTime).format("HH:mm:ss");
      const endDate =
        dayjs(formData.date).format("YYYY-MM-DD") +
        "T" +
        dayjs(formData.endTime).format("HH:mm:ss");

      const startDateFormatted =
        dayjs(formData.date).format("YYYY-MM-DD") +
        " " +
        dayjs(formData.startTime).format("HH:mm:ss");
      const endDateFormatted =
        dayjs(formData.date).format("YYYY-MM-DD") +
        " " +
        dayjs(formData.endTime).format("HH:mm:ss");

      const overlapping = formData.coach.schedule?.find((schedule) => {
        const existingStart = dayjs(schedule.startDate);
        const existingEnd = dayjs(schedule.endDate);
        return (
          (dayjs(startDate).isBefore(existingEnd) &&
            dayjs(endDate).isAfter(existingStart)) ||
          (dayjs(startDate).isSame(existingStart) &&
            dayjs(endDate).isSame(existingEnd))
        );
      });

      if (overlapping) {
        const startTimeOverlapped = dayjs(overlapping.startDate);
        const endTimeOverlapped = dayjs(overlapping.endDate);
        setErrors((prev) => ({
          ...prev,
          time: `Overlapping coach schedule: ${
            overlapping.title
          } (${startTimeOverlapped.format(
            "HH:mm"
          )} - ${endTimeOverlapped.format(
            "HH:mm"
          )} ${startTimeOverlapped.format("DD/MM/YYYY")})`,
        }));
        return;
      } else {
        try {
          await api.post("/class/add-class", {
            title: formData.title,
            categoryId: selectedCategory,
            coachId: formData.coach.coach.id,
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            maxParticipants: formData.maxParticipants,
            description: formData.description,
            gymId: selectedGym.id,
          });
          closeDialog();
          setOpenAlert(true);
          getListCategory();
          getListClass();
          getListCoach();
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      title: "",
      date: dayjs(),
      startTime: null,
      endTime: null,
      coach: "not-select",
      description: "",
      maxParticipants: 10,
      category: "",
      gym: "",
    });
    setErrors({
      title: "",
      time: "",
      coach: "",
      maxParticipants: "",
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
        Create New Class
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
            <TitleField>Title *:</TitleField>
            <TextFieldItem
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              autoComplete="off"
              helperText={errors.title}
            />
          </Box>
          <Box>
            <TitleField>Category:</TitleField>
            <TextFieldItem
              value={formData.category?.name}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <Box>
            <TitleField>Coach *:</TitleField>
            <AutocompleteItem
              value={formData.coach}
              onChange={handleAutocompleteChange}
              options={listCoaches}
              getOptionLabel={(option) =>
                option.coach?.code !== undefined
                  ? `${option.coach?.code} - ${option.coach?.name}`
                  : ""
              }
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{ display: "flex", alignItems: "center", gap: 3 }}
                >
                  <TextStyled sx={{ color: "#343c6a", fontSize: 16.5, py: 1 }}>
                    {option.coach?.code} - {option.coach?.name}
                  </TextStyled>
                </Box>
              )}
              renderInput={(params) => (
                <TextFieldItem
                  {...params}
                  placeholder="Select coach"
                  variant="outlined"
                />
              )}
            />
            {formData.coach !== "not-select" && formData.coach !== null && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <ToolButton
                  sx={{ px: 3 }}
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => setScheduleDialog(true)}
                >
                  View coach schedule
                </ToolButton>
              </Box>
            )}
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.coach}
            </TextStyled>
          </Box>
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
            <TitleField>Max participants *:</TitleField>
            <TextFieldItem
              name="maxParticipants"
              type="number"
              value={formData.maxParticipants}
              onChange={handleChange}
              inputProps={{
                min: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { textAlign: "center" },
              }}
              onKeyDown={handleKeyDown}
            />
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.maxParticipants}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Note/description:</TitleField>
            <TextFieldItem
              name="description"
              minRows={2}
              multiline
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter note/description about class"
            />
          </Box>
          <Box>
            <TitleField>Gym:</TitleField>
            <TextFieldItem
              value={formData.gym}
              InputProps={{
                readOnly: true,
              }}
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

        <CoachScheduleDialog
          openDialog={openScheduleDialog}
          handleCloseDialog={handleCloseScheduleDialog}
          data={formData.coach}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateClassDialog;
