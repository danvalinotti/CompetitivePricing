import React, { Component } from "react";
import HeaderComponent from "./HeaderComponent";
import * as Sorting from "./Sorting";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Icons from "./Icons"
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
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';

import TextField from "@material-ui/core/TextField";
import { Typography } from "@material-ui/core";
import { Field, reduxForm } from 'redux-form';
import AutoSuggestComponent2 from "./AutoSuggestComponent.1";
import DrugStrengthDropDown2 from "./drugStrengthDropdown.1";
import DrugQuantityDropDown2 from "./DrugQuantityDropDown.1";
import MaterialTable from 'material-table';
import TabBar from "./TabBar";

class ManageDrugs extends Component {
    constructor(props) {
        super(props);
      
        this.authenticateUser();

        this.state = {
            drugs: [],
            page: 0,
            rowsPerPage: 5,
            selectedDrugs: [],
            newDrugDialog: false,
            email: '',
            name:'',
            isAdmin:false,


            drugName: '',
            selectedDrug: null,
            drugStrengthArray: [],
            dosageStrength: null,
        
            drugQuantityArray: [],
            quantity: '',
            firstChoice:null,
            loggedInProfile: {},
        }
        //    this.populateDrugs.bind(this);
        this.populateDrugs();



    }
    authenticateUser(){
        console.log("dashboardContainer")
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token' , userToken)
        .then(r => {
            console.log(r.data)
            if(r.data.password != "false"){
              this.setState({
                openSignIn : false,
                loggedIn : true,
                loggedInProfile: r.data
              });
              console.log("LOGGED IN");
             
              window.sessionStorage.setItem("token",r.data.password);
              window.sessionStorage.setItem("loggedIn","true");
             if(r.data.role != "admin" && r.data.role != "createdadmin"){
                 this.props.history.push({ pathname: '/search' });
             }
           
            }else{
               console.log("incorrect");
               this.props.history.push({ pathname: '/signIn' });
            }
        })
    }
    populateDrugs() {
        Axios.get('https://drug-pricing-backend.cfapps.io/drugmaster/get/all')
            .then(response => {
                console.log(response)
                this.setState({
                    drugs: response.data,
                    selectedDrugs: new Array(response.data.length).fill(false),
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
            rowsPerPage: rows,
            page:0
        });
    }
    clickHome() {
        console.log("HOME");
        this.props.history.push("/admin/manage/users");
    }
    clickDashboard() {
        this.props.history.push("/admin/manage/users");
    }
    clickReports() {
        this.props.history.push("/admin/manage/drugs");
    }
    handleClose() {
        this.setState({
            newDrugDialog: false
        })
    }
    addDrug() {
        this.setState({
            newDrugDialog: true
        })
    }
    createDrug() {
        console.log("druggggg");
        console.log(this.state);
        var drug = {};

        drug.zipcode = "08873";
        drug.drugName = this.state.drugName;
        drug.dosageStrength = this.state.dosageStrength.label;
        drug.quantity = this.state.quantity;
        drug.drugNDC = this.state.dosageStrength.value;
        
       
        Axios.post('https://drug-pricing-backend.cfapps.io/report/add/drug/last' , drug)
        .then(response => {
            this.populateDrugs(); 
                this.setState({
                newDrugDialog:   false,
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
    adminChecked(event){
        console.log("event.target.value");
        console.log(event.target.value);
        this.setState({
            isAdmin: event.target.value
        })
    }
    handleChange(event,index) {
        console.log(this.state.selectedDrugs);
        console.log(index);
    
        if (event.target.checked) {
            this.state.selectedDrugs[index]= true;
            this.setState({
                selectedDrugs:this.state.selectedDrugs,
            })
            
        } else {
            this.state.selectedDrugs[index]= false;
            this.setState({
                selectedDrugs:this.state.selectedDrugs,
            })
        }
       
    }
    renderDrugType(drugType){
        
        if(drugType == "B"){
            drugType =  "BRAND WITH GENERIC";
        }
        if(drugType == "G"){
            drugType =  "GENERIC";
        }
        
            return drugType ;
    }
    
    setFirstChoice(){
        console.log("setfirstchoice")
    }
    updateDrug(drug) {

        this.setState({
            drugName: drug.name,
            selectedDrug: drug,
            drugStrengthArray: drug.dose,
            dosageStrength: drug.dose[0],
            drugStrengthIndex: 0,
            drugQuantityArray: drug.dose[0].quantity,
            quantity: drug.dose[0].quantity[0].value,
        });
    };
    handleSubmit(event){
        console.log("HANDLE SUBMIT ");
        console.log(event);
    }
    updateQuantity(quantity) {
        this.setState({

            quantity: quantity,
        })
    }  
    updateStrength(strength, index) {
        console.log("UPDATE STRENGTH2")
        console.log(index);
        this.setState({
            dosageStrength: strength,
            drugStrengthIndex: index,
            drugQuantityArray: strength.quantity,
            quantity: strength.quantity[0].value,
        })
    }


    render() {

        return (
            <div>
                <TabBar page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={2} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)}></TabBar>
                {/* <HeaderComponent value={2} clickHome={this.clickHome} history={this.props.history} clickDashboard={this.clickDashboard} clickReports={this.clickReports} /> */}
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>
                    <br />
                 
                    <div style={{ paddingTop: '30px'}}>
                        <Container >
                        
                           
                            {/* <Table>
                                <TableHead >
                                    <TableRow>
                                        <TableCell padding="checkbox"></TableCell>
                                        <TableCell >Name</TableCell>
                                        <TableCell >Drug Type</TableCell>
                                        <TableCell >Dosage Strength</TableCell>
                                        <TableCell >Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.drugs.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((drug, index) => (
                                        <TableRow key={index}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    id={drug.id}
                                                    onChange={() => this.handleChange(event,  this.state.page * this.state.rowsPerPage +index)}
                                                    value= {this.state.selectedDrugs[this.state.page * this.state.rowsPerPage +index]}
                                                    checked={this.state.selectedDrugs[ this.state.page * this.state.rowsPerPage +index]}
                                                     style={{ zIndex: 0 }}
                                                    color="primary"

                                                    inputProps={{
                                                        'aria-label': 'secondary checkbox',
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{drug.name} </TableCell>
                                            <TableCell>{this.renderDrugType(drug.drugType)}</TableCell>
                                            <TableCell > {drug.dosageStrength + drug.dosageUOM}</TableCell>
                                            <TableCell>{drug.quantity}</TableCell>
                                        </TableRow> 
                                    ))}


                                </TableBody>
                                <TableFooter>
                                    <TableRow>

                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, 50]}
                                            colSpan={4}
                                            count={this.state.drugs.length}
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
                        */}
                        <MaterialTable  
                        title="Manage Drugs"
                        style= {{boxShadow:0}}
                        columns = {[{title: 'Drug Name', field: 'name'},
                        {title: 'Brand/Generic', field: 'drugType' , render: rowData => this.renderDrugType(rowData.drugType)} ,
                        {title: 'Dosage Strength', field: 'dosageStrength' , render: rowData => rowData.dosageStrength+ rowData.dosageUOM},
                         {title: 'Quantity', field: 'quantity'}]}
                        data = {this.state.drugs}
                        editable={{
                                onRowAdd: newData =>
                                  new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                      {
                                        const data = this.state.data;
                                        data.push(newData);
                                        this.setState({ data }, () => resolve());
                                      }
                                      resolve()
                                    }, 1000)
                                  }),
                                  addFunction: ()=> this.addDrug.bind(this)
                               
                              }}
                        options={{
                            sorting: true,
                            draggable: false,
                          }}
                        />
                        
                       
                        </Container><br /> <br />
                    </div>
                </div>
                <Dialog fullWidth onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.newDrugDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Add User
                    </DialogTitle>
                    <DialogContent className="textCenter">
                  

                        <Grid container   >
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom"> Email:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                            <AutoSuggestComponent2 name="autoSuggestValue"
                                AutoSuggestComponent={this.props.drugStrengthArray}
                                selectedDrug={this.selectedDrug}
                                setFirstChoice= {this.setFirstChoice.bind(this)}
                                drugSearchResult={this.props.drugSearchResult}
                                actions={this.props.actions}
                                drugStrengthArray={this.props.drugStrengthArray}
                                updateDrug={this.updateDrug.bind(this)}
                                value={this.state.drugName}
                            ></AutoSuggestComponent2><br/>
                         
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom"> Name:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                            <DrugStrengthDropDown2 name="drugStrength"
                                    drugStrengthArray={this.state.drugStrengthArray}
                                    updateStrength={this.updateStrength.bind(this)}
                                    drugStrength={this.state.drugStrengthIndex}
                                    value={this.state.dosageStrength} /><br/><br/>
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                              <Typography verticalAlign="bottom"> Role:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                            <DrugQuantityDropDown2 name="drugQuantity"
                                    drugQuantityArray={this.state.drugQuantityArray}
                                    drugQuantity={this.state.quantity}
                                    updateQuantity={this.updateQuantity.bind(this)}
                                    value={this.state.quantity}
                                ></DrugQuantityDropDown2><br/>
                            </Grid>
                        </Grid>
                        <br/>
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.createDrug.bind(this)} variant="contained" color="primary">Add Drug</Button>
                       
                    </DialogContent>
                </Dialog>

            </div>
        )
    }
}


export default withRouter(ManageDrugs);