import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'


class Arrow extends React.Component {

    constructor(props) {
        super(props);
    }

    
    render() {
        
        return (<Fragment>
            {
               this.props && this.props.diff < 0 ? <p style={{marginBottom: 3}}>&darr;</p> : <p style={{marginBottom: 3}}>&uarr;</p>
            }
        </Fragment>);
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
    pider: {
        height: theme.spacing.unit * 2,
    },
});
export default withStyles(styles)(Arrow);