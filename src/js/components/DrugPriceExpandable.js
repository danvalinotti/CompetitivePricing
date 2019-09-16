import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SingleCareImg from "../../assests/images/singleCare2.png";
import Arrow from "../components/Arrow";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33%",
    alignSelf: "center",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33%",
    // float: "right",
    alignSelf: "center",
    color: theme.palette.text.secondary
  },
  thirdHeading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33%",
    float: "right",
    textAlign: "right",
    lineHeight: "2%",
    color: theme.palette.text.secondary
  }
}));
function round(num) {
  return Number(num).toFixed(2);
}

export default function DrugPriceExpandable({prices}) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  console.log(prices);
  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{prices.programs[0].prices[0].program}</Typography>
          <Typography className={classes.secondaryHeading} inline align="left">
           {prices.programs[0].prices[0].pharmacy}
          </Typography>
          <div className={classes.thirdHeading}>
            <Typography inline align="right">
             {prices.programs[0].prices[0].price}
            </Typography>
            <br />
            <Typography inline align="right">
              {prices.programs[0].prices[0].diff}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        <div name="SingleCareRow"  style={{display:"contents"}}>
                <div className="col-xs-12 col-sm competitors firstCol " > 
                 <img src={SingleCareImg} alt="SingleCare" style={{ height: '60px', width: '150px' }} />
                </div>
                <div className=" col-xs-12 col-sm competitors pharmacy rest ">{prices && prices != "N/A" ? prices.programs[4].prices[0].pharmacy : "N/A"}</div>
                <div className=" col-xs-12 col-sm competitors price rest " >
                  <span className="compPrice">
                   <span ></span> 
                    {prices && prices.programs[4].price != "N/A" ? "$" + round(prices.programs[4].prices[0].price) : "N/A"} 
                    </span> <br />
                  <span className="diff">
                    <span style={{ display: 'inline-flex' }}><Arrow diff={prices ? prices.programs[4].prices[0].diff : 0}></Arrow>{prices && prices.programs[4].prices[0].diff != "N/A" ? round(prices.programs[4].prices[0].diff) : "N/A"}</span >
                  </span ></div >
              </div >
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Users</Typography>
          <Typography className={classes.secondaryHeading}>
            You are currently not an owner
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat
            lectus, varius pulvinar diam eros in elit. Pellentesque convallis
            laoreet laoreet.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Advanced settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Personal data</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer
            sit amet egestas eros, vitae egestas augue. Duis vel est augue.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
