import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Container from '@material-ui/core/Container';
import MaterialTable from 'material-table';
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

    renderDrugType(drugType) {

        if (drugType == "B") {
            drugType = "Brand";
        }
        if (drugType == "G") {
            drugType = "Generic";
        }

        return drugType;
    }
    renderReportFlag(reportFlag) {
        if (reportFlag == true) {
            return <label>Yes</label>
        } else {
            return <label>No</label>
        }

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
            newDrugDialog: this.state.newDrugDialog ? false : true
        });
    }
    submit(values) {
        this.setState({
            newDrugDialog: false,
            loading: true
        });
        var drug = {};
        drug.id = values.id;
        drug.zipcode = values.zipCode;
        drug.drugName = values.name;
        drug.dosageStrength = values.dosageStrength;
        drug.quantity = values.quantity;
        drug.drugNDC = values.ndc;
        drug.reportFlag = state.reportFlag;
        
        Axios.post(process.env.API_URL + '/add/drug', drug)
            .then(response => {
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
                                { title: 'Include', field: 'reportFlag', render: rowData => { return (this.renderReportFlag(rowData.reportFlag)) }, type: 'boolean' }]}
                                data={this.state.drugs}
                                options={{
                                    sorting: true,
                                    draggable: false,
                                    search: true,
                                    // selection: true,

                                }}
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