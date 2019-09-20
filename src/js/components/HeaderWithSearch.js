import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Downshift from 'downshift';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import axios from 'axios';

import image from "../../assests/images/RxWave Logo White.png";
import brandImage from "../../assests/images/InsideLogo_1.svg";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import AccountCircle from '@material-ui/icons/AccountCircle';

import Menu from '@material-ui/core/Menu';
import AutoSuggestComponent2 from "./AutoSuggestComponent.1";
import Grid from '@material-ui/core/Grid';


class HeaderWithSearch extends React.Component {

  constructor(props) {
    super(props);

    var loggedIn = window.sessionStorage.getItem("loggedIn");

    if (!(loggedIn == "true")) {
      loggedIn = false;
    } else {
      loggedIn = true;
    }

    this.state = {
      inputValue: '',
      selectedItem: [],
      providerPrices: [],
      strengthList: [],
      quantityList: [],
      zipCode: '',
      drugStrength: '',
      drugQuantity: '',
      selectedDrug: null,
      selectedDrugName: '',
      drugRequest: null,
      drugDetails: null,
      toDashboard: true,
      open: false,
      averagePriceColor: null,
      value: 0,
      anchorEl: null,
      profileMenuOpen: false,
      loggedIn: loggedIn,
      openSignIn: false,
      openSignUp: false
    };
  }
  onChangeZipCode(event) {
    this.setState({
      zipCode: event.target.value,
    });
  }
  handleChange(event, newValue) {
    this.setState({
      value: newValue
    }
    );
  }
  
  onClickDrug(drug) {

    this.dosageList = drug.dose;
    this.setState({
      inputValue: drug.name,
      selectedDrug: drug,
      strengthList: drug.dose,
      drugStrength: drug.dose[0],
      quantityList: drug.dose[0].quantity,
      drugQuantity: drug.dose[0].quantity[0],
    });

  };
 
  getDrugDetails(drugRequest) {
    this.props.toggleDialog();
    axios.post('http://localhost:8081/getPharmacyPrice', drugRequest)
      .then(response => {

        this.setState({
          drugDetails: response.data,
        });

        this.props.toggleDialog();
        this.props.updateProperties(this.state.drugRequest, this.state.selectedDrug, response.data,
          this.state.strengthList, this.state.quantityList, 0, 0);
        if (response.data.averageDiff >= 0 || this.state.drugDetails.averageDiff === "N/A") {

          this.setState({
            averagePriceColor: { color: '#08CA00' },
          });
        } else {
          this.setState({
            averagePriceColor: { color: 'red' },
          });
        }
      })
  };
  
  onClickSearch() {
    this.state.providerPrices[0];
    if (this.state.selectedDrug == null) {
      this.state.selectedDrug = this.state.providerPrices[0];
      var drug = this.state.selectedDrug;
      this.dosageList = drug.dose;
      this.setState({
        inputValue: drug.name,
        selectedDrug: drug,
        strengthList: drug.dose,
        drugStrength: drug.dose[0],
        quantityList: drug.dose[0].quantity,
        drugQuantity: drug.dose[0].quantity[0],
      });
    }


    const zipCode = this.state.zipCode;
    const drugNDC = this.state.selectedDrug.defaultDose;
    const drugType = "BRAND_WITH_GENERIC";
    const drugStrength = this.state.selectedDrug.dose[0].label;
    const quantity = this.state.selectedDrug.dose[0].defaultQuantity;
    const drugName = this.state.selectedDrug.name;
    const drugRequest = { "drugNDC": drugNDC, "drugName": drugName, "drugType": drugType, "dosageStrength": drugStrength, "quantity": quantity, "zipcode": zipCode, "longitude": "longitude", "latitude": "latitude" }

    this.setState({
      drugRequest: drugRequest,
    });
    this.getDrugDetails(drugRequest);

  }
 
