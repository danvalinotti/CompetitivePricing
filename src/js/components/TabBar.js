import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import image from "../../assests/images/InsideLogo_1.svg";
import IconButton from '@material-ui/core/IconButton'; 
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import SignInDialog from './SignInDialog';
import SignUpDialog from './SignUpDialog';
import Axios from "axios";
import Toolbar from "@material-ui/core/Toolbar"

class TabBar extends React.Component {

  constructor(props) {
    super(props);
   // window.sessionStorage.setItem("key", "value");
    var loggedIn = window.sessionStorage.getItem("loggedIn");
    
    if(!(loggedIn == "true")){
      loggedIn = false;
    }else{
      loggedIn = true;
    }
   
    this.state = {
      value: this.props.value,
      anchorEl:null,
      profileMenuOpen: false,
      loggedIn: loggedIn,
      openSignIn:false,
      openSignUp:false

    }
  }
  handleChange(event, newValue) {
    this.setState({
      value: newValue
    }
    );
  }
  
  openProfileMenu(event){
   
    this.setState({
      profileMenuOpen: !this.state.openProfileMenu,
      anchorEl: event.target
    })
  }
  closeProfileMenu(event){
    
    this.setState({
      profileMenuOpen:false,
      anchorEl: event.target
    })
  }
  logout(){
    this.setState({
      loggedIn: false,
    });

    window.sessionStorage.setItem("loggedIn",false);
    window.sessionStorage.setItem("token","");
    this.props.history.push({ pathname: '/signin' });

  }
 
  goToAdmin(){
    if(this.props.page){
      this.props.history.push("/search");  
    }else{
      this.props.history.push("/admin/manage/users");
    }
  }

  loadMenuItems(){
      if(this.props.profile.role == "admin"){
        if(this.props.page){
          return(<div>
            <MenuItem >My Account</MenuItem>
            <MenuItem onClick={this.goToAdmin.bind(this)} >Go To User View</MenuItem>
            <MenuItem  onClick={this.logout.bind(this)}>Logout</MenuItem></div>);  
        }
        return(<div>
          <MenuItem >My Account</MenuItem>
          <MenuItem onClick={this.goToAdmin.bind(this)} >Go To Admin</MenuItem>
          <MenuItem  onClick={this.logout.bind(this)}>Logout</MenuItem></div>);
      }else{
        return(<div>
          <MenuItem >My Account</MenuItem>
          <MenuItem  onClick={this.logout.bind(this)}>Logout</MenuItem></div>);
      }
     
  }
  closeSignIn(){
  
    this.setState({
      openSignIn : false
    })
  }
  closeSignUp(){
    
    this.setState({
      openSignUp : false
    })
  }
  submitSignUp(profile){
    Axios.post('https://drug-pricing-backend.cfapps.io/signUp' , profile)
    .then(response => {
      console.log("response");
    });

    this.setState({
      openSignUp : false
    })
  }
  submitSignIn(profile){
    Axios.post('https://drug-pricing-backend.cfapps.io/create/token' , profile)
    .then(response => {
      
        var p = {};
        Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token' , response.data)
        .then(r => {
            if(r.data.password != "false"){
              this.setState({
                openSignIn : false,
                loggedIn : true,
                
              });
              window.sessionStorage.setItem("token",r.data.password);
              window.sessionStorage.setItem("loggedIn","true");
            }
        })
        
     });
    
}

  render() {
    return (
      <div>
        <AppBar position="static" style={{ background: this.props.color }}>
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
              <Tab style={{color:'white'}} onClick={() => this.props.clickHome()} label={this.props.tab1} />
              <Tab style={{color:'white'}} onClick={() => this.props.clickDashboard()} label={this.props.tab2} />
              <Tab style={{color:'white'}} onClick={() => this.props.clickReports()} label={this.props.tab3} />
              {this.props.tab4 ? <Tab style={{color:'white'}} onClick={() => this.props.clickTab4()} label={this.props.tab4} />: ''}
            </Tabs>
            <div style={{ marginLeft: "auto", marginRight: -12}}>
              <IconButton
                aria-label="Account of current user"
                aria-controls="menu-appbar"
               
                aria-haspopup="true"
                color="white"
                onClick={this.openProfileMenu.bind(this)}>
                
                <AccountCircle  style={{color:'white'}} />
              </IconButton>
              <Menu
                id="menu-appbar"
               open={this.state.profileMenuOpen}
               onChange= {()=>{this.navigateProfile}}
               onBlur={this.closeProfileMenu.bind(this)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                getContentAnchorEl={null}
                anchorEl={this.state.anchorEl}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
               
              >{this.loadMenuItems()}
               
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
          <SignInDialog onCloseFunc={this.closeSignIn.bind(this)} 
          dialog={this.state.openSignIn}
          submit={this.submitSignIn.bind(this)}></SignInDialog>
          <SignUpDialog onCloseFunc={this.closeSignUp.bind(this)} 
          dialog={this.state.openSignUp}
          submit={this.submitSignUp.bind(this)}></SignUpDialog>
      </div>
    );
  }

}
export default TabBar;