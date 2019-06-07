import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'


class Arrow extends React.Component {

    constructor(props) {
        super(props);
    }

    
    render() {
        
        return (<div>
            {
               this.props && this.props.diff < 0 ? <div>&darr;</div> : <div>&uarr;</div>
            }
            <div>
                
            </div>
        </div>);
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
        zIndex: 5,
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
export default withStyles(styles)(Arrow);