import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../axiosInterceptor";

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
  marginBottom: 5,
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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  color: "white",
}));

const AddEquipmentDialog = ({
  openDialog,
  handleCloseDialog,
  selectedGym,
  listCategories,
  setOpenAlert,
  getListEquipment,
  getListCategory
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "not-select",
    image: "",
    manufacturer: "",
    quantity: 1,
    purchaseDate: dayjs(),
    warrantyPeriod: 1,
    unitPrice: "",
    gym: selectedGym?.name,
  });
  const [errors, setErrors] = useState({
    name: "",
    category: "",
    image: "",
    quantity: "",
    warrantyPeriod: "",
    manufacturer: "",
    unitPrice: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    if (selectedGym) {
      setFormData((prevData) => ({
        ...prevData,
        gym: selectedGym?.name,
      }));
    }
  }, [selectedGym]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "unitPrice") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }
    } else if (
      (name === "quantity" || name === "warrantyPeriod") &&
      value !== "" &&
      (!/^\d+$/.test(value) || parseInt(value, 10) < 1)
    ) {
      return;
    }
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      purchaseDate: newDate,
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setFormData({ ...formData, image: file.name });
      validateField("image", file.name);
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
          error = "Equipment name is required.";
        }
        setErrors((prev) => ({ ...prev, name: error }));
        break;

      case "manufacturer":
        if (!value.trim()) {
          error = "Manufacturer is required.";
        }
        setErrors((prev) => ({ ...prev, manufacturer: error }));
        break;

      case "category":
        if (value === "not-select") {
          error = "Please select a category.";
        }
        setErrors((prev) => ({ ...prev, category: error }));
        break;

      case "image":
        if (!value.trim()) {
          error = "Equipment image is required.";
        }
        setErrors((prev) => ({ ...prev, image: error }));
        break;

      case "unitPrice":
        if (!value.trim()) {
          error = "Unit price is required.";
        }
        setErrors((prev) => ({ ...prev, unitPrice: error }));
        break;

      case "quantity":
        if (!value) {
          error = "Quantity is required.";
        }
        setErrors((prev) => ({ ...prev, quantity: error }));
        break;

      case "warrantyPeriod":
        if (!value) {
          error = "Warranty period is required.";
        }
        setErrors((prev) => ({ ...prev, warrantyPeriod: error }));
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async () => {
    const nameError = validateField("name", formData.name);
    const imageError = validateField("image", formData.image);
    const categoryError = validateField("category", formData.category);
    const manufacturerError = validateField(
      "manufacturer",
      formData.manufacturer
    );
    const unitPriceError = validateField("unitPrice", formData.unitPrice);
    const quantityError = validateField("quantity", formData.quantity);
    const warrantyPeriodError = validateField(
      "warrantyPeriod",
      formData.warrantyPeriod
    );

    // Kiểm tra xem có lỗi nào không
    if (
      !nameError &&
      !imageError &&
      !categoryError &&
      !manufacturerError &&
      !unitPriceError &&
      !quantityError &&
      !warrantyPeriodError
    ) {
      setIsButtonDisabled(true);
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      const snapshot = await uploadBytes(storageRef, selectedImage);
      const downloadURL = await getDownloadURL(snapshot.ref);

      try {
        await api.post("/equipment/add-equipment", {
          name: formData.name,
          categoryId: formData.category,
          imageUrl: downloadURL,
          manufacturer: formData.manufacturer,
          totalQuantity: formData.quantity,
          purchaseDate: dayjs(formData.purchaseDate).format("YYYY-MM-DD"),
          warrantyExpiration: dayjs(formData.purchaseDate).add(
            formData.warrantyPeriod,
            "month"
          ),
          unitPrice: formData.unitPrice,
          totalPrice: formData.unitPrice * formData.quantity,
          gymId: selectedGym.id,
        });
        closeDialog();
        setOpenAlert(true);
        getListEquipment();
        getListCategory();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setFormData({
      name: "",
      category: "not-select",
      image: "",
      manufacturer: "",
      quantity: 1,
      purchaseDate: dayjs(),
      warrantyPeriod: 1,
      unitPrice: "",
      totalPrice: "",
      gym: selectedGym.name,
    });
    setErrors({
      name: "",
      category: "",
      image: "",
      manufacturer: "",
      unitPrice: "",
    });
    setSelectedImage(null);
    setIsButtonDisabled(false);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
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
        Add New Equipment
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
          <Box>
            <TitleField>Equipment name *</TitleField>
            <TextFieldItem
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter equipment name"
              autoComplete="off"
              helperText={errors.name}
            />
          </Box>
          <Box>
            <TitleField>Category *:</TitleField>
            <SelectItem
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <MenuItemStyled value="not-select">
                Select equipment category
              </MenuItemStyled>
              {listCategories.map((item, idx) => (
                <MenuItemStyled key={idx} value={item.id}>
                  {item.name}
                </MenuItemStyled>
              ))}
            </SelectItem>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.category}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Manufacturer *:</TitleField>
            <TextFieldItem
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              placeholder="Enter manufacturer"
              autoComplete="off"
              helperText={errors.manufacturer}
            />
          </Box>
          <Box>
            <TitleField>Equipment image *</TitleField>
            {selectedImage ? (
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
                    src={URL.createObjectURL(selectedImage)}
                    alt="equipment img"
                    style={{
                      width: "100%",
                      borderRadius: 16,
                    }}
                  />
                </Badge>
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 320,
                  borderRadius: 4,
                  border: "2px dashed #ccc",
                  backgroundColor: "white",
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
                  fileInput.onchange = handleImageChange;
                  fileInput.click();
                }}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: 50, color: "grey" }} />
                <TextStyled sx={{ color: "grey" }}>
                  Upload Equipment Image
                </TextStyled>
              </Box>
            )}
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.image}
            </TextStyled>
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box>
                <TitleField>Quantity *:</TitleField>
                <TextFieldItem
                  name="quantity"
                  type="number"
                  value={formData.quantity}
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
              </Box>
              <Box>
                <TitleField>Unit price (in $) *:</TitleField>
                <TextFieldItem
                  name="unitPrice"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="Enter unit price"
                  autoComplete="off"
                />
              </Box>
              <Box>
                <TitleField>Total price (in $) *:</TitleField>
                <TextFieldItem
                  value={
                    formData.unitPrice
                      ? formData.quantity * parseFloat(formData.unitPrice)
                      : ""
                  }
                  placeholder="Total price"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.quantity}
            </TextStyled>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.unitPrice}
            </TextStyled>
          </Box>
          <Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Box>
                <TitleField>Warranty period (months) *:</TitleField>
                <TextFieldItem
                  name="warrantyPeriod"
                  type="number"
                  value={formData.warrantyPeriod}
                  onChange={handleChange}
                  inputProps={{
                    min: 1,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    style: { textAlign: "center" },
                  }}
                  onKeyDown={handleKeyDown}
                />
              </Box>
              <Box>
                <TitleField>Purchase date *:</TitleField>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={formData.purchaseDate}
                    onChange={(newDate) => handleDateChange(newDate)}
                    inputFormat="DD/MM/YYYY"
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
            </Box>
            <TextStyled sx={{ color: "#ea2c3e", mt: 1, ml: 2 }}>
              {errors.warrantyPeriod}
            </TextStyled>
          </Box>
          <Box>
            <TitleField>Gym *</TitleField>
            <TextFieldItem
              value={formData.gym}
              InputProps={{
                readOnly: true,
              }}
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

export default AddEquipmentDialog;
