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


class ManageAlerts extends Component {
    constructor(props) {
        super(props);

        this.authenticateUser();

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
        }
        this.authenticateUser.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllDrugs = this.getAllDrugs.bind(this);
        
        this.populateAlerts();
        this.getAllDrugs();
        this.getAllUsers();
        
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
    populateAlerts() {
        Axios.get('http://localhost:8081/get/alerts/all')
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
        Axios.get('http://localhost:8081/admin/get/users')
            .then(response => {
            // console.log(response.data)
                this.setState({
                    users: response.data,
                })
            })
    }
    getAllDrugs(){
        Axios.get('http://localhost:8081/drugmaster/get/all')
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
        Axios.post('http://localhost:8081/create/alert/type', alert)
            .then(response => {
                rule.alertTypeId = response.data.id
                this.setState({
                    newAlertDialog: false,
                });
                
                Axios.post('http://localhost:8081/create/drug/rule', rule)
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
        var str = ""
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
                <Dialog fullWidth onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.newAlertDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Send Alert
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <Grid container   >
                            <Grid item xs={5}>
                                <Typography style={{padding:'5%'}} verticalAlign="bottom"> Alert Name:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField required variant="outlined" value={this.state.alertName} onChange={this.handleNameChange.bind(this)} /><br />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography style={{padding:'20%'}} verticalAlign="bottom"> Summary Message:</Typography>
                            </Grid>
                            <Grid item xs={7}>

                                <TextField id="outlined-multiline-flexible"  margin="normal"
                                    multiline rows="4" value={this.state.summary} variant="outlined"
                                    onChange={this.handleSummaryChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography style={{padding:'25%'}} verticalAlign="bottom"> Header Text:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                            
                                <TextField id="outlined-multiline-flexible" margin="normal"
                                    multiline rows="4" value={this.state.header} variant="outlined"
                                    onChange={this.handleHeaderChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography style={{padding:'25%'}} verticalAlign="bottom"> Footer Text:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                        
                                <TextField id="outlined-multiline-flexible"  margin="normal"
                                    multiline rows="4" value={this.state.footer} variant="outlined"
                                    onChange={this.handleFooterChange.bind(this)} />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography style={{padding:'15%'}} verticalAlign="bottom"  > Recipients:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <FormControl style={{padding:'5%'}} variant="outlined">
                                    <Select
                                        multiple style={{ width: '200px'}}
                                        value={this.state.selectedRecipients}
                                        onChange={this.handleRecipientChange.bind(this)}   
                                        renderValue={selected => this.renderSelected(selected)}
                                        input={<OutlinedInput  /> }  >
                                        {this.state.users.map(user => (
                                            <MenuItem key={user.id} value={user} >
                                                <Checkbox
                                                    checked={this.state.selectedRecipients.indexOf(user) > -1} />
                                                <ListItemText primary={user.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography style={{padding:'15%'}} verticalAlign="bottom"  > Alert for All Drugs:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                            <Checkbox checked={this.state.alertAllDrugs} onChange={this.handleAlertAllDrugs.bind(this)}/>
                            </Grid>
                        </Grid>
                        {this.state.alertAllDrugs ==false ? 
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography style={{padding:'15%'}} verticalAlign="bottom"  > Drug:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <FormControl style={{padding:'5%'}} variant="outlined">
                                    <Select
                                        style={{ width: '200px'}}
                                        value={this.state.selectedDrug}
                                        onChange={this.handleDrugChange.bind(this)}   
                                        renderValue={selected => (selected.name+"").substring(0,20)}
                                        input={<OutlinedInput  /> }  >
                                        {this.state.allDrugs.map(drug => (
                                            <MenuItem key={drug.id} value={drug} >
                                                <ListItemText primary={drug.name + " "+ drug.dosageStrength+drug.dosageUOM + "("+drug.quantity+")"} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>: ''}
                        <Grid container   >
                            <Grid item xs={5}>
                                <Typography style={{padding:'5%'}} verticalAlign="bottom"> Percentage Change:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField required variant="outlined" value={this.state.percentChange} onChange={this.handlePercentChange.bind(this)} /><br />
                            </Grid>
                        </Grid>

                        <br />
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.sendAlert.bind(this)} variant="contained" color="primary">Send Alert</Button>

                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}

export default withRouter(ManageAlerts);