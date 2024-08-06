import {
  Box,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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

const StatusButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  textAlign: "center",
  borderRadius: 8,
}));

const CoachItem = styled(Box)(() => ({
  backgroundColor: "white",
  border: "1px solid #ccc",
}));

const CoachImage = styled("img")(() => ({
  width: "100%",
  height: "55vh",
  borderRadius: 5,
  cursor: "pointer",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.1)",
  },
  objectFit: "cover",
}));

const CoachesPage = () => {
  useScrollToTop();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [listGyms, setListGyms] = useState([]);
  const [gym, setGym] = useState(
    user.role === "GYM_MANAGER" ? user?.gym?.id : "all"
  );
  const [status, setStatus] = useState("all");
  const [level, setLevel] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    getListGyms();
  }, []);

  const getListCoach = async () => {
    try {
      const response = await axios.get("http://localhost:2002/gms/api/v1/coach/get-list-coach", {
        params: {
          level: level,
          status: status,
          gym: gym,
          keyword: keyword,
          page: page,
        },
      });
      setData(response.data.listItem);
      setTotalPages(Math.floor(response.data.numItem / 9) + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListCoach();
  }, [level, status, gym, keyword, page]);

  const handlePageChange = (event, page) => {
    setPage(page);
    const targetElement = document.getElementById("main-section");
    targetElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
    setPage(1);
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
          Coaches List
        </Typography>
        <TextFieldItem
          value={keyword}
          onChange={handleSearch}
          placeholder="Search by coach code or name"
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
              sx={{ width: "12vw" }}
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <MenuItemStyled value="all">All levels</MenuItemStyled>
              <MenuItemStyled value="Senior Coach">Senior Coach</MenuItemStyled>
              <MenuItemStyled value="Junior Coach">Junior Coach</MenuItemStyled>
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
              <MenuItemStyled value="all">All status</MenuItemStyled>
              <MenuItemStyled value="Active">Active</MenuItemStyled>
              <MenuItemStyled value="Inactive">Inactive</MenuItemStyled>
            </SelectItem>
          </Box>

          {user.role === "SENIOR_ADMIN" && (
            <Box>
              <SelectItem
                sx={{ width: "25vw" }}
                value={gym}
                onChange={(e) => {
                  setGym(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItemStyled value="all">All Gyms</MenuItemStyled>
                {listGyms.map((item, idx) => (
                  <MenuItemStyled key={idx} value={item.id}>
                    {item.name}
                  </MenuItemStyled>
                ))}
              </SelectItem>
            </Box>
          )}
        </Box>

        <ToolButton
          sx={{ px: 3 }}
          startIcon={<AddIcon />}
          onClick={() => navigate("/coaches/add")}
        >
          Add new coach
        </ToolButton>
      </Box>

      <Box>
        <Grid container spacing={10}>
          {data.map((item, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <CoachItem sx={{ borderRadius: 5, flexGrow: 1 }} key={idx}>
                <Box
                  sx={{
                    width: "100%",
                    height: "55vh",
                    overflow: "hidden",
                    borderRadius: "19px 19px 0 0",
                  }}
                >
                  <CoachImage
                    src={item.imageUrl}
                    alt="coach img"
                    onClick={() => navigate(`/coaches/detail/${item.id}`)}
                  />
                </Box>
                <Box
                  sx={{
                    pt: 1.5,
                    pb: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#221551",
                      fontWeight: 500,
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 20,
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    className="coach-name"
                    onClick={() => navigate(`/coaches/detail/${item.id}`)}
                  >
                    {item.code} - {item.name}
                  </Typography>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#6e34d5",
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 19,
                      fontWeight: 500,
                    }}
                  >
                    {item.level}
                  </Typography>
                  <StatusButton
                    sx={{
                      alignSelf: "center",
                      px: 3,
                      ...(item.status === "Active" && {
                        color: "rgb(0, 182, 155) !important",
                        backgroundColor: "rgba(0, 182, 155, 0.2) !important",
                        border: "1px solid rgb(0, 182, 155) !important",
                      }),
                      ...(item.status === "Inactive" && {
                        color: "rgb(239, 56, 38) !important",
                        backgroundColor: "rgba(239, 56, 38, 0.2) !important",
                        border: "1px solid rgb(239, 56, 38) !important",
                      }),
                    }}
                  >
                    {item.status}
                  </StatusButton>
                </Box>
              </CoachItem>
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
    </Box>
  );
};

export default CoachesPage;
