import React, {Component} from "react";
import zIndex from "@material-ui/core/styles/zIndex";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
class DrugStrengthDropDown2 extends Component {
    constructor(props){
        super(props);
        this.state = {
          
            drugStrength:this.props.drugStrength,
        };
        
        this.onStrengthChange = this.onStrengthChange.bind(this);
    }
    
    onStrengthChange(event) {
        if (event) {
            this.setState({
                drugStrength: event.target.dataset.value,

            });
            this.props.updateStrength(this.props.drugStrengthArray[event.target.dataset.value], event.target.dataset.value);
         
        }

    }
   

    render(){

        return (
                <Select name="drugStrength" onChange={()=>this.onStrengthChange(event)} value={this.props.drugStrength} 
                        className="form-control" >
                        
                    {this.props.drugStrengthArray.map((option,index) =>    
                        <MenuItem value={index}>{option.label}</MenuItem>
                      )}
               
                </Select>
        )
    }
}

export default DrugStrengthDropDown2;