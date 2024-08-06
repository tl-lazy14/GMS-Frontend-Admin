import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Toolbar,
  DateNavigator,
  Appointments,
  AppointmentTooltip,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import moment from "moment";

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(() => ({
  backgroundColor: "#ffffff",
  "&:hover": {
    backgroundColor: "#ffffff !important",
  },
  "&:focus": {
    backgroundColor: "#ffffff !important",
  },
  "&.today-cell": {
    backgroundColor: "rgba(46, 215, 222, 0.15)",
    "&:hover": {
      backgroundColor: "rgba(46, 215, 222, 0.2) !important",
    },
    "&:focus": {
      backgroundColor: "rgba(46, 215, 222, 0.2) !important",
    },
  },
}));

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(() => ({
  backgroundColor: "rgb(255, 250, 205)",
  "&.today": {
    backgroundColor: "rgb(136, 219, 223, 0.7)",
  },
}));

const formatDayScaleDate = (date, options) => {
  const momentDate = moment(date);
  const { weekday } = options;
  return momentDate.format(weekday ? "dddd" : "D");
};

const TimeTableCell = (props) => {
  const { startDate } = props;
  const date = new Date(startDate);

  if (date.getDate() === new Date().getDate()) {
    return <StyledWeekViewTimeTableCell {...props} className="today-cell" />;
  }
  return <StyledWeekViewTimeTableCell {...props} />;
};

const DayScaleCell = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { startDate, today } = props;

  if (today) {
    return (
      <StyledWeekViewDayScaleCell
        {...props}
        formatDate={formatDayScaleDate}
        className="today"
      />
    );
  }
  return (
    <StyledWeekViewDayScaleCell {...props} formatDate={formatDayScaleDate} />
  );
};

const ScheduleContainer = ({ schedule, Content }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const handleCurrentDateChange = (date) => {
    setCurrentDate(date);
  };

  return (
    <Paper sx={{ border: "1px solid #ccc" }}>
      <Scheduler data={schedule} firstDayOfWeek={1} height={1660}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={handleCurrentDateChange}
        />
        <WeekView
          startDayHour={7}
          endDayHour={23}
          timeTableCellComponent={TimeTableCell}
          dayScaleCellComponent={DayScaleCell}
        />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <Appointments />
        <AppointmentTooltip showCloseButton contentComponent={Content} />
      </Scheduler>
    </Paper>
  );
};

export default ScheduleContainer;
