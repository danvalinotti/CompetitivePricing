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
            message:''
        }
        this.authenticateUser.bind(this);
        this.populateAlerts();
    }
    authenticateUser() {
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token', userToken)
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
        Axios.get('https://drug-pricing-backend.cfapps.io/get/alerts/all')
            .then(response => {
                console.log(response.data)
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
        console.log("addDrug")
    }
    sendAlert() {
        var alert = {};

        alert.name = this.state.alertName;
        alert.type = this.state.alertType;
        alert.message = this.state.message;

        Axios.post('https://drug-pricing-backend.cfapps.io/send/alert', alert)
            .then(response => {
                this.populateAlerts();
                this.setState({
                    newAlertDialog: false,
                })
            })
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
    handleTypeChange(event){
        this.setState({
            alertType:event.target.value
        })
    }
    handleMessageChange(event){
        this.setState({
            message:event.target.value
        })
    }
    getDate(time) {

        var d = new Date(time);
        return d.toLocaleString();
    }

    render() {

        return (
            <div>
                <TabBar page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={3} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Alerts"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}></TabBar>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <br />
                    <div style={{ paddingTop: '30px' }}>

                        <Container>
                            <MaterialTable
                                title="Manage Alerts"
                                style={{ boxShadow: 0 }}
                                columns={[{ title: 'Alert Name', field: 'name' },
                                { title: 'Type', field: 'type' },
                                { title: 'Date / Time', field: 'time',type:'datetime', render:(rowData)=>this.getDate(rowData.time)},
                                ]}
                                data={this.state.alerts}
                                editable={{
                                    onRowAdd: newData =>
                                        new Promise((resolve, reject) => {
                                            console.log("add")
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
                                <Typography verticalAlign="bottom"> Alert Name:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField required variant="outlined" value={this.state.alertName} onChange={this.handleNameChange.bind(this)} /><br/>
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Alert Type:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                            <br/>
                                <TextField required variant="outlined" value={this.state.alertType} onChange={this.handleTypeChange.bind(this)} /><br/>
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Alert Message:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                            <br/>
                                <TextField
                                    id="outlined-multiline-flexible"
                                    label="Multiline"
                                    multiline
                                    rowsMax="4"
                                    value={this.state.message}
                                    onChange={this.handleMessageChange.bind(this)}
                                   
                                    margin="normal"
                                    variant="outlined"
                                />                            </Grid>
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