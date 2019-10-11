import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import {authenticateUser} from '../services/authService';
import NewTableItemDialog from "./NewTableItemDialog";

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import AutoSuggestComponent from "./AutoSuggestComponent";
import DrugStrengthDropDown from "./drugStrengthDropdown";
import DrugQuantityDropDown from "./DrugQuantityDropDown";
import Button from '@material-ui/core/Button';
import CircularProgress from "@material-ui/core/CircularProgress";

class ManageRequests extends Component {
    constructor(props) {
        super(props);

        authenticateUser(this);

        this.state = {
            requests: [],
            page: 0,
            rowsPerPage: 5,
            isAdmin: false,
            loggedInProfile: {},
            editRequestDialog: false,
            newNDC:'',
            newQuantity:'',
            newZipCode:'',
            newDrugName:'',
            newBrandIndicator:'',
            newGSN:'',
            newLatitude:'',
            newLongitude:'',
            newGoodRxId: '',
            selectedRequest:{},
            newRequestDialog:false,
            selectedOption:{},
            options:[],
            drugList:[],
            newProgram:0,
            loading: false
        };
        this.getAllDrugs = this.getAllDrugs.bind(this);
        this.submit = this.submit.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.populateRequests = this.populateRequests.bind(this);
        this.getAllDrugs();
        this.populateRequests(); 
    }

    submit(values) {
        this.setState({
            newRequestDialog: false,
            loading: true
        })
        var drugRequest = {};
        drugRequest.drugId = values.drug.id;
        drugRequest.drugName = values.drug.name;
        drugRequest.ndc = values.ndc;
        drugRequest.quantity = values.quantity;
        drugRequest.zipcode = values.zipcode;
        drugRequest.brandIndicator = values.brandIndicator ? 'BRAND' : 'GENERIC';
        drugRequest.gsn = values.gsn;
        drugRequest.latitude = values.latitude;
        drugRequest.longitude = values.longitude;
        drugRequest.good_rx_id = values.goodRxId;
        drugRequest.programId = values.program.id;
        Axios.post(process.env.API_URL + '/request/create', drugRequest)
            .then(response => {
                this.populateRequests();
                this.setState({
                    loading: false
                })
            });
    }

    toggleDialog() {
        this.setState({
            newRequestDialog: this.state.newRequestDialog ? false : true
        });
    }
    
    getAllDrugs() {
    //  console.log("getting alldrugs")
        Axios.get(process.env.API_URL + '/drugmaster/get/all')
            .then(response => {
                // console.log("got ")
                // console.log(response.data)
                this.setState({
                    drugList: response.data,
                });
                this.mapOptions(response.data);
            });
    }

