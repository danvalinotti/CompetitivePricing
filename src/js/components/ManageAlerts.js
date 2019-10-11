import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from "@material-ui/core/Container";
import MaterialTable from "material-table";
import TabBar from "./TabBar";
import { authenticateUser } from "../services/authService";
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

class ManageAlerts extends Component {
    constructor(props) {
        super(props);

        authenticateUser(this);

        this.state = {
            alerts: [],
            page: 0,
            email: "",
            loggedInProfile: {},
            newAlertDialog: false,
            users: [],
            allDrugs: [],
            percentChange: 0.0,
            alertAllDrugs: true,
            loading: false
        };
        this.getAllUsers = this.getAllUsers.bind(this);
        this.getAllDrugs = this.getAllDrugs.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.submit = this.submit.bind(this);
        this.populateAlerts();
        this.getAllDrugs();
        this.getAllUsers();
    }

    populateAlerts() {
        Axios.get(process.env.API_URL + "/get/alerts/all").then(response => {
            // console.log(response.data)
            this.setState({
                alerts: response.data
            });
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
    clickRequests() {
        this.props.history.push("/admin/manage/requests");
    }
    getAllUsers() {
        Axios.get(process.env.API_URL + "/admin/get/users").then(response => {
            // console.log(response.data)
            this.setState({
                users: response.data
            });
        });
    }
    getAllDrugs() {
        Axios.get(process.env.API_URL + "/drugmaster/get/all").then(
            response => {
                this.setState({
                    allDrugs: response.data
                });
            }
        );
    }
    getDate(time) {
        var d = new Date(time);
        return d.toLocaleString();
    }
    toggleDialog() {
        this.setState({
            newAlertDialog: !this.state.newAlertDialog
        });
    }

    submit(values) {
        this.setState({
            loading: true
        });
        let alert = {};
        alert.name = values.name;
        alert.header = values.header;
        alert.footer = values.footer;
        alert.summary = values.summary;
        alert.deliveryType = "email";
        alert.active = true;
        alert.recipients = values.recipients.toString();

        var rule = {};
        if (alert.selectedDrug === 0) {
          rule.drugId = 0;
        } else {
          rule.drugId = alert.selectedDrug.id
        }
        rule.percentChange = values.percentChange;
        Axios.post(process.env.API_URL + "/create/alert/type", alert).then(
            response => {
                rule.alertTypeId = response.data.id;
                this.setState({
                    newAlertDialog: false
                });

                Axios.post(
                    process.env.API_URL + "/create/drug/rule",
                    rule
                ).then(response => {
                    this.setState({
                        loading: false
                    })
                });
            }
        );
    }

    render() {
        return (
            <div>
                <TabBar
                    page="admin"
                    profile={this.state.loggedInProfile}
                    color={"steelblue"}
                    value={3}
                    history={this.props.history}
                    tab1={"Home"}
                    clickHome={this.clickHome.bind(this)}
                    tab2={"Manage Users"}
                    clickDashboard={this.clickDashboard.bind(this)}
                    tab3={"Manage Drugs"}
                    clickReports={this.clickReports.bind(this)}
                    tab4={"Manage Alerts"}
                    clickTab4={this.clickAlerts.bind(this)}
                    tab5={"Manage Requests"}
                    clickTab5={this.clickRequests.bind(this)}
                />
                <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
                    <br />
                    <div style={{ paddingTop: "30px" }}>
                        <Container>
                            <MaterialTable
                                title="Manage Alerts"
                                style={{ boxShadow: 0, padding: 15 }}
                                columns={[
                                    { title: "Alert Name", field: "name" },
                                    { title: "Type", field: "type" },
                                    {
                                        title: "Date / Time",
                                        field: "time",
                                        type: "datetime",
                                        render: rowData =>
                                            this.getDate(rowData.time)
                                    }
                                ]}
                                data={this.state.alerts}
                                options={{
                                    sorting: true,
                                    draggable: false,
                                    search: true
                                }}
                                actions={[
                                    {
                                        icon: "add",
                                        isFreeAction: true,
                                        onClick: () => this.toggleDialog()
                                    }
                                ]}
                            />
                        </Container>
                        <br /> <br />
                    </div>
                </div>
                <NewTableItemDialog
                    title="New Alert"
                    initValues={[
                        {
                            name: "Alert Name",
                            id: "name",
                            type: "text",
                            value: ""
                        },
                        {
                            name: "Header Text",
                            id: "header",
                            type: "text",
                            value: ""
                        },
                        {
                            name: "Footer Text",
                            id: "footer",
                            type: "text",
                            value: ""
                        },
                        {
                            name: "Summary",
                            id: "summary",
                            type: "text",
                            value: ""
                        },
                        {
                            name: "Percent change",
                            id: "percentChange",
                            type: "number",
                            value: 0
                        },
                        {
                            name: "Recipients",
                            id: "recipients",
                            type: "selectMulti",
                            values: this.state.users,
                            selector: 'username',
                            value: []
                        },
                        {
                          name: "Selected drug",
                          id: "selectedDrug",
                          type: "select",
                          values: [{id: 0, name: 'All'}, ...this.state.allDrugs],
                          selector: 'id',
                          value: 0
                        }
                    ]}
                    open={this.state.newAlertDialog}
                    toggleDialog={this.toggleDialog}
                    handleSubmit={this.submit}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}

export default withRouter(ManageAlerts);
