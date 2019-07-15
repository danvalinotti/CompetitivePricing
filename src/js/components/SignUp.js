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
import galaxeLogo from "../../assests/images/galaxeLogo.png";
import Divider from '@material-ui/core/Divider';

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email:''  ,
            name:'',
            password:''    
        }
    }
    handleEmailChange(event){
        this.setState({
            email:event.target.value
        });
    }
  
    handleNameChange(event){
        this.setState({
            name:event.target.value
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
    renderPasswordStep(){
            return(<div>
                 <Grid container direction="column" alignItems="center" justify="center">
                <TextField
            id="standard-name"
            label="Name" 
            value={this.state.name}
            onChange={this.handleNameChange.bind(this)}
            margin="normal"
          />
          </Grid>
            </div>);
    }
    renderFinalStep(){
        return(<div>
            Sign Up
        </div>);
    }
    handleSubmit(){
        var profile = {};
        profile.username = this.state.email;
        profile.password= this.state.password ; 
        profile.name = this.state.name ; 
        profile.role = "user"
        this.submitSignUp(profile);
    }
    submitSignUp(profile){
        console.log("profile");
        console.log(profile);
        Axios.post('https://drug-pricing-backend.cfapps.io/signUp' , profile)
        .then(response => {
          console.log(response.data);
          this.props.history.push({ pathname: '/signin' });
        });
    
        
      }
      signInNav(){
          this.props.history.push("/signin");
      }



    render() {
      
        return (
            <div><br/>
                <Grid container direction="column" alignItems="center" justify="center">
                <Card style={{maxWidth:'500px', backgroundColor:'whitesmoke'}}>
               
                    <CardContent>
                    <Grid container spacing={1} direction="column" alignItems="center" justify="center">
                    <Grid container item xs={12} spacing={3} direction="column" alignItems="center" justify="center">
                        <Typography variant="h4">Sign Up</Typography><br/>
                      
                         <img src={galaxeLogo} width="100px"height="100px"/>
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
                            </Grid><br/>
                            <Grid container item xs={12} spacing={3} direction="column" alignItems="right" justify="right">
                                    <Button variant="contained"  onClick={ this.signInNav.bind(this)}>Sign In</Button>
                            </Grid>                       
                        </Grid>
                    </CardContent>
                    
                </Card>
               </Grid>

            </div>
        )
    }
}

export default withRouter(SignUp);