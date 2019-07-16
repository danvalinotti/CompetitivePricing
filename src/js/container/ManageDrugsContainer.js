import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import ManageDrugs from "../components/ManageDrugs";
import TabBar from "../components/TabBar";

class ManageDrugsContainer extends Component {
    constructor(props) {
        super(props);
        console.log("ManageDrugsContainer");
        console.log(props);
    }
    clickHome() {
        console.log("HOME");
    }
    clickDashboard() {
        console.log("Dashboard");
    }
    clickReports() {
        console.log("Reports");
    }


    render() {
        return (
            <div>
                <ManageDrugs
                    actions = {this.props.actions}
                    dashBoardDrugsData = {this.props.dashBoardDrugsData}
                />

            </div>
        );
    }
}




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
export default connect(mapStateToProps, mapDispatchToProps)(ManageDrugsContainer);

