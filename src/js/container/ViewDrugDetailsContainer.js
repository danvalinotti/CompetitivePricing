import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import ViewDrugDetails from "../components/ViewDrugDetails";
import '../../assests/sass/ViewDrugDetailsCSS.css'


class ViewDrugDetailsContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                    <ViewDrugDetails
                        drugSearchResult={this.props.drugSearchResult}
                        actions={this.props.actions}
                        drugStrengthArray={this.props.drugStrengthArray}
                        state= {this.props}
                    />
            </div>
        );
    }
}


ViewDrugDetailsContainer.propTypes = {

};



const mapStateToProps = (state) => {
    const { drugSearchResult, drugStrengthArray, showDrugStrength } = state.dashBoardReducer;
    return {
        drugSearchResult, drugStrengthArray, showDrugStrength
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ViewDrugDetailsContainer);

