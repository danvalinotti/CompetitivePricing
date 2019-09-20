import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'

import HeaderComponent from "./HeaderComponent";
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
import Axios from "axios";
import TabBar from './TabBar';
class ViewDrugDetails extends React.Component {
  constructor(props) {
    super(props);
    this.authenticateUser();
    var quantityList = [];
    
    if (!this.props.state.location.state) {
      this.props.history.push('/search');
      this.state = {};
    } else {
      var response = this.props.state.location.state.response;
    var request = this.props.state.location.state.request;
    request.token = window.sessionStorage.getItem("token");
      console.log(response);
    if(response.average == "0" || response.average == "N/A"|| response.average == "0.0"){
      response.average = this.responseAverage(response);
    }
    if(response.recommendedPrice == "0" || response.recommendedPrice == "N/A"|| response.recommendedPrice == "0.0"){
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
    this.authenticateUser.bind(this);
    this.clickHome = this.clickHome.bind(this);
    this.clickDashboard = this.clickDashboard.bind(this);
    this.clickReports = this.clickReports.bind(this);

  }
  responseAverage(response){
   
    var count = 0;
    var sum = 0;
   
    response.programs.forEach(program => {
      // console.log(program.price);
      // console.log(count);
      // console.log(sum);
      if(program.price != "N/A"){
        count++
        sum = sum+Number(program.price) 
      }
      
    });

    return sum/count;
  }
  responseLowest(response){
    
    var lowest = "N/A";
    
   
    response.programs.forEach(program => {
      console.log(program.price);
      console.log(lowest);
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
  authenticateUser(){
    var userToken = {};
    userToken.name = window.sessionStorage.getItem("token");

    Axios.post('http://localhost:8081/authenticate/token' , userToken)
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
      var averagePriceColor, lowestPriceColor, usPharmCardPriceColor, currentPriceColor, singleCarePriceColor, wellRxPriceColor, blinkPriceColor;
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
        if (this.state.drugDetails.programs[5].diff >= 0 || this.state.drugDetails.programs[5].diff === "N/A") {
          blinkPriceColor = { color: '#08CA00' };
        } else {
          blinkPriceColor = { color: 'red' };
        }
      }
      return (

        <div>
          {/* <HeaderWithSearch
          
            updateProperties={this.updateProperties.bind(this)}
            toggleDialog={this.toggleDialog.bind(this)}
            history={this.props.history}
            value={0}
            profile={this.state.loggedInProfile}
            clickHome={this.clickHome} clickDashboard={this.clickDashboard} clickReports={this.clickReports}
          ></HeaderWithSearch> */}
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
              <div name="BlinkHealthRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >
                 <svg width="150px" height="60px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 171 27"><g fill="#EF4156" fill-rule="nonzero"><path d="M11.928 16.772c-.166-.095-.148-.335.027-.413 1.323-.59 1.913-2.433 1.788-3.663-.239-2.333-2.033-4.449-5.518-4.449H.701a.7.7 0 0 0-.701.7v17.124a.7.7 0 0 0 .7.701h7.403c4.091 0 6.255-2.071 6.255-5.582 0-1.958-.735-3.447-2.43-4.418zM3.758 12.3a.7.7 0 0 1 .7-.7h3.53c1.135 0 1.953.592 1.953 1.948 0 1.356-.818 1.949-1.953 1.949h-3.53a.7.7 0 0 1-.7-.7V12.3zm4.397 11.118H4.458a.7.7 0 0 1-.7-.7v-3.168a.7.7 0 0 1 .7-.7h3.697c1.61 0 2.402.745 2.402 2.284 0 1.538-.792 2.284-2.402 2.284zM48.041 26.435c.144.201.375.32.621.32h2.626a.774.774 0 0 0 .775-.773l-.01-16.972a.777.777 0 0 0-.777-.776H49.05a.778.778 0 0 0-.777.776l.003 10.55c0 .182-.236.254-.338.102-1.376-2.063-6.53-9.788-7.427-11.093a.776.776 0 0 0-.64-.335h-2.395a.778.778 0 0 0-.778.778l-.007 16.976c0 .43.348.779.778.779h2.3c.431 0 .757-.35.756-.78l-.003-9.848c0-.18.233-.253.336-.104l7.182 10.4zM109.11 8.97v2.287a.71.71 0 0 1-.712.71h-7.506a.185.185 0 0 0-.186.185v3.063c0 .102.083.184.185.184h5.514c.433 0 .783.35.783.783v2.249c0 .432-.35.783-.783.783h-5.513a.185.185 0 0 0-.186.185v3.451c0 .102.083.185.186.185h7.462c.424 0 .767.344.767.767v2.344a.767.767 0 0 1-.766.766H97.668a.783.783 0 0 1-.783-.783V9.042c0-.433.35-.784.783-.784h10.73a.71.71 0 0 1 .711.711M154.435 8.963v2.283a.766.766 0 0 1-.815.765h-4.37a.185.185 0 0 0-.186.185v14.007a.753.753 0 0 1-.74.766h-2.26a.753.753 0 0 1-.74-.766V12.196a.185.185 0 0 0-.185-.185h-4.417a.766.766 0 0 1-.815-.765V8.963c0-.388.314-.702.702-.702h13.124c.387 0 .702.314.702.702M59.434 19.305l5.587 7.254c.144.191.37.303.61.303h2.91c.631 0 .989-.721.608-1.223 0 0-5.773-7.467-6.584-8.502a.184.184 0 0 1 .008-.234l6.52-7.46c.468-.483.189-1.228-.484-1.228h-3.23a.76.76 0 0 0-.549.235l-5.462 6.38a.185.185 0 0 1-.325-.12V8.986a.748.748 0 0 0-.749-.749H55.97a.749.749 0 0 0-.75.75v17.126c0 .414.336.75.75.75h2.326a.749.749 0 0 0 .749-.749l.006-6.681c0-.205.26-.292.384-.128M141.312 26.267v-2.498a.702.702 0 0 0-.702-.701h-7.5a.185.185 0 0 1-.186-.186V8.956a.702.702 0 0 0-.702-.702h-2.46a.702.702 0 0 0-.703.702v17.31c0 .388.314.703.702.703h10.85a.702.702 0 0 0 .701-.702M28.807 26.054v-2.485a.698.698 0 0 0-.699-.698h-7.464a.184.184 0 0 1-.184-.185V8.94a.699.699 0 0 0-.699-.699h-2.448a.698.698 0 0 0-.699.699v17.115c0 .386.313.699.699.699h10.795a.699.699 0 0 0 .699-.7M160.915 9.032v6.183c0 .103.082.186.185.186h5.839a.185.185 0 0 0 .185-.186V9.032c0-.435.353-.787.788-.787h2.238c.435 0 .788.353.788.788v17.095a.788.788 0 0 1-.787.787h-2.24a.788.788 0 0 1-.787-.787v-6.742a.185.185 0 0 0-.185-.186H161.1a.185.185 0 0 0-.185.186v6.742a.788.788 0 0 1-.788.787h-2.201c-.435 0-.825-.351-.826-.786V9.034c0-.436.353-.79.79-.79h2.236c.435 0 .789.353.789.788M30.638 5.274a2.546 2.546 0 1 0 0-5.093 2.546 2.546 0 0 0 0 5.093M33.185 16.906V10.37a2.55 2.55 0 0 0-2.547-2.546 2.55 2.55 0 0 0-2.547 2.546v6.535a2.55 2.55 0 0 0 2.547 2.546 2.55 2.55 0 0 0 2.547-2.546m-.753-6.535v3.131h-3.588v-3.13c0-.99.805-1.794 1.794-1.794.99 0 1.794.805 1.794 1.793M120.04 18.477h-2.252c-.184 0-.212-.182-.158-.282l1.13-3.2a.157.157 0 0 1 .105-.09v-.001c.016-.006.032-.004.049-.005.017 0 .033-.001.049.005.043.01.083.043.105.09l1.13 3.2c.054.1.026.283-.158.283m6.906 7.574L120.679 9.1a1.2 1.2 0 0 0-1.13-.796h-1.168a1.2 1.2 0 0 0-1.13.796l-6.284 16.952c-.128.34.001.732.31.904a.45.45 0 0 0 .193.045h2.273c.544 0 .756-.184.936-.558.122-.254.134-.268.181-.376l1.39-3.813c.186-.425.458-.493.808-.493h3.713c.349 0 .621.068.807.493 0 0 1.508 4.057 1.57 4.189.18.374.393.558.937.558h2.358c.06 0 .14-.016.193-.045.309-.172.438-.564.31-.904M83.819 9.033v6.183c0 .103.083.185.185.185h5.839a.185.185 0 0 0 .185-.185V9.033c0-.435.353-.788.788-.788h2.238c.435 0 .789.353.789.789v17.094a.788.788 0 0 1-.788.788h-2.238a.789.789 0 0 1-.789-.789v-6.74a.185.185 0 0 0-.185-.186h-5.839a.185.185 0 0 0-.185.186v6.741a.788.788 0 0 1-.788.788h-2.2c-.435 0-.825-.351-.826-.786V9.034a.788.788 0 0 1 .788-.789h2.237c.436 0 .789.353.789.788"></path></g></svg>
                  </div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails.programs[5].pharmacy != "N/A" ? this.state.drugDetails.programs[5].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={blinkPriceColor}>
                  <span className="compPrice ">
                    <span ></span>
                    {(this.state.drugDetails && this.state.drugDetails.programs[5].price != "N/A") ? "$" + this.round(this.state.drugDetails.programs[5].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[5].diff : 0}></Arrow> {(this.state.drugDetails && this.state.drugDetails.programs[5].diff != "N/A") ? this.round(this.state.drugDetails.programs[5].diff) : "N/A"}</span >
                  </span ></div >
              </div >
              <div name="GoodRxRow" className="row competitorRow">
                <div className="col-xs-12 col-sm competitors firstCol " >  <img src={GoodRxImg} alt="GoodRx" style={{ height: '60px', width: '150px' }} /></div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest">{this.state.drugDetails && this.state.drugDetails != "N/A" ? this.state.drugDetails.programs[6].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " style={singleCarePriceColor}>
                  <span className="compPrice">
                    <span ></span>
                    {this.state.drugDetails && this.state.drugDetails.programs[6].price != "N/A" ? "$" + this.round(this.state.drugDetails.programs[6].price) : "N/A"}</span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={this.state.drugDetails ? this.state.drugDetails.programs[6].diff : 0}></Arrow>{this.state.drugDetails && this.state.drugDetails.programs[6].diff != "N/A" ? this.round(this.state.drugDetails.programs[6].diff) : "N/A"}</span >
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
