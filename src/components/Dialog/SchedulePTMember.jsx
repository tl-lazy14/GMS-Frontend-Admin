import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { tableCellClasses } from "@mui/material/TableCell";

const TextStyled = styled(Typography)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 17,
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: "'Outfit Variable', sans-serif",
  fontSize: 16,
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#6e34d5",
    color: "white",
    fontSize: 16,
  },
}));

const StatusButton = styled(Button)(() => ({
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  fontFamily: "'Outfit Variable', sans-serif",
  textAlign: "center",
  borderRadius: 8,
  width: "100%",
}));

const SchedulePTMember = ({ openDialog, handleCloseDialog, data }) => {
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
        Member Training Schedule
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
        <TextStyled>
          Scheduled training sessions: {data.schedule?.length}/
          {data.service?.numSessions}
        </TextStyled>
        {data.schedule?.length > 0 && (
          <TableContainer
            sx={{
              borderRadius: 4,
              overflowX: "auto",
              boxSizing: "border-box",
              my: 3,
              border: "1px solid #ccc",
            }}
            component={Paper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                    Session
                  </StyledTableCell>
                  <StyledTableCell>Time</StyledTableCell>
                  <StyledTableCell sx={{ textAlign: 'center' }}>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.schedule.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      height: "100%",
                      borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    }}
                  >
                    <StyledTableCell sx={{ pl: 3, textAlign: "center" }}>
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>
                      {dayjs(item.startDate).format("HH:mm")} -{" "}
                      {dayjs(item.endDate).format("HH:mm")}{" "}
                      {dayjs(item.startDate).format("DD/MM/YYYY")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {dayjs(item.endDate) < dayjs() && (
                        <StatusButton
                          sx={{
                            color: "rgb(0, 182, 155) !important",
                            backgroundColor:
                              "rgba(0, 182, 155, 0.2) !important",
                            border: "1px solid rgb(0, 182, 155) !important",
                          }}
                        >
                          Finished
                        </StatusButton>
                      )}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            sx={{
              fontFamily: "'Outfit Variable', sans-serif",
              fontSize: 19,
              backgroundColor: "#6e34d5",
              border: "1px solid #6e34d5",
              color: "white",
              textTransform: "none",
              width: "12vw",
              mt: 2,
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

export default SchedulePTMember;
