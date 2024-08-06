import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Pagination,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/userContext";
import axios from "axios";

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

const FilterSection = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
}));

const Title = styled(Typography)(() => ({
  fontSize: 18,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
}));

const OptionFilterButton = styled(Button)(() => ({
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#221551",
  border: "2px solid #6e38d5",
  textTransform: "none",
  fontSize: 16,
  flexGrow: 1,
  transition: "0.3s",
  "&:hover": {
    backgroundColor: "#221551",
    color: "white",
    border: "2px solid #221551",
  },
}));

const PrettoSlider = styled(Slider)({
  color: "#6e38d5",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  marginTop: 10,
});

const TransItem = styled(Box)(() => ({
  backgroundColor: "white",
  border: "1px solid #ccc",
}));

const TransImage = styled("img")(() => ({
  width: "100%",
  height: "50vh",
  borderRadius: 5,
  cursor: "pointer",
  transition: "0.3s",
  objectFit: "cover",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const optionFilterGender = ["All", "Male", "Female"];
const optionFilterAge = ["All", "18+", "30+", "40+"];

const ResultsPage = () => {
  useScrollToTop();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [gender, setGender] = useState("All");
  const [age, setAge] = useState("All");
  const [numWeeks, setNumWeeks] = useState([0, 50]);
  const [initialNumWeeks, setInitialNumWeeks] = useState([0, 50]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getListResults = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2002/gms/api/v1/customer/get-list-result`,
        {
          params: {
            gymId: user.role === "GYM_MANAGER" ? user.gym.id : "all",
            gender: gender,
            age: age !== 'All' ? parseInt(age.split("+")[0], 10) : 0,
            minNumWeeks: numWeeks[0],
            maxNumWeeks: numWeeks[1],
            keyword: keyword,
            page: page,
          },
        }
      );
      setData(response.data.listItem);
      setTotalPages(Math.floor(response.data.numItem / 9) + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListResults();
  }, [gender, age, numWeeks, keyword, page]);

  const handlePageChange = (event, page) => {
    setPage(page);
    const targetElement = document.getElementById("main-section");
    targetElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleSearch = (event) => {
    setKeyword(event.target.value);
    setPage(1);
  };

  const handleChangeSlider = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setNumWeeks([Math.min(newValue[0], numWeeks[1] - 5), numWeeks[1]]);
    } else {
      setNumWeeks([numWeeks[0], Math.max(newValue[1], numWeeks[0] + 5)]);
    }
  };

  const handleSliderRelease = () => {
    if (
      numWeeks[0] !== initialNumWeeks[0] ||
      numWeeks[1] !== initialNumWeeks[1]
    ) {
      setTimeout(() => {
        setPage(1);
        setInitialNumWeeks([...numWeeks]);
      }, 1000);
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
          Workout Results
        </Typography>

        <TextFieldItem
          value={keyword}
          onChange={handleSearch}
          placeholder="Search by member code or name"
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

      <FilterSection sx={{ my: 4 }}>
        <Box>
          <Title>Gender</Title>
          <Box sx={{ display: "flex", gap: 1.5, py: 1.5 }}>
            {optionFilterGender.map((item, idx) => (
              <OptionFilterButton
                key={idx}
                onClick={() => {
                  if (gender !== item) {
                    setGender(item);
                    setPage(1);
                  }
                }}
                sx={{
                  backgroundColor:
                    gender === item ? "#6e38d5 !important" : "white",
                  border:
                    gender === item
                      ? "2px solid #6e38d5 !important"
                      : "2px solid #221551",
                  color: gender === item ? "white" : "#221551",
                }}
              >
                {item}
              </OptionFilterButton>
            ))}
          </Box>
        </Box>
        <Box>
          <Title>Age</Title>
          <Box sx={{ display: "flex", gap: 1.5, py: 1.5 }}>
            {optionFilterAge.map((item, idx) => (
              <OptionFilterButton
                key={idx}
                onClick={() => {
                  if (age !== item) {
                    setAge(item);
                    setPage(1);
                  }
                }}
                sx={{
                  backgroundColor:
                    age === item ? "#6e38d5 !important" : "white",
                  border:
                    age === item
                      ? "2px solid #6e38d5 !important"
                      : "2px solid #221551",
                  color: age === item ? "white" : "#221551",
                }}
              >
                {item}
              </OptionFilterButton>
            ))}
          </Box>
        </Box>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Title>Workout Time: </Title>
            <Typography
              sx={{
                fontFamily: "'Outfit Variable', sans-serif",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 18,
                  backgroundColor: "#6e38d5",
                  color: "white",
                  borderRadius: "50%",
                  width: 35,
                  height: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {numWeeks[0]}
              </Typography>{" "}
              -{" "}
              <Typography
                sx={{
                  fontFamily: "'Outfit Variable', sans-serif",
                  fontSize: 18,
                  backgroundColor: "#6e38d5",
                  color: "white",
                  borderRadius: "50%",
                  width: 35,
                  height: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {numWeeks[1]}
              </Typography>{" "}
              Weeks
            </Typography>
          </Box>
          <Box>
            <PrettoSlider
              value={numWeeks}
              valueLabelDisplay="off"
              aria-label="pretto slider"
              onChange={handleChangeSlider}
              onChangeCommitted={handleSliderRelease}
              disableSwap
              max={50}
            />
          </Box>
        </Box>
      </FilterSection>

      <Box sx={{ my: 5 }}>
        <Grid container spacing={10}>
          {data.map((item, idx) => (
            <Grid item key={idx} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <TransItem sx={{ borderRadius: 5, flexGrow: 1 }} key={idx}>
                <Box
                  sx={{
                    width: "100%",
                    height: "50vh",
                    overflow: "hidden",
                    borderRadius: "19px 19px 0 0",
                  }}
                >
                  <TransImage
                    src={item.imageUrl}
                    alt="trans img"
                    onClick={() =>
                      navigate(`/training-results/detail/${item.id}`)
                    }
                  />
                </Box>
                <Box sx={{ pt: 1, pb: 2 }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      color: "#221551",
                      fontWeight: 500,
                      fontFamily: "'Outfit Variable', sans-serif",
                      fontSize: 20,
                      py: 1,
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    className="trans-name"
                    onClick={() =>
                      navigate(`/training-results/detail/${item.id}`)
                    }
                  >
                    {item.memberService.member.code} -{" "}
                    {item.memberService.member.name}
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
                    {item.numWeeks} Weeks
                  </Typography>
                </Box>
              </TransItem>
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

export default ResultsPage;
