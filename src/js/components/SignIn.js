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
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            warning :'',
            activeStep:0,
            updateDialog:false,
            oldPassword:'',
            newPassword:'',
            credWarning:''
        }
        this.setActiveStep  = this.setActiveStep.bind(this);
        this.submitSignIn =this.submitSignIn.bind(this);
    }
    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }
    renderEmailStep() {
        return (<div> {this.state.warning}
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
    renderPasswordStep() {
        return (<div>
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
    renderFinalStep() {
        return (<div>
            Log in
        </div>);
    }
    handleSubmit(resetFunc) {
        var profile = {};
        profile.username = this.state.email;
        profile.password = this.state.password;
        // profile.name = this.state.name ; 
        // profile.role = "user"
        console.log("resetFunc");
        console.log(resetFunc);
        this.submitSignIn(profile, resetFunc);
    }
    submitSignIn(profile) {
        console.log("profile");
        console.log(profile)
        Axios.post('https://drug-pricing-backend.cfapps.io/create/token', profile)
            .then(response => {

                console.log("response.data");
                console.log(response.data);
                var p = {};
                Axios.post('https://drug-pricing-backend.cfapps.io/authenticate/token', response.data)
                    .then(r => {
                        console.log(r.data)
                        if (r.data.password != "false") {
                            this.setState({
                                openSignIn: false,
                                loggedIn: true,

                            });
                            console.log("LOGGED IN");

                            window.sessionStorage.setItem("token", r.data.password);
                            window.sessionStorage.setItem("loggedIn", "true");
                            if(r.data.role.startsWith("created")){
                                //Open Dialog
                                this.setState({
                                    updateDialog:true
                                })
                            }else{
                                this.props.history.push({ pathname: '/search' });
                            }

                           
                        } else {
                            console.log("incorrect");
                            this.setActiveStep((data)=>{return 0})
                        }
                    })
                    // this.setActiveStep((data)=>{return 0}) 
            });
          
    }

    signUpNav() {
        this.props.history.push("/signup");
    }
    setActiveStep(newStep) {
        if(newStep == 0){
        }else {
            if(newStep()==0){
                this.setState({
                    activeStep:0,
                    email : '',
                    password: '',
                    warning :<div style={{color:"red"}}>Wrong credentials, try again.</div>,
                })
            }else{
                console.log("setActiveStep")
                console.log(newStep);
                var step = newStep(this.state.activeStep);
                this.setState({
                    activeStep:step
                })
            }
        }
        
        
       
    }
    handleClose(){
        this.setState({
            updateDialog:false
        })
    }
    handleOldPassword(event){
        this.setState({
            oldPassword : event.target.value
        });
    }
    handleNewPassword(event){
        this.setState({
            newPassword : event.target.value
        });
    }
    updatePassword(){
        var profile = {};
       
        profile.password = this.state.oldPassword ; 
        profile.username = this.state.email; 
        profile.role = this.state.newPassword; 
        Axios.post('https://drug-pricing-backend.cfapps.io/update/password', profile)
        .then(response => {
            if(response.data == null){
                this.setState({
                    credWarning:'Incorrect password'
                });
            }else{
                this.props.history.push("/search");
            }
        });
       
    }
    render() {

        return (
            <div><br /><br />
                <Grid container direction="column" alignItems="center" justify="center">
                    <Card style={{ maxWidth: '500px', backgroundColor: 'whitesmoke' }} >
                        <CardContent>
                            <Grid container spacing={1} direction="column" alignItems="center" justify="center">
                                <Grid container item xs={12} spacing={3} direction="column" alignItems="center" justify="center">
                                    <Typography variant="h4">Sign In</Typography><br />

                                    {/* <Divider variant="middle" light={true} /> */}
                                    <img src={galaxeLogo} width="100px" height="100px" />
                                </Grid>

                                <Grid container item xs={12} spacing={3}>

                                    <HorizontalLinearStepper
                                        step1={this.renderEmailStep.bind(this)}
                                        step2={this.renderPasswordStep.bind(this)}
                                        step3={this.renderFinalStep.bind(this)}
                                        submit={this.handleSubmit.bind(this)}
                                        steps={["Enter Email Address", "Enter Password", "Login"]}
                                        activeStep= {this.state.activeStep}
                                        setActiveStep = {this.setActiveStep.bind(this)}
                                    >

                                    </HorizontalLinearStepper>
                                </Grid><br />
                                <Grid container item xs={12} spacing={3} direction="column" alignItems="right" justify="right">
                                    <Button variant="contained"  onClick={ this.signUpNav.bind(this)}>Sign Up</Button>
                                </Grid>
                            </Grid>
                        </CardContent>

                    </Card>
                </Grid>
                <Dialog onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.updateDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Update Password
                    </DialogTitle>
                    <DialogContent className="textCenter">
                        <Grid container>
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom"> Old Password:</Typography>

                             </Grid>
                             {this.state.credWarning}
                            <Grid item xs={7}>
                                <TextField
                                    id="standard-name"
                                    type="password"
                                    value={this.state.oldPassword}
                                    onChange={this.handleOldPassword.bind(this)}
                                    margin="none"
                                />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item xs={5}>
                            <Typography verticalAlign="bottom">New Password:</Typography> 
                             </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    id="standard-name"
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={this.handleNewPassword.bind(this)}
                                    margin="none"
                                />
                            </Grid>
                        </Grid>
                       

                        <Button style={{ fontSize: '13px', height: '32px' }} onClick={() => { this.updatePassword() }} variant="contained" color="primary">Update Password</Button>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(SignIn);