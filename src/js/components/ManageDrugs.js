import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import {authenticateUser} from  '../services/authService';
class ManageDrugs extends Component {
    constructor(props) {
        super(props);

        authenticateUser(this);

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


        };
        this.populateDrugs();
        this.editDrug = this.editDrug.bind(this);
    }
    populateDrugs() {

        Axios.get(process.env.API_URL + '/drugmaster/get/all')
            .then(response => {
                // console.log("POPULATE DURGS");
                // console.log(response);
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
        Axios.get(process.env.API_URL + '/getDrugInfo/' + drug.name)
            .then(response => {
                // console.log(response.data[0]);
                var drugDetails = response.data[0];
                var dosageIndex = this.getDosageIndex(drug.dosageStrength, drugDetails.dose);
                // console.log("dosageIndex");
                // console.log(dosageIndex);
                // console.log(drug.quantity);
                this.setState({
                    editDrug: drug,
                    editDrugName: drug.name,
                    editDrugStrength: dosageIndex,
                    editDrugQuantity: drugDetails.dose[dosageIndex].quantity[0].value,
                    drugStrengthArray: drugDetails.dose,
                    drugQuantityArray: drugDetails.dose[dosageIndex].quantity
                });
                this.setState({
                    editDrugDialog: true,
                });
                // console.log(this.state.editDrugName);

            });

    }
    getDosageIndex(dosageStrength, strengthArr) {
        // console.log(dosageStrength);
        // console.log(strengthArr);
        var firstIndex = -1;
        strengthArr.forEach((strength, index) => {
            if (strength.label.includes(dosageStrength)) {
                // console.log("HERE");
                if(firstIndex == -1){
                    // console.log("HERE");
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
            // console.log("NOT FOUND");
            firstIndex = 0
        }
        return firstIndex;


    }
    createDrug() {
        this.setState({
            addingDialog: true,
        });
        var drug = {};
        // console.log(this.state.selectedDrug);
        // console.log("HELLO");
        // console.log(this.state.dosageStrength);
        drug.zipcode = "08873";
        drug.drugName = this.state.drugName;
        drug.dosageStrength = this.state.dosageStrength.label;
        drug.quantity = this.state.quantity;
        drug.drugNDC = this.state.dosageStrength.value;
        drug.reportFlag = this.state.reportFlag;
        
        Axios.post(process.env.API_URL + '/add/drug', drug)
            .then(response => {
               this.populateDrugs();
                this.setState({
                    addingDialog: false,
                })
                // console.log("ADDED DRUG");
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
        // console.log("setfirstchoice")
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
    closeAddingDialog(){
        this.setState({
            
            addingDialog:false
        })
    }
    handleReportFlagChange(event) {
        this.setState({
            reportFlag: event.target.value
        })
        // console.log(event);
    }
    renderReportFlag(reportFlag) {
        if (reportFlag == true) {
            return <label>Yes</label>
        } else {
            return <label>No</label>
        }

    }
    drugChange(drugs) {
        // console.log(drugs);
    }
    clickRequests() {
        this.props.history.push("/admin/manage/requests");
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
        Axios.get(process.env.API_URL + '/getDrugInfo/' + drugName)
            .then(response => {
                // console.log(response.data[0]);
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
            
            Axios.post(process.env.API_URL + '/edit/drug', drug)
                .then(response => {
                    this.populateDrugs();
                    this.setState({
                        editDrugDialog: false,
                    })
                    // console.log("FINISHED ADDING");
                })
            
    
    }


    render() {

        return (
            <div>
                <TabBar  page="admin" profile={this.state.loggedInProfile} color={"steelblue"} value={2} history={this.props.history} tab1={"Home"} clickHome={this.clickHome.bind(this)} tab2={"Manage Users"} clickDashboard={this.clickDashboard.bind(this)} tab3={"Manage Drugs"} clickReports={this.clickReports.bind(this)} tab4={"Manage Alerts"} clickTab4={this.clickAlerts.bind(this)}tab5={"Manage Requests"} clickTab5={this.clickRequests.bind(this)}></TabBar>
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
                                            // console.log("add")
                                        }),
                                    addFunction: () => this.addDrug.bind(this),
                                    onRowUpdate: (newData, oldData) =>
                                        new Promise((resolve, reject) => {
                                            // console.log("update")
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
            </div>
        )
    }
}
export default withRouter(ManageDrugs);