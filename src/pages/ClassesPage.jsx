import React, { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import ScheduleContainer from "../components/ScheduleContainer";
import { AppointmentTooltip } from "@devexpress/dx-react-scheduler-material-ui";
import ClassCategoryDialog from "../components/Dialog/ClassCategoryDialog";
import CreateClassDialog from "../components/Dialog/CreateClassDialog";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useScrollToTop } from "../utils/handleScroll";
import EditClassDialog from "../components/Dialog/EditClassDialog";
import ClassParticipantsDialog from "../components/Dialog/ClassParticipantsDialog";
import { UserContext } from "../components/userContext";
import axios from "axios";
import api from "../components/axiosInterceptor";

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "#e8dcfc",
    color: "#343c6a",
    borderRadius: 8,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #8287A6",
    borderRadius: 8,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #8287A6",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const ScheduleTextContainer = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 10,
  marginBottom: 10,
}));

const ClassesPage = () => {
  useScrollToTop();
  const { user } = useContext(UserContext);

  const [data, setData] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [listCoaches, setListCoaches] = useState([]);
  const [listGyms, setListGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(
    user.role === "GYM_MANAGER" ? user?.gym : "not-select"
  );
  const [selectedCategory, setSelectedCategory] = useState("not-select");

  const [selectedItem, setSelectedItem] = useState({});

  const getListGyms = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/gym/get-list-active-gym"
      );
      setListGyms(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListCoach = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2002/gms/api/v1/coach/get-list-coach-with-schedule/${selectedGym.id}`
      );
      setListCoaches(response.data);
      console.log("sdgsdgdsg");
    } catch (err) {
      console.log(err);
    }
  };

  const getListCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/class/get-list-category"
      );
      setListCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListClass = async () => {
    try {
      const response = await axios.get("http://localhost:2002/gms/api/v1/class/get-list-class", {
        params: {
          gymId: selectedGym.id,
          categoryId: selectedCategory,
        },
      });
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGyms();
    getListCategory();
  }, []);

  useEffect(() => {
    if (selectedGym !== "not-select" && selectedCategory !== "not-select")
      getListCoach()
      getListClass();
  }, [selectedGym, selectedCategory]);

  const Content = ({ children, appointmentData, ...restProps }) => (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    >
      <Box sx={{ px: 3 }}>
        <ScheduleTextContainer>
          <Typography sx={{ fontWeight: "bold" }}>Code:</Typography>
          <Typography>{appointmentData.code}</Typography>
        </ScheduleTextContainer>
        <ScheduleTextContainer>
          <Typography sx={{ fontWeight: "bold" }}>Coach:</Typography>
          <Typography>
            {appointmentData.coach?.code} - {appointmentData.coach?.name}
          </Typography>
        </ScheduleTextContainer>
        <ScheduleTextContainer>
          <Typography sx={{ fontWeight: "bold" }}>Max participants:</Typography>
          <Typography>{appointmentData.maxParticipants}</Typography>
        </ScheduleTextContainer>
        <ScheduleTextContainer>
          <Typography sx={{ fontWeight: "bold" }}>
            Current participants:
          </Typography>
          <Typography>{appointmentData.currentParticipants}</Typography>
        </ScheduleTextContainer>
        {appointmentData.description && (
          <Typography>{appointmentData.description}</Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          <Tooltip title="Manage participants">
            <IconButton
              onClick={() => handleClickParticipants(appointmentData)}
              sx={{ color: "#6e34d5" }}
              title="Manage participants"
            >
              <PeopleAltIcon />
            </IconButton>
          </Tooltip>
          {dayjs().isBefore(dayjs(appointmentData.endDate)) && (
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleClickEdit(appointmentData)}
                sx={{ color: "#00b69b" }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton
              onClick={() => handleClickDel(appointmentData)}
              sx={{ color: "#ef3826" }}
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </AppointmentTooltip.Content>
  );

  const handleExport = () => {
    const headers = [
      "No.",
      "Code",
      "Name",
      "Category",
      "Date",
      "Start time",
      "End time",
      "Coach",
      "Description",
      "Max participants",
      "Current participants",
      "Gym",
    ];

    // Tạo dữ liệu CSV từ gymManagers
    const csvData = [
      headers,
      ...data.map((item, index) => [
        index + 1,
        `"${item.code}"`,
        `"${item.title}"`,
        `"${item.classCategory?.name}"`,
        `"${dayjs(item.startDate).format("DD/MM/YYYY")}"`,
        `"${dayjs(item.startDate).format("HH:mm")}"`,
        `"${dayjs(item.endDate).format("HH:mm")}"`,
        `"${item.coach?.code} - ${item.coach?.name}"`,
        `"${item.description}"`,
        `"${item.maxParticipants}"`,
        `"${item.currentParticipants}"`,
        `"${selectedGym.name}"`,
      ]),
    ];

    // Tạo file CSV và tải xuống
    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `class-${selectedGym.name
        .toLowerCase()
        .replace(/\s/g, "_")}-${selectedCategory}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("success");
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  const [openDelDialog, setOpenDelDialog] = useState(false);
  const handleCloseDelDialog = () => {
    setOpenDelDialog(false);
  };
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };
  const [openParticipantsDialog, setOpenParticipantsDialog] = useState(false);
  const handleCloseParticipantsDialog = () => {
    setOpenParticipantsDialog(false);
  };

  const handleClickAdd = () => {
    setTypeAlert("success");
    setContentAlert("New class created successfully!");
    setOpenAddDialog(true);
  };

  const handleClickEdit = (item) => {
    setSelectedItem(item);
    setTypeAlert("success");
    setContentAlert("Class updated successfully!");
    setOpenEditDialog(true);
  };

  const handleClickDel = (item) => {
    setSelectedItem(item);
    setOpenDelDialog(true);
  };

  const handleClickParticipants = (item) => {
    setSelectedItem(item);
    setOpenParticipantsDialog(true);
  };

  const handleClickManageCategories = () => {
    setOpenCategoryDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/class/delete-class/${selectedItem.id}`);
      setOpenDelDialog(false);
      setTypeAlert("success");
      setContentAlert("Class deleted successfully!");
      setOpenAlert(true);
      getListCategory();
      getListCoach();
      getListClass();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f7fa",
        minHeight: "89.5vh",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Classes List
        </Typography>
        {user.role === "SENIOR_ADMIN" && (
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<CategoryIcon />}
            onClick={handleClickManageCategories}
          >
            Manage categories
          </ToolButton>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", my: 4 }}>
          <Box
            sx={{
              backgroundColor: "#e8dcfc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 57,
              height: 57,
              border: "1px solid #8287A6",
              borderRadius: 2,
            }}
          >
            <FilterAltIcon sx={{ color: "#6e34d5", fontSize: 35 }} />
          </Box>

          {user.role === "SENIOR_ADMIN" && (
            <Box>
              <SelectItem
                sx={{ width: "25vw" }}
                value={selectedGym}
                onChange={(e) => {
                  setSelectedGym(e.target.value);
                }}
              >
                <MenuItemStyled value="not-select">Select gym</MenuItemStyled>
                {listGyms.map((item) => (
                  <MenuItemStyled key={item.id} value={item}>
                    {item.name}
                  </MenuItemStyled>
                ))}
              </SelectItem>
            </Box>
          )}

          <Box>
            <SelectItem
              sx={{ width: "17vw" }}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
              }}
            >
              <MenuItemStyled value="not-select">
                Select class category
              </MenuItemStyled>
              {listCategories.map((item) => (
                <MenuItemStyled key={item.id} value={item.id}>
                  {item.name}
                </MenuItemStyled>
              ))}
            </SelectItem>
          </Box>
        </Box>

        {selectedGym !== "not-select" && selectedCategory !== "not-select" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<AddIcon />}
              onClick={handleClickAdd}
            >
              Add
            </ToolButton>
            <ToolButton
              sx={{ px: 3 }}
              startIcon={<FileDownloadIcon />}
              onClick={handleExport}
            >
              Export
            </ToolButton>
          </Box>
        )}
      </Box>

      {selectedGym !== "not-select" && selectedCategory !== "not-select" ? (
        <ScheduleContainer schedule={data} Content={Content} />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextStyled sx={{ fontSize: 30, fontWeight: 700, color: "#343c6a" }}>
            Select a gym and a class category to view the schedule.
          </TextStyled>
        </Box>
      )}

      <ClassCategoryDialog
        data={listCategories}
        openDialog={openCategoryDialog}
        handleCloseDialog={handleCloseCategoryDialog}
        setOpenAlert={setOpenAlert}
        setTypeAlert={setTypeAlert}
        setContentAlert={setContentAlert}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        getListCategory={getListCategory}
      />

      <ConfirmDialog
        title="Delete Class"
        content="Are you sure you want to delete this class? This action cannot be undone."
        openDialog={openDelDialog}
        handleCloseDialog={handleCloseDelDialog}
        handleConfirm={handleConfirmDelete}
      />

      <CreateClassDialog
        openDialog={openAddDialog}
        handleCloseDialog={handleCloseAddDialog}
        selectedGym={selectedGym}
        selectedCategory={selectedCategory}
        listCoaches={listCoaches}
        setOpenAlert={setOpenAlert}
        getListClass={getListClass}
        getListCoach={getListCoach}
        getListCategory={getListCategory}
      />

      <EditClassDialog
        openDialog={openEditDialog}
        handleCloseDialog={handleCloseEditDialog}
        listCoaches={listCoaches}
        setOpenAlert={setOpenAlert}
        selectedClass={selectedItem}
        getListClass={getListClass}
        getListCoach={getListCoach}
      />

      <ClassParticipantsDialog
        openDialog={openParticipantsDialog}
        handleCloseDialog={handleCloseParticipantsDialog}
        selectedClass={selectedItem}
        setOpenAlert={setOpenAlert}
        setTypeAlert={setTypeAlert}
        setContentAlert={setContentAlert}
        getListClass={getListClass}
        setSelectedClass={setSelectedItem}
      />

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={typeAlert === "success" ? "success" : "error"}
          variant="filled"
          sx={{
            maxWidth: "35vw",
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            fontWeight: 400,
          }}
        >
          {contentAlert}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClassesPage;
