import React, { Component } from "react";
import TabBar from "./TabBar";
class HeaderComponent extends Component {

    render() {
        return (
            
            <TabBar color={"#0F0034"} profile={this.props.profile} value={this.props.value}history={this.props.history} tab1={"Home"} clickHome={this.props.clickHome} tab2={"Dashboard"} clickDashboard={this.props.clickDashboard} tab3={"Reports"} clickReports={this.props.clickReports}></TabBar>
        )
    }

}
export default HeaderComponent;