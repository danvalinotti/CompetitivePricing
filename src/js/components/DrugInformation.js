import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";


class DrugInformation extends React.Component {

    constructor(props) {
        super(props);      
       
        this.state = {
            drugRequest: '',
            selectedDrug: null,
            dosageForm:"",
            pastDrugName: this.props.drugRequest.drugName,
            drugDescription:this.props.selectedDrug.description,
        };
       this.getDosageForm = this.getDosageForm.bind(this);
       this.getDrugDescription = this.getDrugDescription.bind(this);
        this.getDosageForm();
        // this.getDrugDescription();
    }
    getDosageForm(){
      
        fetch( "https://api.fda.gov/drug/ndc.json?search=brand_name:"+ this.props.response.name)
        .then(res => res.json())
        .then(json => {
            this.setState({
                dosageForm: json.results[0].route[0]
            })
         
        });
    }
    getDrugDescription(){
        // console.log(this.props.selectedDrug);
        this.setState({
            drugDescription: this.props.selectedDrug.description,
        });
    }

    getDrugDetails(drugRequest) {

        axios.post(process.env.API_URL + '/getPharmacyPrice', drugRequest)
            .then(response => {
                this.props.toggleDialog();
                this.setState({
                    drugDetails: response.data,
                });

                this.props.updateProperties(drugRequest,this.props.selectedDrug,response.data,
                    this.props.strengthList,this.props.quantityList,this.props.drugStrength,this.props.drugQuantity);
               
            })
    };
  

    onClickFilterSearch() {
        this.props.toggleDialog();
       
        const zipCode = this.props.drugRequest.zipcode;
        const drugType = "BRAND_WITH_GENERIC";
        const drugStrength =this.props.strengthList[this.props.drugStrength].label;
        const quantity = this.props.quantityList[this.props.drugQuantity].value;
        const drugName = this.props.selectedDrug.name;
        const drugNDC = this.getNDC(drugStrength,this.props.selectedDrug);
        const drugRequest = { "drugNDC": drugNDC, "drugName": drugName, "drugType": drugType, "dosageStrength": drugStrength, 
        "quantity": quantity, "zipcode": zipCode, "longitude": "longitude", "latitude": "latitude" };
        this.setState({
            drugRequest: drugRequest,
        });
        this.getDrugDetails(drugRequest);
    }
  
   
    addDrug() {

        this.props.toggleDialog();
        axios.post(process.env.API_URL + '/dashboard/drugs/add', this.props.drugRequest)
            .then(() => {
                
                this.props.toggleDialog();

            })

    }
    getNDC(strength, response){


        let drugNDC = "";
        response.dose.forEach(dose => {

            if(dose.label.trim() === strength.trim()){
                drugNDC = dose.value;
            }
        });
       
        return drugNDC;
    }

   
   
    
    format(str){
        let text = str;
        text = text.toLowerCase();
        const first = text.charAt(0).toUpperCase();
        text = first + text.substring(1);
        return text;
    }
    render() {
        if(this.state.pastDrugName !== this.props.drugRequest.drugName){
            this.setState({
                pastDrugName: this.props.drugRequest.drugName
            });
            this.getDosageForm();
        }
        return (
            <div style={{backgroundColor:'#F8F8F8',borderBottomStyle:'solid' , borderBottomColor:'#B3B3B3'}}>
                <br/>
        <div className="page description">
           
            <h2 className="drugName row">
                <div className="col-sm-6 ">
                    {this.props && this.props.drugRequest ? this.props.drugRequest.drugName : "Drug Name"}
                </div>
                <div className="col-sm-6 ">
                    <button type="button" style={{backgroundColor:'white', padding: '.375rem 2.5rem'}} onClick={() => { this.addDrug() }} className="btn btn-outline-primary float-sm-right trackListing pointer">Track Pricing</button>
                </div>
            </h2>
            <h3 className="formalName">
                <i> {this.props.selectedDrug ? this.props.selectedDrug.formalName : "Formal Name"}</i>
            </h3>
            <div className="drugDescription">
                {this.props.selectedDrug ? this.state.drugDescription : "Drug Description"}
            </div>
            <div className="drugSearchOptions">
                <div className="row" style={{paddingBottom:'10px', paddingTop:'10px'}}>
                    <div className="col-sm-6 col-md">
                        <select className="form-control search-bar" id="drugType"  onChange={()=>{}} value={this.props.response.drugType} name="drugType">
                            <option value="GENERIC">
                                Generic
                </option >
                            <option value="BRAND_WITH_GENERIC">
                                Brand
                </option>
                        </select>
                    </div>
                    <div className="col-sm-6 col-md">
                        <select className="form-control search-bar" id="dosageForm" onChange={()=>{}} value= {this.state.dosageForm}>
                         
                            <option value ={this.format(this.state.dosageForm)}> {this.format(this.state.dosageForm)}</option>
                        </select>
                    </div>
                    <div className="col-sm-6 col-md">
                        <select className="form-control search-bar-copy-3" id="drugStrength" value={this.props.drugStrength} onChange={() => this.props.onStrengthChange(event)}>
                            {
                                this.props.strengthList.map((strength, index) =>
                                    <option value={index} key={index}>{strength.label}</option>
                                )
                            }

                        </select>

                    </div>
                    <div className="col-sm-6 col-md">

                        <select className="form-control search-bar-copy-3" id="quantityDropdown" value={this.props.drugQuantity} onChange={() => this.props.updateQuantity(event)}>
                            <option value="" disabled >Quantity</option>
                            {
                                this.props.quantityList.map((quantity, index) =>
                                    <option value={index} key={quantity.value}  >{quantity.label}</option>
                                )
                            }
                        </select>

                    </div>
                    <div className="col-sm-12 col-md ">
                        <button className="search-bar-copy-4 searchButton2 myStyle form-control" onClick={() => this.onClickFilterSearch()}>
                            <span className="alignFlex">Search</span>
                        </button>
                    </div>
                </div>
            </div>
            <Dialog
                onClose={this.props.toggleDialog}
                aria-labelledby="customized-dialog-title"
                open={this.props.showDialog}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.toggleDialog}>
                    Loading
          </DialogTitle>
                <DialogContent className="textCenter">
                    <CircularProgress />
                </DialogContent>

            </Dialog>
        </div></div>);
    }
}

const styles = theme => ({
    root: {
   
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 5,
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
export default withStyles(styles)(DrugInformation);