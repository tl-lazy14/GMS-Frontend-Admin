import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import WestIcon from "@mui/icons-material/West";
import dayjs from "dayjs";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import EastIcon from "@mui/icons-material/East";
import QuillContent from "../components/QuillContent";
import axios from "axios";

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

const TransImage = styled("img")(() => ({
  width: "23vw",
  borderRadius: 16,
  objectFit: "cover",
}));

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 15,
}));

const TitleFieldRow = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
}));

const Text = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 19,
  marginTop: 20,
  marginBottom: 20,
  color: "#111",
}));

const TitleSection = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 23,
  fontWeight: 600,
  marginTop: 25,
  marginBottom: 20,
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  backgroundColor: "white",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e38d5",
    color: "white",
    fontSize: 18,
  },
}));

const ResultDetailsPage = () => {
  useScrollToTop();
  const { id } = useParams();

  const navigate = useNavigate();
  const [data, setData] = useState({});

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2002/gms/api/v1/customer/get-training-result/${id}`
      );
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
          Workout Result Details
        </Typography>
        <Box display="flex" gap={2}>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<WestIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </ToolButton>
          <ToolButton
            sx={{ px: 3 }}
            startIcon={<EditIcon />}
            onClick={() => navigate(`/training-results/edit/${id}`)}
          >
            Edit
          </ToolButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", width: "100%", gap: 5, my: 5 }}>
        <Box>
          <TransImage src={data.imageUrl} alt="trans img" />
          <Typography
            sx={{
              textAlign: "center",
              color: "#221551",
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 20,
              fontWeight: 500,
              my: 1,
            }}
          >
            {data.numWeeks} Weeks
          </Typography>
        </Box>

        <Box
          sx={{ width: "100%", fontFamily: "'Outfit Variable', sans-serif" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              boxSizing: "border-box",
            }}
          >
            <FieldContainer>
              <TitleFieldRow>Member:</TitleFieldRow>
              <TextStyled>
                {data.memberService?.member?.code} - {data.memberService?.member?.name} (Age:{" "}
                {dayjs().diff(dayjs(data.memberService?.member?.dob), "year")})
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Gym:</TitleFieldRow>
              <TextStyled>{data.gym?.name}</TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Trainer:</TitleFieldRow>
              <TextStyled>
                {data.memberService?.coach?.code} - {data.memberService?.coach?.name}
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>PT package:</TitleFieldRow>
              <TextStyled>
                {data.memberService?.personalTrainerPackage?.name} ({data.memberService?.personalTrainerPackage?.numSessions} sessions/
                {data.memberService?.personalTrainerPackage?.duration} months)
              </TextStyled>
            </FieldContainer>
            <FieldContainer>
              <TitleFieldRow>Service period:</TitleFieldRow>
              <TextStyled>
                {dayjs(data.memberService?.startDate).format("DD/MM/YYYY")} -{" "}
                {dayjs(data.memberService?.endDate).format("DD/MM/YYYY")}
              </TextStyled>
            </FieldContainer>
          </Box>
          <Text>"{data.shareContent}"</Text>
          <Text>{data.description}</Text>
          <Box>
            <TitleSection>Workout results:</TitleSection>
            <TableContainer>
              <Table sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Before</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>After</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.measurement && JSON.parse(data?.measurement).map((item, index) => (
                    <TableRow key={index}>
                      <StyledTableCell
                        sx={{ textTransform: "capitalize", fontWeight: 500 }}
                      >
                        {item.key}
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.before} {item.unit}
                      </StyledTableCell>
                      <StyledTableCell>
                        <EastIcon
                          sx={{ fontSize: 23, verticalAlign: "middle" }}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {item.after} {item.unit}
                      </StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box>
            <TitleSection>Issues before workout:</TitleSection>
            <QuillContent content={data.preIssues} />
          </Box>
          <Box>
            <TitleSection>Training program:</TitleSection>
            <QuillContent content={data.programDescription} />
          </Box>
          <Box>
            <TitleSection>Nutrition plan:</TitleSection>
            <QuillContent content={data.nutritionPlan} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ResultDetailsPage;
