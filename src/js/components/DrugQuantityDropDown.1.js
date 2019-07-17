import React, {Component} from "react";
import { Select, MenuItem } from "@material-ui/core";

class DrugQuantityDropDown2 extends Component {
    constructor(props){
        super(props);
        this.state = {
          
        };
        
    }

    handleChange(e){
        this.props.updateQuantity(e.target.value);
    }
   
   
    render(){
        let drugDosageArray = this.props.drugQuantityArray;
        const { input, label } = this.props;
        return (
                <Select {...input} name="drugQuantity" defaultValue="" 
                className="form-control"
                        onChange={this.handleChange.bind(this)} value={this.props.drugQuantity}>
                        
                    {drugDosageArray.map((option,index) =>
                        <MenuItem key={index} value={option.value}>
                            {option.label}
                        </MenuItem>
                    )}

                </Select>
        )
    }
}

export default DrugQuantityDropDown2;