    mapOptions(drugList) {
        var newOptions = [];
        drugList.map((drug) => {
            newOptions.push({ value: drug, label: drug.name + " " + drug.dosageStrength + " " + "(" + drug.quantity + ")" })
        });
        this.setState({
            options: newOptions
        })
        // console.log("SETOPTIONS");
    }
    populateRequests() {
        Axios.get(process.env.API_URL + '/get/requests')
            .then(response => {
                // console.log(response.data);
                this.setState({
                    requests: response.data,
                })
            })
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
    clickHome() {
        this.props.history.push("/admin/manage/users");
    }
    clickDashboard() {
        this.props.history.push("/admin/manage/users");
    }
    clickReports() {
        this.props.history.push("/admin/manage/drugs");
    }
    clickRequests() {
        this.props.history.push("/admin/manage/requests");
    }
    clickAlerts() {
        this.props.history.push("/admin/manage/alerts");
    }
    editRequest(event, request){
        // console.log(request);
        // console.log(request);
        Axios.get(process.env.API_URL + '/drugmaster/get/id/'+request.drugId)
        .then(r => {
        this.setState({
            selectedRequest:request,
            newDrugName:request.drugName,
            newNDC:request.ndc,
            newQuantity : request.quantity,
            newZipCode: request.zipcode,
            newBrandIndicator: request.brandIndicator,
            newGSN:request.gsn,
            newLatitude:request.latitude,
            newLongitude:request.longitude,
            
            editRequestDialog: true,
        });}
        );
    }
    getProgram(programId){
        if(programId == 0){
            return "Inside Rx"
        }
        if(programId == 1){
            return "U.S Pharmacy Card"
        }
        else if(programId == 2){
            return "Well Rx"
        }
        else if(programId == 3){
            return "MedImpact"
        }
        else if(programId == 4){
            return "Singlecare"
        }
        else if(programId == 5){
            return "Blink Health"
        }
        else if(programId == 6){
            return "GoodRx"
        }

    }
    submitEditRequest(){
        // console.log(this.state.selectedRequest);
        var drugRequest = {};
        drugRequest.id = this.state.selectedRequest.id;
        drugRequest.drugName = this.state.newDrugName;
        drugRequest.ndc = this.state.newNDC;
        drugRequest.quantity = this.state.newQuantity;
        drugRequest.zipcode = this.state.newZipCode;
        drugRequest.brandIndicator = this.state.newBrandIndicator;
        drugRequest.gsn = this.state.newGSN;
        drugRequest.latitude = this.state.newLatitude;
        drugRequest.longitude = this.state.newLongitude;
        
        // console.log(drugRequest);
        Axios.post(process.env.API_URL + '/request/edit', drugRequest)
            .then(response => {
                this.populateRequests();
                this.setState({
                    editRequestDialog: false,
                })
            })
    }

    render() {
        return (
            <div>
                <TabBar page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={4} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}tab5={"Manage Requests"} clickTab5={this.clickRequests.bind(this)}></TabBar>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <br />
                    <div style={{ paddingTop: '30px' }}>

                        <Container>
                            <MaterialTable
                                title="Manage Requests"
                                style={{ boxShadow: 0, padding: 15 }}
                                columns={[{ title: 'Drug Name', field: 'drugName' },
                                { title: 'Program', field: 'programId',  render: (rowData) => this.getProgram(rowData.programId) },
                                { title: 'Quantity', field: 'quantity'},
                                { title: 'NDC', field: 'ndc'},
                                { title: 'GSN', field: 'gsn'},
                                ]}
                                data={this.state.requests}
                                editable={{
                                    // onRowAdd: newData =>
                                    //     new Promise((resolve, reject) => {
                                            // console.log("add")
                                    //     }),
                                    onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve, reject) => {
                                        // console.log("update")
                                    }),
                                    editFunction: () => this.editRequest.bind(this)
                                }}
                                options={{
                                    sorting: true,
                                    draggable: false,
                                    search: true,
                                    // selection: true,
                                }}
                                actions={[
                                    {
                                        icon: "add",
                                        isFreeAction: true,
                                        onClick: () => this.toggleDialog()
                                    }
                                ]}
                              
                            />


                        </Container><br /> <br />
                    </div>
                </div>
                <NewTableItemDialog
                    title="New Drug Request"
                    open={this.state.newRequestDialog}
                    toggleDialog={this.toggleDialog}
                    handleSubmit={this.submit}
                    loading={this.state.loading}
                    initValues={[
                        {
                            name: "Drug",
                            id: "drug",
                            type: "select",
                            value: {},
                            values: this.state.drugList
                        }, {
                            name: "Program",
                            id: 'program',
                            type: 'select',
                            value: '',
                            values: [
                                {id: 0, name: 'InsideRx'},
                                {id: 1, name: 'US Pharmacy Card'},
                                {id: 2, name: 'WellRx'},
                                {id: 3, name: 'MedImpact'},
                                {id: 4, name: 'SingleCare'},
                                {id: 5, name: 'Blink Health'},
                                {id: 6, name: 'GoodRx'}
                            ]
                        }, {
                            name: 'NDC',
                            id: 'ndc',
                            type: 'text',
                            value: ''
                        }, {
                            name: 'GSN',
                            id: 'gsn',
                            type: 'text',
                            value: ''
                        }, {
                            name: 'Quantity',
                            id: 'quantity',
                            type: 'number',
                            value: 0,
                        }, {
                            name: 'Brand Name',
                            id: 'brandIndicator',
                            type: 'checkbox',
                            value: false
                        }, {
                            name: 'Zipcode',
                            id: 'zipcode',
                            type: 'text',
                            value: ''
                        }, {
                            name: 'Longitude',
                            id: 'longitude',
                            type: 'number',
                            value: 0.0
                        }, {
                            name: 'Latitude',
                            id: 'latitude',
                            type: 'number',
                            value: 0.0
                        }, {
                            name: 'GoodRX ID',
                            id: 'goodRxId',
                            type: 'text',
                            value: ''
                        }
                    ]}
                />
            </div>
        )
    }
}

export default withRouter(ManageRequests);