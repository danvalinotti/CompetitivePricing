import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import AutoSuggestComponent2 from "./AutoSuggestComponent.1";
import DrugStrengthDropDown2 from "./drugStrengthDropdown.1";
import DrugQuantityDropDown2 from "./DrugQuantityDropDown.1";
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import { Select, MenuItem } from "@material-ui/core";

class ManageDrugs extends Component {
    constructor(props) {
        super(props);

        this.authenticateUser();

        this.state = {
            drugs: [],
            newDrugDialog: false,
            drugName: '',
            drugStrengthArray: [],
            dosageStrength: null,
            drugQuantityArray: [],
            quantity: '',
            loggedInProfile: {},
            reportFlag: true,
            editDrugDialog: false,
            editDrugName: '',
            editDrugStrength: '',
            editDrugQuantity: '',
            editDrug:null,


        }
        this.populateDrugs();
        this.editDrug = this.editDrug.bind(this);
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
    populateDrugs() {

        Axios.get('https://drug-pricing-backend.cfapps.io/drugmaster/get/all')
            .then(response => {
                console.log("POPULATE DURGS");
                console.log(response);
                this.setState({
                    drugs: response.data,
                    selectedDrugs: new Array(response.data.length).fill(false),
                })
            })
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
            newDrugDialog: false
        })
    }
    addDrug() {

        this.setState({
            newDrugDialog: true
        })
    }
    editDrug(event, drug) {
        // drugStrengthArray={this.state.drugStrengthArray}
        // updateStrength={this.updateStrength.bind(this)}
        // drugStrength={this.state.drugStrengthIndex}
        // value={this.state.editDrugStrength} /><br /><br />
        Axios.get('https://drug-pricing-backend.cfapps.io/getDrugInfo/' + drug.name)
            .then(response => {
                console.log(response.data[0]);
                var drugDetails = response.data[0];
                var dosageIndex = this.getDosageIndex(drug.dosageStrength, drugDetails.dose);
                console.log("dosageIndex");
                console.log(dosageIndex);
                console.log(drug.quantity);
                this.setState({
                    editDrug: drug,
                    editDrugName: drug.name,
                    editDrugStrength: dosageIndex,
                    editDrugQuantity: drugDetails.dose[dosageIndex].quantity[0].value,
                    drugStrengthArray: drugDetails.dose,
                    drugQuantityArray: drugDetails.dose[dosageIndex].quantity
                })
                this.setState({
                    editDrugDialog: true,
                });
                console.log(this.state.editDrugName);

            });

    }
    getDosageIndex(dosageStrength, strengthArr) {
        console.log(dosageStrength);
        console.log(strengthArr);
        var firstIndex = -1;
        strengthArr.forEach((strength, index) => {
            if (strength.label.includes(dosageStrength)) {
                console.log("HERE");
                if(firstIndex == -1){
                    console.log("HERE");
                    firstIndex = index;
                }
                
            }
        });
        if (firstIndex == -1) {
            strengthArr.forEach((strength, index) => {
                if (strength.label.includes(dosageStrength.charAt(0))) {
                 
                    if(firstIndex == -1){
                        firstIndex = index;
                    }
                }
            });
        }
        if(firstIndex == -1){
            console.log("NOT FOUND");
            firstIndex = 0
        }
        return firstIndex;


    }
    createDrug() {
        var drug = {};
        console.log("HELLO");
        console.log(this.state.dosageStrength);
        drug.zipcode = "08873";
        drug.drugName = this.state.drugName;
        drug.dosageStrength = this.state.dosageStrength.label;
        drug.quantity = this.state.quantity;
        drug.drugNDC = this.state.dosageStrength.value;
        drug.reportFlag = this.state.reportFlag;
        Axios.post('https://drug-pricing-backend.cfapps.io/report/add/drug/last', drug)
            .then(response => {
                this.populateDrugs();
                this.setState({
                    newDrugDialog: false,
                })
            })
    }

    renderDrugType(drugType) {

        if (drugType == "B") {
            drugType = "Brand";
        }
        if (drugType == "G") {
            drugType = "Generic";
        }

        return drugType;
    }

    setFirstChoice() {
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

    updateQuantity(quantity) {
        
        this.setState({
            quantity: quantity,
        })
    }
    updateEditQuantity(quantity) {
        
        this.setState({
            editDrugQuantity: quantity,
        })
    }
    
    updateStrength(strength, index) {

        this.setState({
            dosageStrength: strength,
            drugStrengthIndex: index,
            drugQuantityArray: strength.quantity,
            quantity: strength.quantity[0].value,
        })
    }
    updateEditStrength(strength, index) {

        this.setState({
            // dosageStrength: strength,
            editDrugStrength: index,
            drugQuantityArray: strength.quantity,
            editDrugQuantity: strength.quantity[0].value,
        })
    }
    handleReportFlagChange(event) {
        this.setState({
            reportFlag: event.target.value
        })
        console.log(event);
    }
    renderReportFlag(reportFlag) {
        if (reportFlag == true) {
            return <label>Yes</label>
        } else {
            return <label>No</label>
        }

    }
    drugChange(drugs) {
        console.log(drugs);
    }
    renderDrugDosage(drugStrength, drugUOM) {
        if (drugUOM == null) {
            return drugStrength
        } else {
            return (drugStrength + drugUOM)
        }

    }
    handleEditDrugClose() {
        this.setState({
            editDrugDialog: false
        })
    }
    getDrugDetails(drugName) {
        Axios.get('https://drug-pricing-backend.cfapps.io/getDrugInfo/' + drugName)
            .then(response => {
                console.log(response.data[0]);
                return response.data[0];
            });
    }
    submitEditDrug(){
      
            var drug = {};
            drug.id = this.state.editDrug.id;
            drug.zipcode = "08873";
            drug.drugName = this.state.editDrugName;
            drug.dosageStrength = this.state.drugStrengthArray[this.state.editDrugStrength].label;
            drug.quantity = this.state.editDrugQuantity;
            drug.drugNDC = this.state.drugStrengthArray[this.state.editDrugStrength].value;
            drug.reportFlag = this.state.reportFlag;
            
            Axios.post('https://drug-pricing-backend.cfapps.io/report/add/drug/last', drug)
                .then(response => {
                    this.populateDrugs();
                    this.setState({
                        editDrugDialog: false,
                    })
                })
            
    
    }


    render() {

        return (
            <div>
                <TabBar  page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={2} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}></TabBar>
                <div style={{ paddingLeft: '10%', paddingRight: '10%' }}>


                    <div style={{ paddingTop: '30px' }}>
                        <Container>
                            <MaterialTable
                                title="Manage Drugs"
                                style={{ boxShadow: 0 }}
                                columns={[{ title: 'Drug Name', field: 'name' },
                                { title: 'Brand/Generic', field: 'drugType', render: rowData => this.renderDrugType(rowData.drugType) },
                                { title: 'Dosage Strength', field: 'dosageStrength', render: rowData => this.renderDrugDosage(rowData.dosageStrength, rowData.dosageUOM) },
                                { title: 'Quantity', field: 'quantity' },
                                { title: 'Include', field: 'reportFlag', render: rowData => { return (this.renderReportFlag(rowData.reportFlag)) }, type: 'html' }]}
                                data={this.state.drugs}
                                editable={{
                                    onRowAdd: newData =>
                                        new Promise((resolve, reject) => {
                                            console.log("add")
                                        }),
                                    addFunction: () => this.addDrug.bind(this),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve, reject) => {
                                            console.log("update")
                                        }),
                                    editFunction: () => this.editDrug.bind(this)
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
                    aria-labelledby="customized-dialog-title" open={this.state.newDrugDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Add Drug
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <Grid container   >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Drug Name:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <AutoSuggestComponent2 name="autoSuggestValue"
                                    AutoSuggestComponent={this.props.drugStrengthArray}
                                    selectedDrug={this.selectedDrug}
                                    setFirstChoice={this.setFirstChoice.bind(this)}
                                    drugSearchResult={this.props.drugSearchResult}
                                    actions={this.props.actions}
                                    drugStrengthArray={this.props.drugStrengthArray}
                                    updateDrug={this.updateDrug.bind(this)}
                                    value={this.state.drugName}
                                ></AutoSuggestComponent2><br />

                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Dosage Strength:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <DrugStrengthDropDown2 name="drugStrength"
                                    drugStrengthArray={this.state.drugStrengthArray}
                                    updateStrength={this.updateStrength.bind(this)}
                                    drugStrength={this.state.drugStrengthIndex}
                                    value={this.state.dosageStrength} /><br /><br />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Quantity:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <DrugQuantityDropDown2 name="drugQuantity"
                                    drugQuantityArray={this.state.drugQuantityArray}
                                    drugQuantity={this.state.quantity}
                                    updateQuantity={this.updateQuantity.bind(this)}
                                    value={this.state.quantity}
                                ></DrugQuantityDropDown2><br />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}><br />
                                <Typography verticalAlign="bottom"> Include In Report:</Typography>
                            </Grid>
                            <Grid item xs={7}><br />
                                <Select name="addToReport" defaultValue={true}
                                    className="form-control"
                                    onChange={this.handleReportFlagChange.bind(this)} value={this.state.reportFlag}>
                                    <MenuItem key="0" value={true}>
                                        Yes
                                        </MenuItem>
                                    <MenuItem key="1" value={false}>
                                        No
                                        </MenuItem>
                                </Select><br />
                            </Grid>
                        </Grid>

                        <br />
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.createDrug.bind(this)} variant="contained" color="primary">Add Drug</Button>

                    </DialogContent>
                </Dialog>
                <Dialog fullWidth onClose={() => this.handleEditDrugClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.editDrugDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleEditDrugClose.bind(this)}>
                        Edit {this.state.editDrugName}
                    </DialogTitle>
                    <DialogContent className="textCenter">

                        <Grid container >
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Dosage Strength:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <DrugStrengthDropDown2 name="drugStrength"
                                    drugStrengthArray={this.state.drugStrengthArray}
                                    updateStrength={this.updateEditStrength.bind(this)}
                                    drugStrength={this.state.editDrugStrength}
                                    value={this.state.editDrugStrength} /><br /><br />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={5}>
                                <Typography verticalAlign="bottom"> Quantity:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <DrugQuantityDropDown2 name="drugQuantity"
                                    drugQuantityArray={this.state.drugQuantityArray}
                                    drugQuantity={this.state.editDrugQuantity}
                                    updateQuantity={this.updateEditQuantity.bind(this)}
                                    value={this.state.editDrugQuantity}
                                ></DrugQuantityDropDown2><br />
                            </Grid>
                        </Grid>
                        <Grid container  >
                            <Grid item xs={5}><br />
                                <Typography verticalAlign="bottom"> Include In Report:</Typography>
                            </Grid>
                            <Grid item xs={7}><br />
                                <Select name="addToReport" defaultValue={true}
                                    className="form-control"
                                    onChange={this.handleReportFlagChange.bind(this)} value={this.state.reportFlag}>
                                    <MenuItem key="0" value={true}>
                                        Yes
                                        </MenuItem>
                                    <MenuItem key="1" value={false}>
                                        No
                                        </MenuItem>
                                </Select><br />
                            </Grid>
                        </Grid>

                        <br />
                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={this.submitEditDrug.bind(this)} variant="contained" color="primary">Edit Drug</Button>

                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}
export default withRouter(ManageDrugs);