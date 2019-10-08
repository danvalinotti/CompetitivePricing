import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper/Paper";
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';


function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        
        <TextField style={{width:'100%',height:'100%'}}
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                    input: classes.inputInput,
                },
                ...InputProps,
            }}
            {...other}
            
        />
    );
}
class AutoSuggestComponent extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            inputValue: '',
            selectedItem: [],
            providerPrices: [],
          
        };

    }

    getSuggestions(value) {

        return this.state.providerPrices;
    }
    onClickDrug(drug) {

        this.dosageList = drug.dose;
        this.setState({
            inputValue: drug.name,
            strengthList: drug.dose,
            drugStrength: drug.dose[0],
            quantityList: drug.dose[0].quantity,
            drugQuantity: drug.dose[0].quantity[0],
        });
 
        this.props.updateDrug(drug);

    };
    handleInputChange(event) {
        this.setState({
            inputValue: event.target.value,
        });

        this.getProviderPrices(event.target.value);
    };
    getProviderPrices(drugName) {
        fetch(process.env.API_URL + '/getDrugInfo/' + drugName, {
            headers: {
                mode: 'no-cors'
            }
        })
            .then(res => res.json())
            .then(json => {
              
                this.props.setFirstChoice(json[0]);
                this.setState({
                    providerPrices: json
                });
                return json;
            });

    };
    renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.name + "1"}
                value={suggestion}
                selected={isHighlighted}

                component="div"
                style={{

                    backgroundColor: isHighlighted ? 'lightgrey' : 'white',
                    zIndex: 4,
                }}
            >
                {suggestion.name}
            </MenuItem>
        );
    }


    render() {
        const { classes } = this.props;
        
        const theme = {
            input: {
                height: '60px ',
                width: '100% ',
                border: '1px solid #B3B3B3 ',
                backgroundColor: ' #FFFFFF ',
                borderRadius: '8px ',
                boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08) '
            },
            suggestionsContainerOpen: {
                flex: 'row',
                border: '1px solid #B3B3B3 ',
                backgroundColor: ' #FFFFFF ',
                borderRadius: '8px ',
                boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08) '
            },
            root: {
                flexGrow: '1',
         
            },

            container: {
                flexGrow: '1',
                position: 'relative',
            },
            paper: {
                position: 'absolute',
                zIndex: 5,
                marginTop: 'theme.spacing.unit',
                left: '0',
                right: '0',
            },
            chip: {
                margin: '`${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`',
            },
            inputRoot: {
                flexWrap: 'wrap',
            },
            inputInput: {
                width: 'auto',
                flexGrow: '1',
            },
            divider: {
                height: 'theme.spacing.unit * 2',
            }
        };
        
        const searchBarCopy = {

            marginRight: '20%',
            
            height: '60px',
            width: '100% ',
            border: '1px solid #B3B3B3',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 8px 25px -10px rgba(0, 0, 0, 0.08)'
        };

        return (
            <div className="col-sm-9">
                <Downshift onSelect={(drug) => this.onClickDrug(drug)} itemToString={i => { return i ? i.name : '' }} id="downshift-simple" 
                >
                    {({
                        theme,
                        getInputProps,
                        getItemProps,
                        getMenuProps,
                        handleInputChange,
                        highlightedIndex,
                        inputValue,
                        isOpen,
                        selectedItem,

                    }) => (
                            <div className={classes.container} className="form-control search-bar-copy " style={searchBarCopy}>
                                {renderInput({
                                    fullWidth: true,
                                    classes,
                                    InputProps: getInputProps({
                                        placeholder: 'Search A Drug',
                                        className: 'removeLine ',
                                        style: {width:'100%',height:'100%'},
                                        onChange: this.handleInputChange.bind(this),
                                        value: this.state.inputValue,
                                    }),

                                })}
                                <div {...getMenuProps()} >
                                    {isOpen ? (
                                       
                                        <Paper  className="" style={{
                                            position: 'relative',
                                            zIndex: 5,
                                            maxHeight:'200px',
                                            overflowY:'scroll'
                                        }}>
                                            {this.getSuggestions(inputValue).map((suggestion, index) =>
                                                this.renderSuggestion({
                                                    suggestion,
                                                    index,
                                                    itemProps: getItemProps({ item: suggestion }),
                                                    highlightedIndex,
                                                    selectedItem,

                                                }),
                                            )}
                                        </Paper>
                                       
                                    ) : null}
                                </div>
                            </div>
                        )}
                </Downshift>
            </div>

        )
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
export default withStyles(styles)(AutoSuggestComponent);