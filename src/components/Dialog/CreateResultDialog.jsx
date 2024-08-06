import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import dayjs from "dayjs";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../Quill.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../axiosInterceptor";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  width: "50vw",
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

const CreateResultDialog = ({
  openDialog,
  handleCloseDialog,
  memInfo,
  ptServiceItem,
  setOpenAlert,
  getPTService
}) => {
  
  const [formData, setFormData] = useState({
    imageURL: "",
    description: "",
    preIssues: "",
    programDes: "",
    nutritionPlan: "",
    measurement: [{ key: "", before: "", after: "", unit: "" }],
    shareContent: "",
  });
  const [errors, setErrors] = useState({
    imageURL: "",
    preIssues: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    const onlySpaceRegex = /^\s*$/;
    const strippedContent = value.replace(/<[^>]*>/g, "");
    if (
      value.trim() === "" ||
      onlySpaceRegex.test(strippedContent) ||
      value === "<p><br></p>"
    ) {
      setFormData({ ...formData, [name]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      imageURL: "",
      description: "",
      preIssues: "",
      programDes: "",
      nutritionPlan: "",
      measurement: [{ key: "", before: "", after: "", unit: "" }],
      shareContent: "",
    });
    setErrors({
      imageURL: "",
      preIssues: "",
    });
    setSelectedImage(null);
    setIsButtonDisabled(false);
  };

  const calculateNumWeeks = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return end.diff(start, "week") + 1;
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, imageURL: file.name });
      validateField("imageURL", file.name);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setFormData({ ...formData, imageURL: "" });
  };

  const handleAddMeasurement = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      measurement: [
        ...prevFormData.measurement,
        { key: "", before: "", after: "", unit: "" },
      ],
    }));
  };

  const handleRemoveMeasurement = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      measurement: prevFormData.measurement.filter((_, i) => i !== index),
    }));
  };

  const handleMeasurementChange = (index, field, value) => {
    const newMeasurements = [...formData.measurement];
    newMeasurements[index][field] = value;
    setFormData({ ...formData, measurement: newMeasurements });
  };

  const handleSubmit = async () => {
    const imageError = validateField("imageURL", formData.imageURL);
    const preIssuesError = validateField("preIssues", formData.preIssues);

    // Kiểm tra xem có lỗi nào không
    if (!imageError && !preIssuesError) {
      if (selectedImage) {
        setIsButtonDisabled(true);
        try {
          const storageRef = ref(storage, `images/${selectedImage.name}`);
          const snapshot = await uploadBytes(storageRef, selectedImage);
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Call API tao ket qua tap luyen
          const cleanedMeasurement = formData.measurement.filter(
            (measure) =>
              !(measure.key === "" && measure.before === "" && measure.after === "" && measure.unit === "")
          );
          const measurementString = JSON.stringify(cleanedMeasurement);
          try {
            await api.post(`/customer/add-workout-result/${ptServiceItem.id}`, {
              numWeeks: calculateNumWeeks(ptServiceItem?.startDate, ptServiceItem?.expiredDate),
              imageUrl: downloadURL,
              preIssues: formData.preIssues,
              shareContent: formData.shareContent,
              description: formData.description,
              measurement: measurementString,
              programDescription: formData.programDes,
              nutritionPlan: formData.nutritionPlan
            });
            closeDialog();
            setOpenAlert(true);
            getPTService();
          } catch (err) {
            console.log(err);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
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
        Create Workout Results
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={closeDialog}
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 10,
              boxSizing: "border-box",
              overflowX: "hidden",
            }}
          >
            {selectedImage ? (
              <Box sx={{ position: "relative" }}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="workout result img"
                  style={{
                    width: "20vw",
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  boxSizing: "border-box",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20vw",
                  minHeight: "40vh",
                  border: `2px dashed #ccc`,
                  borderRadius: 2,
                  cursor: "pointer",
                  backgroundColor: "#f5f7f9",
                  gap: 2,
                  "&:hover": {
                    border: `2px dashed #6e34d5`,
                  },
                }}
                onClick={() =>
                  document.getElementById("image-upload-input").click()
                }
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "grey" }} />
                <TextStyled sx={{ color: "grey" }}>
                  Upload Workout Result Image
                </TextStyled>
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "20vw",
                boxSizing: "border-box",
              }}
            >
              <FieldContainer>
                <TitleFieldRow>Member:</TitleFieldRow>
                <TextStyled>
                  {memInfo.code} - {memInfo.name}
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>Trainer:</TitleFieldRow>
                <TextStyled>
                  {ptServiceItem.trainer?.code} - {ptServiceItem.trainer?.name}
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>PT package:</TitleFieldRow>
                <TextStyled>
                  {ptServiceItem.service?.name} ({ptServiceItem.service?.numSessions} sessions/
                  {ptServiceItem.service?.duration} months)
                </TextStyled>
              </FieldContainer>
              <FieldContainer>
                <TitleFieldRow>Service period:</TitleFieldRow>
                <TextStyled>
                  {dayjs(ptServiceItem.startDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(ptServiceItem.expiredDate).format("DD/MM/YYYY")} (
                  {calculateNumWeeks(ptServiceItem?.startDate, ptServiceItem?.expiredDate)} weeks)
                </TextStyled>
              </FieldContainer>
              <TextStyled sx={{ color: "#ea2c3e" }}>
                {errors.imageURL}
              </TextStyled>
            </Box>
          </Box>

          <Box>
            <TitleField>Description:</TitleField>
            <TextFieldItem
              name="description"
              multiline
              minRows={4}
              value={formData.description}
              onChange={handleTextChange}
              placeholder="Enter description"
            />
          </Box>

          <Box>
            <TitleField>Previous issues *:</TitleField>
            <Box sx={{ border: "1px solid #ccc" }}>
              <ReactQuill
                className="quill"
                value={formData.preIssues}
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
                value={formData.programDes}
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
                value={formData.nutritionPlan}
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
            {formData.measurement.map((measure, index) => (
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
              value={formData.shareContent}
              onChange={handleTextChange}
              placeholder="Enter member's sharing content"
            />
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
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            Save
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResultDialog;
