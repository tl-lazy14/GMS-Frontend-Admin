import {
  Alert,
  Badge,
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill";
import "../components/Quill.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import api from "../components/axiosInterceptor";

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

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 18,
  fontWeight: 500,
  marginBottom: 8,
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

const EditResultPage = () => {
  useScrollToTop();
  const { id } = useParams();

  const navigate = useNavigate();
  const [data, setData] = useState({
    member: {},
    gym: {},
    trainer: {},
    ptPackage: {},
    startDate: null,
    expiredDate: null,
    numWeeks: 0,
    imageURL: "",
    description: "",
    preIssues: "",
    programDes: "",
    nutritionPlan: "",
    measurement: [],
    shareContent: "",
  });
  const [errors, setErrors] = useState({
    imageURL: "",
    preIssues: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const getData = async () => {
    try {
      const response = await axios.get(
        `https://eagle-fits.onrender.com/gms/api/v1/customer/get-training-result/${id}`
      );
      setData({
        member: response.data.memberService.member,
        gym: response.data.gym,
        trainer: response.data.memberService.coach,
        ptPackage: response.data.memberService.personalTrainerPackage,
        startDate: dayjs(response.data.memberService.startDate),
        expiredDate: dayjs(response.data.memberService.endDate),
        numWeeks: response.data.numWeeks,
        imageURL: response.data.imageUrl,
        description: response.data.description,
        preIssues: response.data.preIssues,
        programDes: response.data.programDescription,
        nutritionPlan: response.data.nutritionPlan,
        measurement: JSON.parse(response.data.measurement),
        shareContent: response.data.shareContent,
      });
      setDataLoaded(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    const onlySpaceRegex = /^\s*$/;
    const strippedContent = value.replace(/<[^>]*>/g, "");
    if (
      value.trim() === "" ||
      onlySpaceRegex.test(strippedContent) ||
      value === "<p><br></p>"
    ) {
      setData({ ...data, [name]: "" });
    } else {
      setData({ ...data, [name]: value });
    }

    if (name === "preIssues") {
      validateField(name, value);
    }
  };

  const validateField = (field, value) => {
    let error = "";
    const onlySpaceRegex = /^\s*$/;
    switch (field) {
      case "imageURL":
        if (!value.trim()) {
          error = "Workout result image is required.";
        }
        setErrors((prev) => ({ ...prev, imageURL: error }));
        break;

      case "preIssues":
        const strippedContent = value.replace(/<[^>]*>/g, "");
        if (
          value.trim() === "" ||
          onlySpaceRegex.test(strippedContent) ||
          value === "<p><br></p>"
        ) {
          error = "Previous issues are required.";
        }
        setErrors((prev) => ({ ...prev, preIssues: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setData({ ...data, imageURL: URL.createObjectURL(file) });
      validateField("imageURL", file.name);
    }
  };

  const handleAddMeasurement = () => {
    setData((prevFormData) => ({
      ...prevFormData,
      measurement: [
        ...prevFormData.measurement,
        { key: "", before: "", after: "", unit: "" },
      ],
    }));
  };

  const handleRemoveMeasurement = (index) => {
    setData((prevFormData) => ({
      ...prevFormData,
      measurement: prevFormData.measurement.filter((_, i) => i !== index),
    }));
  };

  const handleMeasurementChange = (index, field, value) => {
    const newMeasurements = [...data.measurement];
    newMeasurements[index][field] = value;
    setData({ ...data, measurement: newMeasurements });
  };

  // Alert
  const [contentAlert, setContentAlert] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleSubmit = async () => {
    const imageError = validateField("imageURL", data.imageURL);
    const preIssuesError = validateField("preIssues", data.preIssues);

    // Kiểm tra xem có lỗi nào không
    if (!imageError && !preIssuesError) {
      setIsButtonDisabled(true);
      let downloadURL;
      if (selectedImage) {
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      // Call API tao ket qua tap luyen
      const cleanedMeasurement = data.measurement.filter(
        (measure) =>
          !(
            measure.key === "" &&
            measure.before === "" &&
            measure.after === "" &&
            measure.unit === ""
          )
      );
      const measurementString = JSON.stringify(cleanedMeasurement);
      
      try {
        // eslint-disable-next-line no-unused-vars
        await api.put(`/customer/edit-workout-result/${id}`, {
          numWeeks: data.numWeeks,
          imageUrl: selectedImage ? downloadURL : data.imageURL,
          preIssues: data.preIssues,
          shareContent: data.shareContent,
          description: data.description,
          measurement: measurementString,
          programDescription: data.programDes,
          nutritionPlan: data.nutritionPlan
        });
        setContentAlert("Workout result updated successfully!");
        setOpenAlert(true);
        setTimeout(() => {
          navigate(`/training-results/detail/${id}`);
        }, 2000);
      } catch (err) {
        console.log(err);
      }
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
      <Typography
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          color: "#343c6a",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        Edit Workout Result
      </Typography>

      {dataLoaded && (
        <Box sx={{ display: "flex", width: "100%", gap: 5, my: 5 }}>
          <Box
            sx={{
              display: "flex",
              gap: 10,
              boxSizing: "border-box",
            }}
          >
            <Box>
              <Badge
                overlap="rectangular"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    onClick={() => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = "image/*";
                      fileInput.onchange = handleImageChange;
                      fileInput.click();
                    }}
                    sx={{
                      backgroundColor: "#6e34d5 !important",
                      color: "white !important",
                      p: 0.75,
                    }}
                  >
                    <EditIcon sx={{ fontSize: 23 }} />
                  </IconButton>
                }
              >
                <img
                  src={data.imageURL}
                  alt="transform img"
                  style={{
                    width: "23vw",
                    borderRadius: 16,
                    objectFit: "cover",
                  }}
                />
              </Badge>
            </Box>

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
                  {data.member.code} - {data.member.name} (Age:{" "}
                  {dayjs().diff(dayjs(data.member.dob), "year")})
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>Gym:</TitleFieldRow>
                <TextStyled>{data.gym.name}</TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>Trainer:</TitleFieldRow>
                <TextStyled>
                  {data.trainer.code} - {data.trainer.name}
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>PT package:</TitleFieldRow>
                <TextStyled>
                  {data.ptPackage.name} ({data.ptPackage.numSessions} sessions/
                  {data.ptPackage.duration} months)
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>Service period:</TitleFieldRow>
                <TextStyled>
                  {dayjs(data.startDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(data.expiredDate).format("DD/MM/YYYY")}
                </TextStyled>
              </FieldContainer>
            </Box>
          </Box>
        </Box>
      )}

      {dataLoaded && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <TitleField>Description:</TitleField>
            <TextFieldItem
              name="description"
              multiline
              minRows={4}
              value={data.description}
              onChange={handleTextChange}
              placeholder="Enter description"
            />
          </Box>

          <Box>
            <TitleField>Previous issues *:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={data.preIssues}
                name="content"
                theme="snow"
                onChange={(value) => handleEditorChange("preIssues", value)}
                modules={{
                  toolbar: {
                    container: [
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                    ],
                  },
                }}
              />
            </Box>
            <TextStyled sx={{ color: "#ea2c3e" }}>
              {errors.preIssues}
            </TextStyled>
          </Box>

          <Box>
            <TitleField>Training program:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={data.programDes}
                name="content"
                theme="snow"
                onChange={(value) => handleEditorChange("programDes", value)}
                modules={{
                  toolbar: {
                    container: [
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                    ],
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <TitleField>Nutrition plan:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={data.nutritionPlan}
                name="content"
                theme="snow"
                onChange={(value) => handleEditorChange("nutritionPlan", value)}
                modules={{
                  toolbar: {
                    container: [
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        { indent: "-1" },
                        { indent: "+1" },
                      ],
                    ],
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <TitleField>Workout results before & after:</TitleField>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TitleField
                sx={{ flex: 1, textAlign: "center", color: "#6e34d5" }}
              >
                Metric
              </TitleField>
              <TitleField
                sx={{ flex: 1, textAlign: "center", color: "#6e34d5" }}
              >
                Before
              </TitleField>
              <TitleField
                sx={{ flex: 1, textAlign: "center", color: "#6e34d5" }}
              >
                After
              </TitleField>
              <TitleField
                sx={{ flex: 1, textAlign: "center", color: "#6e34d5" }}
              >
                Unit
              </TitleField>
              <Box sx={{ width: "40px" }}></Box>
            </Box>
            {data.measurement.map((measure, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, my: 2, alignItems: "center" }}
              >
                <TextFieldItem
                  value={measure.key}
                  onChange={(e) =>
                    handleMeasurementChange(index, "key", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="Metric"
                />
                <TextFieldItem
                  value={measure.before}
                  onChange={(e) =>
                    handleMeasurementChange(index, "before", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="Before"
                />
                <TextFieldItem
                  value={measure.after}
                  onChange={(e) =>
                    handleMeasurementChange(index, "after", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="After"
                />
                <TextFieldItem
                  value={measure.unit}
                  onChange={(e) =>
                    handleMeasurementChange(index, "unit", e.target.value)
                  }
                  autoComplete="off"
                  placeholder="Unit"
                />
                <IconButton
                  onClick={() => handleRemoveMeasurement(index)}
                  sx={{
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 0, 0, 0.2)",
                    },
                  }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <ToolButton
                sx={{ px: 3 }}
                startIcon={<AddIcon />}
                onClick={handleAddMeasurement}
              >
                Add metric
              </ToolButton>
            </Box>
          </Box>

          <Box>
            <TitleField>Member's sharing content:</TitleField>
            <TextFieldItem
              name="shareContent"
              minRows={4}
              multiline
              value={data.shareContent}
              onChange={handleTextChange}
              placeholder="Enter member's sharing content"
            />
          </Box>
        </Box>
      )}

      {dataLoaded && (
        <Box
          sx={{
            display: "flex",
            mt: 5,
            mb: 3,
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "white",
              border: "1px solid #aaa",
              color: "#221515",
              textTransform: "none",
              width: "10vw",
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#eee",
              },
            }}
            disabled={isButtonDisabled}
            onClick={() => navigate(`/training-results/detail/${id}`)}
          >
            Cancel
          </Button>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "10vw",
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      )}

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

export default EditResultPage;
