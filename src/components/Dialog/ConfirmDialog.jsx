import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";

const DialogContentTextStyled = styled(DialogContentText)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 18,
}));

const ConfirmDialog = ({ openDialog, handleCloseDialog, title, content, handleConfirm }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{
          fontFamily: "'Outfit Variable', sans-serif",
          fontSize: 23,
        }}
      >
        {title}
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
        <DialogContentTextStyled>{content}</DialogContentTextStyled>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 17,
            color: "#6e34d5",
          }}
          onClick={handleCloseDialog}
        >
          CANCEL
        </Button>
        <Button
          sx={{
            fontFamily: "'Outfit Variable', sans-serif",
            fontSize: 17,
            color: "#6e34d5",
          }}
          onClick={handleConfirm}
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
