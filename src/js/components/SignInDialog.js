import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField'

import HorizontalLinearStepper from './SignInStepper'

class SignInDialog extends React.Component {

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
            <TextField
        id="standard-name"
        label="Email" 
        value={this.state.email}
        onChange={this.handleEmailChange.bind(this)}
        margin="normal"
      />
        </div>);
    }
    renderPasswordStep(){
            return(<div>
                <TextField
            id="standard-name"
            label="Password" 
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange.bind(this)}
            margin="normal"
          />
            </div>);
    }
    renderFinalStep(){
        return(<div>
            Final Step
        </div>);
    }
    handleSubmit(){

        const profile = {};
        profile.username = this.state.email;
        profile.password = this.state.password;

        this.props.submit(profile);
    }


    render() {
        return (

            <Dialog 
                onClose={() => this.props.onCloseFunc()}
                aria-labelledby="customized-dialog-title"
                open={this.props.dialog}
                style={{overflowY:'inherit'}}
                onBackdropClick={() => this.props.onCloseFunc()}
            >
                <DialogTitle id="customized-dialog-title" onClose={() => this.props.onCloseFunc()}>
                   Sign In
                </DialogTitle>
                <DialogContent className="textCenter" style={{maxHeight:'600px', overflowY:'initial'}}>
                    {/* <Container style={{overflowY:'inherit'}}> */}
                    
                        <Grid container spacing={1}>
                            <Grid container item xs={12} spacing={3}>
                            Logo
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
                    <br />

                </DialogContent>

            </Dialog>

        );

    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 4,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});
export default withStyles(styles)(SignInDialog);