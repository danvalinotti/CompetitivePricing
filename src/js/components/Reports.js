import React, { Component } from "react";
import HeaderComponent from "./HeaderComponent";
import * as Sorting from "./Sorting";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Icons from "./Icons"
import { isNumber } from "util";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";
import { runInThisContext } from "vm";
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
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import SplitButton from './SplitButton';
import Grid from '@material-ui/core/Grid';
import FilterDialogs from './FilterDialogs'
import ManualReportDialog from './ManualReportDialog'


class Reports extends Component {
    constructor(props) {
        super(props);
        this.authenticateUser();

        this.state = {
            dashBoardDrugsData: this.props.dashBoardDrugsData,
            filteredList: [],
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
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
        }
        this.authenticateUser.bind(this);
        this.getAllReports();
        
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);
            console.log("hello");
            
            

    }
    authenticateUser(){
       
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token' , userToken)
        .then(r => {
            console.log(r.data)
            if(r.data.password != "false"){
              this.setState({
                openSignIn : false,
                loggedIn : true,
                loggedInProfile: r.data
              });
              console.log("LOGGED IN");
             
              window.sessionStorage.setItem("token",r.data.password);
              window.sessionStorage.setItem("loggedIn","true");
            //   this.props.history.push({ pathname: '/search' });
            }else{
               console.log("incorrect");
               this.props.history.push({ pathname: '/signIn' });
            }
        })
    }
    getAllReports(){
        Axios.get('https://drug-pricing-backend.cfapps.io/reports/getAll')
            .then(response => {
                console.log("REPORTS"); 
               console.log(response);
               this.state.reports = response.data;
                this.setState({
                    reports: response.data,
                    selectedReports: new Array(response.data.length).fill(false),

                });
                this.sortBy("", {"func":this.compareNewestToOldest.bind(this)});
            });
    }
    routeToSearch() {
        this.props.history.push({ pathname: '/search' });
    }
    resetSelected(){
        var arr = new Array(this.state.count).fill(false);
        this.setState({
            selectedReports:arr
        });
    }
    manualReport() {
        this.setState({
            loadingDialog: true
        });

        Axios.get('https://drug-pricing-backend.cfapps.io/masterList/addToMasterList')
            .then(response => {
                this.exportReport(response.data.drug);
                this.handleCloseLoading();
            });

    }
    handleClose() {
        console.log("CLOSE");
        this.setState({
            reportsDialog: false
        });
    }
    handleCloseLoading() {
        console.log("closing loading");
        this.setState({
            loadingDialog: false
        });
    }
    toggleDialog() {
        this.setState({
            reportsDialog: !this.state.reportsDialog,
        });
    }
    viewSummaries() {
        this.toggleDialog();
        console.log("view");
    }
    exportDrugs() {
        var exportList = [["Drug Name", "Drug Type", "Dosage Strength",
            "Quantity", "Zip Code", "Inside Rx Price", "U.S Pharmacy Card Price",
            "Well Rx Price", "MedImpact Price", "Singlecare Price",
            "Recommended Price", "Difference"]];
        this.state.filteredList.forEach((element, index) => {
            var row = [element.name, element.drugType, element.dosageStrength + " " + element.dosageUOM,
            element.quantity, '= "' + element.zipcode + '"', element.programs[0].price, element.programs[1].price,
            element.programs[2].price, element.programs[3].price, element.programs[4].price,
            element.recommendedPrice, element.recommendedDiff];

            exportList.push(row);

        });

        console.log(exportList);
        let csvContent = "data:text/csv;charset=utf-8,";

        exportList.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "DashboardDrugs.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
    }
    deleteDrug(id) {

        Axios.delete('https://drug-pricing-backend.cfapps.io/removeDrug/' + id)
            .then(response => {
                this.props.actions.dashBoardDrugs();
                this.setState({
                    dashBoardDrugsData: this.props.dashBoardDrugsData,

                })
                var element = document.getElementById("myZipCode").value;
                this.filterList({ target: { value: element } });

            })
    }
    getDashboardDrugs() {
        fetch('https://drug-pricing-backend.cfapps.io/getAllPharmacy')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    dashBoardDrugsData: json
                })
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

    getDiv(program) {
        if (program.diff >= 0) {
            return (<div style={{ color: "#08ca00" }}>
                <span>{this.round(program.price)}</span>
                <div style={{ fontWeight: 'normal' }}>{this.round(program.diff)}</div>
            </div>)
        } else {
            return (<div style={{ color: "red" }}>
                <span>{this.round(program.price)}</span>
                <div style={{ fontWeight: 'normal' }}>{this.round(program.diff)}</div>
            </div>)
        }

    }
    getDiv2(price, diff) {
        if (diff >= 0) {
            return (<div style={{ color: "#08ca00" }}>
                <span>{this.round(price)}</span>
                <div style={{ fontWeight: 'normal' }}>{this.round(diff)}</div>
            </div>)
        } else {
            return (<div style={{ color: "red" }}>
                <span>{this.round(price)}</span>
                <div style={{ fontWeight: 'normal' }}>{this.round(diff)}</div>
            </div>)
        }

    }
    filterList(event) {
        var str = event.target.value.toLowerCase();
        var filteredList = [];
        this.props.dashBoardDrugsData.map(val => {
            var drugName = val.name.toLowerCase();
            if (drugName.includes(str)) {
                filteredList.push(val);
            }

        })
        console.log(filteredList);
        this.setState({
            filteredList: filteredList
        });
    }
    commandList(event) {
        if (event.key === 'Enter') {
            this.sortList();
            //  var command = this.parseCommand(event.target.value);
        }
    }
    parseCommand(strCommand) {
        var command = [];
        var i = strCommand.indexOf(":");
        command.push(strCommand.substring(0, i));
        command.push(strCommand.substring(i + 1, strCommand.length));
        console.log(command);
        return command;
    }
    sortList(sortBy) {

        var sorted = Sorting.sortByQuantity(this.state.filteredList, 1);
        this.setState({
            filteredList: sorted
        })
        console.log("sorted");
        console.log(sorted);
    }
    sortByName() {
        var sort = "off";
        switch (this.state.drugSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off";
                break;
        }
        this.setState({
            drugSort: sort,
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            filteredList: Sorting.sortByName(this.state.filteredList, sort)
        });

    }
    sortByInsideRx() {
        var sort = "off";
        switch (this.state.insideRxSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off";
                break;
        }
        this.setState({
            drugSort: "off",
            insideRxSort: sort,
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            filteredList: Sorting.sortByProgramPrice(this.state.filteredList, 0, sort)
        });
    }
    sortByPharmCard() {
        var sort = "off";
        switch (this.state.pharmCardSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off";
                break;
        }
        this.setState({
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: sort,
            singleCareSort: "off",
            lowestPriceSort: "off",
            filteredList: Sorting.sortByProgramPrice(this.state.filteredList, 1, sort)
        });
    }
    sortByWellRx() {
        var sort = "off";
        switch (this.state.wellRxSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off"
                break;
        }
        this.setState({
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: sort,
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            filteredList: Sorting.sortByProgramPrice(this.state.filteredList, 2, sort)
        });
    }
    sortByMedImpact() {
        console.log(this.state.medImpactSort);
        var sort = "off";
        switch (this.state.medImpactSort) {
            case 'off':
                sort = "up";
                break;
            case 'up':
                sort = "down";
                break;
            case 'down':
                sort = "off";
                break;

        }
        //   console.log(sort);
        this.setState({
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: sort,
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            filteredList: Sorting.sortByProgramPrice(this.state.filteredList, 3, sort)
        });
    }
    sortBySingleCare() {
        var sort = "off";
        switch (this.state.singleCareSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off"
                break;
        }
        this.setState({
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: sort,
            lowestPriceSort: "off",
            filteredList: Sorting.sortByProgramPrice(this.state.filteredList, 4, sort)
        });
    }
    exportReport(data) {
        console.log(data); 
        let options = {
            responseType: 'blob',

        }
        Axios.get('https://drug-pricing-backend.cfapps.io/reportdrugs/get/' + data.id,options)
        .then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', 'poi-generated-file.xlsx');
                document.body.appendChild(link);
                link.click();
                console.log(response.data)
               
                
        });
    }
    getDailyReports() {
        console.log("test");
        var self = this;
        var inputVal = document.getElementById("mui-pickers-date").value;
        console.log("INPUTVAL");
        console.log(inputVal);
        Axios.get('https://drug-pricing-backend.cfapps.io/masterList/getByDate/' + inputVal)
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

                    ))} </div>

                if (response.data.length === 0) {
                    inner = <div> <br /> No Results Found</div>
                }


                this.setState({
                    reportsByDate: inner
                });
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
    sortByLowestPrice() {
        var sort = "off";
        switch (this.state.lowestPriceSort) {
            case "off":
                sort = "up";
                break;
            case "up":
                sort = "down";
                break;
            case "down":
                sort = "off";
                break;
        }
        this.setState({
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: sort,
            filteredList: Sorting.sortByLowestPrice(this.state.filteredList, sort)
        });
    }
    handleChangePage(event, newPage) {
        console.log("handleChangePAge");
        console.log(this.state.selectedReports);
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
        console.log(this.state.selectedReports);
        console.log(index);
    
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
        console.log("this.state.selectedReports");
        console.log(this.state.selectedReports);
        this.state.selectedReports.forEach((report, index) => {
            if(report==true){
               this.exportReport(this.state.reports[index]);
            }
            
        })
    }
    sortBy(event, compare) {
        console.log(compare);
        console.log("sort ing");
        var list = this.state.reports;
        console.log(list);
        list.sort(compare.func);
        console.log(list);
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
    filterByHelper(option) {
        var list = this.state.reports;
        console.log("filterhelper");
        option.func()
        // this.setState({
        //     reports:list
        // });
    }
    compareNewestToOldest(a, b) {
        console.log("compare")
        console.log(a);
        var dateA = new Date(a.timestamp);
        var dateB = new Date(b.timestamp);

        if (dateA < dateB) return 1;
        if (dateB < dateA) return -1;

        return 0;
    }
    compareOldestToNewest(a, b) {
        console.log("compare")
        console.log(a);
        var dateA = new Date(a.timestamp);
        var dateB = new Date(b.timestamp);

        if (dateA > dateB) return 1;
        if (dateB > dateA) return -1;

        return 0;
    }
    compareNumberOfDrugs(a, b) {
        console.log("compare")
        console.log(a);
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
        Axios.get('https://drug-pricing-backend.cfapps.io/reports/get/between/' + start + '/' + end)
            .then(response => {
                this.setState({
                    reports: response.data
                });
            });
    }
    getBetweenDrugs(start, end) {
        //Not Yet
    }
    equalDate(date) {
        Axios.get('https://drug-pricing-backend.cfapps.io/reports/get/date/' + date)
            .then(response => {
                this.setState({
                    reports: response.data
                });
            });
    }
    getWithDrugCount(drugCount) {

        Axios.get('https://drug-pricing-backend.cfapps.io/reports/get/drugCount/' + drugCount)
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
    reportIncludes(selectedReports, givenReport) {
        console.log("REPORT")
        var found = false;
        var batchStart = givenReport.batchDetails.batchStart;
        for (var i = 0; i < selectedReports.length; i++) {
            console.log(selectedReports[i].batchDetails.batchStart == batchStart);
            if (selectedReports[i].batchDetails.batchStart == batchStart) {
                found = true;
                break;
            }
        }
        console.log(found);
        return found
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
                <HeaderComponent profile={this.state.loggedInProfile} value={2} clickHome={this.clickHome}history={this.props.history} clickDashboard={this.clickDashboard} clickReports={this.clickReports} />
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <h4 className="row" style={{ paddingTop: '3%', marginRight: '0px', marginLeft: '0px' }}>
                        <div className="col-sm-6" style={{ fontWeight: 'bold', }} style={{ display: 'inline-flex', paddingLeft: '0px' }}>
                            <div style={{ padding: '10px', paddingLeft: '0px' }}>Reports </div>
                            <div className=" headerZip" style={{ padding: '0px' }}>
                                {/* <input className="form-control search-bar " onChange={() => { this.filterList(event) }} type="text" id="myZipCode" placeholder="Filter Dashboard Drugs" /> */}
                            </div>
                            {/* <div className="col-sm-3 headerZip" style={{ padding: '0px' }}>
                            <input className="form-control search-bar " onKeyPress={()=>{this.commandList(event)}} type="text" id="myZipCode" placeholder="Filter Dashboard Drugs" />
                        </div> */}
                        </div>
                        <div className="col-sm-6 " style={{ paddingRight: '0px', }}>
                            <div className="float-sm-right">
                                {/* <button type="button" style={{ marginRight: '10px' }} onClick={() => { this.viewSummaries() }} className="btn btn-outline-primary">View Daily Summaries</button>
                                <button type="button" onClick={() => { this.manualReport() }} className="btn btn-outline-primary">Manual Report</button> */}
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
                <FilterDialogs updateDialog={this.updateDialog.bind(this)} dialog={this.state.openFilter} filterFunc={this.state.filterFunc}></FilterDialogs>
                <ManualReportDialog dialog={this.state.openManualReport} onCloseFunc={this.handleManualReportClose.bind(this)}></ManualReportDialog>
            </div>
        )
    }
}

export default withRouter(Reports);