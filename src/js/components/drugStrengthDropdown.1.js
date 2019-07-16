import React, {Component} from "react";
import zIndex from "@material-ui/core/styles/zIndex";
import Select from "@material-ui/core/Select";
import { MenuItem } from "@material-ui/core";
class DrugStrengthDropDown2 extends Component {
    constructor(props){
        super(props);
        this.state = {
            tech: 'select',
            drugStrength:this.props.drugStrength,
        };
        
        this.onStrengthChange = this.onStrengthChange.bind(this);
    }

    handleChange(e){
        this.setState({
            tech: e.target.value
        })
    }
    
    onStrengthChange(event) {
        console.log("CHANGING STRENTHG CHANGE ");
        console.log(event)
        if (event) {
            this.setState({
                drugStrength: event.target.dataset.value,

            });
            this.props.updateStrength(this.props.drugStrengthArray[event.target.dataset.value], event.target.dataset.value);
         
        }

    }
    getDose(index){
        return this.state.drugStrengthArray[index];
    }

    render(){

         let drugDosageArray =this.props.drugStrengthArray;
        const { input, label } = this.props;

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