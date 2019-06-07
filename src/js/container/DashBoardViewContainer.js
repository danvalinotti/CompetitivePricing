import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import DashBoardViewComponent from "../components/DashBoardView";


class DashBoardViewContainer extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <DashBoardViewComponent
                    actions = {this.props.actions}
                    dashBoardDrugsData = {this.props.dashBoardDrugsData}


                />

            </div>
        );
    }
}


DashBoardViewContainer.propTypes = {

};



const mapStateToProps = (state) => {
    const {dashBoardDrugsData} = state.dashBoardReducer;
    return {
        dashBoardDrugsData
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoardViewContainer);

