import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
import TabBar from "./TabBar";
import {authenticateUser} from  '../services/authService';
import NewTableItemDialog from "./NewTableItemDialog";
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
        this.toggleDialog = this.toggleDialog.bind(this);
        this.submit = this.submit.bind(this);
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
    editDrug(event, drug) {
        // drugStrengthArray={this.state.drugStrengthArray}
        // updateStrength={this.updateStrength.bind(this)}
        // drugStrength={this.state.drugStrengthIndex}
        // value={this.state.editDrugStrength} /><br /><br />
        Axios.get(process.env.API_URL + '/getDrugInfo/' + drug.name)
            .then(response => {
                // console.log(response.data[0]);
                const drugDetails = response.data[0];
                const dosageIndex = this.getDosageIndex(drug.dosageStrength, drugDetails.dose);
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
        let firstIndex = -1;
        strengthArr.forEach((strength, index) => {
            if (strength.label.includes(dosageStrength)) {
                // console.log("HERE");
                if(firstIndex === -1){
                    // console.log("HERE");
                    firstIndex = index;
                }
                
            }
        });
        if (firstIndex === -1) {
            strengthArr.forEach((strength, index) => {
                if (strength.label.includes(dosageStrength.charAt(0))) {
                 
                    if(firstIndex === -1){
                        firstIndex = index;
                    }
                }
            });
        }
        if(firstIndex === -1){
            // console.log("NOT FOUND");
            firstIndex = 0
        }
        return firstIndex;


    }

    renderDrugType(drugType) {

        if (drugType === "B") {
            drugType = "Brand";
        }
        if (drugType === "G") {
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

    updateStrength(strength, index) {

        this.setState({
            dosageStrength: strength,
            drugStrengthIndex: index,
            drugQuantityArray: strength.quantity,
            quantity: strength.quantity[0].value,
        })
    }

    renderReportFlag(reportFlag) {
        if (reportFlag === true) {
            return <label>Yes</label>
        } else {
            return <label>No</label>
        }

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


    toggleDialog() {
        this.setState({
            newDrugDialog: !this.state.newDrugDialog
        });
    }
    submit(values) {
        this.setState({
            newDrugDialog: false,
            loading: true
        });
        const drug = {};
        drug.id = values.id;
        drug.zipcode = values.zipCode;
        drug.drugName = values.name;
        drug.dosageStrength = values.dosageStrength;
        drug.quantity = values.quantity;
        drug.drugNDC = values.ndc;
        drug.reportFlag = state.reportFlag;
        
        Axios.post(process.env.API_URL + '/add/drug', drug)
            .then(() => {
                this.populateDrugs();
                this.setState({
                    loading: false
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
                                style={{ boxShadow: 0, padding: 15 }}
                                columns={[{ title: 'Drug Name', field: 'name' },
                                { title: 'Brand/Generic', field: 'drugType', render: rowData => this.renderDrugType(rowData.drugType) },
                                { title: 'Dosage Strength', field: 'dosageStrength', render: rowData => this.renderDrugDosage(rowData.dosageStrength, rowData.dosageUOM) },
                                { title: 'Quantity', field: 'quantity' },
                                { title: 'Include', field: 'reportFlag', render: rowData => { return (this.renderReportFlag(rowData.reportFlag)) }, type: 'html' }]}
                                data={this.state.drugs}
                                editable={{
                                    onRowUpdate: () =>
                                        new Promise(() => {
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
                                actions={[
                                    {
                                        icon: "add",
                                        isFreeAction: true,
                                        onClick: () => this.toggleDialog()
                                    }
                                ]}

                            />
                        </Container><br /> <br />
                    </div>
                </div>
                <NewTableItemDialog
                    title="New Drug"
                    open={this.state.newDrugDialog}
                    toggleDialog={this.toggleDialog}
                    handleSubmit={this.submit}
                    loading={this.state.loading}
                    initValues={[
                        {
                            name: "Name",
                            id: 'name',
                            type: 'text',
                            value: ''
                        },
                        {
                            name: "Drug ID",
                            id: 'id',
                            type: 'number',
                            value: 0
                        },
                        {
                            name: "Dosage Strength",
                            id: 'dosageStrength',
                            type: 'text',
                            value: ''
                        },
                        // {
                        //     name: 'GSN',
                        //     id: 'gsn',
                        //     type: 'tetx',
                        //     value: ''
                        // },
                        {
                            name: "NDC",
                            id: 'ndc',
                            type: 'text',
                            value: ''
                        },
                        {
                            name: "Quantity",
                            id: 'quantity',
                            type: 'number',
                            value: 0
                        },
                        {
                            name: 'Drug Type',
                            id: 'drugType',
                            type: 'text',
                            value: '',  
                        },
                        {
                            name: "Zip Code",
                            id: 'zipCode',
                            type: 'text',
                            value: ''
                        },
                        {
                            name: "Add to report:",
                            id: 'reportFlag',
                            type: 'checkbox',
                            value: true
                        }
                    ]}
                />
            </div>
        )
    }
}
export default withRouter(ManageDrugs);