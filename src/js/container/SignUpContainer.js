import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import SignUp from "../components/SignUp";
import gxWave from "../../assests/images/GxWave-Logo-White.png";


class SignUpContainer extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        return (
            <div  style={{ backgroundColor:'#0F0034'}}>
                <SignUp
                    actions = {this.props.actions}
                    dashBoardDrugsData = {this.props.dashBoardDrugsData}
                /><br/><br/>
                <div xs={4} justify="center" style={{
                         left: '0', bottom: '0', width: '100%', textAlign: 'center',}}>
                         <label  fontSize="9"> <strong style={{color:"white"}}>Powered By</strong>  </label>  
                         <img  className="gxWave" src={gxWave} style={{paddingLeft:'10px'}} width="75px" height="25px"/>
                    </div>
                    <br/>
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
export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer);

