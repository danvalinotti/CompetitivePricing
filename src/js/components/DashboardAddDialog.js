import React from 'react';
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DashboardAddDrugDialog = ({open, onChange, onSubmit}) => {
    const [dayList, setDayList] = React.useState([]);

    const updateValues = event => {
        let arr = dayList;
        arr[event.target.value] = !dayList[event.target.value];
        setDayList(arr);
    };

    const handleSubmit = () => {
        let finalList = dayList;
        let schedule = "";
        for (let i = 0; i < 7; i++) {
            if (finalList[i] === undefined) {
                finalList[i] = false;
            }
            if (finalList[i] === true) {
                schedule +=
                    i === 0
                        ? days[i].toLowerCase()
                        : ',' + days[i].toLowerCase();
            }
        }
        onSubmit(schedule);
    };

    return (
        <Dialog open={open} onClose={onChange}>
            <DialogTitle id={"dashboard-dialog-title"}>
                Select days
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please select the days of the week where you want this drug to appear on your dashboard.
                </DialogContentText>
                <div className={"dashboard-dialog-content"}>
                    {days.map((day, index) => (
                        <div key={index} className={"dashboard-dialog-check"}>
                            <Checkbox
                                checked={dayList[index]}
                                onChange={updateValues}
                                value={index}
                            />
                            <Typography variant={"h6"}>
                                {day}
                            </Typography>
                        </div>
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onChange} color={"secondary"}>Cancel</Button>
                <Button onClick={handleSubmit} color={"primary"}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DashboardAddDrugDialog;