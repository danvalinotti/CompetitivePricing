import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import {authenticateUser} from '../services/authService';

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
        };
        this.getAllDrugs = this.getAllDrugs.bind(this);
        
        
        this.populateRequests = this.populateRequests.bind(this);
        this.getAllDrugs();
        this.populateRequests(); 
        
    }
    
    getAllDrugs() {
    //  console.log("getting alldrugs")
        Axios.get('http://localhost:8081/drugmaster/get/all')
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
        Axios.get('http://localhost:8081/get/requests')
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
    handleClose() {
        this.setState({
            editRequestDialog: false
        })
    }
    handleAddClose() {
        this.setState({
            newRequestDialog: false
        })
    }
    handleNDCChange(event) {
        this.setState({
            newNDC: event.target.value,
        });
    }
    handleQuantityChange(event) {
        this.setState({
            newQuantity: event.target.value,
        });
    }
    handleZipCodeChange(event) {
        this.setState({
            newZipCode: event.target.value,
        });
    }
    handleDrugNameChange(event) {
        this.setState({
            newDrugName: event.target.value,
        });
    }
    handleBrandChange(event) {
        this.setState({
            newBrandIndicator: event.target.value,
        });
    }
    handleGSNChange(event) {
        this.setState({
            newGSN: event.target.value,
        });
    }
    handleLatitudeChange(event) {
        this.setState({
            newLatitude: event.target.value,
        });
    }
    handleLongitudeChange(event) {
        this.setState({
            newLongitude: event.target.value,
        });
    }
    handleGoodRxIdChange(event) {
        this.setState({
            newGoodRxId: event.target.value,
        });
    }
    handleDrugChange(selectedOption) {

        this.setState({ selectedOption: selectedOption });
    };

    editRequest(event, request){
        // console.log(request);
        // console.log(request);
        Axios.get('http://localhost:8081/drugmaster/get/id/'+request.drugId)
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
    addRequest() {

        this.setState({
            newRequestDialog: true
        })
    }
    handleNewProviderChange(event){
        this.setState({
            newProgram: event.target.value
        })
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
        Axios.post('http://localhost:8081/request/edit', drugRequest)
            .then(response => {
                this.populateRequests();
                this.setState({
                    editRequestDialog: false,
                })
            })
    }
    submitAddRequest(){
        
        var drugRequest = {};
        // console.log(this.state.selectedOption)
        drugRequest.drugId = this.state.selectedOption.value.id;
        drugRequest.drugName = this.state.newDrugName;
        drugRequest.ndc = this.state.newNDC;
        drugRequest.quantity = this.state.newQuantity;
        drugRequest.zipcode = this.state.newZipCode;
        drugRequest.brandIndicator = this.state.newBrandIndicator;
        drugRequest.gsn = this.state.newGSN;
        drugRequest.latitude = this.state.newLatitude;
        drugRequest.longitude = this.state.newLongitude;
        drugRequest.good_rx_id = this.state.newGoodRxId;
        drugRequest.programId = this.state.newProgram;
        // console.log(drugRequest);
        Axios.post('http://localhost:8081/request/create', drugRequest)
            .then(response => {
                this.populateRequests();
                this.setState({
                    newRequestDialog: false,
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
                                style={{ boxShadow: 0 }}
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
                                    onRowAdd: newData =>
                                    new Promise((resolve, reject) => {
                                        // console.log("add")
                                    }),
                                    addFunction: () => this.addRequest.bind(this),
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
                              
                            />


                        </Container><br /> <br />
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ManageRequests);