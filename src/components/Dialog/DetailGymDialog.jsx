import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ImageSlider from "../ImageSlider";
import CloseIcon from "@mui/icons-material/Close";

const Text = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  lineHeight: 1.5,
}));

const FieldContainer = styled(Box)(() => ({
  display: "flex",
  gap: 10,
}));

const TitleField = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
  fontWeight: 500,
}));

const DetailGymDialog = ({ openDialog, handleCloseDialog, item }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
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
          textAlign: "center",
        }}
      >
        Gym Details
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseDialog}
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
            <TitleField>Gym:</TitleField>
            <Text>{item.name}</Text>
          </FieldContainer>
          <Box>
            <TitleField sx={{ mb: 1.5 }}>Amenities:</TitleField>
            <Grid container columnSpacing={10} rowSpacing={1.5}>
              {item.amenity?.map((item, idx) => (
                <Grid item key={idx} md={6} sx={{ display: "flex" }}>
                  <Box item={item} sx={{ flexGrow: 1 }}>
                    <Text
                      key={idx}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <FiberManualRecordIcon
                        sx={{ fontSize: 12, marginRight: 1 }}
                      />
                      {item}
                    </Text>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
          { item && <ImageSlider images={item.listImage} nameComponent="DetailGymDialog" /> }
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

export default DetailGymDialog;
