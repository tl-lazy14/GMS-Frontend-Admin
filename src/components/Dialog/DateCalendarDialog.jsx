import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { CalendarPicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import api from "../axiosInterceptor";

const DateCalendarDialog = ({
  openDialog,
  handleCloseDialog,
  item,
  setOpenAlert,
  setContentAlert,
  getListData,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setSelectedDate(item.preferredDate ? dayjs(item.preferredDate) : dayjs());
  }, [item]);

  const handleSubmit = async () => {
    try {
      await api.put(`/customer/select-trial-date/${item.id}`, {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
      });
      handleCloseDialog();
      setContentAlert("Trial date saved successfully!");
      setOpenAlert(true);
      getListData();
    } catch (err) {
      console.log(err);
    }
  };

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
        {item.preferredDate ? "Edit Trial Date" : "Set Trial Date"}
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
      <DialogContent
        sx={{
          "& .MuiCalendarPicker-root": {
            // Styles for the entire CalendarPicker
            border: "2px solid #6e34d5",
            my: 1,
            borderRadius: 4,
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 23,
          },
          "& .MuiCalendarPicker-viewTransitionContainer": {
            "& .MuiTypography-root": {
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 16,
              color: "#6e34d5",
              fontWeight: 500,
            },
          },
          "& .MuiPickersDay-root": {
            // Styles for the individual days
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 16,
            gap: 2,
            "&.Mui-selected": {
              // Styles for the selected day
              backgroundColor: "#6e34d5 !important",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#221551 !important",
              },
            },
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!item.preferredDate && (
            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 18,
              }}
            >
              Select trial date for the customer.
            </Typography>
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <CalendarPicker
              date={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              minDate={dayjs().startOf("day")}
            />
          </LocalizationProvider>
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

export default DateCalendarDialog;
