
import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import Arrow from "../components/Arrow";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import { Button } from "@material-ui/core";

// TODO: FIND OUT IF UNC PRICE IS DISPLAYED IF IT IS LOWER, OR IF IT EXISTS

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: 5
    },
    buttonText: {
        textTransform: 'capitalize',
        fontStyle: 'italic',
        color: 'rgba(0,0,0,0.4)',
        textDecoration: 'underline'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "34%",
        alignSelf: "center",
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33%",
        // float: "right",
        alignSelf: "center",
        marginLeft: "auto",
        color: "#0F0034",
        fontStyle: 'italic'
    },
    thirdHeading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33%",
        textAlign: "right",
        lineHeight: "2%",
        color: theme.palette.text.secondary,
    },
    priceText: {
        color: 'rgb(8, 202, 0)',
        fontSize: 24,
        fontWeight: 'Bold',
        paddingRight: 15
    },
    summaryContent: {
        height: 160,
        padding: '15px 0 15px 15px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    topFourContents: {
        paddingTop: 0,
        paddingBottom: 0,
        fontFamily: 'inherit',
        alignItems: 'center',
        color: 'rgba(0,0,0, 0.55)',
        fontStyle: 'italic',
        fontSize: 14
    },
    topFourPrices: {
        color: 'rgba(0,0,0, 0.55)',
        paddingTop: 0,
        paddingBottom: 0,
        fontFamily: 'inherit',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: 16
    },
    topFourContainer: {
        backgroundColor: '#F3F2F2',
        padding: '7px 0 0',
        display: 'flex',
        flexDirection: 'column'
    },
    topFourRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0 15px',
        marginBottom: '7px',
        borderBottom: '1px solid #CACACA'
    },
    topFourRowLAST: {
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0 15px',
        borderBottom: '1px solid #CACACA'
    },
    topFourNumber: {
        color: 'rgba(15,0,52, 0.66)',
        fontStyle: 'italic',
        fontSize: 18
    },
    diff: {
        display: 'flex',
        justifyContent: 'flex-end',
        fontSize: 14,
        fontWeight: 400
    },
    diffText: {
        color: 'rgb(8, 202, 0)',
        fontSize: 16,
        paddingRight: 15,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
}));

export default function DrugExpandableRow({ program, image, programId }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    function round(num) {
        let n = num;
        if (num instanceof String) {
            n = parseFloat(num);
        } else if (num === -1.0 || num === "null" || num == null) {
            return "N/A";
        }
        return Number(n).toFixed(2);
    }

    return (

        <ExpansionPanel
            square={true}
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
        >
            <ExpansionPanelSummary
                aria-controls="panel1bh-content"
                id="panel1bh-header"

                style={expanded ? { boxShadow: '-1px 3px 7px -4px rgba(0, 0, 0, 0.4)' } : {}}
            >
                <div id={programId} className={classes.summaryContent} >
                    <img src={image} alt="InsideRx" style={{ height: '60px', width: '150px' }} />
                    <Typography className={classes.secondaryHeading} align="left">
                        {program.prices.length > 0 ? program.prices[0]["pharmacy"] : "N/A"}
                    </Typography>
                    <div className={classes.thirdHeading} style={program.prices.length > 0 && program.prices[0].uncPriceFlag ? {paddingTop: 30} : {paddingTop: 0}}>
                        {(program.prices.length > 0 && program.prices[0].uncPriceFlag) ? (
                            <div className="uncPriceBox">
                                <span className="uncPriceLabel">UNC Price</span>
                            </div>
                        ) : (
                            <div></div>
                        ) }

                        {program.prices.length > 0 ? (
                            <Typography align="right" className={classes.priceText}>
                                {program.prices[0]["price"] ? "$" +
                                    round(
                                        program.prices[0]["uncPriceFlag"]
                                        ? program.prices[0]["uncPrice"]
                                        : program.prices[0]["price"])
                                    : "N/A"
                                }
                            </Typography>
                        ) : (
                                <Typography align="right" className={classes.priceText}>
                                    N/A
                            </Typography>
                            )}
                        <br />
                        {program.prices.length > 0 ? (
                            <Typography align="right" className={classes.diffText}>
                                {/*<Arrow diff={program.prices[0].diff} />${round(program.prices[0].diff)}*/}
                                <Arrow diff={0.00} />$0.00
                            </Typography>
                        ) : <div></div>}
                        <Button variant={"text"} color={"default"} className={classes.button} onClick={handleChange("panel1")}>
                            <span className={classes.buttonText}>Show {expanded ? "less" : "more"}</span>
                            {expanded ? <ExpandLessIcon style={{ fill: 'rgba(0,0,0,0.4)' }} /> : <ExpandMoreIcon style={{ fill: 'rgba(0,0,0,0.4)' }} />}

                        </Button>
                    </div>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.topFourContainer}>
                {program.prices.length > 0 ? (
                    <div className={`top4-${programId}`}>
                        {program.prices.slice(1, 5).map((price, key) => {
                            if (price.price) {
                                return (
                                    <div className={classes.topFourRow} key={key}>
                                        <div className={`${classes.topFourContents} col-xs-12 col-sm  price rest `} style={{ display: 'flex', justifyContent: 'flex-start' }}><span className={classes.topFourNumber}>#{key + 2}</span> </div>
                                        <div className={`${classes.topFourContents} col-xs-12 col-sm  ph armacy rest `} style={{ display: 'flex' }}><span>{price["pharmacy"]}</span></div>
                                        <div className={`${classes.topFourPrices} col-xs-12 col-sm  price rest `}>
                                        {(price.uncPriceFlag) ? (
                                            <div className="uncPriceBox--sub">
                                                <span className="uncPriceLabel">UNC Price</span>
                                            </div>
                                        ) : (<div></div>)}
                                            <span>
                                                {price.price === "N/A" ? "N/A" : "$" + round(price.uncPriceFlag ? price.uncPrice : price.price)}
                                            </span>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                ) : (
                        <div className={classes.topFourRow}>
                            <div className={`${classes.topFourContents} col-xs-12 col-sm  price rest `} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <span className={classes.topFourNumber}>
                                    No Pricing Information.
                            </span>
                            </div>
                        </div>
                    )}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
}