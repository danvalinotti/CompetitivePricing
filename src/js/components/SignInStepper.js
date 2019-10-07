import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));


function getStepContent(step , props) {
    
  switch (step) {
    case 0:
      return props.step1();
    case 1:
      return props.step2();
    case 2:
      return props.step3();
    default:
      return "Unknown step";
  }
}

export default function HorizontalLinearStepper(props) {
 
  const classes = useStyles();
  
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = props.steps;

  function isStepOptional(step) {
    return false;
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  function handleNext(props) {
    if(props.activeStep === steps.length - 1){
            props.submit();
    }
    let newSkipped = skipped;
    if (isStepSkipped(props.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(props.activeStep);
    }

    props.setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  function handleBack(props) {
    props.setActiveStep(prevActiveStep => prevActiveStep - 1);
  }


  function handleReset(props) {
    props.setActiveStep(0);
  }

  return (
    <div className={classes.root}>
    <Grid container direction="column" alignItems="center" justify="center" >
    <br/>
      <Stepper activeStep={props.activeStep} style={{backgroundColor:'white'}}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      </Grid>
      <div>
        {props.activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={() => handleReset(props)} className={classes.button}
            style={{backgroundColor:'rgb(28,173,220)', color:'#0F0034'}}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(props.activeStep, props)}
            </Typography>
            <div>
            <Grid container alignItems="center" justify="center" >
              <Button
                disabled={props.activeStep === 0}
                onClick={()=>handleBack(props)}
                className={classes.button}
              >
                Back
              </Button>

              <Button
                variant="contained"
               
                onClick={()=>{handleNext(props)}}
                style={{backgroundColor:'rgb(28,173,220)', color:'#0F0034'}}
                color="blue"
                
              >
                {props.activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              </Grid>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
