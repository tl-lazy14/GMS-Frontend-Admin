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

const BenefitsManageDialog = ({
  data,
  openDialog,
  handleCloseDialog,
  setOpenAlert,
  setTypeAlert,
  setContentAlert,
  getListBenefit,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [newBenefit, setNewBenefit] = useState("");
  const [displayAddField, setDisplayAddField] = useState(false);

  const handleEditClick = (item) => {
    setSelectedItem(item);
  };

  const handleAddNew = async () => {
    if (newBenefit.trim() === "") {
      setTypeAlert("error");
      setContentAlert("New benefit cannot be empty.");
      setOpenAlert(true);
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      await api.post("/service/add-benefit", {
        description: newBenefit,
      });
      getListBenefit();
      setNewBenefit("");
      setDisplayAddField(false);
      setTypeAlert("success");
      setContentAlert("New benefit created successfully!");
      setOpenAlert(true);
    } catch (err) {
      setTypeAlert("error");
      setContentAlert(err.response.data.error);
      setOpenAlert(true);
      return;
    }
  };

  const handleEditSave = async () => {
    if (selectedItem.description.trim() === "") {
      setTypeAlert("error");
      setContentAlert("Benefit cannot be empty.");
      setOpenAlert(true);
      return;
    }

    try {
      await api.put(`/service/edit-benefit/${selectedItem.id}`, {
        description: selectedItem.description,
      });
      getListBenefit();
      setSelectedItem("");
      setTypeAlert("success");
      setContentAlert("Benefit updated successfully!");
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
      await api.delete(`/service/delete-benefit/${id}`);
      getListBenefit();
      setTypeAlert("success");
      setContentAlert("Benefit deleted successfully!");
      setOpenAlert(true);
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
        Manage Benefits
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
              Add benefit
            </ToolButton>
          </Box>
          {displayAddField && (
            <Box sx={{ display: "flex", gap: 2, my: 3, alignItems: "center" }}>
              <TextFieldItem
                value={newBenefit}
                placeholder="Enter new benefit"
                autoComplete="off"
                onChange={(e) => setNewBenefit(e.target.value)}
              />
              <ToolButton sx={{ px: 3 }} onClick={handleAddNew}>
                Save
              </ToolButton>
            </Box>
          )}
        </Box>

        {data.map((benefit) => (
          <Box
            key={benefit.id}
            sx={{
              display: "flex",
              my: 1,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {selectedItem?.id === benefit.id ? (
              <TextFieldItem
                value={selectedItem.description}
                placeholder="Enter benefit"
                autoComplete="off"
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              <TextStyled>{benefit.description}</TextStyled>
            )}

            <Box>
              {selectedItem?.id === benefit.id ? (
                <IconButton onClick={handleEditSave}>
                  <EditIcon color="primary" />
                </IconButton>
              ) : (
                <IconButton
                  sx={{ color: "#00b69b" }}
                  onClick={() => handleEditClick(benefit)}
                >
                  <EditIcon />
                </IconButton>
              )}

              {selectedItem?.id !== benefit.id && (
                <IconButton
                  sx={{ color: "#ef3826" }}
                  onClick={() => handleDeleteClick(benefit.id)}
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

export default BenefitsManageDialog;
