import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatOperatingHours, formatPhone } from "../utils/formatString";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DetailGymDialog from "../components/Dialog/DetailGymDialog";
import api from "../components/axiosInterceptor";

const GymItem = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 50,
  width: "100%",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: 20,
  boxSizing: "border-box",
  backgroundColor: "white",
}));

const NameText = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontWeight: 700,
  textTransform: "uppercase",
  fontSize: 38,
  lineHeight: 1.3,
  wordSpacing: 5,
  marginBottom: 20,
}));

const Text = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  lineHeight: 1.5,
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

const GymsPage = () => {
  useScrollToTop();

  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [selectedItem, setSelectedItem] = useState({});

  const getListGym = async () => {
    try {
      const response = await api.get("/gym/get-list-gym");
      const gyms = response.data.map(gym => {
        return {
          ...gym,
          operatingTime: JSON.parse(gym.operatingTime),
          listImage: JSON.parse(gym.listImage),
          amenity: JSON.parse(gym.amenity),
        };
      });
      setData(gyms);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListGym();
  }, [])

  const handleClickSeeMore = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
          Gym List
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<AddIcon />}
            onClick={() => navigate("/gyms/create")}
          >
            Create
          </ToolButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          my: 5,
        }}
      >
        {data?.map((item, idx) => {
          const groupedHours = formatOperatingHours(item.operatingTime);
          const hoursLines = groupedHours.split("\n");
          return (
            <GymItem sx={{ p: 5 }} key={idx}>
              <Box>
                <NameText>{item.name}</NameText>
                <Text sx={{ marginBottom: 1.5 }}>{item.description}</Text>
                <Text sx={{ marginBottom: 0.5 }}>Address: {item.address}</Text>
                <Text sx={{ marginBottom: 1.5 }}>
                  Contact: {formatPhone(item.phone)}
                </Text>
                <Text sx={{ marginBottom: 0.3 }}>Operating hours:</Text>
                <Box>
                  {hoursLines.map((group, index) => (
                    <Text key={index}>{group}</Text>
                  ))}
                </Box>
                <Box
                  sx={{ display: "flex", gap: 2, alignItems: "center", mt: 2 }}
                >
                  <Text>Status:</Text>
                  <StatusButton
                    sx={{
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
                <Box sx={{ display: "flex", gap: 2, my: 3 }}>
                  <ToolButton
                    onClick={() => handleClickSeeMore(item)}
                    sx={{ px: 3 }}
                    startIcon={<VisibilityIcon />}
                  >
                    See more
                  </ToolButton>
                  <ToolButton
                    onClick={() => navigate(`/gyms/edit/${item.id}`)}
                    sx={{ px: 3 }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </ToolButton>
                </Box>
              </Box>
              <img
                style={{
                  width: "30vw",
                  height: "40vh",
                  objectFit: "cover",
                  borderRadius: 20,
                }}
                src={item.thumbnail}
                alt="gym featured img"
              />
            </GymItem>
          );
        })}
      </Box>

      <DetailGymDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        item={selectedItem}
      />
    </Box>
  );
};

export default GymsPage;
