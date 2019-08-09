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
import { Typography } from "@material-ui/core";

import TabBar from "./TabBar";

class ManageUsers extends Component {
    constructor(props) {
        super(props);
        
        this.authenticateUser();

        this.state = {
            profiles: [],
            page: 0,
            rowsPerPage: 5,
            selectedProfiles: [],
            newProfileDialog: false,
            email: '',
            name:'',
            isAdmin:false,
            loggedInProfile:{},
        }
        this.authenticateUser.bind(this);
        this.populateProfiles();
    }
    authenticateUser(){
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        Axios.post('http://100.25.217.246:8081/authenticate/token' , userToken)
        .then(r => {
            if(r.data.password != "false"){
              this.setState({
                openSignIn : false,
                loggedIn : true,
                loggedInProfile: r.data
              });
             
              window.sessionStorage.setItem("token",r.data.password);
              window.sessionStorage.setItem("loggedIn","true");
             if(r.data.role != "admin" && r.data.role != "createdadmin"){
                 this.props.history.push({ pathname: '/search' });
             }
           
            }else{
               this.props.history.push({ pathname: '/signIn' });
            }
        })
    }
    populateProfiles() {
        Axios.get('http://100.25.217.246:8081/admin/get/users')
            .then(response => {
                this.setState({
                    profiles: response.data,
                    selectedProfiles: new Array(response.data.length).fill(false),
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
    handleClose() {
        this.setState({
            newProfileDialog: false
        })
    }
    addProfile() {
        this.setState({
            newProfileDialog: true
        })
    }
    createProfile() {
      var profile = {};
      
      profile.name = this.state.name;
      profile.username = this.state.email;
      if(this.state.isAdmin == true){
        profile.role= "admin"  ;  
      }else{
        profile.role = "user";
      }
     

      Axios.post('http://100.25.217.246:8081/admin/create/user' , profile)
            .then(response => {
                this.populateProfiles(); 
                  this.setState({
                    newProfileDialog:   false,
                  })
             })
    }
    handleEmailChange(event){
        this.setState({
            email: event.target.value
        })
    }
    handleNameChange(event){
        this.setState({
            name: event.target.value
        })
    }
    
    handleChange(event,index) {

    
        if (event.target.checked) {
            this.state.selectedProfiles[index]= true;
            this.setState({
                selectedProfiles:this.state.selectedProfiles,
            })
            
        } else {
            this.state.selectedProfiles[index]= false;
            this.setState({
                selectedProfiles:this.state.selectedProfiles,
            })
        }
       
    }

    render() {

        return (
            <div>
                <TabBar  page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={1} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}tab5={"Manage Requests"} clickTab5={this.clickRequests.bind(this)}></TabBar>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <br />
                    Manage Users
                    <div style={{ paddingTop: '30px'}}>
                        <Container >
                            <Grid container spacing={1}>

                                <Grid item direction="column" alignItems="right" justify="right">
                                    <Button style={{ fontSize: '13px', height: '32px' }} onClick={() => { this.addProfile() }} variant="contained" color="primary">Create Profile</Button>
                                </Grid>
                            </Grid>
                            <Table >
                                <TableHead >
                                    <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell >Email</TableCell>
                                        <TableCell size="small" >Name</TableCell>
                                        <TableCell padding="checkbox">Role</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.profiles.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((profile, index) => (
                                        <TableRow key={index}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    id={profile.id}
                                                    onChange={() => this.handleChange(event,  this.state.page * this.state.rowsPerPage +index)}
                                                    value= {this.state.selectedProfiles[this.state.page * this.state.rowsPerPage +index]}
                                                    checked={this.state.selectedProfiles[ this.state.page * this.state.rowsPerPage +index]}
                                                     style={{ zIndex: 0 }}
                                                    color="primary"

                                                    inputProps={{
                                                        'aria-label': 'secondary checkbox',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{profile.username} </TableCell>
                                            <TableCell size="small"> {profile.name}</TableCell>
                                            <TableCell>{profile.role}</TableCell>
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
                    aria-labelledby="customized-dialog-title" open={this.state.newProfileDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Add User
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <Grid container   >
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom"> Email:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    id="standard-name"
                                
                                    value={this.state.email}
                                    onChange={this.handleEmailChange.bind(this)}
                                    margin="none"
                                />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom"> Name:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    id="standard-name"
                                    
                                    value={this.state.name}
                                    onChange={this.handleNameChange.bind(this)}
                                    margin="none"
                                />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                              <Typography verticalAlign="bottom"> Role:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                                <Checkbox checked={this.state.isAdmin} onClick={() => {
                                    this.setState({ isAdmin: !this.state.isAdmin });
                                }} />
                            </Grid>
                        </Grid>

                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={() => { this.createProfile() }} variant="contained" color="primary">Create Profile</Button>
                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}

export default withRouter(ManageUsers);