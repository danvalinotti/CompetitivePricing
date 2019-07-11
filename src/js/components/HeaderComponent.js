import React, { Component } from "react";
import image from "../../assests/images/InsideLogo_1.svg";

import TabBar from "./TabBar";
class HeaderComponent extends Component {

    render() {
        return (
            // <div className="row header" style={{ backgroundColor: '#ff9505', height: '60px', marginLeft: '0px', marginRight: '0px' }}>
            //     <table>
            //         <thead>
            //         <tr>
            //             <td style={{ paddingTop: '10px' }}>
            //                 <span className="headerHelp">
            //                     <span ><svg style={{ marginLeft: '30%', width: '70px', paddingTop: '5px' }}
            //                         xmlns="http://www.w3.org/2000/svg">
            //                         <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></span>

            //                     <span><img src={image} style={{ float: 'right', width: '130px', height: '30px' }} /> </span></span>
            //             </td>
            //         </tr>
            //         </thead>
            //     </table>


            // </div>
            <TabBar value={this.props.value}history={this.props.history} clickHome={this.props.clickHome} clickDashboard={this.props.clickDashboard} clickReports={this.props.clickReports}></TabBar>
        )
    }

}
export default HeaderComponent;