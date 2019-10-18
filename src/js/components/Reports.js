import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Icons from "./Icons" 
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress"; 
import {Snackbar, SnackbarContent, IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DatePicker from './DatePicker';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead'; 
import SplitButton from './SplitButton';
import Grid from '@material-ui/core/Grid';
import FilterDialogs from './FilterDialogs'
import ManualReportDialog from './ManualReportDialog'
import {authenticateUser} from '../services/authService';

class Reports extends Component {
    constructor(props) {
        super(props);
        authenticateUser(this);

        this.state = {
            dashBoardDrugsData: this.props.dashBoardDrugsData,
            filteredList: [],
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            reportsDialog: false,
            reportsByDate: <div></div>,
            reports: [],
            loadingDialog: false,
            page: 0,
            rowsPerPage: 10,
            openFilter: "off",
            filterFunc: null,
            selectedReports: [],
            openManualReport:false,
            loggedInProfile:{},
            showDialog: false,
            errorMessage: false
        };
        this.getAllReports();
        
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.handleErrorMessage = this.handleErrorMessage.bind(this);
        this.openErrorMessage = this.openErrorMessage.bind(this);
        this.closeErrorMessage = this.closeErrorMessage.bind(this);
    }

    handleErrorMessage() {
        this.openErrorMessage();
        setTimeout(() => {
            this.closeErrorMessage();
        }, 5000);
    }

    openErrorMessage() {
        this.setState({
            errorMessage: true
        });
    }

    closeErrorMessage() {
        this.setState({
            errorMessage: false
        })
    }

    toggleDialog() {
        this.setState({
            showDialog: this.state.showDialog ? false : true
        });
    }

    getAllReports(){
        Axios.get(process.env.API_URL + '/reports/getAll')
            .then(response => {
               this.state.reports = response.data;
                this.setState({
                    reports: response.data,
                    selectedReports: new Array(response.data.length).fill(false),

                });
                this.sortBy("", {"func":this.compareNewestToOldest.bind(this)});
            });
    }
  
   
    handleClose() {
      
        this.setState({
            reportsDialog: false
        });
    }
    handleCloseLoading() {
        this.setState({
            loadingDialog: false
        });
    }
    
    round(num) {
        var num2 = Number(num).toFixed(2);
        if (num2 === "NaN") {
            num2 = "N/A";
        } else {
            num2 = "" + num2;
            num2 = this.addCommas(num2);
            num2 = "$" + num2;
        }


        return num2;


    }

    addCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    filterList(event) {
        var str = event.target.value.toLowerCase();
        var filteredList = [];
        this.props.dashBoardDrugsData.map(val => {
            var drugName = val.name.toLowerCase();
            if (drugName.includes(str)) {
                filteredList.push(val);
            }

        });
        this.setState({
            filteredList: filteredList
        });
    }   
  
    exportReport(data) {
        let options = {
            responseType: 'blob',
        };
        this.toggleDialog();
        Axios.get(process.env.API_URL + '/asd/' + data.id,options)
        .then(response => {
            this.toggleDialog();
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', 'poi-generated-file.xlsx');
                document.body.appendChild(link);
                link.click(); 
        }).catch((error) => {
            // console.log(error);
            this.toggleDialog();
            this.handleErrorMessage();
        });
    }
    getDailyReports() {
        var inputVal = document.getElementById("mui-pickers-date").value;
        Axios.get(process.env.API_URL + '/masterList/getByDate/' + inputVal)
            .then(response => {

                var inner = <div><br />
                    {response.data.map(item => (
                        <div>
                            <Button style={{ marginBottom: '10px' }} variant="outlined" color="default" onClick={() => this.exportReport(item.drug)}>
                                Report for {this.getDate(item.batchDetails.batchStart)}
                                <Icons icon="save" height="24" width="24" />
                            </Button>
                            <br />
                        </div>

                    ))} </div>;

                if (response.data.length === 0) {
                    inner = <div> <br /> No Results Found</div>
                }


                this.setState({
                    reportsByDate: inner
                });
            }).catch((error) => {
                this.toggleDialog();

            });

    }
    clickHome() {
        this.props.history.push({ pathname: '/search' });
    }
    clickDashboard() {
        this.props.history.push({ pathname: '/viewDashboard' });
    }
    clickReports() {
        this.props.history.push({ pathname: '/reports' });
    }
    getDate(batchStart) {

        var d = new Date(batchStart);
        return d.toLocaleString();
    }
   
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage, 
        });
    }
    handleChangeRowsPerPage(event) {
        var rows = parseInt(event.target.value);
        this.setState({
            rowsPerPage: rows
        });
    }
    handleChange(event, index) {
    
        if (event.target.checked) {
            this.state.selectedReports[index]= true;
            this.setState({
                selectedReports:this.state.selectedReports,
            })
            
        } else {
            this.state.selectedReports[index]= false;
            this.setState({
                selectedReports:this.state.selectedReports,
            })
        }
       
    }
    downloadSelected() {
       
        this.state.selectedReports.forEach((report, index) => {
            if(report==true){
               this.exportReport(this.state.reports[index]);
            }
            
        })
    }
    sortBy(event, compare) {
        var list = this.state.reports;
        list.sort(compare.func);
        this.setState({
            selectedReports: [],
            reports: list
        });
    }
    filterBy(event, option) {

        this.setState({
            selectedReports: [],
            filterFunc: option.func,
            openFilter: option.dialog
        });



    }
  
    compareNewestToOldest(a, b) {
        var dateA = new Date(a.timestamp);
        var dateB = new Date(b.timestamp);

        if (dateA < dateB) return 1;
        if (dateB < dateA) return -1;

        return 0;
    }
    compareOldestToNewest(a, b) {
        var dateA = new Date(a.timestamp);
        var dateB = new Date(b.timestamp);

        if (dateA > dateB) return 1;
        if (dateB > dateA) return -1;

        return 0;
    }
    compareNumberOfDrugs(a, b) {
        if (a.drugCount < b.drugCount) return 1;
        if (b.drugCount < a.drugCount) return -1;

        return 0;
    }
    updateDialog(value) {
        this.setState({
            openFilter: value,
        });
    }
    getBetweenDates(start, end) {
        Axios.get(process.env.API_URL + '/reports/get/between/' + start + '/' + end)
            .then(response => {
                this.setState({
                    reports: response.data
                });
            });
    }
    
    equalDate(date) {
        Axios.get(process.env.API_URL + '/reports/get/date/' + date)
            .then(response => {
                this.setState({
                    reports: response.data
                });
            });
    }
    getWithDrugCount(drugCount) {

        Axios.get(process.env.API_URL + '/reports/get/drugCount/' + drugCount)
            .then(response => {
                this.setState({
                    reports: response.data
                });
            });
    }
    createManualReport(){
        this.setState({
            openManualReport:true,
        })
    }
 
    handleManualReportClose() {

        this.setState({
            openManualReport: false,
        });
    }

    render() {
        if (this.props.dashBoardDrugsData != this.state.dashBoardDrugsData) {
            this.setState({
                dashBoardDrugsData: this.props.dashBoardDrugsData,

            });
            var element = document.getElementById("myZipCode").value;
            this.filterList({ target: { value: element } });
        }
        return (
            <div>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <h4 className="row" style={{ paddingTop: '3%', marginRight: '0px', marginLeft: '0px' }}>
                        <div className="col-sm-6" style={{ fontWeight: 'bold', }} style={{ display: 'inline-flex', paddingLeft: '0px' }}>
                            <div style={{ padding: '10px', paddingLeft: '0px' }}>Reports </div>
                            <div className=" headerZip" style={{ padding: '0px' }}>
                            </div>
                        </div>
                        <div className="col-sm-6 " style={{ paddingRight: '0px', }}>
                            <div className="float-sm-right">
                            </div>
                        </div>
                    </h4>
                    <div style={{ paddingTop: '30px' }}>
                        <Container >
                            <Grid container spacing={1}>

                                <Grid item xs={2}>
                                    <SplitButton reset={this.getAllReports.bind(this)} masterFunction={this.sortBy.bind(this)} selections={[{ key: 0, text: "Newest to Oldest", func: this.compareNewestToOldest.bind(this) }, { key: 1, text: "Oldest to Newest", func: this.compareOldestToNewest.bind(this) }, { key: 2, text: "Number of Drugs", func: this.compareNumberOfDrugs.bind(this) }]} dropDownName="Sort" ></SplitButton>

                                </Grid>
                                <Grid item xs={2}>
                                    <SplitButton reset={this.getAllReports.bind(this)} masterFunction={this.filterBy.bind(this)} selections={[{ key: 0, text: "Specific Date", func: this.equalDate.bind(this), dialog: 'specificDate' }, { key: 1, text: "Date Range", func: this.getBetweenDates.bind(this), dialog: 'betweenDates' }, { key: 2, text: "Number Of Drugs", func: this.getWithDrugCount.bind(this), dialog: 'drugCount' }]} dropDownName="Filter" ></SplitButton>

                                </Grid>
                                <Grid item xs={2}>
                                    <SplitButton masterFunction={this.downloadSelected.bind(this)} selections={[{ key: 0, text: "Download Selected", func: this.equalDate.bind(this) }]} dropDownName="Actions"></SplitButton>

                                </Grid>
                                <Grid item xs={6}>
                                    <Button style={{ float: 'right' ,fontSize: '13px' ,height: '32px' }} onClick={() => { this.createManualReport() }} variant="contained" color="primary">Create Manual Report</Button>

                                </Grid>
                            </Grid>
                            <Table >
                                <TableHead >
                                    <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell >Date of Report</TableCell>
                                        <TableCell size="small" >Drug Count</TableCell>
                                        <TableCell padding="checkbox">Download</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.reports.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((report, index) => (
                                        <TableRow key={index}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    id={report.id}
                                                    onChange={() => this.handleChange(event,  this.state.page * this.state.rowsPerPage +index)}
                                                    value= {this.state.selectedReports[this.state.page * this.state.rowsPerPage +index]}
                                                    checked={this.state.selectedReports[ this.state.page * this.state.rowsPerPage +index]}
                                                    style={{ zIndex: 0 }}
                                                    color="primary"

                                                    inputProps={{
                                                        'aria-label': 'secondary checkbox',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{new Date(report.timestamp).toLocaleString()} </TableCell>
                                            <TableCell size="small"> {report.drugCount}</TableCell>
                                            <TableCell padding="checkbox" onClick={() => this.exportReport(this.state.reports[this.state.page * this.state.rowsPerPage +index])}> <Icons icon="save" height="24" width="24" /></TableCell>
                                        </TableRow>
                                    ))}


                                </TableBody>
                                <TableFooter>
                                    <TableRow>

                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            colSpan={4}
                                            count={this.state.reports.length}
                                            rowsPerPage={this.state.rowsPerPage}
                                            page={this.state.page}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'Rows per page' },
                                                native: true,
                                            }}

                                            onChangePage={this.handleChangePage.bind(this)}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(this)}

                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>

                        </Container><br /> <br />
                    </div>
                </div>
                <Dialog onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.reportsDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Daily Summaries
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <DatePicker></DatePicker><br />
                        <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.getDailyReports() }} className="btn btn-outline-primary">View Daily Summary</button>
                        {this.state.reportsByDate}

                    </DialogContent>
                </Dialog>
                <Dialog
                    onClose={() => this.handleCloseLoading()}
                    aria-labelledby="customized-dialog-title"
                    open={this.state.loadingDialog}
                >
                    <DialogTitle id="customized-dialog-title" onClose={this.handleCloseLoading.bind(this)}>
                        Manual Report
          </DialogTitle>
                    <DialogContent className="textCenter">
                        Your manual report is being created, this may take a few minutes.
                        You may close this dialog box and continue using the competitive pricing website.
                        If you leave the website, you will not recieve a download of your report. However,
                        the report will still be created and you may download it by clicking "View Daily Summaries".<br />
                        <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleCloseLoading() }} className="btn btn-outline-primary">Okay</button>
                        <br />
                        <CircularProgress />
                    </DialogContent>

                </Dialog>
                <Dialog onClose={() => this.toggleDialog.bind(this)}
                    aria-labelledby="customized-dialog-title" open={this.state.showDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.toggleDialog.bind(this)}>
                        Downloading report...
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <CircularProgress />
                    </DialogContent>
                </Dialog>

                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                    open={this.state.errorMessage}
                    autoHideDuration={5000}
                    onClose={this.handleErrorMessage}
                >
                    <SnackbarContent 
                        message={"An error occurred while downloading report. Check the console for errors."}
                        style={{backgroundColor: "#e00000", fontWeight: 600}}
                        action={[
                            <IconButton key="close" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        ]}
                    />
                </Snackbar>
                <FilterDialogs updateDialog={this.updateDialog.bind(this)} dialog={this.state.openFilter} filterFunc={this.state.filterFunc}></FilterDialogs>
                <ManualReportDialog dialog={this.state.openManualReport} onCloseFunc={this.handleManualReportClose.bind(this)}></ManualReportDialog>
            </div>
        )
    }
}

export default withRouter(Reports);