  openProfileMenu(event) {
     
    this.setState({
      profileMenuOpen: !this.state.openProfileMenu,
      anchorEl: event.target
    })
  }
  closeProfileMenu(event) {
    
    this.setState({
      profileMenuOpen: false,
      anchorEl: event.target
    })
  }
  goToAdmin(){
    this.props.history.push("/admin/manage/users");
  }
  loadMenuItems(){
    
      if(this.props.profile.role == "admin"){
        return(<div>
          <MenuItem >My Account</MenuItem>
          <MenuItem onClick={this.goToAdmin.bind(this)} >Go To Admin</MenuItem>
          <MenuItem  onClick={this.logout.bind(this)}>Logout</MenuItem></div>);
      }else{
        return(<div>
          <MenuItem >My Account</MenuItem>
          <MenuItem  onClick={this.logout.bind(this)}>Logout</MenuItem></div>);
      }
  } 
  logout() {
    this.setState({
      loggedIn: false,
    });
    window.sessionStorage.setItem("loggedIn", false);
    window.sessionStorage.setItem("token", "");

    this.props.history.push({ pathname: '/signin' });
  }
 
 
  updateDrug(drug) {
    this.onClickDrug(drug);
  }
  setFirstChoice() {
    // console.log("SET FIRST CHOICE");
  }

  render() {
    const { classes } = this.props;
    return (

      <AppBar position="static" style={{ background: "#0F0034" }}>
        <Toolbar>

          <Grid container sm={12} direction="row">
          <Grid container sm={8}direction="row">
            <span onClick={() => this.props.clickHome()} className="headerHelp pointer" style={{ marginTop: '1.5%' }}>
              {/* <span ><svg style={{ width: '70px', paddingTop: '5px', height: '25px' }}
                xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></span> */}
              <span><img src={image} style={{ paddingRight: '20px', float: 'right', width: '130px', height: '30px' }} /> </span></span>
            <Tabs  value={this.state.value} onChange={(event, value) => this.handleChange(event, value)}
            >
              <Tab  onClick={() => this.props.clickHome()} label={<span style={{ color: 'white' }}> Home</span>}/>
              <Tab  onClick={() => this.props.clickDashboard()} label={<span style={{ color: 'white' }}>Dashboard</span>} />
              <Tab onClick={() => this.props.clickReports()} label={<span style={{ color: 'white' }}>Reports</span>}/>
            </Tabs>

            </Grid>
            <Grid container sm={4} direction="row">
            {/* <div className="headerButton" style={{width:'350px', padding: '0px' }}>
            
                <AutoSuggestComponent2 name="autoSuggestValue"
                  AutoSuggestComponent={this.props.drugStrengthArray}

                  setFirstChoice={this.setFirstChoice.bind(this)}
                  drugSearchResult={this.props.drugSearchResult}
                  actions={this.props.actions}
                  drugStrengthArray={this.props.drugStrengthArray}
                  updateDrug={this.updateDrug.bind(this)}

                > </AutoSuggestComponent2>
            
            </div> */}
          
            {/* <div className=" headerZip" style={{width:'100px', padding: '0px', paddingRight: '5px' }}>
              <input className="form-control " style={{height:'50px'}} onChange={this.onChangeZipCode.bind(this)} type="text" id="myZipCode" placeholder="Zip Code" />
            </div>
            <div className="headerButton" style={{ padding: '0px', paddingRight: '5px' }}>
              <button className="searchButton1 search-bar-copy-4" onClick={this.onClickSearch.bind(this)}>
                Search
                </button>
            </div> */}

            <div style={{ marginLeft: "auto", marginRight: -12 }}>
              <Button
                aria-label="Account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.openProfileMenu.bind(this)}
                color="white"
                style={{backgroundColor:'white'}}
              >
               <span><img src={brandImage} style={{ paddingRight: '20px', float: 'right', width: '130px', height: '30px' }} /> </span>
                <AccountCircle style={{ color: 'white' }} />
              </Button>
              <Menu
                id="menu-appbar"
                open={this.state.profileMenuOpen}
                onChange={() => { this.navigateProfile }}
                onBlur={this.closeProfileMenu.bind(this)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                getContentAnchorEl={null}
                anchorEl={this.state.anchorEl}

                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}

              >{this.loadMenuItems()}
              </Menu>
            </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

    );
  };
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
export default withStyles(styles)(HeaderWithSearch);