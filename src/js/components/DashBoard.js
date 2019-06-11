import React from "react";
import axios from 'axios';
import { PageHeader } from 'react-bootstrap';
import DrugStrengthDropDown from "./drugStrengthDropdown";
import DrugQuantityDropDown from "./DrugQuantityDropDown";
import "../../assests/sass/searchPage.css"
import HeaderComponent from "./HeaderComponent";
import gxImage from "../../assests/images/gxImage.png";
import { Field, reduxForm } from 'redux-form';
import AutoSuggestComponent from "./AutoSuggestComponent";
import { withRouter } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from "@material-ui/core/CircularProgress";
//import SockJS from "sockjs-client";

class DashBoard extends React.Component {

    constructor(props) {
        super(props);
        //SockJS

        // var sock = new SockJS('http://localhost:8980/gs-guide-websocket');


        // sock.onopen = function () {
        //     console.log('open');

        // };

        // sock.onmessage = function (e) {
        //     console.log('message', e.data);
        //     // sock.close();
        // };

        // sock.onclose = function () {
        //     console.log('close');
        // };

        //console.log("SOCK");
        this.state = { 
            drugName: '',
            drugNDC: '',
            dosageStrength: '',
            drugType: 'BRAND_WITH_GENERIC',
            quantity: '',
            zipcode: '',
            longitude: 'longitude',
            latitude: 'latitude',
            drugStrengthArray: [],
            drugQuantityArray: [],
            selectedDrug: null,
            showDialog: false,
          
        };


        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectedDrug = this.selectedDrug.bind(this);


    }
   
    // onConnected() {
    //     //  stompClient.subscribe('/topic/greetings', onMessageReceived);

    //     // Tell your username to the server
    //     stompClient.send("/app/greeting?name=hello");
    //     console.log("sent");
    // }

    changeStrengthList(strengthList) {
        this.selectedDrug({
            drugStrengthArray: strengthList
        })
    }
    changeQuantityList(quantityList) {
        this.selectedDrug({
            drugQuantityArray: quantityList
        })
    }
    handleSubmit(data) {
        this.setState({
            zipcode: data.myZipCode,
            drugType: data.drugType,
        });
        this.toggleDialog();

        const requestObject = {
            "drugNDC": this.state.dosageStrength.value,
            "drugName": this.state.drugName,
            "dosageStrength": this.state.dosageStrength.label,
            "drugType": this.state.drugType,
            "quantity": this.state.quantity,
            "zipcode": data.myZipCode,
            "longitude": "longitude",
            "latitude": "latitude"
        };

        axios.post('https://drug-pricing-app.cfapps.io/getPharmacyPrice', requestObject)
            .then(response => {
                this.toggleDialog();
                this.props.history.push({ pathname: '/viewdrugs', state: { request: requestObject, info: this.state.selectedDrug, response: response.data } });

            })
    }


    selectedDrug(drugName) {
        this.setState({
            drugName: drugName
        });

        return drugName;
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

    goToDashboard() {
      //  this.state.actions.
       //     this.state.actions.send("testing");
     //   console.log("GO TO DASHBOARD");
      this.props.history.push({ pathname: '/viewDashboard' });

    }
    toggleDialog() {

        this.setState({

            showDialog: !this.state.showDialog,
        })
    }


    render() {

        const searchBarStyle = {

            height: '60px ',
            width: '100% ',
            border: '1px solid #B3B3B3 ',
            backgroundColor: ' #FFFFFF ',
            borderRadius: '8px ',
            boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08) '
        }

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
            height: '10%',
            width: '70%',
            color: '#1E2022',
            fontFamily: 'TradeGothic LT',
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
                    <HeaderComponent />
                    <div className="title ">
                        <div style={{ float: 'right' }}>
                            <img className="gxImage" src={gxImage} />
                        </div>
                        <h1 className="search-for-a-prescri" style={searchPrescri}>Search for a medication to compare
                        prices.</h1>
                    </div>
                    <div style={{
                        paddingLeft: '10%',
                        paddingRight: '10%'

                    }}>
                        <div className='row'>
                            <Field component={AutoSuggestComponent} name="autoSuggestValue"
                                AutoSuggestComponent={this.props.drugStrengthArray}
                                selectedDrug={this.selectedDrug}
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
                                    <option value="Brand" selected>Brand</option>
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
                                    <option selected={true}>Oral</option>
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
                                <button className="form-control" style={seePricesBtn}><span
                                    className="see-prices">SEE PRICES</span></button>
                                <button type="button" onClick={() => { this.goToDashboard() }} className="form-control" style={seePricesBtn}><span
                                    className="see-prices" >SEE DASHBOARD</span></button>
                                <br />
                            </div>
                            <div className='col-sm-4'>  </div>
                        </div>
                    </div>
                </form>
                <Dialog onClose={() => this.toggleDialog.bind(this)}
                    aria-labelledby="customized-dialog-title" open={this.state.showDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.toggleDialog.bind(this)}>
                        Loading
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <CircularProgress />
                    </DialogContent>
                </Dialog></div>
        );
    }

}

DashBoard = reduxForm({
    form: 'Simple'
})(DashBoard);
export default withRouter(DashBoard);

