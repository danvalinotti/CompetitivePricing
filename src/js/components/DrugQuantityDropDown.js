import React, {Component} from "react";

class DrugQuantityDropDown extends Component {
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
                <select {...input} name="drugQuantity" defaultValue="" style={{ height: '60px',
                    width: '100%',
                    border: '1px solid #B3B3B3',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)'

                }}
                        onChange={this.handleChange.bind(this)} value={this.props.drugQuantity}>
                        <option key="" value="">
                           Select Quantity
                        </option>
                    {drugDosageArray.map((option,index) =>
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    )}

                </select>
        )
    }
}

export default DrugQuantityDropDown;