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

function getSteps() {
  return ["Enter Email Address", "Enter Password", "Login"];
}

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
  const [activeStep, setActiveStep] = React.useState(0);
   
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = props.steps;

  function isStepOptional(step) {
    return false;
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  function handleNext(props) {
    if(activeStep === steps.length - 1){
            props.submit();
    }
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  function handleSkip() {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }

  function handleReset() {
    setActiveStep(0);
  }

  return (
    <div className={classes.root}>
    <Grid container direction="column" alignItems="center" justify="center" >
      <Stepper activeStep={activeStep} style={{backgroundColor:'whitesmoke'}}>
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
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep, props)}
            </Typography>
            <div>
            <Grid container alignItems="center" justify="center" >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={()=>{handleNext(props)}}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
              </Grid>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
