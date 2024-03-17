/* eslint-disable no-use-before-define */
import React from 'react';
// import TextField from '@material-ui/core/TextField';
import TextField from '@mui/material/TextField';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import Autocomplete from '@mui/material/Autocomplete';
// import { JSX } from 'react/jsx-runtime';


export default function ComboBox(props) {
    const { data, type, change, option, orderType, style, value, price, expiry, hedge, callPrice, putPrice, callBuy, callSell, putBuy, putSell, Quantity } = props;
    return (
        <Autocomplete
            id="combo-box-demo"
            value={value}
            // sx={{ width: 270 }}
            options={data}
            disablePortal
            // getOptionLabel={type ?  (option: { tradingsymbol: any; }) => option : (option: { tradingsymbol: any; }) => option.tradingsymbol}
            style={style}
            renderInput={(params) => <TextField {...params} style={{ width: "100%", paddingLeft: '0px', paddingRight: '0px' }} label={type && !orderType ? "Lots" : orderType ? 'Order Type' : option ? "Strike Price" : price ? "Price" : expiry ? "Expiry" : hedge ? "Hedge" : putPrice ? "Put Price" : callPrice ? "Call Price" : callSell ? "Call Sell" : callBuy ? "Call Buy" : putBuy ? "Put Buy" : putSell ? "Put Sell" : Quantity ? 'Quantity' : "Instruments"} variant="outlined" />}
            onChange={change}
            noOptionsText={"No Options"}
        />
    );
}