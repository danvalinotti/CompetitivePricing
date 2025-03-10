import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import '../../assests/sass/ViewDrugDetailsCSS.css'


class Icons extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div>
             
                {(this.props.icon === "delete") ?
                    <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
                :null}

                 {(this.props.icon === "down") ?
                 <svg xmlns="http://www.w3.org/2000/svg"width={this.props.width} height={this.props.height}><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/><path fill="none" d="M0 0h24v24H0V0z"/></svg>
                 :null}
                 
                 {(this.props.icon === "up") ?
                 <svg xmlns="http://www.w3.org/2000/svg"width={this.props.width} height={this.props.height}  ><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg> 
                 :null}
                  {(this.props.icon === "off") ?
                 <svg xmlns="http://www.w3.org/2000/svg"width={this.props.width} height={this.props.height}  visibility='hidden' ><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/><path d="M0 0h24v24H0z" fill="none"/></svg> 
                 :null}
                  {(this.props.icon === "save") ?
                  <svg className="pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
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
export default withStyles(styles)(Icons);