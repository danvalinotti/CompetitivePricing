import React from "react";
import axios from 'axios';

import DrugStrengthDropDown from "./drugStrengthDropdown";
import DrugQuantityDropDown from "./DrugQuantityDropDown";
import "../../assests/sass/searchPage.css"
import HeaderComponent from "./HeaderComponent";
import gxImage from "../../assests/images/gxImage.png";
import gxWave from "../../assests/images/GxWave-Logo.png";
import { Field, reduxForm } from 'redux-form';
import AutoSuggestComponent from "./AutoSuggestComponent";
import { withRouter } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from '@material-ui/core/Grid';
import { Snackbar, SnackbarContent, IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

class DashBoard extends React.Component {

    constructor(props) {
        super(props);
        this.authenticateUser();
        
        this.state = { 
            drugName: '',
            dosageStrength: '',
            drugType: 'BRAND_WITH_GENERIC',
            quantity: '',
            drugStrengthArray: [],
            drugQuantityArray: [],
            selectedDrug: null,
            showDialog: false,
            firstChoice:null,
            loggedInProfile:{},
            invalid: false
        };

        this.authenticateUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectedDrug = this.selectedDrug.bind(this);
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.openDialog = this.openDialog.bind(this);
    }
    authenticateUser(){
      
        var userToken = {};
        userToken.name = window.sessionStorage.getItem("token");

        axios.post('http://localhost:8081/authenticate/token' , userToken)
        .then(r => {
          
            if(r.data.password != "false"){
              this.setState({
                openSignIn : false,
                loggedIn : true,
                loggedInProfile: r.data
              });
            
             
              window.sessionStorage.setItem("token",r.data.password);
              window.sessionStorage.setItem("loggedIn","true");
            //   this.props.history.push({ pathname: '/search' });
            }else{
             
               this.props.history.push({ pathname: '/signIn' });
            }
        })
    }
   
   

 
   
    setFirstChoice(drug){
        this.setState({
            firstChoice:drug,
        });
    }
    handleSubmit(data) {
        if (data.myZipCode !== undefined && this.state.drugName !== "" && this.state.dosageStrength !== "" && this.state.quantity !== undefined && this.state.selectedDrug !== null) {

            try {
                let zip = parseFloat(data.myZipCode);
                if (data.myZipCode.length === 5) {
                    var drugName = this.state.drugName;
                    var dosageStrength = this.state.dosageStrength;
                    var quantity = this.state.quantity;
                    if(this.state.drugName === ""){
                            drugName = this.state.firstChoice.name;
                            dosageStrength =this.state.firstChoice.dose[0];
                            quantity = this.state.firstChoice.dose[0].quantity[0].value;
                            this.state.selectedDrug = this.state.firstChoice;
                    }
                    this.setState({
                    
                        drugType: data.drugType,
                    });
                    this.toggleDialog();
                    
                    const requestObject = {
                        "drugNDC": dosageStrength.value,
                        "drugName": drugName,
                        "dosageStrength": dosageStrength.label,
                        "drugType": this.state.drugType,
                        "quantity": quantity,
                        "zipcode": data.myZipCode,
                        "longitude": "longitude",
                        "latitude": "latitude"
                    };
    
                    axios.post('http://localhost:8081/getPharmacyPrice', requestObject)
                        .then(response => {
                            this.toggleDialog();
                            this.props.history.push({ pathname: '/viewdrugs', state: { request: requestObject, info: this.state.selectedDrug, response: response.data } });
    
                        }).catch(error => {
                            // handle error
                            this.toggleDialog();
                            this.openDialog();
                        });
                } else {
                    this.openDialog();
                }
            } catch(err) {
                console.log(err);
                if (data.myZipCode.length !== 5) {
                    this.openDialog();
                }
            }
        } else {
            this.openDialog();
            setTimeout(() => {
                this.handleClose();
            }, 5000)
        }
    }

    openDialog() {
        this.setState({
            invalid: true
        });
    }

    handleClose() {
        this.setState({
            invalid: false
        });
    }

    selectedDrug(drugName) {
        this.setState({
            drugName: drugName
        });

        return drugName;
    }

    updateDrug(drug) {
        // console.log(drug)
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
    updateStrength(strength, index) {

        this.setState({
            dosageStrength: strength,
            drugStrengthIndex: index,
            drugQuantityArray: strength.quantity,
            quantity: strength.quantity[0].value,
        })
    }
    updateQuantity(quantity) {
        this.setState({

            quantity: quantity,
        })
    }

   
    toggleDialog() {

        this.setState({

            showDialog: !this.state.showDialog,
        })
    }
    clickHome(){
        this.props.history.push({ pathname: '/search' });
    }
    clickDashboard(){
        this.props.history.push({ pathname: '/viewDashboard' });
    }
    clickReports(){
        this.props.history.push({ pathname: '/reports' });
    }


    render() {

        const searchBarCopy = {

            marginRight: '20%',

            height: '60px',
            width: '100% ',
            border: '1px solid #B3B3B3',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)'
        }

        const searchPrescri = {
            margin: '30px 0',
            height: '10%',
            width: '70%',
            color: '#1E2022',
            fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
            letterSpacing: 'normal',
            fontSize: '36px',
            fontWeight: 'bold',
            lineHeight: '43px',
            textAlign: 'center',
            paddingTop: '1%',

        }
        const seePricesBtn = {
            height: '60px ',
            width: '100% ',
            borderRadius: '8px ',
            backgroundColor: '#1B8DCA ',
            boxShadow: '0 10px 20px -10px rgba(0, 0, 0, 0.26) !important'
        }
        
        return (
            <div>
                <form id='Simple' className="form-horizontal" onSubmit={this.props.handleSubmit(this.handleSubmit.bind(this))}
                >
                    <HeaderComponent profile={this.state.loggedInProfile} value={0} clickHome={this.clickHome} clickDashboard={this.clickDashboard} history={this.props.history} clickReports={this.clickReports}/>
                    <div className="title ">
                        <div style={{ float: 'right', paddingTop:'10px'}}>
                            {/* <img className="gxImage" src={gxImage} /> */}
                        </div>
                        <h1 className="search-for-a-prescri" style={searchPrescri}>Search for a prescription to compare
                        prices.</h1>
                    </div>
                    <div style={{
                        paddingLeft: '10%',
                        paddingRight: '10%'

                    }}>
                        <div className='row'>
                            <Field  component={AutoSuggestComponent} name="autoSuggestValue"
                                AutoSuggestComponent={this.props.drugStrengthArray}
                                selectedDrug={this.selectedDrug}
                                setFirstChoice= {this.setFirstChoice.bind(this)}
                                drugSearchResult={this.props.drugSearchResult}
                                actions={this.props.actions}
                                drugStrengthArray={this.props.drugStrengthArray}
                                updateDrug={this.updateDrug.bind(this)}

                            />
                            <div className="col-sm-3">
                                <Field component='input' className="form-control search-bar-copy" style={searchBarCopy}
                                    name="myZipCode" id="myZipCode" placeholder="Enter Zip Code" />
                            </div>
                        </div>
                        <div className='row' style={{ paddingTop: '10px' }}>
                            <div className='col-sm-3'>
                                <Field component='select' className="form-control " style={{
                                    height: '60px',
                                    width: '100%',
                                    border: '1px solid #B3B3B3',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)'

                                }} name="drugType">
                                    <option value="Brand" >Brand</option>
                                    <option value="Generic">Generic</option>
                                </Field>
                            </div>
                            <div className='col-sm-3'>
                                <Field component='select' className="form-control " style={{
                                    height: '60px',
                                    width: '100%',
                                    border: '1px solid #B3B3B3',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)'

                                }} name="dosageForm">
                                    <option value="" disabled>Dosage Form</option>
                                    <option>Oral</option>
                                </Field>
                            </div>
                            <div className='col-sm-3'>
                                <Field component={DrugStrengthDropDown} name="drugStrength"
                                    drugStrengthArray={this.state.drugStrengthArray}
                                    updateStrength={this.updateStrength.bind(this)}
                                    drugStrength={this.state.drugStrengthIndex} />
                            </div>
                            <div className='col-sm-3'>
                                <Field component={DrugQuantityDropDown} name="drugQuantity"
                                    drugQuantityArray={this.state.drugQuantityArray}
                                    drugQuantity={this.state.quantity}
                                    updateQuantity={this.updateQuantity.bind(this)}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ padding: '2%' }}>
                            <div className='col-sm-4'>  </div>
                            <div className='col-sm-4'>
                                <button className="form-control pointer" style={seePricesBtn}><span
                                    className="see-prices ">SEE PRICES</span></button>
                                
                                <br />
                            </div>
                            <div className='col-sm-4'>  </div>
                        </div>
                    </div>
                </form>
                {/* <br/><br/><br/><br/>
              */}
                    {/* <div xs={4} justify="center" style={{
   position: 'fixed', left: '0', bottom: '0', width: '100%', textAlign: 'center',}}>
                         <label  fontSize="9"> <strong style={{color:"darkgrey"}}>Powered By</strong></label>  <img  className="gxWave" src={gxWave} width="75px" height="25px"/>
                    </div> */}
                
                <Dialog onClose={() => this.toggleDialog.bind(this)}
                    aria-labelledby="customized-dialog-title" open={this.state.showDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.toggleDialog.bind(this)}>
                        Loading
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <CircularProgress />
                    </DialogContent>
                </Dialog>
                <Snackbar
                    anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                    open={this.state.invalid}
                    autoHideDuration={5000}
                    onClose={this.handleClose}
                >
                    <SnackbarContent 
                        message={"Drug search terms invalid."}
                        style={{backgroundColor: "#e00000", fontWeight: 600}}
                        action={[
                            <IconButton key="close" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon />
                            </IconButton>
                        ]}
                    />
                </Snackbar>
            </div>
        );
    }
}

DashBoard = reduxForm({
    form: 'Simple',
    destroyOnUnmount: false
})(DashBoard);
export default withRouter(DashBoard);

