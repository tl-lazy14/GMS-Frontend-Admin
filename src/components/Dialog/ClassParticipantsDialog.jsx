import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../axiosInterceptor";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 10,
}));

const TitleFieldRow = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
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

const ClassParticipantsDialog = ({
  openDialog,
  handleCloseDialog,
  selectedClass,
  setOpenAlert,
  setTypeAlert,
  setContentAlert,
  getListClass,
  setSelectedClass
}) => {
  const [participants, setParticipants] = useState([]);
  const [numParticipants, setNumParticipants] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  const getListParticipant = async () => {
    try {
      const response = await api.get(
        `/class/get-list-participant/${selectedClass.id}`
      );
      setParticipants(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListParticipant();
    setNumParticipants(selectedClass.currentParticipants);
  }, [openDialog, selectedClass]);

  const closeDialog = () => {
    handleCloseDialog();
  };

  const handleRemoveStudent = async (item) => {
    try {
      const response = await api.delete(
        `/class/remove-member-from-class/${selectedClass.id}/${item.id}`
      );
      setTypeAlert("success");
      setContentAlert("Student has been successfully removed from the class!");
      setOpenAlert(true);
      getListClass();
      setSelectedClass(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Xu ly voi dialog them hoc vien vao lop hoc
  const [selectedMember, setSelectedMember] = useState("not-select");
  const [listOptions, setListOptions] = useState([]);
  const [error, setError] = useState("");

  const getListMemberAvailableForAddToClass = async () => {
    try {
      const response = await api.get(
        `/class/get-list-available-mem/${selectedClass.id}`
      );
      setListOptions(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListMemberAvailableForAddToClass();
  }, [openAddDialog]);

  const validateField = (value) => {
    let errorText = "";
    if (value === "not-select" || value === null) {
      errorText = "Please select a member to add to class";
    }
    setError(errorText);
    return errorText;
  };

  const handleChange = (event, newValue) => {
    setSelectedMember(newValue);
    validateField(newValue);
  };

  const isStudentInClass = (studentId) => {
    return participants.some((participant) => participant.id === studentId);
  };

  const handleAddStudentToClass = async () => {
    const selectStudentError = validateField(selectedMember);
    if (!selectStudentError) {
      if (isStudentInClass(selectedMember.id)) {
        setTypeAlert("error");
        setContentAlert("Student is already in the class!");
        setOpenAlert(true);
      } else {
        try {
          const response = await api.post(
            `/class/add-member-to-class/${selectedClass.id}/${selectedMember.id}`
          );
          closeAddDialog();
          setTypeAlert("success");
          setContentAlert("Student has been successfully added to the class!");
          setOpenAlert(true);
          getListClass();
          setSelectedClass(response.data);
        } catch (err) {
          console.log(err);
        }
      }
    }
  };

  const closeAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedMember("not-select");
    setError("");
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
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
        Class Participants Management
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
        <Box sx={{ display: "flex", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexGrow: 1,
            }}
          >
            <FieldContainer>
              <TitleFieldRow>Class:</TitleFieldRow>
              <TextStyled>
                {selectedClass?.code} - {selectedClass?.title}
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Gym:</TitleFieldRow>
              <TextStyled>{selectedClass.gym?.name}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Date:</TitleFieldRow>
              <TextStyled>
                {dayjs(selectedClass.startDate).format("DD/MM/YYYY")}
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Number of participants:</TitleFieldRow>
              <TextStyled>{numParticipants}</TextStyled>
            </FieldContainer>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flexGrow: 1,
            }}
          >
            <FieldContainer>
              <TitleFieldRow>Category:</TitleFieldRow>
              <TextStyled>{selectedClass.classCategory?.name}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Coach:</TitleFieldRow>
              <TextStyled>
                {selectedClass.coach?.code} - {selectedClass.coach?.name}
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Time:</TitleFieldRow>
              <TextStyled>
                {dayjs(selectedClass.startDate).format("HH:mm")} -{" "}
                {dayjs(selectedClass.endDate).format("HH:mm")}
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Max participants:</TitleFieldRow>
              <TextStyled>{selectedClass.maxParticipants}</TextStyled>
            </FieldContainer>
          </Box>
        </Box>
        <TextStyled sx={{ my: 2 }}>{selectedClass.description}</TextStyled>
        {numParticipants < selectedClass.maxParticipants &&
          dayjs().isBefore(dayjs(selectedClass.endDate)) && (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <ToolButton
                sx={{ px: 3 }}
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
              >
                Add student
              </ToolButton>
            </Box>
          )}
        {numParticipants > 0 && (
          <TableContainer
            sx={{
              borderRadius: 4,
              overflowX: "auto",
              boxSizing: "border-box",
              my: 3,
              border: "1px solid #ccc",
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    No.
                  </StyledTableCell>
                  <StyledTableCell>Code</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  {dayjs().isBefore(dayjs(selectedClass.endDate)) && (
                    <StyledTableCell></StyledTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {participants.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      height: "100%",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{item.code}</StyledTableCell>
                    <StyledTableCell>{item.name}</StyledTableCell>
                    {dayjs().isBefore(dayjs(selectedClass.endDate)) && (
                      <StyledTableCell
                        sx={{
                          pr: 3,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderBottom: "none",
                        }}
                      >
                        <IconButton
                          sx={{ color: "#ef3826" }}
                          onClick={() => handleRemoveStudent(item)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              mt: 2,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={closeDialog}
          >
            Close
          </Button>
        </Box>

        <Dialog
          open={openAddDialog}
          onClose={closeAddDialog}
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
            Add student to class
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={closeAddDialog}
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
                  value={selectedMember}
                  onChange={handleChange}
                  options={listOptions}
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
                  {error}
                </TextStyled>
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
                onClick={handleAddStudentToClass}
              >
                Save
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default ClassParticipantsDialog;
