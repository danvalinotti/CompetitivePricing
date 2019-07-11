import React, { Component } from "react";
import HeaderComponent from "./HeaderComponent";
import * as Sorting from "./Sorting";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Icons from "./Icons"
import Button from '@material-ui/core/Button'; 
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent'; 
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import HorizontalLinearStepper from './SignInStepper'
import TextField from '@material-ui/core/TextField'

class SignIn extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            email:''  ,
            password:''    
        }
    }
    handleEmailChange(event){
        this.setState({
            email:event.target.value
        });
    }
  
    handlePasswordChange(event){
        this.setState({
            password:event.target.value
        });
    }
    renderEmailStep(){
        return(<div>
             <Grid container direction="column" alignItems="center" justify="center">
            <TextField
        id="standard-name"
        label="Email" 
        value={this.state.email}
        onChange={this.handleEmailChange.bind(this)}
        margin="normal"
      />
      </Grid>
        </div>);
    }
    renderPasswordStep(){
            return(<div>
                  <Grid container direction="column" alignItems="center" justify="center">
                <TextField
            id="standard-name"
            label="Password" 
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange.bind(this)}
            margin="normal"
          />
          </Grid>
            </div>);
    }
    renderFinalStep(){
        return(<div>
            Final Step
        </div>);
    }
    handleSubmit(){
        var profile = {};
        profile.username = this.state.email;
        profile.password= this.state.password ; 
        // profile.name = this.state.name ; 
        // profile.role = "user"
        this.submitSignIn(profile);
    }
    submitSignIn(profile){
        console.log("profile");
        console.log(profile)
         Axios.post('https://drug-pricing-backend.cfapps.io/create/token' , profile)
         .then(response => {
           
             console.log("response.data"); 
             console.log(response.data); 
             var p = {};
             Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token' , response.data)
             .then(r => {
                 console.log(r.data)
                 if(r.data.password != "false"){
                   this.setState({
                     openSignIn : false,
                     loggedIn : true,
                     
                   });
                   console.log("LOGGED IN");
                  
                   window.sessionStorage.setItem("token",r.data.password);
                   window.sessionStorage.setItem("loggedIn","true");
                   this.props.history.push({ pathname: '/search' });
                 }else{
                    console.log("incorrect");
                 }
             })
             
          });
         
     }



    render() {
      
        return (
            <div><br/><br/><br/>
                <Grid container direction="column" alignItems="center" justify="center">
                <Card style={{maxWidth:'500px', backgroundColor:'whitesmoke'}} >
               
                    <CardContent>
                    <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={3}>
                         
                            </Grid>
                                
                            <Grid container item xs={12} spacing={3}>
                            <HorizontalLinearStepper 
                                step1={this.renderEmailStep.bind(this)} 
                                step2={this.renderPasswordStep.bind(this)}
                                step3={this.renderFinalStep.bind(this)}
                                submit= {this.handleSubmit.bind(this)}
                                steps= {["Enter Email Address", "Enter Password", "Login"]}

                                >
                               
                            </HorizontalLinearStepper>
                            </Grid>
                       
                        </Grid>
                    </CardContent>
                    
                </Card>
               </Grid>

            </div>
        )
    }
}

export default withRouter(SignIn);