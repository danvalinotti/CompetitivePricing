import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import { Typography, Input } from "@material-ui/core";
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { RuleList } from "jss";
import IntegrationReactSelect2 from './SelectDrugDropdown.1' 

class ManageRequests extends Component {
    constructor(props) {
        super(props);

        this.authenticateUser();

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
        }
        this.getAllDrugs = this.getAllDrugs.bind(this)
        
        this.authenticateUser.bind(this);
        
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
        })
        this.setState({
            options: newOptions
        })
        // console.log("SETOPTIONS");
    }

    authenticateUser() {
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        Axios.post('http://localhost:8081/authenticate/token', userToken)
            .then(r => {
                if (r.data.password != "false") {
                    this.setState({
                        openSignIn: false,
                        loggedIn: true,
                        loggedInProfile: r.data
                    });

                    window.sessionStorage.setItem("token", r.data.password);
                    window.sessionStorage.setItem("loggedIn", "true");
                    if (r.data.role != "admin" && r.data.role != "createdadmin") {
                        this.props.history.push({ pathname: '/search' });
                    }

                } else {
                    this.props.history.push({ pathname: '/signIn' });
                }
            })
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
                <Dialog fullWidth onClose={()=>this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.editRequestDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                    Edit {this.state.selectedRequest ? this.state.selectedRequest.drugName: ''} {this.state.selectedRequest.program} Request
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Drug Name:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newDrugName} variant="outlined"
                                    onChange={this.handleDrugNameChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Brand Indicator:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newBrandIndicator} variant="outlined"
                                    onChange={this.handleBrandChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <Typography style={{padding:'5%'}} verticalAlign="bottom"> NDC:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField required variant="outlined" value={this.state.newNDC} onChange={this.handleNDCChange.bind(this)} /><br />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> GSN:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField margin="normal"  value={this.state.newGSN} variant="outlined"
                                    onChange={this.handleGSNChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Quantity:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newQuantity} variant="outlined"
                                    onChange={this.handleQuantityChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Zip Code:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newZipCode} variant="outlined"
                                    onChange={this.handleZipCodeChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Latitude:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newLatitude} variant="outlined"
                                    onChange={this.handleLatitudeChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Longitude:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField margin="normal"  value={this.state.newLongitude} variant="outlined"
                                    onChange={this.handleLongitudeChange.bind(this)} />
                            </Grid>
                        </Grid>                     

                        <br />
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.submitEditRequest.bind(this)} variant="contained" color="primary">Edit Request</Button>

                    </DialogContent>
                </Dialog>
                <Dialog fullWidth onClose={()=>this.handleAddClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.newRequestDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleAddClose.bind(this)}>
                    Add Request
                    </DialogTitle>
                    <DialogContent className="textCenter">
                    <Grid container >
                        <Grid item xs={5}>
                                <Typography  verticalAlign="bottom"> Select Drug:</Typography>
                        </Grid>
                                <Grid item xs={7}>
                                    <IntegrationReactSelect2 drugValue={this.state.selectedOption}
                                        drugOnChange={this.handleDrugChange.bind(this)} listOfDrugs={this.state.options}></IntegrationReactSelect2>
                                </Grid>
                                </Grid>
                                <br/>
                                <Grid container >
                        <Grid item xs={5}>
                                <Typography  verticalAlign="bottom"> Select Provider:</Typography>
                        </Grid>
                                <Grid item xs={7}>
                                <FormControl variant="outlined" style={{width:'66%'}}>        
                                     
                                  <Select value={this.state.newProgram}  onChange={this.handleNewProviderChange.bind(this)} >          
                                        
                                     <MenuItem value={0}>InsideRx</MenuItem>           
                                     <MenuItem value={1}>U.S Pharmacy Card</MenuItem>           
                                     <MenuItem value={2}>WellRx</MenuItem> 
                                     <MenuItem value={3}>MedImpact</MenuItem> 
                                     <MenuItem value={4}>SingleCare</MenuItem> 
                                     <MenuItem value={5}>Blink Health</MenuItem> 
                                     <MenuItem value={6}>GoodRx</MenuItem>    
                                          </Select>       
                                          </FormControl>
                                </Grid>
                                </Grid>
                                <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Drug Name:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField margin="normal"  value={this.state.newDrugName} variant="outlined"
                                    onChange={this.handleDrugNameChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Brand Indicator:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newBrandIndicator} variant="outlined"
                                    onChange={this.handleBrandChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <Typography style={{padding:'5%'}} verticalAlign="bottom"> NDC:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField required variant="outlined" value={this.state.newNDC} onChange={this.handleNDCChange.bind(this)} /><br />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> GSN:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField margin="normal"  value={this.state.newGSN} variant="outlined"
                                    onChange={this.handleGSNChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Quantity:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newQuantity} variant="outlined"
                                    onChange={this.handleQuantityChange.bind(this)} />
                            </Grid>
                        </Grid>
                       
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Zip Code:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newZipCode} variant="outlined"
                                    onChange={this.handleZipCodeChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Latitude:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newLatitude} variant="outlined"
                                    onChange={this.handleLatitudeChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Longitude:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField margin="normal"  value={this.state.newLongitude} variant="outlined"
                                    onChange={this.handleLongitudeChange.bind(this)} />
                            </Grid>
                        </Grid>    
                         <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> GoodRxId:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField margin="normal"  value={this.state.newGoodRxId} variant="outlined"
                                    onChange={this.handleGoodRxIdChange.bind(this)} />
                            </Grid>
                        </Grid>                 

                        <br />
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.submitAddRequest.bind(this)} variant="contained" color="primary">Add Request</Button>

                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}

export default withRouter(ManageRequests);