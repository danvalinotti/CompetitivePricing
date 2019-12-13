import React, {useState} from 'react';
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import {Dialog, makeStyles, Paper, Select, Snackbar, TableBody, TableCell, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Axios from "axios";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Button from "@material-ui/core/Button";
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from "@material-ui/core/MenuItem";

export default function DashboardTable(props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [list, setList] = useState(props.filteredList);
    const [filteredList, setFilteredList] = useState(props.filteredList);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteOk, setDeleteOk] = useState(true);
    const [filter, setFilter] = useState('none');

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const round = (num) => {
        let num2 = Number(num).toFixed(2);
        if (num2 === 'NaN') {
            num2 = 'N/A'
        } else if (num2 >= 0) {
            num2 = '' + num2;
            num2 = addCommas(num2);
            num2 = '$' + num2
        } else {
            num2 = addCommas('' + (num2 * -1));
            num2 = '-$' + num2;
        }

        return num2
    };

    const addCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    };

    const getPriceColor = (price) => {
        if (price === 'N/A') {
            return {color: "crimson"};
        } else {
            return {color: "#08ca00", fontWeight: 600};
        }
    };

    const toggleDialog = () => {
        setDialogOpen(!dialogOpen);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const deleteDrug = (drug) => {
        const payload = {
            ...drug,
            token: window.sessionStorage.getItem("token")
        };
        console.log(drug);
        setDialogOpen(true);
        const token = sessionStorage.getItem("token");
        let list = filteredList;
        let i = list.indexOf(drug);
        let newList = list.splice(i, 1);
        Axios.delete(process.env.API_URL + '/dashboard/remove', {data: payload}).then(
            (response) => {
                if (response.status === 200) {
                    setDialogOpen(false);
                    setSnackbarMessage("Drug successfully deleted from dashboard.");
                    setSnackbarOpen(true);
                    setDeleteOk(true);
                    setFilteredList(list);
                } else if (response.status === 208) {
                    setSnackbarMessage("Drug already deleted from dashboard.");
                    setSnackbarOpen(true);
                    setDeleteOk(true);
                } else {
                    setSnackbarMessage("An unknown error has occurred.");
                    setSnackbarOpen(true);
                    setDeleteOk(false);
                }
            }
        ).catch((error) => {
            console.log(error);
            setSnackbarMessage("Failed to delete drug from dashboard.");
            setSnackbarOpen(true);
            setDeleteOk(false);
        });
    };

    const updateFilter = (event) => {
        setFilter(event.target.value);
        setPage(0);
        if (event.target.value === "leading") {
            let newList = list.filter((drug) => {
                return parseFloat(drug["recommendedDiff"]) === 0;
            });
            setFilteredList(newList);
        } else if (event.target.value === "trailing") {
            let newList = list.filter((drug) => {
                return parseFloat(drug["recommendedDiff"]) < 0;
            });
            setFilteredList(newList);
        } else {
            setFilteredList(list);
        }
    };

    return (
        <Paper>
            <div>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <th className={"table-filter-container"} style={{backgroundColor: "#2e2051", color: "whitesmoke", paddingLeft: 15}}>
                                <Typography style={{color: "whitesmoke"}}>Filter: </Typography>
                                <Select
                                    value={filter}
                                    onChange={updateFilter}
                                    style={{color: "black", backgroundColor: "whitesmoke", marginLeft: 15, padding: "0 10px", fontWeight: 400, width: 180}}
                                >
                                    <MenuItem value={"none"}>None</MenuItem>
                                    <MenuItem value={"leading"}>Market Leading</MenuItem>
                                    <MenuItem value={"trailing"}>Market Trailing</MenuItem>
                                </Select>
                            </th>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 50]}
                                count={filteredList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handleRowsPerPageChange}
                                ActionsComponent={TablePaginationActions}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke"}}
                            />
                        </TableRow>
                        <TableRow>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                Drug Info
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                InsideRx
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                USPharmacy Card
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                WellRX
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                MedImpact
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                BlinkHealth
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                SingleCare
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                GoodRx
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600, borderRight: "1px solid lightgray"}}>
                                Lowest Market Price
                            </TableCell>
                            <TableCell
                                align={"center"}
                                style={{backgroundColor: "#2e2051", color: "whitesmoke", fontWeight: 600}}>
                                Delete?
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage
                        ).map((drug, key) => (
                            <TableRow key={key} hover>
                                <TableCell align={"left"} style={{borderRight: "1px solid lightgray", width: 240}}>
                                    <span style={{fontSize: "1rem", fontWeight: 600}}>{drug.name.toUpperCase()}</span><br/>
                                    <span style={{fontSize: "0.9rem", color: "#9b9b9b"}}>
                                        Form: {drug.drugType ? drug.drugType.replace(/-/g, " ") : ""}<br/>
                                        Dosage: {drug.dosageStrength ? drug.dosageStrength.replace(/-/g, " ") : ""}<br/>
                                        Quantity: {drug.quantity ? drug.quantity : ""}<br/>
                                        ZipCode: {drug.zipcode ? drug.zipcode : ""}
                                    </span>
                                </TableCell>
                                {drug["programs"].map((program, key) => (
                                    <TableCell key={key} align={"center"} style={{borderRight: "1px solid lightgray", width: 150, position: 'relative'}}>
                                        <div className={"table-row-doublecell"}>
                                            <div className={"table-row-doublecell-child"}>
                                                <span style={
                                                    program["prices"].length > 0 && drug["programs"][0]["prices"].length > 0
                                                        ? getPriceColor(round(program["prices"][0]["price"]))
                                                        : {color: "crimson"}}
                                                >
                                                    {program["prices"].length > 0
                                                        ? round(program["prices"][0]["price"])
                                                        : "N/A"
                                                    }
                                                </span>
                                            </div>
                                            {(program["prices"].length > 0 && program["prices"][0]["pharmacy"]) && (
                                                <div className={"table-row-doublecell-child"}>
                                                    <span>
                                                         {/*TODO: add pharmacy to dashboard price*/}
                                                        {program["prices"].length > 0
                                                            ? (<span style={{fontSize: '0.8em', color: 'rgb(81, 81, 81)', fontStyle: 'italic'}}>
                                                                        {program["prices"][0]["pharmacy"]}
                                                                </span>
                                                            ) : (<span style={{fontSize: '0.8em', color: 'crimson'}}>
                                                                    N/A
                                                                </span>
                                                            )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                ))}

                                <TableCell align={"center"} style={{width: 120, borderRight: "1px solid lightgray", color: "#08ca00", fontWeight: 600, position: 'relative'}}>
                                    <div className={"table-row-doublecell"}>
                                        <div className={"table-row-doublecell-child"}>
                                                <span style={
                                                    drug["recommendedDiff"] >= 0
                                                        ? {color: "#08ca00"}
                                                        : {color: "crimson"}}
                                                >
                                                    {round(drug["recommendedPrice"])}
                                                </span>
                                        </div>
                                        {(drug["programs"][0]["prices"].length > 0 && drug["recommendedDiff"]) && (
                                            <div className={"table-row-doublecell-child"}>
                                                    <span>
                                                         {/*TODO: add pharmacy to dashboard price*/}
                                                        {drug["recommendedDiff"] >= 0
                                                            ? (<span style={{fontWeight: 400, fontSize: '0.9em', color: 'rgb(81, 81, 81)', fontStyle: 'italic'}}>
                                                                    {round(drug["recommendedDiff"])}
                                                                </span>
                                                            ) : (<span style={{fontWeight: 400, fontSize: '0.9em', color: 'crimson', fontStyle: 'italic'}}>
                                                                    {round(drug["recommendedDiff"])}
                                                                </span>
                                                            )}
                                                    </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell align={"center"}>
                                    <IconButton
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteDrug(drug)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
                <Dialog
                    open={dialogOpen}
                    onClose={toggleDialog}
                    aria-labelledby="customized-dialog-title"
                >
                    <DialogTitle id="customized-dialog-title" onClose={toggleDialog}>
                        Loading
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <CircularProgress/>
                    </DialogContent>
                </Dialog>
                <Snackbar
                    open={snackbarOpen}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                >
                    <SnackbarContent
                        onClose={handleCloseSnackbar}
                        style={deleteOk ? {backgroundColor: 'limegreen'} : {backgroundColor: 'crimson'}}
                        message={snackbarMessage}
                        action={[
                            <IconButton key="close" aria-label="close" color="inherit"
                                onClick={handleCloseSnackbar}>
                                <CloseIcon style={{fontSize: 20}}/>
                            </IconButton>,
                        ]}/>
                </Snackbar>
            </div>
        </Paper>
    );
}

function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = event => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = event => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = event => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = event => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div style={{width: 350, marginLeft: 15}}>
            <IconButton
                style={{color: "whitesmoke"}}
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton
                style={{color: "whitesmoke"}}
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                style={{color: "whitesmoke"}}
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                style={{color: "whitesmoke"}}
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
}

