import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import DrugExpandableRow from "./DrugExpandableRow";
import InsideRxImg from "../../assests/images/InsideLogo_1.svg";
import USPImage from "../../assests/images/usPharmCard2.png";
import WellRxImage from '../../assests/images/wellRx2.png';
import MedImpImage from "../../assests/images/medImpact2.png";
import SingleImage from "../../assests/images/singleCare2.png";
import BlinkImage from "../../assests/images/blinkLogo.png";
import GoodRxImage from "../../assests/images/goodRx2.png";

const useStyles = makeStyles(() => ({
    root: {
        width: "100%"
    }
}));

export default function DrugPriceExpandable({prices}) {
    const classes = useStyles();
    const images = [InsideRxImg, USPImage, WellRxImage, MedImpImage, SingleImage, BlinkImage, GoodRxImage];

    return (
        <div className={classes.root}>
            {prices.programs.map((program, key) => {
                return (
                    <DrugExpandableRow program={program} key={key} image={images[key]}/>
                )
            })}
        </div>
    );
}
