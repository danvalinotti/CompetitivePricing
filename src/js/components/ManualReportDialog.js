import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css' 
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid'; 
import Container from '@material-ui/core/Container';
import Axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import IntegrationReactSelect from './SelectDrugDropdown' 

class ManualReportDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          
          
          
            drugDetails: ["Brand Type", "Dosage Strength", "Quantity", "Zip Code", "Recommended Price", "Difference"],
            selectedDrugDetails: [],
            providers: ["InsideRx", "WellRx", "SingleCare", "MedImpact", "U.S Pharmacy Card"],
            selectedProviders: [],
            buttonText: "Create Manual Report",
            previousReports: [],
            buttonDisabled: false,
            isSaved: false,
            selectedPrevious: null,
            reportName: "",
            options: [
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
            ],
            selectedOption: null,
        };
        this.getLatestReport();
    }
    handlePrevious(event) {
        if (event.target.value === "none") {
            this.setState({
                selectedPrevious: 'None',
                selectedProviders: [],
                selectedDrugDetails: [],
                selectedOption: [],
            })
        } else {
            const arr = [];
            event.target.value.drug_ids.map((drug) => {
                arr.push({ 'label': drug.name + " " + drug.dosageStrength + " " + "(" + drug.quantity + ")", 'value': drug })
            });
            this.setState({
                selectedPrevious: event.target.value.name,
                selectedProviders: event.target.value.providers,
                selectedDrugDetails: event.target.value.drug_fields,
                selectedOption: arr,
            })
        }

    }
    handleInputChange(event) {
        this.setState({
            reportName: event.target.value
        })
    }
    
    handleSubmit() {
        const selectedDrugs = [];
        this.state.selectedOption.map((option) => {
            selectedDrugs.push(option.value);
        });
        const reportRequest = {
            'drugs': selectedDrugs, 'drugDetails': this.state.selectedDrugDetails,
            'providers': this.state.selectedProviders, 'isSaved': this.state.isSaved, 'name': this.state.reportName
        };
        this.setState({
            buttonText: "Loading ...",
            buttonDisabled: true,

        });
        reportRequest.token = window.sessionStorage.getItem("token");
        let options = {
            responseType: 'blob',

        };
        Axios.post(process.env.API_URL + '/create/report/manual', reportRequest, options)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.ms-excel' }));
                const link = document.createElement('a');

                link.href = url;
                link.setAttribute('download', 'poi-generated-file.xlsx');
                document.body.appendChild(link);
                link.click();
                this.setState({
                    buttonText: "Create Manual Report",
                    buttonDisabled: false,
                });
            });


    }
    getLatestReport() {
        Axios.get(process.env.API_URL + '/drugmaster/get/all')
            .then(response => {

                this.setState({
                    drugList: response.data,
                });
                this.mapOptions(response.data);
            });
    }
    mapOptions(drugList) {
        const newOptions = [];
        drugList.map((drug) => {
            newOptions.push({ value: drug, label: drug.name + " " + drug.dosageStrength + " " + "(" + drug.quantity + ")" })
        });
        this.setState({
            options: newOptions
        })
    }
   
    handleDrugDetailsChange(event) {
        this.setState({
            selectedDrugDetails: event.target.value,
        });

    }
    
  
    handleProvidersChange(event) {
        this.setState({
            selectedProviders: event.target.value,
        });

    }
    handleDrugChange(selectedOption) {

        this.setState({ selectedOption: selectedOption });
    };


    render() {
        return (

            <Dialog
                onClose={() => this.props.onCloseFunc()}
                aria-labelledby="customized-dialog-title"
                open={this.props.dialog}
                style={{ overflowY: 'inherit' }}
            >
                <DialogTitle id="customized-dialog-title" onClose={() => this.props.onCloseFunc()}>
                    Create Manual Report
                    </DialogTitle>
                <DialogContent className="textCenter" style={{ maxHeight: '600px', overflowY: 'initial' }}>
                    <Container style={{ overflowY: 'inherit' }}>

                        <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Load Previous Manual Report:
                                </Grid>
                                <Grid item xs={6}>
                                    <Select

                                        value={this.state.selectedPrevious}
                                        onChange={this.handlePrevious.bind(this)}
                                        style={{ width: '200px' }}
                                        renderValue={selected => (selected + "").substring(0, 20)}>
                                        <MenuItem key='none' value="none" >
                                            None
                                        </MenuItem>
                                        {this.state.previousReports.map((report, index) => (
                                            <MenuItem key={index} value={report} >
                                                <ListItemText primary={report.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>



                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Select Drug(s):
                            </Grid>
                                <Grid item xs={6}>
                                    <IntegrationReactSelect drugValue={this.state.selectedOption}
                                        drugOnChange={this.handleDrugChange.bind(this)} listOfDrugs={this.state.options}></IntegrationReactSelect>

                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Select Drug Details:
                                </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        multiple
                                        value={this.state.selectedDrugDetails}
                                        onChange={this.handleDrugDetailsChange.bind(this)}
                                        style={{ width: '200px' }}
                                        renderValue={selected => (selected + "").substring(0, 20)}>
                                        {this.state.drugDetails.map(drug => (
                                            <MenuItem key={drug} value={drug} >
                                                <Checkbox
                                                    checked={this.state.selectedDrugDetails.indexOf(drug) > -1} />
                                                <ListItemText primary={drug} />
                                            </MenuItem>
                                        ))}

                                    </Select>



                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Select Providers:
                            </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        multiple
                                        value={this.state.selectedProviders}
                                        onChange={this.handleProvidersChange.bind(this)}
                                        style={{ width: '200px' }}
                                        renderValue={selected => (selected + "").substring(0, 20)}

                                    >
                                        {this.state.providers.map(drug => (
                                            <MenuItem key={drug} value={drug} >
                                                <Checkbox
                                                    checked={this.state.selectedProviders.indexOf(drug) > -1} />
                                                <ListItemText primary={drug} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Save Report:
                            </Grid>
                                <Grid item xs={6}>
                                    <Checkbox checked={this.state.isSaved} onClick={() => {
                                        this.setState({ isSaved: !this.state.isSaved });
                                    }} />
                                </Grid>
                            </Grid>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Name Report:
                             </Grid>
                                <Grid item xs={6}>
                                    <Input required value={this.state.reportName} onChange={this.handleInputChange.bind(this)} />

                                </Grid>
                            </Grid>


                        </Grid>
                    </Container>
                    <button disabled={this.state.buttonDisabled} style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleSubmit() }} className="btn btn-outline-primary">{this.state.buttonText}</button>
                    <br />

                </DialogContent>

            </Dialog>

        );

    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 4,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});
export default withStyles(styles)(ManualReportDialog);