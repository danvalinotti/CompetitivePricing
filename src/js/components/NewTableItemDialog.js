import React, { Fragment } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Select, Checkbox, MenuItem, InputLabel, FormControl } from '@material-ui/core';

export default function NewTableItemDialog({open, initValues, handleSubmit, title, toggleDialog}) {
    const v = {};
    initValues.forEach((value) => {
        v[value.id] = value.value
    });
    const [values, setValues] = React.useState(v);
    
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
        console.log(event.target)
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    }
    const updateList = event => {
        console.log(event.target);
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
    
    console.log(values);
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
                                            <MenuItem id={value.id} key={key} value={item.id}
                                                style={values[value.id] ===  item.id ? {backgroundColor: 'lightgray'} : {}}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            ) 
                        } else if (value.type === 'checkbox') {
                            return (
                                <Checkbox key={key} checked={values[value.id]} onChange={toggleValue(value.value)} />
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
        </Fragment>
    )
}