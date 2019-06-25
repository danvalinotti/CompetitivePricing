import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Downshift from 'downshift';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import axios from 'axios';
import image from "../../assests/images/InsideLogo_1.svg";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";


function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

class HeaderWithSearch extends React.Component {

  constructor(props) {
    super(props);
    console.log("PROPS");
    console.log(this.props);
    console.log(props);
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
      value: 0 ,
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
  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value,
    })

    this.getProviderPrices(event.target.value);
  };

  getProviderPrices(drugName) {
    fetch('http://localhost:8081/getDrugInfo/' + drugName)
      .then(res => res.json())
      .then(json => {
        this.setState({
          providerPrices: json
        });
        return json;
      });
  };
  getSuggestions(value) {
    const providerPrices = this.state.providerPrices;

    return providerPrices;
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
  handleInputChange(event) {
    this.setState({
      inputValue: event.target.value,
    })

    this.getProviderPrices(event.target.value);
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
  renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;

    return (
      <MenuItem
        {...itemProps}
        key={suggestion.name + "1"}
        value={suggestion}
        selected={isHighlighted}

        component="div"
        style={{

          backgroundColor: isHighlighted ? 'lightgrey' : 'white',
          zIndex: 4,
        }}
      >
        {suggestion.name}
      </MenuItem>
    );
  }
  onClickSearch() {
    console.log("PRovider Price");
    console.log(this.state.providerPrices[0]);
    this.state.providerPrices[0];
    if(this.state.selectedDrug  == null){
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
  render() {
    const { classes } = this.props;
    return (

      // <div className="header" >
      //   <div className="searchArea">

      //     <div className="headerRow row" style={{padding:'.5%'}}>
      //       <div className="headerCol col-sm-4" style ={{padding:'0px'}} >
      //         <div className="headerHelp" style ={{paddingTop: '2%' , paddingLeft: '4%'}}>
      //           <div ><svg style={{width: '35px', height:'35px'}}
      //             xmlns="http://www.w3.org/2000/svg">
      //             <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></div>

      //           <div><img src={image} style={{ float: 'right', width: '130px', height: '30px' }} /> </div></div>
      //       </div>
      //       <div className="headerCol col-sm-8 searchHeader " style ={{padding:'0px'}}>
              
      //       </div>
      //     </div>

      //   </div>

      // </div>
      <AppBar position="static" style={{ background: "orange" }}>
      <Toolbar>
     
       <div className="col-sm-7"> 
        <div className= "row">
        <span onClick={()=>this.props.clickHome()} className="headerHelp pointer" style={{marginTop:'1.5%'}}>
          <span ><svg style={{ marginLeft: '30%', width: '70px', paddingTop: '5px' ,height:'25px' }}
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></span>
          <span><img src={image} style={{paddingRight:'20px' , float: 'right', width: '130px', height: '30px' }} /> </span></span>
        <Tabs
          value={this.state.value}

          onChange={(event, value) => this.handleChange(event, value)}
        >
          <Tab onClick={() => this.props.clickHome()} label="Search" />
          <Tab onClick={() => this.props.clickDashboard()} label="Dashboard" />
          <Tab onClick={() => this.props.clickReports()} label="Reports" />
        </Tabs>
        </div> 
       </div>
        <div className="col-sm-5">
        <div className="row">
                <div className="col-sm-6 headerButton" style={{padding:'0px'}}>
                  <Downshift onSelect={(drug) => this.onClickDrug(drug)} itemToString={i => { return i ? i.name : '' }} id="downshift-simple" >
                    {({
                      theme = { theme },
                      getInputProps,
                      getItemProps,
                      getMenuProps,
                      handleInputChange,
                      highlightedIndex,
                      inputValue,
                      isOpen,
                      selectedItem,

                    }) => (
                        <div className={classes.container} className="form-control search-bar ">
                          {renderInput({
                            fullWidth: true,
                            classes,

                            InputProps: getInputProps({
                              placeholder: 'Search A Drug',
                              className: 'removeLine ',
                              onChange: this.handleInputChange.bind(this),
                              value: this.state.inputValue,
                              style:{flexWrap:'inherit'}
                            }),

                          })}
                          <div {...getMenuProps()}>
                            {isOpen ? (
                              <Paper className={classes.paper} square className="" style={{
                                position: 'relative',
                                zIndex: 5,
                                maxHeight:'200px',
                                overflowY:'scroll'
                            }}>
                                {this.getSuggestions(inputValue).map((suggestion, index) =>
                                  this.renderSuggestion({
                                    suggestion,
                                    index,
                                    itemProps: getItemProps({ item: suggestion }),
                                    highlightedIndex,
                                    selectedItem,

                                  }),
                                )}
                              </Paper>
                            ) : null}
                          </div>
                        </div>
                      )}
                  </Downshift>
                </div>
                <div className="col-sm-3 headerZip" style={{padding:'0px', paddingRight:'5px'}}>
                  <input className="form-control search-bar " onChange={this.onChangeZipCode.bind(this)} type="text" id="myZipCode" placeholder="Zip Code" />
                </div>
                <div className="col-sm-3 headerButton" style={{padding:'0px',paddingRight:'5px'}}>
                  <button className="searchButton1 search-bar-copy-4" onClick={this.onClickSearch.bind(this)}>
                    Search
                  </button>
                </div>
                </div>
              </div>
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