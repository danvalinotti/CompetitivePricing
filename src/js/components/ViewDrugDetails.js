import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import HeaderComponent from "./HeaderComponent";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Arrow from "../components/Arrow";
import DrugInformation from "../components/DrugInformation";
import DrugPriceExpandable from "./DrugPriceExpandable"
import {authenticateUser} from '../services/authService';

class ViewDrugDetails extends React.Component {
  constructor(props) {
    super(props);
    authenticateUser(this);
    var quantityList = [];
    
    if (!this.props.state.location.state) {
      this.props.history.push('/search');
      this.state = {};
    } else {
      var response = this.props.state.location.state.response;
    var request = this.props.state.location.state.request;
    request.token = window.sessionStorage.getItem("token");
      // console.log(response);
    if(response.average == "0" || response.average == "N/A"|| response.average == "0.0"){
      response.average = this.responseAverage(response);
    }
    if(response.recommendedPrice == "0" || response.recommendedPrice == "N/A"){
      response.recommendedPrice = this.responseLowest(response);
    }

    var info = this.props.state.location.state.info;
      this.props.state.location.state.info.dose.map((dose) => {
        if (dose.label === this.props.state.location.state.request.dosageStrength) {
          quantityList = dose.quantity;
        }
      });
      info.description= response.description;
      this.state = {
        strengthList: info.dose,
        quantityList: quantityList,
        drugStrength: this.getIndexByLabel(request.dosageStrength, info.dose),
        drugQuantity: this.getIndexByValue(request.quantity, quantityList),
        selectedDrug: info,
        drugRequest: request,
        drugDetails: response,
        
        toggleDialog: false,
        loggedInProfile:{},
      };
     
    }
    this.clickHome = this.clickHome.bind(this);
    this.clickDashboard = this.clickDashboard.bind(this);
    this.clickReports = this.clickReports.bind(this);

  }
  responseAverage(response){
   
    var count = 0;
    var sum = 0;
   
    response.programs.forEach(program => {
      if(program.price != "N/A"){
        count++;
        sum = sum+Number(program.price) 
      }
      
    });

    return sum/count;
  }
  responseLowest(response){
    
    var lowest = "N/A";
    
   
    response.programs.forEach(program => {
      if(program.price != "N/A"){
        if(lowest == "N/A"){
         lowest =  Number(program.price)
        }else if(Number(program.price)<= Number(lowest)){
          lowest =  Number(program.price)
        }
      }
      
    });

    return lowest;
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
      var averagePriceColor, lowestPriceColor, currentPriceColor;
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

        if (this.state.drugDetails.programs.prices) {
          if (this.state.drugDetails.programs[0].prices[0].diff >= 0 || this.state.drugDetails.programs[0].prices[0].diff === "N/A") {
            currentPriceColor = { color: '#08CA00' };
          } else {
            currentPriceColor = { color: 'red' };
          }
        } else {
          currentPriceColor = { color: '#08CA00'}
        }

      }
      return (

        <div>
          <HeaderComponent profile={this.state.loggedInProfile} value={0} clickHome={this.clickHome} clickDashboard={this.clickDashboard} history={this.props.history} clickReports={this.clickReports}/>

      
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

          <div className="page" style={{paddingTop:'45px'}}>
            <div className="overallDisplay ">
              <div className="row">
                <div className=" col-sm overallPriceContainer">
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
                <div className="col-sm overallPriceContainer">
                  <div className="row">
                    <div className=" priceTitle col-sm">Current Price</div>
                  </div>
                  <div className="row">
                    <div className=" overallPrice col-sm" style={currentPriceColor}>
                      <div className="headerhelp">
                        <span ></span>
                        {this.state.drugDetails.programs[0].prices.length > 0 && this.state.drugDetails != "N/A" ? "$" + this.round(this.state.drugDetails.programs[0].prices[0].price) : "N/A"}</div>
                      <div className="diff">
                        <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails.programs[0].prices.length > 0 ? this.state.drugDetails.programs[0].prices[0].diff : 0}></Arrow> 
                        {this.state.drugDetails.programs[0].prices.length > 0 && this.state.drugDetails != "N/A" ? this.round(this.state.drugDetails.programs[0].prices[0].diff) : "N/A"}</span>
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
                        {console.log(this.state.drugDetails.recommendedPrice)}
                        {(this.state.drugDetails && this.state.drugDetails.recommendedPrice != "N/A") ? "$" + this.round(this.state.drugDetails.recommendedPrice) : "N/A"}</div>
                      <div className="diff">
                        <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.recommendedDiff : 0}></Arrow>{(this.state.drugDetails && this.state.drugDetails != "N/A") ? this.round(this.state.drugDetails.recommendedDiff) : "N/A"}</span>
                      </div> </div>
                  </div>
                </div>
              </div>
            </div >
            <h3 className="competitorTitle"><strong>Competitor Pricing</strong></h3>
            <div >
              <DrugPriceExpandable prices= {this.state.drugDetails}></DrugPriceExpandable>
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
