import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import {authenticateUser} from '../services/authService';

class ManageAlerts extends Component {
    constructor(props) {
        super(props);

        authenticateUser(this);

        this.state = {
            alerts: [],
            page: 0,
            rowsPerPage: 5,
            selectedProfiles: [],
            newProfileDialog: false,
            email: '',
            alertName: '',
            alertType: '',
            isAdmin: false,
            loggedInProfile: {},
            newAlertDialog: false,
            message: '',
            summary:'',
            header:'',
            footer: '',
            users:[],
            selectedRecipients:[],
            selectedNames:[],
            selectedDrug:null,
            allDrugs:[],
            percentChange:0.0,
            alertAllDrugs:true,
        };
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllDrugs = this.getAllDrugs.bind(this);
        
        this.populateAlerts();
        this.getAllDrugs();
        this.getAllUsers();
        
    }
    
    populateAlerts() {
        Axios.get(process.env.API_URL + '/get/alerts/all')
            .then(response => {
                // console.log(response.data)
                this.setState({
                    alerts: response.data,

                })
            })
    }
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage,
        });
    }
    handleSummaryChange(event) {
        this.setState({
            summary: event.target.value,
        });
    }
    handleHeaderChange(event) {
        this.setState({
            header: event.target.value,
        });
    }
    handleFooterChange(event) {
        this.setState({
            footer: event.target.value,
        });
    }
    handleChangeRowsPerPage(event) {
        var rows = parseInt(event.target.value);
        this.setState({
            rowsPerPage: rows
        });
    }
    clickHome() {
        this.props.history.push("/admin/manage/users");
    }
    clickDashboard() {
        this.props.history.push("/admin/manage/users");
    }
    clickReports() {
        this.props.history.push("/admin/manage/drugs");
    }
    clickAlerts() {
        this.props.history.push("/admin/manage/alerts");
    }
    handleClose() {
        this.setState({
            newAlertDialog: false
        })
    }
    addDrug() {
        this.setState({
            newAlertDialog: true
        })
        // console.log("addDrug")
    }
    getAllUsers(){
        Axios.get(process.env.API_URL + '/admin/get/users')
            .then(response => {
            // console.log(response.data)
                this.setState({
                    users: response.data,
                })
            })
    }
    getAllDrugs(){
        Axios.get(process.env.API_URL + '/drugmaster/get/all')
            .then(response => {
           
                this.setState({
                    allDrugs: response.data,
                })
            })
    }

    sendAlert() {
        var alert = {};
        var recipientIds = [];
        this.state.selectedRecipients.forEach(element => {
            recipientIds.push(element.id);
        });

        alert.name          = this.state.alertName;
        alert.header        = this.state.header;
        alert.footer        = this.state.footer;
        alert.summary       = this.state.summary;
        alert.deliveryType  = "email";
        alert.active = true;
        alert.recipients = recipientIds.toString();
        // console.log(alert);
        var rule = {};
        if(this.state.alertAllDrugs == true){
            rule.drugId = 0;
        }else{
            rule.drugId = this.state.selectedDrug.id;
        }
        
        rule.percentChange = this.state.percentChange;
        // console.log(rule);
        Axios.post(process.env.API_URL + '/create/alert/type', alert)
            .then(response => {
                rule.alertTypeId = response.data.id;
                this.setState({
                    newAlertDialog: false,
                });
                
                Axios.post(process.env.API_URL + '/create/drug/rule', rule)
                .then(response => {
                    
                });
            });

    }
    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        })
    }
    handleNameChange(event) {
        this.setState({
            alertName: event.target.value
        })
    }

    handleChange(event, index) {


        if (event.target.checked) {
            this.state.selectedProfiles[index] = true;
            this.setState({
                selectedProfiles: this.state.selectedProfiles,
            })

        } else {
            this.state.selectedProfiles[index] = false;
            this.setState({
                selectedProfiles: this.state.selectedProfiles,
            })
        }

    }
    handleTypeChange(event) {
        this.setState({
            alertType: event.target.value
        })
    }
    handleMessageChange(event) {
        this.setState({
            message: event.target.value
        })
    }
    getDate(time) {

        var d = new Date(time);
        return d.toLocaleString();
    }
    handleRecipientChange(event) {
        this.setState({
            selectedRecipients: event.target.value,
        });

    }
    handleDrugChange(event) {
        this.setState({
            selectedDrug: event.target.value,
        });

    }
    clickRequests() {
        this.props.history.push("/admin/manage/requests");
    }
    handlePercentChange(event) {
        this.setState({
            percentChange: event.target.value,
        });

    }
    handleAlertAllDrugs(event){
        this.setState({
            alertAllDrugs : !this.state.alertAllDrugs,
        });
        // console.log(event);
    }
    renderSelected(selectedArr){
        var str = "";
        selectedArr.forEach(element => {
           str +=  element.name +", ";
        });
        if(str.length>3){
            str = str.substring(0 , str.length-2)
        }
        return str.substring(0,20);
    }

    render() {

        return (
            <div>
                <TabBar page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={3} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}tab5={"Manage Requests"} clickTab5={this.clickRequests.bind(this)}></TabBar>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <br />
                    <div style={{ paddingTop: '30px' }}>

                        <Container>
                            <MaterialTable
                                title="Manage Alerts"
                                style={{ boxShadow: 0 }}
                                columns={[{ title: 'Alert Name', field: 'name' },
                                { title: 'Type', field: 'type' },
                                { title: 'Date / Time', field: 'time', type: 'datetime', render: (rowData) => this.getDate(rowData.time) },
                                ]}
                                data={this.state.alerts}
                                editable={{
                                    onRowAdd: newData =>
                                        new Promise((resolve, reject) => {
                                            // console.log("add")
                                        }),
                                    addFunction: () => this.addDrug.bind(this),

                                }}
                                options={{
                                    sorting: true,
                                    draggable: false,
                                    search: true,
                                    // selection: true,

                                }}
                                onSelectionChange={(rows) => { this.drugChange(rows) }}

                            />
                        </Container><br /> <br />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ManageAlerts);