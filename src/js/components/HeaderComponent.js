import React, { Component } from "react";
import image from "../../assests/images/InsideLogo_1.svg";

import TabBar from "./TabBar";
class HeaderComponent extends Component {

    render() {
        return (
            
            <TabBar color={"orange"} profile={this.props.profile} value={this.props.value}history={this.props.history} tab1={"Home"} clickHome={this.props.clickHome} tab2={"Dashboard"} clickDashboard={this.props.clickDashboard} tab3={"Reports"} clickReports={this.props.clickReports}></TabBar>
        )
    }

}
export default HeaderComponent;