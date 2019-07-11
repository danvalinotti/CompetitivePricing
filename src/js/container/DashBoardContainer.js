import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import DashBoard from "../components/DashBoard";
import {actions} from "../actions/dashBoardActions";
import Axios from 'axios';

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
                />

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

