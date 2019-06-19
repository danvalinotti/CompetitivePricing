import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'
import DatePicker from './DatePicker'
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
class FilterDialogs extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            isOpen:true
        }
    }
    handleClose(){

        this.setState({
            isOpen : false,
        });
    }
    handleSubmit(){
        var date = document.getElementById("mui-pickers-date").value;
        console.log(date);
        this.props.filterFunc(date);

        this.props.updateDialog("off");

    }
    handleBetweenSubmit(){
        var start = document.getElementById("datePicker1").value;
        var end = document.getElementById("datePicker2").value;
        this.props.filterFunc(start, end);

       this.props.updateDialog("off");
    }
    handleBetweenDrugsSubmit(){
        var start = document.getElementById("startDrug").value;
        var end = document.getElementById("endDrug").value;
        this.props.filterFunc(start, end);

       this.props.updateDialog("off");
    }
    handleDrugCountSubmit(){
        var drugCount = document.getElementById("drugCount").value;
        this.props.filterFunc(drugCount);

       this.props.updateDialog("off");
    }

    render() {
        return (
            <div>
             
                {(this.props.dialog === "specificDate") ?
                   <Dialog
                   onClose={() => this.handleClose()}
                   aria-labelledby="customized-dialog-title"
                   open={this.props.dialog!="off"}
               >
                   <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                       Filter By Specific Date
                    </DialogTitle>
                   <DialogContent className="textCenter">
                       <DatePicker></DatePicker><br />
                       <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleSubmit() }} className="btn btn-outline-primary">Select Date</button>
                       <br />
                       
                   </DialogContent>

               </Dialog>
                :null} 
                 {(this.props.dialog === "betweenDates") ?
                   <Dialog
                   onClose={() => this.handleClose()}
                   aria-labelledby="customized-dialog-title"
                   open={this.props.dialog!="off"}
               >
                   <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                       Filter By Range Of Dates
                    </DialogTitle>
                   <DialogContent className="textCenter">
                   
                       <div ><DatePicker id="datePicker1"></DatePicker></div><br />
                       <div ><DatePicker id="datePicker2"></DatePicker></div><br />
                       <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleBetweenSubmit() }} className="btn btn-outline-primary">Select Date</button>
                       <br />
                       
                   </DialogContent>

               </Dialog>
                :null}   
                  {(this.props.dialog === "drugRange") ?
                   <Dialog
                   onClose={() => this.handleClose()}
                   aria-labelledby="customized-dialog-title"
                   open={this.props.dialog!="off"}
               >
                   <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                       Filter By Range Of Dates
                    </DialogTitle>
                   <DialogContent className="textCenter">
                   
                   <input className="form-control search-bar " type="text" id="startDrug" placeholder="Filter Dashboard Drugs" /><br/>
                   <input className="form-control search-bar " type="text" id="endDrug" placeholder="Filter Dashboard Drugs" /><br/>
                       <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleBetweenDrugsSubmit() }} className="btn btn-outline-primary">Select Date</button>
                       <br />
                       
                   </DialogContent>

               </Dialog>
                :null}   
                  {(this.props.dialog === "drugCount") ?
                   <Dialog
                   onClose={() => this.handleClose()}
                   aria-labelledby="customized-dialog-title"
                   open={this.props.dialog!="off"}
               >
                   <DialogTitle id="customized-dialog-title" onClose={this.handleClose.bind(this)}>
                       Filter By Range Of Dates
                    </DialogTitle>
                   <DialogContent className="textCenter">
                   
                   <input className="form-control search-bar " type="text" id="drugCount" placeholder="Filter Dashboard Drugs" /><br/>
                       <button style={{ marginTop: '10px' }} type="button" onClick={() => { this.handleDrugCountSubmit() }} className="btn btn-outline-primary">Select Date</button>
                       <br />
                       
                   </DialogContent>

               </Dialog>
                :null}        
        
            </div>
        );

    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 4,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
    inputInput: {
        width: 'auto',
        flexGrow: 1,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});
export default withStyles(styles)(FilterDialogs);