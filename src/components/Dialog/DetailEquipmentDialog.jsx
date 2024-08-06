import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 15,
}));

const NameField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const ValueField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const DetailEquipmentDialog = ({ openDialog, handleCloseDialog, item }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          p: 1,
          borderRadius: 4,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
          my: 1,
          textAlign: "center",
        }}
      >
        Equipment Info Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", gap: 5 }}>
          <Box>
            <img src={item?.image} alt="equipment img" style={{ width: '26vw' }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FieldContainer>
              <NameField>Name:</NameField>
              <ValueField>{item?.name}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Category:</NameField>
              <ValueField>{item?.category?.name}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Manufacturer:</NameField>
              <ValueField>{item?.manufacturer}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Quantity:</NameField>
              <ValueField>{item?.totalQuantity}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Available quantity:</NameField>
              <ValueField>{item?.availableQuantity}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Faulty/Maintenance quantity:</NameField>
              <ValueField>{item?.faultyMaintenanceQuantity}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Purchase date:</NameField>
              <ValueField>
                {item?.purchaseDate
                  ? dayjs(item.purchaseDate).format("DD/MM/YYYY")
                  : ""}
              </ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Warranty expiration:</NameField>
              <ValueField>
                {item?.warrantyExpiration
                  ? dayjs(item.warrantyExpiration).format("DD/MM/YYYY")
                  : ""}
              </ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Unit price:</NameField>
              <ValueField>{item?.unitPrice} $</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Total price:</NameField>
              <ValueField>{item?.totalPrice} $</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Gym:</NameField>
              <ValueField>{item?.gym?.name}</ValueField>
            </FieldContainer>
            <FieldContainer>
              <NameField>Equipment codes:</NameField>
              <ValueField>{item?.listCode?.join(', ')}</ValueField>
            </FieldContainer>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 18,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              mt: 3,
              mb: 1,
              transition: "0.3s",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#221551",
                border: "1px solid #221551",
              },
            }}
            onClick={handleCloseDialog}
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailEquipmentDialog;
