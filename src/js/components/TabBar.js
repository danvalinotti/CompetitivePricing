import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import image from "../../assests/images/InsideLogo_1.svg";


class TabBar extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      value: this.props.value
    }
  }
  handleChange(event, newValue) {
    this.setState({
      value: newValue
    }
    );
  }

  render() {
    return (
      <div>
        <AppBar position="static" style={{ background: "orange" }}>
          <Toolbar>
           
            <span onClick={()=>this.props.clickHome()} className="headerHelp pointer">
              <span ><svg style={{ marginLeft: '30%', width: '70px', paddingTop: '5px' ,height:'25px' }}
                xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg></span>
              <span><img src={image} style={{paddingRight:'20px' , float: 'right', width: '130px', height: '30px' }} /> </span></span>
            <Tabs
              value={this.state.value}
              onChange={(event, value) => this.handleChange(event, value)}
            >
              <Tab style={{color:'white'}} onClick={() => this.props.clickHome()} label="Search" />
              <Tab style={{color:'white'}} onClick={() => this.props.clickDashboard()} label="Dashboard" />
              <Tab style={{color:'white'}} onClick={() => this.props.clickReports()} label="Reports" />
            </Tabs>
          </Toolbar>
        </AppBar>

      </div>
    );
  }

}
export default TabBar;