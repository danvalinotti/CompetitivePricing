import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import Grid from "@material-ui/core/Grid";
import { authenticateUser } from "../services/authService";
import NewTableItemDialog from "./NewTableItemDialog";

class ManageUsers extends Component {
    constructor(props) {
        super(props);

        authenticateUser(this);

        this.state = {
            profiles: [],
            page: 0,
            rowsPerPage: 5,
            selectedProfiles: [],
            newProfileDialog: false,
            email: "",
            name: "",
            isAdmin: false,
            loggedInProfile: {},
            loading: false
        };
        this.populateProfiles();
        this.toggleDialog = this.toggleDialog.bind(this);
        this.submit = this.submit.bind(this);
    }
    populateProfiles() {
        Axios.get(process.env.API_URL + "/admin/get/users").then(response => {
            this.setState({
                profiles: response.data,
                selectedProfiles: new Array(response.data.length).fill(false)
            });
        });
    }
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage
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
    clickAlerts() {
        this.props.history.push("/admin/manage/alerts");
    }
    clickRequests() {
        this.props.history.push("/admin/manage/requests");
    }
    clickDashboard() {
        this.props.history.push("/admin/manage/users");
    }
    clickReports() {
        this.props.history.push("/admin/manage/drugs");
    }
    toggleDialog() {
        this.setState({
            newProfileDialog: this.state.newProfileDialog ? false : true
        });
    }
    submit(values) {
        this.setState({
            loading: true
        });
        var profile = {};

        profile.name = values.name;
        profile.username = values.email;
        if (this.state.isAdmin == true) {
            profile.role = "admin";
        } else {
            profile.role = "user";
        }

        Axios.post(process.env.API_URL + "/admin/create/user", profile).then(
            response => {
                this.populateProfiles();
                this.setState({
                    newProfileDialog: false,
                    loading: false
                });
            }
        );
    }

    render() {
        return (
            <div>
                <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
                    <br />
                    Manage Users
                    <div style={{ paddingTop: "30px" }}>
                        <Container>
                            <Grid container spacing={1}>
                                <Grid
                                    item
                                    direction="column"
                                    alignItems="flex-end"
                                    justify="flex-end"
                                >
                                    <Button
                                        style={{
                                            fontSize: "13px",
                                            height: "32px"
                                        }}
                                        onClick={() => this.toggleDialog()}
                                        variant="contained"
                                        color="primary"
                                    >
                                        Create Profile
                                    </Button>
                                </Grid>
                            </Grid>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell size="small">Name</TableCell>
                                        <TableCell padding="checkbox">
                                            Role
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.profiles
                                        .slice(
                                            this.state.page *
                                                this.state.rowsPerPage,
                                            this.state.page *
                                                this.state.rowsPerPage +
                                                this.state.rowsPerPage
                                        )
                                        .map((profile, index) => (
                                            <TableRow key={index}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        id={profile.id}
                                                        onChange={() =>
                                                            this.handleChange(
                                                                event,
                                                                this.state
                                                                    .page *
                                                                    this.state
                                                                        .rowsPerPage +
                                                                    index
                                                            )
                                                        }
                                                        value={
                                                            this.state
                                                                .selectedProfiles[
                                                                this.state
                                                                    .page *
                                                                    this.state
                                                                        .rowsPerPage +
                                                                    index
                                                            ]
                                                        }
                                                        checked={
                                                            this.state
                                                                .selectedProfiles[
                                                                this.state
                                                                    .page *
                                                                    this.state
                                                                        .rowsPerPage +
                                                                    index
                                                            ]
                                                        }
                                                        style={{ zIndex: 0 }}
                                                        color="primary"
                                                        inputProps={{
                                                            "aria-label":
                                                                "secondary checkbox"
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {profile.username}{" "}
                                                </TableCell>
                                                <TableCell size="small">
                                                    {" "}
                                                    {profile.name}
                                                </TableCell>
                                                <TableCell>
                                                    {profile.role}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            colSpan={4}
                                            count={this.state.profiles.length}
                                            rowsPerPage={this.state.rowsPerPage}
                                            page={this.state.page}
                                            SelectProps={{
                                                inputProps: {
                                                    "aria-label":
                                                        "Rows per page"
                                                },
                                                native: true
                                            }}
                                            onChangePage={this.handleChangePage.bind(
                                                this
                                            )}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage.bind(
                                                this
                                            )}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </Container>
                        <br /> <br />
                    </div>
                </div>
                <NewTableItemDialog
                    title="New User"
                    initValues={[
                        {
                            name: "Email",
                            id: "email",
                            value: "",
                            type: "email"
                        },
                        {
                            name: "Name",
                            id: "name",
                            value: "",
                            type: "text"
                        },
                        {
                            name: "Role",
                            id: "role",
                            type: "select",
                            value: [],
                            values: [
                                { id: "createdadmin", name: "Admin" },
                                { id: "createduser", name: "User" }
                            ]
                        }
                    ]}
                    open={this.state.newProfileDialog}
                    toggleDialog={this.toggleDialog}
                    handleSubmit={this.submit}
                    loading={this.state.loading}
                />
            </div>
        );
    }
}

export default withRouter(ManageUsers);
