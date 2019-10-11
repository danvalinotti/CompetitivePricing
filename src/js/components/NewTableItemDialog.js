import React, { Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Button, Select, Checkbox, MenuItem, InputLabel, FormControl, CircularProgress, FormControlLabel } from '@material-ui/core';

export default function NewTableItemDialog({open, initValues, handleSubmit, title, toggleDialog, loading}) {
    const v = {};
    initValues.forEach((value) => {
        v[value.id] = value.value
    });
    const [values, setValues] = React.useState(v);
    // const [loading, setLoading] = React.useState(false);
    
    function handleClose() {
        open = false;
    }
    function submit() {
        handleSubmit(values);
    }
    function toggleOpen() {
        toggleDialog();
    }
    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    }
    const toggleValue = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked
        })
    }
    const updateList = event => {
        let newList = values[event.target.name.toLowerCase()];
        if (newList.indexOf(event.target.value.username)<0) {
            newList.push(event.target.value.username);
        } else {
            let l = newList;
            newList = l.filter((_, i) => i !== newList.indexOf(event.target.value.username));
        }
        setValues({
            ...values,
            [event.target.name.toLowerCase()]: newList
        })
    }
    
    return (
        <Fragment>
            <Dialog onClose={() => handleClose()} open={open} >
                <DialogTitle id="customized-dialog-title" style={{paddingBottom: 0}} onClose={()=> handleClose()}>
                    {title}
                </DialogTitle>
                <DialogContent className="textCenter" style={{width: 500, height: 'min-content'}}>
                    {initValues.map((value, key) => {
                        if (value.type === 'selectMulti') {
                            return (
                                <FormControl fullWidth style={{paddingBottom: 10}}>
                                    <InputLabel shrink htmlFor={value.id}>{value.name}</InputLabel>
                                    <Select
                                        key={key}
                                        fullWidth
                                        name={value.name}
                                        id={value.id}
                                        value={values[value.id]}
                                        onChange={updateList}
                                        renderValue={value => {
                                            if (value.length > 0) {
                                                return value.join(', ')
                                            }
                                            return 'None';
                                        }}
                                        inputProps={{name: value.name, id: value.id}}
                                        style={{textAlign: 'left'}}
                                        >
                                        <MenuItem disabled value={''}>
                                            <em>None</em>
                                        </MenuItem>
                                        {value.values.map((item, key) => (
                                            <MenuItem id={value.id} key={key} value={item}
                                            style={values[value.id].indexOf(item[value.selector]) >= 0 ? {backgroundColor: 'lightgray'} : {}}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) 
                        } else if (value.type === 'select') {
                            return (
                                <FormControl fullWidth>
                                    <InputLabel htmlFor={value.id}>{value.name}</InputLabel>
                                    <Select
                                        key={key}
                                        fullWidth
                                        name={value.id}
                                        id={value.id}
                                        value={values[value.id]}
                                        onChange={handleChange}
                                        inputProps={{name: value.id, id: value.id}}
                                        style={{textAlign: 'left'}}
                                    >
                                        {value.values.map((item, key) => (
                                            <MenuItem id={value.id} key={key} value={item}
                                                style={values[value.id] ===  item.id ? {backgroundColor: 'lightgray'} : {}}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) 
                        } else if (value.type === 'checkbox') {
                            return (
                                <FormControlLabel control={<Checkbox key={key} id={value.id} value={values[value.id]} name={value.id} checked={values[value.id]} onChange={toggleValue} />} label={value.name} />
                            )
                        } else {
                            return (
                                <TextField
                                    key={key}
                                    autoFocus={key === 0 ? true : false}
                                    margin="dense"
                                    id={value.id}
                                    label={value.name}
                                    type={value.type}
                                    name={value.id}
                                    value={values[value.id]}
                                    onChange={e => handleChange(e)}
                                    fullWidth
                                />
                            )
                        }
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => submit()} color="primary">Submit</Button>
                    <Button onClick={() => toggleOpen()} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog aria-labelledby="customized-dialog-title" open={loading}>
                <DialogTitle id="customized-dialog-title">
                    Processing...
                </DialogTitle>
                <DialogContent className="textCenter">
                    <CircularProgress />
                </DialogContent>
            </Dialog>
        </Fragment>
    )
}