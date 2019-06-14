import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import USProviderImg from "../../assests/images/usPharmCard2.png";
import WellRxImg from "../../assests/images/wellRx2.png";
import SingleCareImg from "../../assests/images/singleCare2.png";
import MedImpactImg from "../../assests/images/medImpact2.png";
import GoodRxImg from "../../assests/images/goodRx2.png";
import HeaderWithSearch from "../components/HeaderWithSearch";
import Arrow from "../components/Arrow";
import DrugInformation from "../components/DrugInformation";

class ViewDrugDetails extends React.Component {
  constructor(props) {
    super(props);
    var quantityList = [];
    
    if (!this.props.state.location.state) {
      this.props.history.push('/');
      this.state = {};
    } else {
      var response = this.props.state.location.state.response;
    var request = this.props.state.location.state.request;
    var info = this.props.state.location.state.info;
      this.props.state.location.state.info.dose.map((dose) => {
        if (dose.label === this.props.state.location.state.request.dosageStrength) {
          quantityList = dose.quantity;
        }
      });
      this.state = {
        inputValue: '',

        selectedItem: [],
        providerPrices: response.programs,
        strengthList: info.dose,
        quantityList: quantityList,
        zipCode: request.zipcode,
        drugStrength: this.getIndexByLabel(request.dosageStrength, info.dose),
        drugQuantity: this.getIndexByValue(request.quantity, quantityList),
        selectedDrug: info,
        drugRequest: request,
        drugDetails: response,
        toDashboard: true,
        toggleDialog: false,
      };
     
    }
    this.clickHome = this.clickHome.bind(this);
    this.clickDashboard = this.clickDashboard.bind(this);
    this.clickReports = this.clickReports.bind(this);

  }
  getIndexByLabel(label, list){
    var index = 0;
    list.map((obj,i)=>{
      if(obj.label === label){
         index = i;
      }
    });
    return index ;
  }
  getIndexByValue(val , list){
    var index = 0;
    list.map((obj,i)=>{
      if(obj.value === val){
         index = i;
      }
    });
    return index ;
  }
  getIndexByObject(obj, list){
    list.findIndex(obj);
  }
  round(num) {
    return Number(num).toFixed(2);
  }
  updateProperties(request, info, response, drugStrengthList, drugQuantityList, drugStrength, drugQuantity) {
 
    this.setState({
      selectedDrug: info,
      drugRequest: request,
      drugDetails: response,
      strengthList: drugStrengthList,
      quantityList: drugQuantityList,
      zipCode: request.zipcode,
      drugStrength: drugStrength,
      drugQuantity: drugQuantity,
    })

  }
  getDose(index) {
    return this.state.strengthList[index];
  }
  updateQuantity(event) {
    this.setState({
      drugQuantity:event.target.value,
    })
  }
  onStrengthChange(event) {
   
    if (event) {
      this.setState({
        drugStrength: event.target.value,
        quantityList: this.getDose(event.target.value).quantity,

      });
    }

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
  toggleDialog() {
    this.setState({
      toggleDialog: !this.state.toggleDialog
    })
  }

  render() {
    if (this.state.selectedDrug != null) {
      const { classes } = this.props;
      var averagePriceColor, lowestPriceColor, usPharmCardPriceColor, currentPriceColor, singleCarePriceColor, wellRxPriceColor;
      if (this.state.drugDetails) {
        if (this.state.drugDetails.averageDiff >= 0 || this.state.drugDetails.averageDiff === "N/A") {

          averagePriceColor = { color: '#08CA00' };
        } else {

          averagePriceColor = { color: 'red' };
        }
        if (this.state.drugDetails.recommendedDiff >= 0 || this.state.drugDetails.recommendedDiff === "N/A") {

          lowestPriceColor = { color: '#08CA00' };
        } else {

          lowestPriceColor = { color: 'red' };
        }
        if (this.state.drugDetails.programs[0].diff >= 0 || this.state.drugDetails.programs[0].diff === "N/A") {
          currentPriceColor = { color: '#08CA00' };
        } else {
          currentPriceColor = { color: 'red' };
        }
        if (this.state.drugDetails.programs[1].diff >= 0 || this.state.drugDetails.programs[1].diff === "N/A") {
          usPharmCardPriceColor = { color: '#08CA00' };
        } else {
          usPharmCardPriceColor = { color: 'red' };
        }
        if (this.state.drugDetails.programs[2].diff >= 0 || this.state.drugDetails.programs[2].diff === "N/A") {
          wellRxPriceColor = { color: '#08CA00' };
        } else {
          wellRxPriceColor = { color: 'red' };
        }
        if (this.state.drugDetails.programs[3].diff >= 0 || this.state.drugDetails.programs[3].diff === "N/A") {
          singleCarePriceColor = { color: '#08CA00' };
        } else {
          singleCarePriceColor = { color: 'red' };
        }
      }
      return (

        <div>
          <HeaderWithSearch
            updateProperties={this.updateProperties.bind(this)}
            toggleDialog={this.toggleDialog.bind(this)}
            value={0}
            clickHome={this.clickHome} clickDashboard={this.clickDashboard} clickReports={this.clickReports}
          ></HeaderWithSearch>
          <DrugInformation
            drugRequest={this.state.drugRequest}
            selectedDrug={this.state.selectedDrug}
            strengthList={this.state.strengthList}
            quantityList={this.state.quantityList}
            onStrengthChange={this.onStrengthChange.bind(this)}
            updateQuantity={this.updateQuantity.bind(this)}
            drugStrength={this.state.drugStrength}
            drugQuantity={this.state.drugQuantity}
            updateProperties={this.updateProperties.bind(this)}
            toggleDialog={this.toggleDialog.bind(this)}
            showDialog={this.state.toggleDialog}
            history={this.props.history}
            response= {this.state.drugDetails}
          ></DrugInformation>

          <div className="page" style={{paddingTop:'10px'}}>
            <div className="overallDisplay ">
              <div className="row">
                <div className=" col-sm">
                  <div className="row">
                    <div className="priceTitle col-sm">Average Price</div>
                  </div>
                  <div className="row">
                    <div className="overallPrice col-sm" style={averagePriceColor}>
                      <div className="headerhelp">
                        <span></span>
                        <span>{this.state.drugDetails ? "$" + this.round(this.state.drugDetails.average) : "N/A"}</span></div>
                      <div className="diff">
                        <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.averageDiff : 0}></Arrow> {this.state.drugDetails ? this.round(this.state.drugDetails.averageDiff) : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="row">
                    <div className=" priceTitle col-sm">Current Price</div>
                  </div>
                  <div className="row">
                    <div className=" overallPrice col-sm" style={currentPriceColor}>
                      <div className="headerhelp">
                        <span ></span>
                        {this.state.drugDetails && this.state.drugDetails != "N/A" ? "$" + this.round(this.state.drugDetails.programs[0].price) : "N/A"}</div>
                      <div className="diff">
                        <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[0].diff : 0}></Arrow> {this.state.drugDetails && this.state.drugDetails != "N/A" ? this.round(this.state.drugDetails.programs[0].diff) : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                </div>
                <div className=" col-sm">
                  <div className="row">
                    <div className=" priceTitle col-sm">Lowest Market Price</div>
                  </div>
                  <div className="row">
                    <div className=" overallPrice last col-sm " style={lowestPriceColor}>
                      <div className="headerhelp ">
                        <span ></span>
                        {(this.state.drugDetails && this.state.drugDetails != "N/A") ? "$" + this.round(this.state.drugDetails.recommendedPrice) : "N/A"}</div>
                      <div className="diff">
                        <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.recommendedDiff : 0}></Arrow>{(this.state.drugDetails && this.state.drugDetails != "N/A") ? this.round(this.state.drugDetails.recommendedDiff) : "N/A"}</span>
                      </div> </div>
                  </div>
                </div>
              </div>
            </div >
            <h3 className="competitorTitle"><strong>Competitor Price</strong></h3>
            <div >
              <div name="SingleCareRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >  <img src={SingleCareImg} alt="SingleCare" style={{ height: '60px', width: '150px' }} /></div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails != "N/A" ? this.state.drugDetails.programs[4].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={singleCarePriceColor}>
                  <span className="compPrice">
                    <span ></span>
                    {this.state.drugDetails && this.state.drugDetails.programs[4].price != "N/A" ? "$" + this.round(this.state.drugDetails.programs[4].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[4].diff : 0}></Arrow>{this.state.drugDetails && this.state.drugDetails.programs[4].diff != "N/A" ? this.round(this.state.drugDetails.programs[4].diff) : "N/A"}</span >
                  </span ></div >
              </div >
              <div name="MedImpactRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >  <img src={MedImpactImg} alt="MedImpact" style={{ height: '60px', width: '150px' }} /></div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails != "N/A" ? this.state.drugDetails.programs[3].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={singleCarePriceColor}>
                  <span className="compPrice">
                    <span ></span>
                    {this.state.drugDetails && this.state.drugDetails.programs[3].price != "N/A" ? "$" + this.round(this.state.drugDetails.programs[3].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[3].diff : 0}></Arrow>{this.state.drugDetails && this.state.drugDetails.programs[3].diff != "N/A" ? this.round(this.state.drugDetails.programs[3].diff) : "N/A"}</span >
                  </span ></div >
              </div >
              <div name="WellRxRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >
                  <img src={WellRxImg} alt="WellRx" style={{ height: '60px', width: '150px' }} />
                </div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails != "N/A" ? this.state.drugDetails.programs[2].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={wellRxPriceColor}>
                  <span className="compPrice ">
                    <span ></span>
                    {this.state.drugDetails && this.state.drugDetails.programs[2].price != "N/A" ? "$" + this.round(this.state.drugDetails.programs[2].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[2].diff : 0}></Arrow>{this.state.drugDetails && this.state.drugDetails.programs[2].diff != "N/A" ? this.round(this.state.drugDetails.programs[2].diff) : "N/A"}  </span >
                  </span ></div >
              </div >
              <div name="UsPharmacyCardRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >
                  <img src={USProviderImg} alt="US Pharmacy Card" style={{ height: '60px', width: '150px' }} />
                  </div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails.programs[1].pharmacy != "N/A" ? this.state.drugDetails.programs[1].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={usPharmCardPriceColor}>
                  <span className="compPrice ">
                    <span ></span>
                    {(this.state.drugDetails && this.state.drugDetails.programs[1].price != "N/A") ? "$" + this.round(this.state.drugDetails.programs[1].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[1].diff : 0}></Arrow> {(this.state.drugDetails && this.state.drugDetails.programs[1].diff != "N/A") ? this.round(this.state.drugDetails.programs[1].diff) : "N/A"}</span >
                  </span ></div >
              </div >



              <div name="GoodRxRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >  <img src={GoodRxImg} alt="GoodRx" style={{ height: '60px', width: '150px' }} /></div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails != "N/A" ? this.state.drugDetails.programs[5].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={singleCarePriceColor}>
                  <span className="compPrice">
                    <span ></span>
                    {this.state.drugDetails && this.state.drugDetails.programs[5].price != "N/A" ? "$" + this.round(this.state.drugDetails.programs[5].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[5].diff : 0}></Arrow>{this.state.drugDetails && this.state.drugDetails.programs[5].diff != "N/A" ? this.round(this.state.drugDetails.programs[5].diff) : "N/A"}</span >
                  </span ></div >
              </div >
            </div >
          </div >

          <div className={classes.divider} />



        </div >
      );
    } else {
      return (<div></div>);
    }

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


function IntegrationDownshift() {

}

IntegrationDownshift.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(connect()(withStyles(styles)(ViewDrugDetails)));
