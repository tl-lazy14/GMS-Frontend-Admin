import {
  Alert,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useScrollToTop } from "../utils/handleScroll";
import { useEffect, useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import EditIcon from "@mui/icons-material/Edit";
import { storage } from "../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import axios from "axios";
import api from "../components/axiosInterceptor";

const ButtonStyled = styled(Button)(() => ({
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
  alignItems: "center",
  flexGrow: 1,
  gap: 15,
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
  fontWeight: 500,
  marginBottom: 8,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
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

const socialMedia = [
  { name: "facebook", icon: <FaFacebook /> },
  { name: "youtube", icon: <FaYoutube /> },
  { name: "instagram", icon: <FaInstagram /> },
  { name: "twitter", icon: <FaXTwitter /> },
  { name: "tiktok", icon: <FaTiktok /> },
  { name: "pinterest", icon: <FaPinterest /> },
  { name: "linkedin", icon: <FaLinkedin /> },
];

const EditBrandInfoPage = () => {
  useScrollToTop();

  const [data, setData] = useState({
    brandLogo: "",
    brandName: "",
    hotline: "",
    email: "",
    businessAddress: "",
    taxCode: "",
    dayPassFee: 0,
    bankAccounts: [],
    mediaLink: {},
  });
  const [errors, setErrors] = useState({
    brandName: "",
    hotline: "",
    email: "",
    businessAddress: "",
    taxCode: "",
    dayPassFee: "",
    paymentInfo: "",
  });
  const [selectedLogo, setSelectedLogo] = useState(null);
  const navigate = useNavigate();

  const getBrandInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:2002/gms/api/v1/brand/get-brand-info"
      );
      setData({
        brandLogo: response.data.logo,
        brandName: response.data.nameBrand,
        hotline: response.data.hotline,
        email: response.data.email,
        businessAddress: response.data.businessAddress,
        taxCode: response.data.taxCode,
        dayPassFee: response.data.dayPassFee,
        bankAccounts: JSON.parse(response.data.bankAccounts),
        mediaLink: JSON.parse(response.data.mediaLink),
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBrandInfo();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedLogo(file);
      setData((prevData) => ({ ...prevData, brandLogo: imageUrl }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    validateField(name, value);
  };

  const handleBankAccountChange = (idx, field, value) => {
    if (field === "accNumber") {
      // Kiểm tra nếu giá trị không phải là ký tự số thì không cập nhật vào state
      if (!/^\d*$/.test(value)) {
        return;
      }
    } else {
      // Chuyển đổi giá trị thành uppercase cho trường "bank" và "owner"
      value = value.toUpperCase();
    }
    const updatedAccounts = [...data.bankAccounts];
    updatedAccounts[idx][field] = value;
    setData((prevData) => ({ ...prevData, bankAccounts: updatedAccounts }));
  };

  const handleQRFileChange = (idx, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const updatedAccounts = [...data.bankAccounts];
      updatedAccounts[idx].qrCode = imageUrl;
      updatedAccounts[idx].selectedQRFile = file;
      setData((prevData) => ({ ...prevData, bankAccounts: updatedAccounts }));
    }
  };

  const handleRemoveQR = (idx) => {
    const updatedAccounts = [...data.bankAccounts];
    updatedAccounts[idx].qrCode = null;
    updatedAccounts[idx].selectedQRFile = null;
    setData((prevData) => ({ ...prevData, bankAccounts: updatedAccounts }));
  };

  const handleAddBankAccount = () => {
    setData((prevData) => ({
      ...prevData,
      bankAccounts: [
        ...prevData.bankAccounts,
        { bank: "", accNumber: "", owner: "", qrCode: null },
      ],
    }));
  };

  const handleDeleteBankAccount = (idx) => {
    const updatedAccounts = [...data.bankAccounts];
    updatedAccounts.splice(idx, 1);
    setData((prevData) => ({ ...prevData, bankAccounts: updatedAccounts }));
  };

  const handleMediaLinkChange = (name, value) => {
    setData((prevData) => ({
      ...prevData,
      mediaLink: {
        ...prevData.mediaLink,
        [name]: value,
      },
    }));
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "brandName":
        if (!value.trim()) {
          error = "Brand name is required.";
        }
        setErrors((prev) => ({ ...prev, brandName: error }));
        break;

      case "hotline":
        if (!value.trim()) {
          error = "Hotline is required.";
        } else if (!/^\d{8,}$/.test(value)) {
          error = "Hotline must be at least 8 digits.";
        }
        setErrors((prev) => ({ ...prev, hotline: error }));
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

      case "businessAddress":
        if (!value.trim()) {
          error = "Address is required.";
        }
        setErrors((prev) => ({ ...prev, businessAddress: error }));
        break;

      case "taxCode":
        if (!value.trim()) {
          error = "Tax code is required.";
        }
        setErrors((prev) => ({ ...prev, taxCode: error }));
        break;

      case "dayPassFee":
        if (!String(value).trim()) {
          error = "Day pass fee is required.";
        } else if (isNaN(value) || value < 0) {
          error = "Day pass fee must be a positive number.";
        }
        setErrors((prev) => ({ ...prev, dayPassFee: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const validateBankAccounts = () => {
    let error = "";
    for (const account of data.bankAccounts) {
      // Kiểm tra nếu bất kỳ bản ghi nào không có ảnh QR hoặc thiếu thông tin bank, accNumber, owner
      if (
        !account.qrCode ||
        !account.bank ||
        !account.accNumber ||
        !account.owner
      ) {
        error =
          "Please provide complete payment information for all bank accounts.";
        break;
      }
    }
    setErrors((prev) => ({ ...prev, paymentInfo: error }));
    return error;
  };

  const handleSave = async () => {
    const brandNameError = validateField("brandName", data.brandName);
    const hotlineError = validateField("hotline", data.hotline);
    const emailError = validateField("email", data.email);
    const businessAddressError = validateField(
      "businessAddress",
      data.businessAddress
    );
    const taxCodeError = validateField("taxCode", data.taxCode);
    const dayPassFeeError = validateField("dayPassFee", data.dayPassFee);
    const bankAccountsError = validateBankAccounts();

    if (
      !brandNameError &&
      !hotlineError &&
      !emailError &&
      !businessAddressError &&
      !taxCodeError &&
      !dayPassFeeError &&
      !bankAccountsError
    ) {
      setIsButtonDisabled(true);
      let downloadURL;
      if (selectedLogo) {
        const storageRef = ref(storage, `images/${selectedLogo.name}`);
        const snapshot = await uploadBytes(storageRef, selectedLogo);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      // Handle saving bank account QR codes
      // eslint-disable-next-line no-unused-vars
      for (const [idx, account] of data.bankAccounts?.entries()) {
        if (account.selectedQRFile) {
          const storageRef = ref(
            storage,
            `images/${account.selectedQRFile.name}`
          );
          const snapshot = await uploadBytes(
            storageRef,
            account.selectedQRFile
          );
          const downloadURL = await getDownloadURL(snapshot.ref);
          account.qrCode = downloadURL;
          account.selectedQRFile = null; // Clear the file to avoid re-uploading
        }
      }

      try {
        await api.put("/brand/update-brand-info", {
          nameBrand: data.brandName,
          logo: selectedLogo ? downloadURL : data.brandLogo,
          hotline: data.hotline,
          email: data.email,
          taxCode: data.taxCode,
          businessAddress: data.businessAddress,
          bankAccounts: JSON.stringify(data.bankAccounts),
          mediaLink: JSON.stringify(data.mediaLink),
          dayPassFee: data.dayPassFee,
        });
        setOpenAlert(true);
        setTimeout(() => {
          navigate("/brand-info");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
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
          Edit Brand Information
        </Typography>
        <ButtonStyled
          sx={{ px: 3 }}
          startIcon={<WestIcon />}
          onClick={() => navigate("/brand-info")}
          disabled={isButtonDisabled}
        >
          Back
        </ButtonStyled>
      </Box>

      <Box
        sx={{
          my: 4,
          backgroundColor: "#221551",
          borderRadius: 4,
          p: 3,
          border: "1px solid #ddd",
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            color: "white",
            fontSize: 25,
            fontWeight: 600,
          }}
        >
          General Information
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            mx: 10,
            my: 3,
          }}
        >
          <FieldContainer>
            <TitleField>Brand logo:</TitleField>
            <Badge
              overlap="rectangular"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              badgeContent={
                <IconButton
                  onClick={() => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.accept = "image/*";
                    fileInput.onchange = handleFileChange;
                    fileInput.click();
                  }}
                  sx={{
                    backgroundColor: "white !important",
                    opacity: 0.7,
                    color: "#221551 !important",
                    p: 0.75,
                    transition: "0.2s",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  <EditIcon sx={{ fontSize: 23 }} />
                </IconButton>
              }
            >
              <img
                src={data.brandLogo}
                alt="logo trademark"
                style={{ width: 190, height: 61, objectFit: "cover" }}
              />
            </Badge>
          </FieldContainer>
          <Box
            sx={{
              display: "flex",
              gap: 10,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flexGrow: 1,
                flexBasis: 0,
              }}
            >
              <Box>
                <TitleField>Brand name:</TitleField>
                <TextFieldItem
                  name="brandName"
                  value={data.brandName}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                  helperText={errors.brandName}
                />
              </Box>
              <Box>
                <TitleField>Email:</TitleField>
                <TextFieldItem
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  helperText={errors.email}
                />
              </Box>
              <Box>
                <TitleField>Hotline:</TitleField>
                <TextFieldItem
                  name="hotline"
                  value={data.hotline}
                  onChange={handleChange}
                  placeholder="Enter hotline"
                  helperText={errors.hotline}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                flexGrow: 1,
                flexBasis: 0,
              }}
            >
              <Box sx={{ alignItems: "start" }}>
                <TitleField>Address:</TitleField>
                <TextFieldItem
                  name="businessAddress"
                  value={data.businessAddress}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  helperText={errors.businessAddress}
                />
              </Box>
              <Box>
                <TitleField>Tax code:</TitleField>
                <TextFieldItem
                  name="taxCode"
                  value={data.taxCode}
                  onChange={handleChange}
                  placeholder="Enter tax code"
                  helperText={errors.taxCode}
                />
              </Box>
              <Box>
                <TitleField>Day pass fee (in $):</TitleField>
                <TextFieldItem
                  name="dayPassFee"
                  value={data.dayPassFee}
                  onChange={handleChange}
                  placeholder="Enter day pass fee"
                  helperText={errors.dayPassFee}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 3, my: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            border: "1px solid #ddd",
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Payment Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
              my: 5,
            }}
          >
            {data.bankAccounts?.map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 3, mb: 2 }}>
                {item.qrCode ? (
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
                            fileInput.onchange = (e) =>
                              handleQRFileChange(idx, e);
                            fileInput.click();
                          }}
                          sx={{
                            backgroundColor: "#221551 !important",
                            color: "white !important",
                            p: 0.75,
                          }}
                        >
                          <EditIcon sx={{ fontSize: 23 }} />
                        </IconButton>
                      }
                    >
                      <img src={item.qrCode} alt="qr code bank" width={180} />
                    </Badge>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 455,
                      height: "250px",
                      border: "2px dashed #ddd",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#aaa",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      "&:hover": {
                        border: `2px dashed #6e34d5`,
                      },
                    }}
                    onClick={() => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.accept = "image/*";
                      fileInput.onchange = (e) => handleQRFileChange(idx, e);
                      fileInput.click();
                    }}
                  >
                    <AddPhotoAlternateIcon
                      sx={{ fontSize: 50, color: "grey" }}
                    />
                    <TextStyled sx={{ color: "grey" }}>
                      Upload QR Image
                    </TextStyled>
                  </Box>
                )}
                <Box>
                  <TextFieldItem
                    placeholder="Enter bank name"
                    value={item.bank}
                    onChange={(e) =>
                      handleBankAccountChange(idx, "bank", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextFieldItem
                    placeholder="Enter account number"
                    value={item.accNumber}
                    onChange={(e) =>
                      handleBankAccountChange(idx, "accNumber", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  <TextFieldItem
                    placeholder="Enter owner name"
                    value={item.owner}
                    onChange={(e) =>
                      handleBankAccountChange(idx, "owner", e.target.value)
                    }
                    sx={{ mb: 2 }}
                  />
                  {item.qrCode && (
                    <ButtonStyled
                      sx={{ px: 2 }}
                      onClick={() => handleRemoveQR(idx)}
                    >
                      Remove QR image
                    </ButtonStyled>
                  )}
                  <IconButton
                    onClick={() => handleDeleteBankAccount(idx)}
                    aria-label="delete"
                    sx={{
                      ml: 2,
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 0, 0, 0.2)",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>
                </Box>
              </Box>
            ))}
            <TextStyled sx={{ color: "#ea2c3e" }}>
              {errors.paymentInfo}
            </TextStyled>
            <ButtonStyled
              onClick={handleAddBankAccount}
              startIcon={<AddIcon />}
              sx={{ alignSelf: "center", px: 2 }}
              disabled={isButtonDisabled}
            >
              Add
            </ButtonStyled>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            p: 3,
            border: "1px solid #ddd",
            flexGrow: 1,
            flexBasis: 0,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              color: "#343c6a",
              fontSize: 25,
              fontWeight: 600,
            }}
          >
            Social Media
          </Typography>

          <List sx={{ my: 2 }}>
            {data.mediaLink &&
              socialMedia.map((media) => {
                const url = data.mediaLink[media.name];
                return (
                  <ListItem key={media.name} sx={{ mb: 1 }}>
                    <ListItemIcon
                      title={`${media.name}`}
                      sx={{ fontSize: 40, color: "#221551" }}
                    >
                      {media.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <TextFieldItem
                        placeholder={`Enter ${media.name} URL`}
                        value={url ? url : ""}
                        onChange={(e) =>
                          handleMediaLinkChange(media.name, e.target.value)
                        }
                      />
                    </ListItemText>
                  </ListItem>
                );
              })}
          </List>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <ButtonStyled
          onClick={handleSave}
          sx={{ width: 150, my: 2 }}
          disabled={isButtonDisabled}
        >
          Save
        </ButtonStyled>
      </Box>

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
          Brand info updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditBrandInfoPage;
