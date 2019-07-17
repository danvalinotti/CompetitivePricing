import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';



class SplitButton extends Component {
  constructor(props){
    super(props);
    this.state = {
      open:false,
      selectedIndex:-1,
      options : this.props.selections,
    
    }
  }

   handleClick() {
    alert(`You clicked ${options[selectedIndex]}`);
  }

  handleMenuItemClick(event, option) {
   if(option.key != this.state.selectedIndex){
    this.props.masterFunction(event, option);
    this.setSelectedIndex(option.key);
   }else{
     if(this.props.reset != undefined){
      this.props.reset();

     }else{
      this.props.masterFunction(event, option);
     }
     this.setState({
       selectedIndex:-1,
     })
   }
   
     
    
    this.setOpen(false);
  }


  handleToggle() {
    this.setOpen(!this.state.open);
  }
  setSelectedIndex(isSelected){
    this.setState({
      selectedIndex:isSelected
    });
  }
  setOpen(isOpen){
    this.setState({
      open:isOpen
    });
  }

   handleClose(event) {
   
    this.setOpen(false);
  }
  getButtonGroup(){
     
    return(<ButtonGroup fullWidth={true} variant="contained" color="primary" aria-label="Split button">
            <Button
              color="primary"
              variant="contained"
              size="small"
              aria-owns={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={this.handleToggle.bind(this)}
            >
            {this.props.dropDownName}
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>)
  }
  render(){
    return (
      <Grid container>
        <Grid item xs={12} align="center" style={{zIndex:30}}>
          {this.getButtonGroup()}
          <Popper open={this.state.open}  anchorEl={null} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  
                }}
              >
                <Paper id="menu-list-grow"style={{zIndex:30}}>
                  <ClickAwayListener onClickAway={this.handleClose.bind(this)}>
                    <MenuList >
                      {this.state.options.map((option, index) => (
                        <MenuItem
                          key={option.key}
                          style={{zIndex:2}}
                          selected={option.key === this.state.selectedIndex}
                          onClick={event => this.handleMenuItemClick(event, option)}
                        >
                         <label> {option.text}</label>
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Grid>
      </Grid>
    );
  }
  
}
export default SplitButton;