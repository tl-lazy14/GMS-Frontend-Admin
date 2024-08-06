import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../axiosInterceptor";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 10,
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
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

const ErrorText = styled(FormHelperText)(() => ({
  fontSize: "16px",
  lineHeight: 1.5,
  fontFamily: "'Outfit Variable', sans-serif",
  color: "#ea2c3e",
}));

const UpgradeServiceDialog = ({
  openDialog,
  handleCloseDialog,
  data,
  setOpenAlert,
  getMembershipService
}) => {
  const [selectedPackage, setSelectedPackage] = useState("not-select");
  const [listPackages, setListPackages] = useState([]);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);

  const getMembershipOption = async () => {
    try {
      const response = await api.get(`/service/get-list-membership-better/${data[0]?.membership?.id}`);
      setListPackages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMembershipOption();
  }, [openDialog]);

  const validateField = (value) => {
    let errorText = "";
    if (value === "not-select") {
      errorText =
        "Please select the membership package you would like to upgrade to";
    }
    setError(errorText);
    return errorText;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedPackage(value);
    validateField(value);
  };

  const handleSubmit = async () => {
    const selectPackageError = validateField(selectedPackage);
    if (!selectPackageError) {
      try {
        await api.put(`/customer/upgrade-service/${data[0]?.id}`, {
          newPackageId: selectedPackage.id,
          cost: amount,
        });
        closeDialog();
        setOpenAlert(true);
        getMembershipService();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setSelectedPackage("not-select");
    setError("");
    setAmount(0);
  };

  const handleAmountUpgrade = () => {
    const today = dayjs();
    const expiredDate = dayjs(data[0]?.expiredDate);
    const numDays = expiredDate.diff(today, "day");

    const amountUpgrade =
      ((selectedPackage.priceMonth -
        data[0]?.membership?.priceMonth) /
        30) *
      numDays;
    setAmount(amountUpgrade.toFixed(2));
  };

  useEffect(() => {
    if (selectedPackage !== 'not-select') {
        handleAmountUpgrade();
    }
  }, [selectedPackage]);

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xs"
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
        Upgrade Membership Service
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FieldContainer>
            <TitleField>Current Membership Package:</TitleField>
            <TextStyled>{data[0]?.membership.name}</TextStyled>
          </FieldContainer>
          <FieldContainer>
            <TitleField>Current Start Date:</TitleField>
            <TextStyled>
              {dayjs(data[0]?.startDate).format("DD/MM/YYYY")}
            </TextStyled>
          </FieldContainer>
          <FieldContainer>
            <TitleField>New Start Date:</TitleField>
            <TextStyled>
              {dayjs().format("DD/MM/YYYY")}
            </TextStyled>
          </FieldContainer>
          <FieldContainer>
            <TitleField>Expirated Date:</TitleField>
            <TextStyled>
              {dayjs(data[0]?.expiredDate).format(
                "DD/MM/YYYY"
              )}
            </TextStyled>
          </FieldContainer>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TitleField>New Membership Package: </TitleField>
            <SelectItem value={selectedPackage} onChange={handleChange}>
              <MenuItemStyled value="not-select">
                Select new package to upgrade
              </MenuItemStyled>
              {listPackages.map((item) => (
                <MenuItemStyled key={item.id} value={item}>
                  {item.name}
                </MenuItemStyled>
              ))}
            </SelectItem>
            <ErrorText>{error}</ErrorText>
          </Box>
          {selectedPackage !== "not-select" && (
            <FieldContainer sx={{ alignItems: "center" }}>
              <TitleField>Amount:</TitleField>
              <TextStyled sx={{ fontSize: 40, fontWeight: 700 }}>
                {amount}
              </TextStyled>
              <TextStyled sx={{ fontSize: 28, fontWeight: 500 }}>$</TextStyled>
            </FieldContainer>
          )}
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
          >
            Upgrade Service
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeServiceDialog;
