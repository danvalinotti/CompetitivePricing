import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import DatePicker from './DatePicker'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Axios from "axios";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";


class ManualReportDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            drugList: [],
            selectedDrugs:[],
            drugDetails:["Brand Type", "Dosage Strength","Quantity","Zip Code","Recommended Price", "Difference"],
            selectedDrugDetails:[],
            providers:["InsideRx", "WellRx","SingleCare","MedImpact","U.S Pharmacy Card"],
            selectedProviders:[],
            buttonText:"Create Manual Report",
            buttonDisabled:false,
        }
        this.getLatestReport();
    }
   
    handleChange(event) {
       
        
        this.setState({
            selectedDrugs: event.target.value,
        });

        this.state.selectedDrugs.indexOf(event.target.value);
      }
    handleSubmit() {
        var reportRequest = {'drugs':this.state.selectedDrugs, 'drugDetails':this.state.selectedDrugDetails,
        'providers': this.state.selectedProviders}
      //  console.log(this.state.selectedDrugs);
      this.setState({
        buttonText:"Loading ...",
        buttonDisabled:true,

      });
      
        Axios.post('https://drug-pricing-backend.cfapps.io/masterList/manualReport', reportRequest)
            .then(response => {
                console.log(response.data);
                this.exportReport(response.data);
                this.setState({
                    buttonText:"Create Manual Report",
                    buttonDisabled:false,
                  });
            });

        
    }
    getLatestReport() {
        Axios.get('https://drug-pricing-backend.cfapps.io/masterList/getLast')
            .then(response => {

                this.setState({
                    drugList: response.data.drug,
                });
            });
    }
    renderValue(selected){
      
        var str = "";
        selected.forEach((drug)=>{
          
                str = str+" "+ drug.name+",";
         
        });
        return str.substring(1,20);

        
    }
    handleDrugDetailsChange(event){
        this.setState({
            selectedDrugDetails: event.target.value,
        });

    }
    exportReport(data) {
        console.log(data);
        var exportList = [];
        data.forEach((element, index) => {
            

            exportList.push(element);

        });

        console.log(exportList);
        let csvContent = "data:text/csv;charset=utf-8,";

        exportList.forEach(function (rowArray) {
            let row = rowArray.join(",");
            csvContent += row + "\r\n";
        });
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "DashboardDrugs.csv");
        document.body.appendChild(link); // Required for FF

        link.click(); // This will download the data file named "my_data.csv".
        console.log("REPORT");
    }
    isChecked(drug, drugList){
        var checked=false ;
        drugList.forEach((d)=>{
            if(d.id === drug.id){
                checked = true;
            }
        });

        return checked;
    }
    handleProvidersChange(event){
        this.setState({
            selectedProviders: event.target.value,
        });

    }


    render() {
        return (

            <Dialog
                onClose={() => this.props.onCloseFunc()}
                aria-labelledby="customized-dialog-title"
                open={this.props.dialog}
            >
                <DialogTitle id="customized-dialog-title" onClose={() => this.props.onCloseFunc()}>
                   Create Manual Report
                    </DialogTitle>
                <DialogContent className="textCenter">
                    <Container>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={3}>
                                <Grid item xs={6}>
                                    Select Drug(s):
                            </Grid>
                                <Grid item xs={6}>
                                    <Select
                                        multiple
                                        value={this.state.selectedDrugs}
                                        onChange={this.handleChange.bind(this)}
                                        style={{width:'200px'}}
                                        renderValue={selected => this.renderValue(selected)}
                                      
                                    >
                                        {this.state.drugList.map(drug => (
                                            <MenuItem key={drug.id} value={drug} >
                                                <Checkbox
                                                 checked={this.isChecked(drug, this.state.selectedDrugs)} />
                                                <ListItemText primary={drug.name + ", "+drug.dosageStrength+drug.dosageUOM+"("+drug.quantity+")"} />
                                            </MenuItem>
                                        ))}
                                    </Select>
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
                                        style={{width:'200px'}}
                                        renderValue={selected => (selected+"").substring(0,20)}
                                      
                                    >
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
                                        style={{width:'200px'}}
                                        renderValue={selected => (selected+"").substring(0,20)}
                                      
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
                        

                        </Grid>
                    </Container>
                    <button disabled={this.state.buttonDisabled} style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleSubmit() }} className="btn btn-outline-primary">{ this.state.buttonText}</button>
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