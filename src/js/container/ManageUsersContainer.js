import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import ManageUsers from "../components/ManageUsers";


class ManageUsersContainer extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div>
                <ManageUsers
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
export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersContainer);

