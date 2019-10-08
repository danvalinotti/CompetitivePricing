import React, { Component } from "react";
import "../../assests/sass/dashboardstyles.css";
import { withRouter } from "react-router-dom";
import Axios from "axios";
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Dialog from "@material-ui/core/Dialog";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'
import galaxeLogo from "../../assests/images/RxWave Logo.png";

import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from "@material-ui/core";

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            warning: '',
            activeStep: 0,
            updateDialog: false,
            oldPassword: '',
            newPassword: '',
            credWarning: '',
            emailErrorText: '',
            passwordErrorText: '',
            confirmNewPassword: '',
        };
        this.setActiveStep = this.setActiveStep.bind(this);
        this.submitSignIn = this.submitSignIn.bind(this);
    }
    handleEmailChange(event) {
        if (event.target.value.length == 0) {
            this.setState({
                email: event.target.value,
                emailErrorText: 'Email must not be empty'

            });
        } else {
            // console.log(event.target.value.includes('@'));
            if (event.target.value.includes('@')) {
                this.setState({
                    email: event.target.value,
                    emailErrorText: ''
                });
            } else {
                this.setState({
                    email: event.target.value,
                    emailErrorText: 'Email not valid'
                });

            }
        }

    }

    handlePasswordChange(event) {
        if (event.target.value.length == 0) {
            this.setState({
                password: event.target.value,
                passwordErrorText: 'Password must not be empty'

            });
        } else {
            this.setState({
                password: event.target.value,
                passwordErrorText: ''
            });
        }
    }
    renderEmailStep() {
        return (<div> {this.state.warning}
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
            </Grid>
        </div>);
    }
    renderPasswordStep() {
        return (<div>
            <Grid container direction="column" alignItems="center" justify="center">
                <TextField
                    required
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
    renderFinalStep() {
        return (<div>
            Log in
        </div>);
    }
    handleSubmit() {
        var profile = {};
        profile.username = this.state.email;
        profile.password = this.state.password;


        this.submitSignIn(profile);
    }
    submitSignIn(profile) {
        Axios.post(process.env.API_URL + '/create/token', profile)
            .then(response => {

                if(response.data.password != "false"){
                    Axios.post(process.env.API_URL + '/authenticate/token', response.data)
                    .then(r => {

                        if (r.data.password != "false") {
                            this.setState({
                                openSignIn: false,
                                loggedIn: true,

                            });


                            window.sessionStorage.setItem("token", r.data.password);
                            window.sessionStorage.setItem("loggedIn", "true");
                            if (r.data.role.startsWith("created")) {
                                //Open Dialog
                                this.setState({
                                    updateDialog: true
                                })
                            } else {
                                this.props.history.push({ pathname: '/search' });
                            }


                        } else {

                            this.setActiveStep((data) => { return 0 })
                        }
                    })
                }else{
                    this.setActiveStep((data) => { return 0 })
                }
            });

    }

    signUpNav() {
        this.props.history.push("/signup");
    }
    setActiveStep(newStep) {
        if (this.state.emailErrorText == '' && this.state.passwordErrorText == '') {
            if (newStep() == 0 && newStep == 0) {
                this.setState({
                    activeStep: 0,
                    email: '',
                    password: '',
                    warning: <div style={{ color: "red" }}>Wrong credentials, try again.</div>,
                })
            } else if (newStep == 0) {
                var step = newStep(this.state.activeStep);
                this.setState({
                    activeStep: step
                })
            }
        }
    }
    handleClose() {
        this.setState({
            updateDialog: false
        })
    }
    handleForgotClose() {
        this.setState({
            updateDialog: false
        })
    }
    handleOldPassword(event) {
        this.setState({
            oldPassword: event.target.value
        });
    }
    handleNewPassword(event) {
        this.setState({
            newPassword: event.target.value
        });
    }
    handleConfirmNewPassword(event){
        this.setState({
            confirmNewPassword: event.target.value
        });
    }
    handleForgotPW(){
        this.setState({
            updateDialog: true
        })
    }
    updatePassword() {
        var profile = {};

        profile.password = this.state.oldPassword;
        profile.username = this.state.email;
        profile.role = this.state.newPassword;
        if(this.state.newPassword == this.state.confirmNewPassword){
        if(this.state.newPassword != this.state.oldPassword){
        Axios.post(process.env.API_URL + '/update/password', profile)
            .then(response => {
                if (response.data == null) {
                    this.setState({
                        credWarning: 'Incorrect'
                    });
                } else {
                    this.props.history.push("/search");
                }
            });
        }else{
            this.setState({
                credWarning:"New password must not match old password"
            })
     
        }
        }else{
            this.setState({
                credWarning: "New password doesn't match confirmed password"
            })
           
        }
    }
    handleKeyPress (event){
        if(event.key === 'Enter'){
          this.handleSubmit();
        }
      }
    render() {

        return (
            <div style={{backgroundColor:'#0F0034'}}><br /><br />
                <Grid container direction="column" alignItems="center" justify="center">
                    <Card style={{ maxWidth: '500px',minWidth: '300px', backgroundColor: 'white' }} >
                        <CardContent>
                            <Grid container spacing={1} direction="column" alignItems="center" justify="center">
                                <Grid container item xs={12} spacing={3} direction="column" alignItems="center" justify="center">
                                  <br/>
                                    <img src={galaxeLogo} width= "200px" height= "71px" /><br/>
                                    <Typography variant="h6">Log In</Typography>
                                </Grid>

                                <Grid container item direction="column" spacing={3}>
                                    <div><br /> 
                                        <Grid container item xs={12} direction="column" alignItems="center" justify="center">
                                        <Typography verticalAlign="bottom">{this.state.warning}</Typography>

                                            <TextField
                                                width="auto"
                                                required
                                                variant="outlined"
                                                error={this.state.emailErrorText.length === 0 ? false : true}
                                                helperText={this.state.emailErrorText}
                                                id="standard-name"
                                                label="Email"
                                                value={this.state.email}
                                                onChange={this.handleEmailChange.bind(this)}
                                                margin="normal"
                                                onKeyPress={this.handleKeyPress.bind(this)}
                                            />
                                        </Grid>
                                    </div>
                                    <div>
                                        <Grid container item xs={12} direction="column" alignItems="center" justify="center">
                                            <TextField
                                                required
                                                error={this.state.passwordErrorText.length === 0 ? false : true}
                                                helperText={this.state.passwordErrorText}
                                                id="standard-name"
                                                label="Password"
                                                variant="outlined"
                                                type="password"
                                                value={this.state.password}
                                                onChange={this.handlePasswordChange.bind(this)}
                                                margin="normal"
                                                onKeyPress={this.handleKeyPress.bind(this)}
                                            />
                                        </Grid>
                                    </div>

                                </Grid><br />
                                <Grid container item xs={12} direction="column" alignItems="center" justify="center" style={{marginBottom: '-12px'}}>
                                    <Button style={{backgroundColor:'rgb(28,173,220)', color:'#0F0034', width: '80%'}} variant="contained" onClick={this.handleSubmit.bind(this)}>Sign In</Button>
                                </Grid><br />
                                <Grid container item xs={12} direction="column" alignItems="center" justify="center">
                                    <Button style={{backgroundColor:'rgb(28,173,220)', color:'#0F0034', width: '80%'}}variant="contained" onClick={this.signUpNav.bind(this)}>Sign Up</Button>
                                </Grid><br />
                                <Grid container item xs={12} direction="column" alignItems="center" justify="center">
                                    <Link  onClick={this.handleForgotPW.bind(this)}><label style={{cursor:'pointer' ,color:'rgb(28,173,220)'}}><strong>Forgot Password</strong></label></Link>
                                </Grid>
                            </Grid>
                        </CardContent>

                    </Card>
                </Grid>
                <Dialog onClose={() => this.handleClose()}
                    aria-labelledby="customized-dialog-title" open={this.state.updateDialog}>
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                        Forgot Password
                    </DialogTitle>
                    <DialogContent className="textCenter"><label style={{color:'red'}}>{this.state.credWarning}</label>
                    <Grid container >
                            <Grid item style={{paddingTop:'4%'}} xs={5}>
                                <Typography verticalAlign="bottom"> Email:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant="outlined"
                                    id="standard-name"
                                  
                                    value={this.state.email}
                                    onChange={this.handleEmailChange.bind(this)}
                                    margin="dense"
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item style={{paddingTop:'4%'}} xs={5}>
                                <Typography verticalAlign="bottom"> Old Password:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    variant="outlined"
                                    id="standard-name"
                                    type="password"
                                    value={this.state.oldPassword}
                                    onChange={this.handleOldPassword.bind(this)}
                                    margin="dense"
                                />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item style={{paddingTop:'4%'}} xs={5}>
                                <Typography verticalAlign="bottom">New Password:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    
                                    id="standard-name"
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={this.handleNewPassword.bind(this)}
                                    margin="dense"
                                    variant="outlined"
                                    // hiddenLabel
                                />
                            </Grid>
                        </Grid>
                        <Grid container >
                            <Grid item style={{paddingTop:'4%'}} xs={5}>
                                <Typography verticalAlign="bottom">Confirm New Password:</Typography>
                            </Grid>
                            <Grid item xs={7}>
                                <TextField
                                    id="standard-name"
                                    type="password"
                                    value={this.state.confirmNewPassword}
                                    onChange={this.handleConfirmNewPassword.bind(this)}
                                    margin="dense"
                                    variant="outlined"
                                    // hiddenLabel
                                />
                            </Grid>
                        </Grid>

                        <Button style={{ fontSize: '13px', height: '32px', margin:'5%' }} onClick={() => { this.updatePassword() }} variant="contained" color="primary">Update Password</Button>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(SignIn);