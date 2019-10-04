import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import DashBoard from "../components/DashBoard";
import {actions} from "../actions/dashBoardActions";

import gxWave from "../../assests/images/GxWave-Logo.png";
class DashBoardContainer extends Component {
    constructor(props) {
        super(props);
        
    }
    
    render() {
        return (
            <div>
                <DashBoard
                    drugSearchResult={this.props.drugSearchResult}
                    actions={this.props.actions}
                    drugStrengthArray={this.props.drugStrengthArray}
                    drugPriceData = {this.props.drugPriceData}
                />   <br/><br/> 
                  <div xs={4} justify="center" style={{
                         left: '0', bottom: '0', width: '100%', textAlign: 'center',}}>
                         <label  fontSize="9"> <strong style={{color:"darkgrey"}}>Powered By</strong>  </label>  
                         <img  className="gxWave" src={gxWave} style={{paddingLeft:'10px'}} width="75px" height="25px"/>
                    </div>

            </div>

        );
    }
}


DashBoardContainer.propTypes = {

};



const mapStateToProps = (state) => {
    const {drugSearchResult,drugStrengthArray,showDrugStrength,drugPriceData} = state.dashBoardReducer;
    return {
        drugSearchResult,drugStrengthArray,showDrugStrength,drugPriceData
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoardContainer);

