/* eslint-disable no-unused-vars */
import {
  Alert,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import YouTubeIcon from "@mui/icons-material/YouTube";
import CategoryIcon from "@mui/icons-material/Category";
import VideoCategoryDialog from "../components/Dialog/VideoCategoryDialog";
import api from "../components/axiosInterceptor";
import axios from "axios";

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

const TextFieldItem = styled(TextField)(() => ({
  "& .MuiInputBase-input::placeholder": {
    color: "#221551",
    opacity: 0.8,
  },
  "& .MuiOutlinedInput-root": {
    fontFamily: "'Outfit Variable', sans-serif",
    backgroundColor: "white",
    fontSize: 18,
    color: "#221551",
    width: "50vh",
    "& fieldset": {
      border: "1px solid #221551",
    },
    "&:hover fieldset": {
      border: "2px solid #ced4da",
    },
    "&.Mui-focused fieldset": {
      border: "2px solid #6e34d5",
    },
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

const ExerciseItem = styled("Box")(() => ({
  backgroundColor: "white",
  border: "1px solid #ccc",
  borderRadius: 8,
}));

const ExerciseImage = styled("img")(() => ({
  width: "100%",
  height: "30vh",
  objectFit: "cover",
  borderRadius: '8px 8px 0 0'
}));

const ExerciseLibraryPage = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [listCategories, setListCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState({});

  const getListExercise = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/exercise/get-list-exercise`, {
        params: {
          category: category,
          level: level,
          keyword: keyword,
          page: page,
        },
      });
      setData(response.data.listExercises);
      setTotalPages(Math.floor(response.data.numExercises / 9) + 1);
    } catch (err) {
      console.log(err);
    }
  };

  const getListCategory = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/exercise/get-list-category`);
      setListCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListExercise();
  }, [category, level, keyword, page]);

  useEffect(() => {
    getListCategory();
  }, []);

  const handlePageChange = (event, page) => {
    setPage(page);
    const targetElement = document.getElementById("main-section");
    targetElement.scrollIntoView();
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
    setPage(1);
  };

  const handleClickEdit = (item) => {
    navigate(`/exercise-library/edit/${item.id}`);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleOpenVideo = (item) => {
    setSelectedVideo(item);
    setOpenVideoDialog(true);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
    setOpenVideoDialog(false);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const [typeAlert, setTypeAlert] = useState("success");
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
  };
  const handleConfirmDelete = async () => {
    // Xu ly xoa bai tap
    try {
      const response = await api.delete(
        `/exercise/delete-exercise/${selectedItem.id}`
      );
      setOpenDialog(false);
      setTypeAlert("success");
      setContentAlert("Exercise video deleted successfully!");
      setOpenAlert(true);
      getListExercise();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      id="main-section"
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
          Workout Video Library
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={() => navigate("/exercise-library/create")}
          >
            Create
          </ToolButton>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<CategoryIcon />}
            onClick={() => setOpenCategoryDialog(true)}
          >
            Manage Categories
          </ToolButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 5,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

          <Box>
            <SelectItem
              sx={{ width: "15vw" }}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <MenuItemStyled value="all">All Categories</MenuItemStyled>
              {listCategories.length > 0 &&
                listCategories.map((item, idx) => (
                  <MenuItemStyled key={idx} value={item.id}>
                    {item.name}
                  </MenuItemStyled>
                ))}
            </SelectItem>
          </Box>

          <Box>
            <SelectItem
              sx={{ width: "12vw" }}
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <MenuItemStyled value="all">All levels</MenuItemStyled>
              <MenuItemStyled value="Beginner">Beginner</MenuItemStyled>
              <MenuItemStyled value="Intermediate">Intermediate</MenuItemStyled>
              <MenuItemStyled value="Advanced">Advanced</MenuItemStyled>
            </SelectItem>
          </Box>
        </Box>

        <TextFieldItem
          value={keyword}
          onChange={handleSearch}
          placeholder="Search"
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 30, marginRight: 0.5 }} />
              </InputAdornment>
            ),
            endAdornment:
              keyword !== "" ? (
                <InputAdornment position="end">
                  <CancelIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setKeyword("");
                      if (page !== 1) setPage(1);
                    }}
                  />
                </InputAdornment>
              ) : null,
          }}
        />
      </Box>
      <Box>
        <Grid container spacing={5}>
          {data.length > 0 &&
            data.map((item, idx) => (
              <Grid
                item
                key={idx}
                xs={12}
                sm={6}
                md={4}
                sx={{ display: "flex" }}
              >
                <ExerciseItem key={idx}>
                  <Box
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        "& .title-video": {
                          color: "#6e34d5",
                        },
                        "& .des-video": {
                          color: "#6e34d5",
                        },
                        "& .view-icon": {
                          color: "rgba(256, 256, 256, 1)",
                        },
                      },
                    }}
                    onClick={() => handleOpenVideo(item)}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "30vh",
                        position: "relative",
                      }}
                    >
                      <ExerciseImage
                        src={item.thumbnail}
                        alt="thumbnail img video"
                      />
                      <YouTubeIcon
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: 80,
                          color: "rgba(256, 256, 256, 0.7)",
                          transition: "0.3s",
                        }}
                        className="view-icon"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        py: 1.5,
                        px: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 19,
                          lineHeight: 1.5,
                          fontFamily: "'Outfit Variable', sans-serif",
                          transition: "0.3s",
                        }}
                        className="title-video"
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 17,
                          lineHeight: 1.5,
                          fontFamily: "'Outfit Variable', sans-serif",
                          transition: "0.3s",
                        }}
                        className="des-video"
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      px: 2,
                      mb: 1.5,
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleClickEdit(item)}
                        sx={{ color: "#00b69b" }}
                      >
                        <EditIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleClickDelete(item)}
                        sx={{ color: "#ef3826" }}
                        title="Delete"
                      >
                        <DeleteIcon sx={{ fontSize: 30 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ExerciseItem>
              </Grid>
            ))}
        </Grid>
      </Box>

      {data.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            size="large"
            onChange={handlePageChange}
            sx={{
              "& .MuiPaginationItem-root": {
                fontFamily: "'Outfit Variable', sans-serif",
                color: "#221551",
                fontSize: 17,
                "&:hover": {
                  backgroundColor: "#d8c8f6",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "#6e38d5 !important",
                color: "white !important",
              },
            }}
          />
        </Box>
      )}

      <Dialog
        maxWidth="200vh"
        open={openVideoDialog}
        onClose={handleCloseVideo}
      >
        {selectedVideo !== null && (
          <iframe
            style={{ border: "none", backgroundColor: "transparent" }}
            width="1000"
            height="550"
            src={selectedVideo.youtubeUrl}
            title={selectedVideo.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </Dialog>

      <ConfirmDialog
        title="Delete Exercise Video"
        content="Are you sure you want to delete this exercise video? This action cannot be undone."
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
      />

      <VideoCategoryDialog
        data={listCategories}
        openDialog={openCategoryDialog}
        handleCloseDialog={handleCloseCategoryDialog}
        setOpenAlert={setOpenAlert}
        setTypeAlert={setTypeAlert}
        setContentAlert={setContentAlert}
        getListCategory={getListCategory}
        setSelectedCategory={setCategory}
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

export default ExerciseLibraryPage;
