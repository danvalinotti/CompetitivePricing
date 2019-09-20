import React, {Component} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {actions} from "../actions/dashBoardActions";
import ViewDrugDetails from "../components/ViewDrugDetails";
import '../../assests/sass/ViewDrugDetailsCSS.css'
import gxWave from "../../assests/images/GxWave-Logo.png";

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
               <br/><br/>      <div xs={4} justify="center" style={{
                        left: '0', bottom: '0', width: '100%', textAlign: 'center',}}>
                         <label  fontSize="9"> <strong style={{color:"darkgrey"}}>Powered By</strong>  </label>  
                         <img  className="gxWave" src={gxWave} style={{paddingLeft:'10px'}} width="75px" height="25px"/>
                    </div>
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

