import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


class DatePicker extends React.Component {
  // The first commit of Material-UI
  constructor(props){
    super(props);
    this.state={
      selectedDate : new Date(),
    };
    this.setSelectedDate.bind(this);
  }
  
  setSelectedDate(date){
    

    this.setState({
      selectedDate :date,
    })
  }


 handleDateChange(date) {
   
    this.setSelectedDate(date);
  }
  render(){

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
       
          <KeyboardDatePicker
            margin="normal"
            id={this.props.id ?this.props.id  : "mui-pickers-date"}
            format = "MM-dd-yyyy"
            label="Date picker"
            value={this.state.selectedDate}
            onChange={this.handleDateChange.bind(this)}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
         
        
      </MuiPickersUtilsProvider>
  
    );
  }
  
}
export default DatePicker;
