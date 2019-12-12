import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import HeaderComponent from "./HeaderComponent";
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import Arrow from "../components/Arrow";
import DrugInformation from "../components/DrugInformation";
import DrugPriceExpandable from "./DrugPriceExpandable"
import {authenticateUser} from '../services/authService';

class ViewDrugDetails extends React.Component {
    constructor(props) {
        super(props);
        authenticateUser(this);
        let quantityList = [];

        if (!this.props.state.location.state) {
            this.props.history.push('/search');
            this.state = {};
        } else {
            const response = this.props.state.location.state.response;
            const request = this.props.state.location.state.request;
            request.token = window.sessionStorage.getItem("token");
            // console.log(response);
            if (response.averagePrice === "0" || response.averagePrice === "N/A" || response.averagePrice === "0.0") {
                response.averagePrice = this.responseAverage(response);
            }
            if (response.recommendedPrice === "0" || response.recommendedPrice === "N/A") {
                response.recommendedPrice = this.responseLowest(response);
            }

            const info = this.props.state.location.state.info;
            this.props.state.location.state.info["dose"].map((dose) => {
                if (dose.label === this.props.state.location.state.request.dosageStrength) {
                    quantityList = dose.quantity;
                }
            });
            info.description = response.description;
            this.state = {
                strengthList: info["dose"],
                quantityList: quantityList,
                drugStrength: this.getIndexByLabel(request.dosageStrength, info["dose"]),
                drugQuantity: this.getIndexByValue(request.quantity, quantityList),
                selectedDrug: info,
                drugRequest: request,
                drugDetails: response,

                toggleDialog: false,
                loggedInProfile: {},
            };

        }
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);

    }

    responseAverage(response) {

        let count = 0;
        let sum = 0;

        response.programs.forEach(program => {
            if (program.price !== "N/A") {
                count++;
                sum = sum + Number(program.price)
            }

        });

        return sum / count;
    }

    responseLowest(response) {

        let lowest = "N/A";


        response.programs.forEach(program => {
            if (program.price !== "N/A") {
                if (lowest === "N/A") {
                    lowest = Number(program.price)
                } else if (Number(program.price) <= Number(lowest)) {
                    lowest = Number(program.price)
                }
            }

        });

        return lowest;
    }

    getIndexByLabel(label, list) {
        let index = 0;
        list.map((obj, i) => {
            if (obj.label === label) {
                index = i;
            }
        });
        return index;
    }

    getIndexByValue(val, list) {
        let index = 0;
        list.map((obj, i) => {
            if (obj.value === val) {
                index = i;
            }
        });
        return index;
    }

    round(num) {
        console.log(num);
        let n = num;
        if (num instanceof String) {
            n = parseFloat(num);
        } else if (num == null || num === "null") {
            return "N/A"
        }
        return Number(n).toFixed(2);
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
            drugQuantity: event.target.value,
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

    clickHome() {
        this.props.history.push({pathname: '/search'});
    }

    clickDashboard() {
        this.props.history.push({pathname: '/viewDashboard'});
    }

    clickReports() {
        this.props.history.push({pathname: '/reports'});
    }

    toggleDialog() {
        this.setState({
            toggleDialog: !this.state.toggleDialog
        })
    }

    render() {

        if (this.state.selectedDrug != null) {
            const {classes} = this.props;
            let averagePriceColor, lowestPriceColor, currentPriceColor;

            try {
                // Determine 'Average Price' text color
                if (this.state.drugDetails.programs[0].prices.length > 0 && this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.averagePrice <= 0) {
                    averagePriceColor = {color: '#08CA00'};
                } else {
                    averagePriceColor = {color: 'red'};
                }
                // Determine 'Lowest Price' text color
                if (this.state.drugDetails.programs[0].prices.length > 0 && this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.recommendedPrice <= 0) {
                    lowestPriceColor = {color: '#08CA00'};
                } else {
                    lowestPriceColor = {color: 'red'};
                }

                // Determine 'Current Price' text color
                if (this.state.drugDetails.programs) {
                    if (this.state.drugDetails.recommendedDiff >= 0 || this.state.drugDetails.recommendedDiff === "N/A") {
                        currentPriceColor = {color: '#08CA00'};
                    } else {
                        currentPriceColor = {color: 'red'};
                    }
                } else {
                    currentPriceColor = {color: '#08CA00'}
                }
            } catch (error) {
                // If a value is not found, or other error is thrown use default green color
                lowestPriceColor = {color: '#08CA00'};
                averagePriceColor = {color: '#08CA00'};
                currentPriceColor = {color: '#08CA00'};
                console.log(error);
            }

            return (

                <div>
                    <HeaderComponent profile={this.state.loggedInProfile} value={0} clickHome={this.clickHome}
                                     clickDashboard={this.clickDashboard} history={this.props.history}
                                     clickReports={this.clickReports}
                    />

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
                        response={this.state.drugDetails}
                    />

                    <div className="page" style={{paddingTop: '45px'}}>
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
                                                <span>{this.state.drugDetails ? "$" + this.round(this.state.drugDetails.averagePrice) : "N/A"}</span>
                                            </div>
                                            <div className="diff">
                                                <span style={{display: 'inline-flex'}}><Arrow
                                                    diff={this.state.drugDetails ? (this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.averagePrice) : 0}></Arrow> {this.state.drugDetails ? this.round((this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.averagePrice)) : "N/A"}</span>
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
                                                <span></span>
                                                {this.state.drugDetails ? "$" + this.round(this.state.drugDetails.currentPrice) : "N/A"}
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
                                                <span></span>
                                                {(this.state.drugDetails && this.state.drugDetails.recommendedPrice !== "N/A") ? "$" + this.round(this.state.drugDetails.recommendedPrice) : "N/A"}
                                            </div>
                                            <div className="diff">
                                                <span style={{display: 'inline-flex'}}><Arrow
                                                    diff={this.state.drugDetails ? ((this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.recommendedPrice)) : 0}></Arrow>{(this.state.drugDetails && this.state.drugDetails.recommendedPrice) ? this.round((this.state.drugDetails.programs[0].prices[0].price - this.state.drugDetails.recommendedPrice)) : "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 className="competitorTitle"><strong>Competitor Pricing</strong></h3>
                        <div>
                            <DrugPriceExpandable prices={this.state.drugDetails}></DrugPriceExpandable>
                        </div>
                    </div>
                    <div className={classes.divider}/>
                </div>
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
