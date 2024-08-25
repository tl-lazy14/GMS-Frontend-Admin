import {
  Alert,
  Box,
  Button,
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
import { getFirstParagraph } from "../utils/formatString";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
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

const BlogItem = styled(Box)(() => ({
  border: "1px solid #ccc",
  backgroundColor: "white",
  borderRadius: 20,
}));

const BlogImage = styled("img")(() => ({
  width: "100%",
  height: "35vh",
  objectFit: "cover",
  borderRadius: "20px 20px 0 0",
  cursor: "pointer",
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

const StatusButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  textAlign: "center",
  borderRadius: 8,
}));

const listCategories = [
  "News & Events",
  "Workout Knowledge",
  "Exercises",
  "Nutrition",
  "Health Guides",
  "Workout Stories",
];

const ArticlesPage = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState({});

  const getListArticles = async () => {
    try {
      const response = await axios.get(`https://eagle-fits.onrender.com/gms/api/v1/article/get-list-article`, {
        params: {
          category: category,
          status: status,
          keyword: keyword,
          page: page,
        },
      });
      setData(response.data.listArticles);
      setTotalPages(Math.floor(response.data.numArticles / 9) + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListArticles();
  }, [category, status, keyword, page]);

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
    navigate(`/articles/edit/${item.id}`);
  };

  const handleClickDelete = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [contentAlert, setContentAlert] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleConfirmDelete = async () => {
    // Xu ly xoa bai viet
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.delete(
        `/article/delete-article/${selectedItem.id}`
      );
      setOpenDialog(false);
      setContentAlert("Article deleted successfully!");
      setOpenAlert(true);
      getListArticles();
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
          Articles List
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={() => navigate("/articles/create")}
          >
            Create
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
              {listCategories.map((item, idx) => (
                <MenuItemStyled key={idx} value={item}>
                  {item}
                </MenuItemStyled>
              ))}
            </SelectItem>
          </Box>

          <Box>
            <SelectItem
              sx={{ width: "12vw" }}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <MenuItemStyled value="all">All Status</MenuItemStyled>
              <MenuItemStyled value="Published">Published</MenuItemStyled>
              <MenuItemStyled value="Unpublished">Unpublished</MenuItemStyled>
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
                <BlogItem item={item} sx={{ flexGrow: 1 }}>
                  <BlogImage
                    src={item.thumbnail}
                    alt="featured img blog"
                    onClick={() => navigate(`/articles/detail/${item.id}`)}
                  />
                  <Box sx={{ px: 3, py: 2 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 18,
                        lineHeight: 1.5,
                        fontFamily: "'Outfit Variable', sans-serif",
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": {
                          color: "#6e38d5",
                        },
                      }}
                      onClick={() => navigate(`/articles/detail/${item.id}`)}
                    >
                      {item.title}
                    </Typography>

                    <Box
                      sx={{
                        fontSize: 16,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        fontFamily: "'Outfit Variable', sans-serif",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: getFirstParagraph(item.content),
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        my: 3,
                      }}
                    >
                      <StatusButton
                        sx={{
                          px: 2,
                          ...(item.isPublish === 1 && {
                            color: "rgb(0, 182, 155) !important",
                            backgroundColor:
                              "rgba(0, 182, 155, 0.2) !important",
                            border: "1px solid rgb(0, 182, 155) !important",
                          }),
                          ...(item.isPublish === 0 && {
                            color: "rgb(239, 56, 38) !important",
                            backgroundColor:
                              "rgba(239, 56, 38, 0.2) !important",
                            border: "1px solid rgb(239, 56, 38) !important",
                          }),
                        }}
                      >
                        {item.isPublish === 1 ? "Published" : "Unpublished"}
                      </StatusButton>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
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
                    </Box>
                  </Box>
                </BlogItem>
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
      <ConfirmDialog
        title="Delete Article"
        content="Are you sure you want to delete this article? This action cannot be undone."
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleConfirm={handleConfirmDelete}
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
          severity="success"
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

export default ArticlesPage;
