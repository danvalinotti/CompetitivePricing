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
import DatePicker from './DatePicker'
import KJUR from 'jsrsasign'

class DashBoardViewComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dashBoardDrugsData: [],
            filteredList: [],
            drugSort: "off",
            insideRxSort: "off",
            pharmCardSort: "off",
            wellRxSort: "off",
            medImpactSort: "off",
            pharmCardSort: "off",
            singleCareSort: "off",
            lowestPriceSort: "off",
            showDialog: false,
            reports: <div></div>

        }
        this.getDashboardDrugs();
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);
    }
    routeToSearch() {
        this.props.history.push({ pathname: '/search' });
    }
    handleClose() {
        console.log("CLOSE");
        this.setState({
            showDialog: false
        });
    }
    toggleDialog() {
        this.setState({
            showDialog: !this.state.showDialog,
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
    deleteDrug(drug, index) {
            console.log("delete");
            console.log(drug);
            console.log(index);
            
        Axios.post('https://drug-pricing-backend.cfapps.io/dashboard/drug/delete' , drug)
            .then(response => {
                  this.setState({
                    dashBoardDrugsData:   this.state.dashBoardDrugsData.splice(index,1),
                  })
             })
    }
    getDashboardDrugs() {
        var strtoken = window.sessionStorage.getItem("token");
        console.log("strtoken");
        console.log(strtoken);
        var token = {};
        token.value = strtoken;
        token.key = strtoken;
        console.log(token);
        Axios.post('https://drug-pricing-backend.cfapps.io/dashboard/get', token)
        .then(response => {
            console.log(response);
                this.setState({
                    dashBoardDrugsData: response.data,
                    filteredList: response.data
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
    // setFilterList(){
    //     this.setState({
    //         filteredList:this.state.dashBoardDrugsData
    //     })
    // }
    filterList(event) {
        var str = event.target.value.toLowerCase();
        var filteredList = [];
        this.state.dashBoardDrugsData.map(val => {
            var drugName = val.name.toLowerCase();
            if (drugName.includes(str)) {
                filteredList.push(val);
            }

        })
        console.log("filteredList"); 
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
        var exportList = [["Drug Name", "Drug Type", "Dosage Strength",
            "Quantity", "Zip Code", "Inside Rx Price", "U.S Pharmacy Card Price",
            "Well Rx Price", "MedImpact Price", "Singlecare Price",
            "Recommended Price", "Difference"]];
        data.forEach((element, index) => {
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
        console.log("REPORT");
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
                            <Button style={{marginBottom:'10px'}} variant="outlined" color="default" onClick={() => this.exportReport(item.drug)}>
                                Batch for {this.getDate(item.batchDetails.batchStart)}
                                <Icons icon="save" height="24" width="24" />
                            </Button>
                            <br />
                        </div>

                    ))} </div>

                if(response.data.length === 0 ){
                    inner = <div> <br/> No Results Found</div>
                }


                this.setState({
                    reports: inner
                });
            });

    }
    clickHome(){
        this.props.history.push({ pathname: '/search' });
    }
    clickDashboard(){
        this.props.history.push({ pathname: '/viewDashboard' });
    }
    clickReports(){
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
    





    render() {
        // if (this.props.dashBoardDrugsData != this.state.dashBoardDrugsData) {
        //     this.setState({
        //         dashBoardDrugsData: this.props.dashBoardDrugsData,

        //     });
        //     var element = document.getElementById("myZipCode").value;
        //     this.filterList({ target: { value: element } });
        // }
        return (
            <div>
                <HeaderComponent value={1} clickHome={this.clickHome} clickDashboard={this.clickDashboard} history={this.props.history} clickReports={this.clickReports}/>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <h4 className="row" style={{ paddingTop: '3%', marginRight: '0px', marginLeft: '0px' }}>
                        <div className="col-sm-6" style={{ fontWeight: 'bold', }} style={{ display: 'inline-flex', paddingLeft: '0px' }}>
                            <div style={{ padding: '10px', paddingLeft: '0px' }}>
                            Competitive Pricing
                         
                             </div>
                            <div className=" headerZip" style={{ padding: '0px' }}>
                                <input className="form-control search-bar " onChange={() => { this.filterList(event) }} type="text" id="myZipCode" placeholder="Filter Dashboard Drugs" />
                            </div>
                            {/* <div className="col-sm-3 headerZip" style={{ padding: '0px' }}>
                            <input className="form-control search-bar " onKeyPress={()=>{this.commandList(event)}} type="text" id="myZipCode" placeholder="Filter Dashboard Drugs" />
                        </div> */}
                        </div>
                        <div className="col-sm-6 " style={{ paddingRight: '0px', }}>
                            <div className="float-sm-right">
                                <button type="button" style={{ marginRight: '10px' }} onClick={() => { this.exportDrugs() }} className="btn btn-outline-primary">Export</button>
                                {/* <button type="button" onClick={() => { this.routeToSearch() }} className="btn btn-outline-primary">Search Drug</button> */}
                            </div>
                        </div>
                    </h4>
                    <div style={{ paddingTop: '30px' }}>
                        <table className="dashboardPrices">
                            <thead className="dashboardRows">
                                <tr>
                                    <th className="highlightedCell"></th>
                                    <th className="highlightedCell" onClick={() => { this.sortByName() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>Drug</label><div style={{ float: 'left' }}> <Icons icon={this.state.drugSort} height="24" width="24" /></div></div></th>
                                    <th className="highlightedCell" onClick={() => { this.sortByInsideRx() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>Current Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.insideRxSort} height="24" width="24" /></div></div></th>
                                    <th onClick={() => { this.sortByPharmCard() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>US Pharmacy Card Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.pharmCardSort} height="24" width="24" /></div></div></th>
                                    <th onClick={() => { this.sortByWellRx() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>Well Rx Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.wellRxSort} height="24" width="24" /></div></div></th>
                                    <th onClick={() => { this.sortByMedImpact() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>MedImpact Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.medImpactSort} height="24" width="24" /></div></div></th>
                                    <th onClick={() => { this.sortBySingleCare() }}><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>SingleCare Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.singleCareSort} height="24" width="24" /></div></div></th>
                                    <th onClick={() => { this.sortByLowestPrice() }} className="highlightedCell"><div style={{ display: 'inline-flex' }}><label style={{ float: 'left' }}>Lowest Market Price</label><div style={{ float: 'left' }}> <Icons icon={this.state.lowestPriceSort} height="24" width="24" /></div></div></th>
                                </tr>
                            </thead>
                            <tbody>
                  
                                {this.state.filteredList.map((drug, index) => {
                                    return (
                                        <tr className="dashboardRows" key={index}>
                                            <td className="highlightedCell"> <div style={{ color: "red" }} onClick={() => this.deleteDrug(drug,index)}><div><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg></div></div></td>
                                            <td className="highlightedCell">
                                                <span className="nameColor"><strong>{drug.name}</strong><br />
                                                    Type: {drug.drugType}<br />
                                                    Dosage: {drug.dosageStrength} {drug.dosageUOM} <br />
                                                    Quantity: {drug.quantity}<br />
                                                    Zip Code: {drug.zipcode}<br />
                                                </span></td>
                                            <td className="highlightedCell"><span className="programPrice colorBlue">
                                                {this.getDiv(drug.programs[0])} </span><br /></td>
                                            <td className="programPrice"><span className="programPrice colorBlue">
                                                {this.getDiv(drug.programs[1])} </span><br /></td>
                                            <td className="programPrice"><span className="programPrice colorBlue">
                                                {this.getDiv(drug.programs[2])}
                                            </span><br /></td>
                                            <td className="programPrice"><span className="programPrice colorBlue">
                                                {this.getDiv(drug.programs[3])}
                                            </span><br /></td>
                                            <td className="programPrice"><span className="programPrice colorBlue">
                                                {this.getDiv(drug.programs[4])}
                                            </span><br /></td>

                                            <td className="highlightedCell"><span className="programPrice colorBlue">
                                                {this.getDiv2(drug.recommendedPrice, drug.recommendedDiff)}
                                            </span><br /></td>
                                        </tr>);
                                })}
                            </tbody>
                        </table>
                        {(this.state.filteredList.length == 0)?<div style={{textAlign: 'center'}} className="highlightedCell">No Drugs Added To Dashboard</div>:<div></div>}                      
                    </div>
                </div>
                <Dialog onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.showDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Daily Summaries
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <DatePicker></DatePicker><br />
                        <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.getDailyReports() }} className="btn btn-outline-primary">View Daily Summary</button>
                        {this.state.reports}

                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(DashBoardViewComponent);