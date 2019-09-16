import React, { Component } from "react";
import zIndex from "@material-ui/core/styles/zIndex";

class DrugStrengthDropDown extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.onStrengthChange = this.onStrengthChange.bind(this);
    }
    onStrengthChange(event) {

        if (event) {

            this.props.updateStrength(this.props.drugStrengthArray[event.target.value], event.target.value);

        }

    }
    getDose(index) {
        return this.state.drugStrengthArray[index];
    }

    render() {

        let drugDosageArray = this.props.drugStrengthArray;
        const { input, label } = this.props;

        return (
            <select {...input} name="drugStrength" defaultValue="" onChange={() => this.onStrengthChange(event)} value={this.props.drugStrength} style={{
                height: '60px',
                width: '100%',
                border: '1px solid #B3B3B3',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)',

            }}
                className="form-control" >
                <option key="" value="">
                    Select Strength
                        </option>
                {this.props.drugStrengthArray.map((option, index) =>
                    <option value={index} key={index}>{option.label}</option>
                )}

            </select>
        )
    }
}

export default DrugStrengthDropDown;