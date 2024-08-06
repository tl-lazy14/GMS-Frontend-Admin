import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import api from "../axiosInterceptor";

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

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
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

const EquipmentCategoryDialog = ({
  data,
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  setTypeAlert,
  setContentAlert,
  selectedCategory,
  setSelectedCategory,
  getListCategory,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [displayAddField, setDisplayAddField] = useState(false);

  const handleEditClick = (category) => {
    setSelectedItem(category);
  };

  const handleAddNewCategory = async () => {
    if (newCategory.trim() === "") {
      setTypeAlert("error");
      setContentAlert("New category name cannot be empty.");
      setOpenAlert(true);
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.post("/equipment/add-category", {
        name: newCategory,
      });
      getListCategory();
      setNewCategory("");
      setDisplayAddField(false);
      setTypeAlert("success");
      setContentAlert("New category created successfully!");
      setOpenAlert(true);
    } catch (err) {
      setTypeAlert("error");
      setContentAlert(err.response.data.error);
      setOpenAlert(true);
      return;
    }
  };

  const handleEditSave = async () => {
    if (selectedItem.name.trim() === "") {
      setTypeAlert("error");
      setContentAlert("Category name cannot be empty.");
      setOpenAlert(true);
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.put(
        `/equipment/edit-category/${selectedItem.id}`,
        {
          name: selectedItem.name,
        }
      );
      getListCategory();
      setSelectedItem("");
      setTypeAlert("success");
      setContentAlert("Category updated successfully!");
      setOpenAlert(true);
    } catch (err) {
      setTypeAlert("error");
      setContentAlert(err.response.data.error);
      setOpenAlert(true);
      return;
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await api.delete(`/equipment/delete-category/${id}`);
      getListCategory();
      setTypeAlert("success");
      setContentAlert("Category deleted successfully!");
      setOpenAlert(true);
      if (id === selectedCategory) setSelectedCategory("all");
    } catch (err) {
      setTypeAlert("error");
      setContentAlert(err.response.data.error);
      setOpenAlert(true);
      return;
    }
  };

  const closeDialog = () => {
    handleCloseDialog();
    setSelectedItem(null);
  };

  return (
    <Dialog
      open={openDialog}
      onClose={closeDialog}
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
        Manage Equipment Categories
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
        <Box>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <ToolButton
              sx={{ px: 3, mb: 1 }}
              startIcon={<AddIcon />}
              onClick={() => setDisplayAddField(!displayAddField)}
            >
              Add category
            </ToolButton>
          </Box>
          {displayAddField && (
            <Box sx={{ display: "flex", gap: 2, my: 3, alignItems: "center" }}>
              <TextFieldItem
                value={newCategory}
                placeholder="Enter new category name"
                autoComplete="off"
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <ToolButton sx={{ px: 3 }} onClick={handleAddNewCategory}>
                Save
              </ToolButton>
            </Box>
          )}
        </Box>

        {data.map((category) => (
          <Box
            key={category.id}
            sx={{
              display: "flex",
              my: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {selectedItem?.id === category.id ? (
              <TextFieldItem
                value={selectedItem.name}
                placeholder="Enter category name"
                autoComplete="off"
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, name: e.target.value })
                }
              />
            ) : (
              <TextStyled>
                {category.name} ({category.quantity} equipments)
              </TextStyled>
            )}

            <Box>
              {selectedItem?.id === category.id ? (
                <IconButton onClick={handleEditSave}>
                  <EditIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "#00b69b" }}
                  onClick={() => handleEditClick(category)}
                >
                  <EditIcon />
                </IconButton>
              )}

              {category.quantity === 0 && selectedItem?.id !== category.id && (
                <IconButton
                  sx={{ color: "#ef3826" }}
                  onClick={() => handleDeleteClick(category.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "10vw",
              margin: "auto",
              mt: 2,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={closeDialog}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentCategoryDialog;
