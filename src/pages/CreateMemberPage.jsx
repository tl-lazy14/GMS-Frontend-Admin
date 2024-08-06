import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ConfirmDialog from "../components/Dialog/ConfirmDialog";
import axios from "axios";

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
  color: "#343c6a",
}));

const TitleContainer = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 23,
  fontWeight: 600,
  color: "#343c6a",
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

const SelectItem = styled(Select)(() => ({
  width: "100%",
  "& .MuiSelect-select": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 18,
    backgroundColor: "white",
    color: "#343c6a",
    borderRadius: 16,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
    borderRadius: 16,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #d0d7de",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #6e34d5",
  },
}));

const MenuItemStyled = styled(MenuItem)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const ErrorText = styled(Typography)(() => ({
  fontSize: "17px",
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
  paddingLeft: 14,
}));

const StyledRadioBtn = styled(FormControlLabel)(() => ({
  "& .MuiFormControlLabel-label": {
    fontFamily: "'Outfit Variable', sans-serif",
    fontSize: 19,
    color: "#221551",
    fontWeight: 400,
  },
  "& .MuiRadio-root.Mui-checked": {
    color: "#221551",
  },
}));

const CreateMemberPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const { id } = useParams();

  const [listPackages, setListPackages] = useState([]);

  // Lay thong tin gym tu gymId, set vao day
  const [gym, setGym] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Male",
    dob: null,
    durationService: 1,
    membership: "not-select",
    startDate: dayjs(),
    endDate: dayjs().add(1, "month"),
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    membership: "",
    durationService: "",
  });

  const getGym = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2002/gms/api/v1/gym/get-gym/${id}`
      );
      setGym(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getListMembershipPackage = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/service/get-active-membership-package"
      );
      setListPackages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getGym();
    getListMembershipPackage();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (
      name === "durationService" &&
      value !== "" &&
      (!/^\d+$/.test(value) ||
        parseInt(value, 10) < 1 ||
        parseInt(value, 10) > 60)
    ) {
      return;
    }

    setFormData({ ...formData, [name]: value });

    if (name === "durationService") {
      setFormData((prevData) => ({
        ...prevData,
        endDate: prevData.startDate.add(value, "month"),
      }));
    }

    validateField(name, value);
  };

  const handleDateChange = (name, newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: newDate,
      endDate:
        name === "startDate"
          ? newDate.add(prevData.durationService, "month")
          : prevData.endDate,
    }));

    if (name === "dob") {
      validateField("dob", newDate);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "-" || event.key === ".") {
      event.preventDefault();
    }
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required.";
        } else if (
          // eslint-disable-next-line no-useless-escape
          !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
        ) {
          error = "Email is not valid.";
        }
        setErrors((prev) => ({ ...prev, email: error }));
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required.";
        } else if (!/^0\d{9,}$/.test(value)) {
          error = "Phone number must start with 0 and have at least 10 digits.";
        }
        setErrors((prev) => ({ ...prev, phone: error }));
        break;

      case "dob":
        if (!value) {
          error = "Date of birth is required.";
        }
        setErrors((prev) => ({ ...prev, dob: error }));
        break;

      case "membership":
        if (value === "not-select") {
          error = "Please select a membership package.";
        }
        setErrors((prev) => ({ ...prev, membership: error }));
        break;

      case "durationService":
        if (!value) {
          error = "Service duration is required.";
        }
        setErrors((prev) => ({ ...prev, durationService: error }));
        break;

      default:
        break;
    }

    return error;
  };

  // Alert
  const [openAlert, setOpenAlert] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleSubmit = () => {
    const nameError = validateField("name", formData.name);
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    const dobError = validateField("dob", formData.dob);
    const membershipError = validateField("membership", formData.membership);
    const durationServiceError = validateField(
      "durationService",
      formData.durationService
    );

    // Kiểm tra xem có lỗi nào không
    if (
      !nameError &&
      !phoneError &&
      !emailError &&
      !dobError &&
      !membershipError &&
      !durationServiceError
    ) {
      setOpenDialog(true);
    }
  };

  // Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    // Xu ly tao hoi vien moi
    try {
      setOpenDialog(false);
      setIsButtonDisabled(true);
      await axios.post("http://localhost:2002/gms/api/v1/customer/add-member", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        dob: dayjs(formData.dob).format("YYYY-MM-DD"),
        gymId: id,
        membershipId: formData.membership.id,
        startDate: dayjs(formData.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(formData.endDate).format("YYYY-MM-DD"),
        amount: formData.membership.priceMonth * formData.durationService,
      });
      setOpenAlert(true);
      setTimeout(() => {
        navigate("/customers/members");
      }, 2000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "89.5vh",
        backgroundColor: "#f5f7fa",
        boxSizing: "border-box",
        px: 5,
        py: 3,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "#343c6a",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          Create New Member
        </Typography>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={6}>
          <Box>
            <TitleContainer sx={{ my: 3 }}>Member Information</TitleContainer>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <TitleField>Name *</TitleField>
                <TextFieldItem
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  helperText={errors.name}
                />
              </Box>
              <Box>
                <TitleField>Email *</TitleField>
                <TextFieldItem
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  helperText={errors.email}
                />
              </Box>
              <Box>
                <TitleField>Phone Number *</TitleField>
                <TextFieldItem
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  helperText={errors.phone}
                />
              </Box>
              <Box>
                <TitleField>Gender *</TitleField>
                <Box>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <StyledRadioBtn
                      value="Male"
                      control={<Radio />}
                      label="Male"
                    />
                    <StyledRadioBtn
                      value="Female"
                      control={<Radio />}
                      label="Female"
                    />
                  </RadioGroup>
                </Box>
              </Box>
              <Box>
                <TitleField>Date of Birth *</TitleField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="dob"
                    value={formData.dob}
                    onChange={(newDate) => handleDateChange("dob", newDate)}
                    inputFormat="DD/MM/YYYY"
                    maxDate={dayjs().subtract(18, "year")}
                    renderInput={(params) => (
                      <TextFieldItem
                        {...params}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                <ErrorText>{errors.dob}</ErrorText>
              </Box>
              <Box>
                <TitleField>Gym *</TitleField>
                <TextFieldItem value={gym.name} disabled />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <TitleContainer sx={{ my: 3 }}>Service Information</TitleContainer>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <TitleField>Membership package *</TitleField>
                <SelectItem
                  name="membership"
                  value={formData.membership}
                  onChange={handleChange}
                >
                  <MenuItemStyled value="not-select">
                    Select a membership package
                  </MenuItemStyled>
                  {listPackages.map((item) => (
                    <MenuItemStyled key={item.id} value={item}>
                      {item.name}
                    </MenuItemStyled>
                  ))}
                </SelectItem>
                <ErrorText>{errors.membership}</ErrorText>
              </Box>
              <Box>
                <TitleField>Service duration(months) *</TitleField>
                <TextFieldItem
                  sx={{ width: "8vw" }}
                  name="durationService"
                  type="number"
                  value={formData.durationService}
                  onChange={handleChange}
                  inputProps={{
                    min: 1,
                    max: 60,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { textAlign: "center" },
                  }}
                  onKeyDown={handleKeyDown}
                />
                <ErrorText>{errors.durationService}</ErrorText>
              </Box>
              <Box>
                <TitleField>Service Start Date *</TitleField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    name="startDate"
                    value={formData.startDate}
                    onChange={(newDate) =>
                      handleDateChange("startDate", newDate)
                    }
                    inputFormat="DD/MM/YYYY"
                    minDate={dayjs()}
                    renderInput={(params) => (
                      <TextFieldItem
                        {...params}
                        onKeyDown={(e) => {
                          e.preventDefault();
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <TitleField>Service Expired Date *</TitleField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TextFieldItem
                    name="endDate"
                    value={formData.endDate.format("DD/MM/YYYY")}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TitleField
                  sx={{
                    fontSize: 30,
                    fontWeight: 600,
                  }}
                >
                  Total Amount:
                </TitleField>
                {formData.membership !== "not-select" && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      my: -3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Outfit Variable', sans-serif",
                        fontSize: 90,
                        fontWeight: 700,
                        color: "#343c6a",
                      }}
                    >
                      {formData.membership.priceMonth *
                        formData.durationService}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "'Outfit Variable', sans-serif",
                        fontSize: 50,
                        fontWeight: 700,
                        color: "#343c6a",
                      }}
                    >
                      $
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

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
          onClick={() => navigate("/customers/members")}
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

      <ConfirmDialog
        title="Confirm New Member Creation"
        content="Are you sure you want to create a new member? This action cannot be undone. Please review the member details carefully before confirming."
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handleConfirm={handleConfirm}
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
          New member created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateMemberPage;
