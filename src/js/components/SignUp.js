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
            email: '',
            name: '',
            password: '',
            emailErrorText:'',
            passwordErrorText:'',
            activeStep :0,
            warning: '',
        }
    }
    handleEmailChange(event) {
        if(event.target.value.length ==0){
            this.setState({
                email: event.target.value,
                emailErrorText:'Email must not be empty'

            });
        }else{
            console.log(event.target.value.includes('@'));
            if(event.target.value.includes('@')){
                this.setState({
                    email: event.target.value,
                    emailErrorText:''
                });
            }else{
                this.setState({
                    email: event.target.value,
                    emailErrorText:'Email not valid'
                });
                
            }
        }
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        });
    }

    handlePasswordChange(event) {
        if(event.target.value.length ==0){
            this.setState({
                password: event.target.value,
                passwordErrorText:'Password must not be empty'

            });
        }else{
            if(event.target.value.length < 6){
                this.setState({
                    password: event.target.value,
                    passwordErrorText: 'Must be at least 6 characters'
                });
            }else{
                this.setState({
                    password: event.target.value,
                    passwordErrorText:''
                });
            }
           
        }
    }
    renderEmailStep() {
        return (<div>{this.state.warning}
            <Grid container direction="column" alignItems="center" justify="center">
                <TextField
                    required
                    error={this.state.emailErrorText.length === 0 ? false : true}
                    helperText={this.state.emailErrorText}
                    id="standard-name"
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleEmailChange.bind(this)}
                    margin="normal"
                />
                <TextField
                    required
                    autoComplete="off"
                    error={this.state.passwordErrorText.length === 0 ? false : true}
                    helperText={this.state.passwordErrorText}
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
    renderPasswordStep() {
        return (<div>
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
    renderFinalStep() {
        return (<div>
            Sign Up
        </div>);
    }
    handleSubmit() {
        var profile = {};
        profile.username = this.state.email;
        profile.password = this.state.password;
        profile.name = this.state.name;
        profile.role = "user"
        this.submitSignUp(profile);
    }
    submitSignUp(profile) {
        
        Axios.post('http://100.25.217.246:8081/signUp', profile)
            .then(response => {
                console.log(response.data.username)
                if(response.data.username === "Exists"){
                    this.setActiveStep((data)=>{return 0});
                }else{
                    this.props.history.push({ pathname: '/signin' });
                }
               
            });


    }
    signInNav() {
        this.props.history.push("/signin");
    }
    setActiveStep(newStep) {
        if(this.state.emailErrorText == '' && this.state.passwordErrorText == ''){
            if(newStep == 0){

            }else {
                if(newStep()==0){
                    this.setState({
                        activeStep:0,
                        email : '',
                        password: '',
                        warning :<div style={{color:"red"}}>Email taken, try again.</div>,
                    })
                }else{
                
                    var step = newStep(this.state.activeStep);
                    this.setState({
                        activeStep:step
                    })
                }
            }
        
        }
       
    }



    render() {

        return (
            <div><br />
                <Grid container direction="column" alignItems="center" justify="center">
                    <Card style={{ maxWidth: '500px', backgroundColor: 'whitesmoke' }}>

                        <CardContent>
                            <Grid container spacing={1} direction="column" alignItems="center" justify="center">
                                <Grid container item xs={12} spacing={3} direction="column" alignItems="center" justify="center">
                                    <Typography variant="h4">Sign Up</Typography><br />

                                    <img src={galaxeLogo} width="100px" height="100px" />
                                </Grid>

                                <Grid container item xs={12} spacing={3}>
                                    <HorizontalLinearStepper
                                        step1={this.renderEmailStep.bind(this)}
                                        step2={this.renderPasswordStep.bind(this)}
                                        step3={this.renderFinalStep.bind(this)}
                                        submit={this.handleSubmit.bind(this)}
                                        steps={["Email / Password", "Enter Details", "Login"]}
                                        activeStep= {this.state.activeStep}
                                        setActiveStep = {this.setActiveStep.bind(this)}
                                    >

                                    </HorizontalLinearStepper>
                                </Grid><br />
                                <Grid container item xs={12} spacing={3} direction="column" alignItems="right" justify="right">
                                    <Button variant="contained" onClick={this.signInNav.bind(this)}>Sign In</Button>
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