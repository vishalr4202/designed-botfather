import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react'
import { useSettingsContext } from 'src/components/settings';
import { createStructuredSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { executeACGAction, updateScreenIdentifiers } from 'src/store/slice';
import { acgSelector } from 'src/store/selector';
import { ACTION_CODES, STORE_KEYS } from 'src/constants/apiConstants';
import { useRouter, useSearchParams, useParams } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import Stack from '@mui/material/Stack';
import AppWidget from '../app-widget';
// import OrderDetailsToolbar from 'src/sections/order/order-details-toolbar';
import SetToolbar from './SetToolbar';
import Chart from 'src/components/fs_charts/FsChart';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// import AutocompleteView from 'src/sections/_examples/mui/autocomplete-view';
import Autocomplete from '@mui/material/Autocomplete';
import Autocompletes from 'src/components/Autocomplete/Autocomplete';
import TextField from '@mui/material/TextField';
import FS_Instruments from 'src/utils/FSInstruments/fsInstruments.json';
import Switches from 'src/components/Switch/Switch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SetPositions from '../set-positions';
import './manageset.css'
import Chip from 'src/components/Chip/Chip'
import ShortStraddle from 'src/components/ShortStraddle/ShortStraddle';
import ShortStrangle from 'src/components/ShortStrangle/ShortStrangle';
import LongStraddle from 'src/components/LongStraddle/LongStraddle';
import LongStrangle from 'src/components/LongStrangle/LongStrangle';
import BullSpread from 'src/components/BullSpread/BullSpread';
import BearSpread from 'src/components/BearSpread/BearSpread';
export default function ManageSet(props) {
    const router = useRouter();
    const params = useParams()
    const location = useLocation();
    const dispatch = useDispatch();
    const acgStateSelector = createStructuredSelector({
        acgSlice: acgSelector()
    });
    const { acgSlice: state } = useSelector(acgStateSelector);
    const settings = useSettingsContext();
    const navigate = useNavigate();
    const [chartToken, setChartToken] = useState('26000')
    const [selectedChartSymbol, setSelectedChartSymbol] = useState('')
    const [quickLots, setQuickLots] = useState('')
    const [isStrategy, setIsStrategy] = useState(false);
    const [nonPrimaryDetials, setNonPrimaryDetails] = useState('')
    useEffect(() => {
        if (!location.state?.params) {
            navigate(paths.dashboard.set)
        } else {
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.SET_PRIMARY_USER_DETAIL,
                        reqObj: { primary: location?.state?.params?.primary }
                    },
                    storeKey: STORE_KEYS.SET_PRIMARY_USER_DETAIL
                })
            );
        }
    }, [location])
    const setToken = (e) => {
        // const Instrtoken = FS_Instruments.filter((ele) => ele?.TradingSymbol == e.target.innerText)
        // setSelectedChartSymbol(e.target.innerText)
        const Instrtoken = FS_Instruments.filter((ele) => ele?.CompanyName == e.target.innerText)
        console.log(Instrtoken, "Sd")
        setSelectedChartSymbol(Instrtoken[0]?.TradingSymbol)
        setChartToken(Instrtoken[0]?.Token)
        setQuickLots('')
        setTrailPrice('')
    }
    const changeQuickLots = (e) => {
        console.log(selectedChartSymbol, 'selecSymb');
        // let x = 0
        // if (selectedChartSymbol != '' && selectedChartSymbol.includes('NIFTY')) {
        //     x = e.target.value <= 1800 ? e.target.value : 1800
        // }
        // if (selectedChartSymbol != '' && selectedChartSymbol.includes('FINNIFTY')) {
        //     x = e.target.value <= 1800 ? e.target.value : 1800
        // }
        // if (selectedChartSymbol == '' || selectedChartSymbol.includes('BANKNIFTY')) {
        //     x = e.target.value <= 900 ? e.target.value : 900
        // }
        let x = e.target.value
        setQuickLots(x.toString())
    }
    const quickBuySubmit = () => {
        const newData = {
            exchange: "NFO",
            tradingsymbol: selectedChartSymbol,
            quantity: quickLots,
            name: params?.id
        }
        console.log(trail, "trails")
        if (trail) {
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.PLACE_TRAILING_ORDER,
                        reqObj: { ...newData, trailPrice: trailPrice },
                    },
                    storeKey: STORE_KEYS.PLACE_TRAILING_ORDER,
                    uniqueScreenIdentifier: {
                        tradeRecd: true
                    }
                })
            )
            setTrailPrice('')
            setTrail(false)
            setQuickLots('')
        }
        else {
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.PLACE_SET_ORDER,
                        reqObj: newData
                    },
                    storeKey: STORE_KEYS.PLACE_SET_ORDER,
                    uniqueScreenIdentifier: {
                        tradeRecd: true
                    }
                })
            )
        }
    }

    const quickSellSubmit = () => {
        const newData = {
            exchange: "NFO",
            tradingsymbol: selectedChartSymbol,
            quantity: quickLots,
            name: params?.id
        }
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.EXIT_SET_ORDER,
                    reqObj: newData
                },
                storeKey: STORE_KEYS.EXIT_SET_ORDER,
                uniqueScreenIdentifier: {
                    tradeRecd: true
                }
            })
        )
    }

    // Lower place Orders
    // const [isStrategy, setIsStrategy] = useState(false);
    const [multiLegged, setMultiLegged] = useState([{ derivative: false, optionType: false, instruments: FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.TradingSymbol), selectedInstrument: "", selectedLots: [], orderType: '', BuyorSell: false, limitPrice: '', lotSize: [] }])
    const [instr, setInstr] = useState([FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName)])
    const [lots, setLots] = useState([[]]);
    const [singleOrder, setSingleOrder] = useState(true)

    useEffect(() => {
        // console.log(multiLegged, "dfs")
        const data = [...multiLegged]
        const datas = data.map((ele) => {
            let instrums
            if (!ele?.derivative && !ele?.optionType) {
                instrums = FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName)
            }
            if (!ele?.derivative && ele?.optionType) {
                instrums = FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName)
            }
            if (ele?.derivative && !ele?.optionType) {
                instrums = FS_Instruments.filter((ele) => ele?.OptionType == "CE").map((ele) => ele?.CompanyName)
            }
            if (ele?.derivative && ele?.optionType) {
                instrums = FS_Instruments.filter((ele) => ele?.OptionType == "PE").map((ele) => ele?.CompanyName)
            }
            return instrums
        })
        // console.log(datas)
        setInstr(datas)

        const numLots = data.map((ele) => {
            let lots = []
            if (ele?.selectedInstrument == '') {
                lots = []
            }
            else if (ele?.selectedInstrument !== '' && ele?.selectedInstrument.includes('BANKNIFTY')) {
                const arr = []
                for (let i = 1; i <= 60; i++) {
                    arr.push(i.toString())
                }
                // setLotSize(arr)
                lots = arr
            }
            else if (ele?.selectedInstrument !== '' && ele?.selectedInstrument.includes('FINNIFTY')) {
                const arr = []
                for (let i = 1; i <= 45; i++) {
                    arr.push(i.toString())
                }
                // setLotSize(arr)
                lots = arr
            }
            else {
                const arr = []
                for (let i = 1; i <= 36; i++) {
                    arr.push(i.toString())
                }
                // setLotSize(arr)
                lots = arr;
            }
            return lots
        })
        // console.log(numLots, "lots")
        setLots(numLots)

    }, [multiLegged])

    const changeLegValues = (e, index, text) => {
        console.log(e.target.value, index, text, "inner")
        const data = [...multiLegged]
        const newData = data.map((ele, index1) => {
            if (index == index1) {
                let instrums;
                if (!ele?.derivative && !ele?.optionType) {
                    instrums = FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName)
                }
                if (!ele?.derivative && ele?.optionType) {
                    instrums = FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName)
                }
                if (ele?.derivative && !ele?.optionType) {
                    instrums = FS_Instruments.filter((ele) => ele?.OptionType == "CE").map((ele) => ele?.CompanyName)
                }
                if (ele?.derivative && ele?.optionType) {
                    instrums = FS_Instruments.filter((ele) => ele?.OptionType == "PE").map((ele) => ele?.CompanyName)
                }
                return {
                    ...ele,
                    derivative: text == 'derivative' ? e.target.checked : ele?.derivative,
                    optionType: text == 'optionType' ? e.target.checked : ele?.optionType,
                    BuyorSell: text == 'BuyorSell' ? e.target.checked : ele?.BuyorSell,
                    instruments: instrums,
                    // instruments: ,
                    selectedInstrument: text == 'selectedInstr' ? e.target.innerText ? e.target.innerText : '' : ele?.selectedInstrument,
                    selectedLots: text == 'selectedLots' ? e.target.innerText ? e.target.innerText : '' : ele?.selectedLots,
                    orderType: text == "orderType" ? e.target.innerText ? e.target.innerText : '' : ele?.orderType,
                    limitPrice: text == "limitPrice" ? e.target.innertext : ''
                }
            }
            else {
                return ele
            }
        })
        setMultiLegged(newData)
        // console.log(newData, "newData")
    }
    const addLeg = () => {
        const newData = [...multiLegged]
        const newSymb = [...instr];
        const newLot = [...lots]
        newData.push({ derivative: false, optionType: false, instruments: FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName), selectedInstrument: "", selectedLots: "", orderType: '', BuyorSell: false, limitPrice: '', lotSize: [] })
        newSymb.push(FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName))
        newLot.push([])
        setMultiLegged(newData)
        setInstr(newSymb)
        setLots(newLot)
        setSingleOrder(false)
        console.log(newData)
    }

    const deleteLeg = (index) => {
        // alert(index)
        const newData = [...multiLegged]
        const removed = newData.filter((ele, innerIndex) => index !== innerIndex)
        const newSymb = [...instr];
        const removedInstr = newSymb.filter((ele, innerIndex) => index !== innerIndex)
        const newLot = [...lots]
        const removedLot = newLot.filter((ele, innerIndex) => index !== innerIndex)
        // newData.pop()
        // newSymb.pop()
        // newLot.pop()
        setMultiLegged(removed)
        setInstr(removedInstr)
        setLots(removedLot)
        if (newData?.length == 1) {
            setSingleOrder(true)
        }
    }
    const submitOrder = () => {
        const newData = [...multiLegged].map((ele) => {
            // was 50
            let quantMultiple = 75;
            if (ele?.selectedInstrument.includes('BANKNIFTY')) {
                // was 15
                quantMultiple = 30
            }
            if (ele?.selectedInstrument.includes('FINNIFTY')) {
                // was 40
                quantMultiple = 65
            }
            const symbol = FS_Instruments.filter((elem) => elem?.CompanyName == ele?.selectedInstrument)[0]?.TradingSymbol
            return {
                exchange: "NFO",
                // tradingsymbol: ele?.selectedInstrument,
                tradingsymbol: symbol,
                quantity: String(Number(ele?.selectedLots) * quantMultiple),
                price: "0",
                product: "M",
                transactionType: !ele?.derivative && ele?.BuyorSell ? 'S' : !ele?.derivative && !ele?.BuyorSell ? 'B' : ele?.derivative && !ele?.BuyorSell ? 'B' : 'S',
                priceType: ele?.orderType == 'Market' ? 'MKT' : "LMT",
                retention: "IOC",
                triggerPrice: "0",
                remarks: "Test1",
                name: params?.id
            }
        })

        // console.log(data, "data");
        console.log(newData, "new")
        console.log(multiLegged, "legs")
        if (singleOrder) {
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.PLACE_SET_ORDER,
                        reqObj: newData[0]
                    },
                    storeKey: STORE_KEYS.PLACE_SET_ORDER,
                    uniqueScreenIdentifier: {
                        tradeRecd: true
                    }
                })
            )
            // dispatch(
            //     executeACGAction({
            //         payload: {
            //             requestType: 'POST',
            //             urlPath: ACTION_CODES.FS_PLACE_SINGLE_ORDER,
            //             reqObj: newData[0]
            //         },
            //         storeKey: STORE_KEYS.FS_PLACE_SINGLE_ORDER,
            //         uniqueScreenIdentifier: {
            //             tradeRecd: true
            //         }
            //     })
            // )
        }
        else if (!singleOrder) {

            const newData = [...multiLegged].map((ele, index) => {
                let quantMultiple = 75;
                if (ele?.selectedInstrument.includes('BANKNIFTY')) {
                    quantMultiple = 30
                }
                if (ele?.selectedInstrument.includes('FINNIFTY')) {
                    quantMultiple = 65
                }
                const symbol = FS_Instruments.filter((elem) => elem?.CompanyName == ele?.selectedInstrument)[0]?.TradingSymbol
                return {
                    exchange: "NFO",
                    // tradingSymbol: ele?.selectedInstrument,
                    tradingSymbol: symbol,
                    quantity: String(Number(ele?.selectedLots) * quantMultiple),
                    price: "0",
                    product: "M",
                    transactionType: !ele?.derivative && ele?.BuyorSell ? 'S' : !ele?.derivative && !ele?.BuyorSell ? 'B' : ele?.derivative && !ele?.BuyorSell ? 'B' : 'S',
                    priceType: ele?.orderType == 'Market' ? 'MKT' : "LMT",
                    retention: "IOC",
                    triggerPrice: "0",
                    remarks: "Test1",
                    name: params?.id
                }
            })
            dispatch(
                executeACGAction({
                    payload: {
                        requestType: 'POST',
                        urlPath: ACTION_CODES.SET_MULTI_ORDERS,
                        reqObj: newData
                    },
                    storeKey: STORE_KEYS.SET_MULTI_ORDERS,
                    uniqueScreenIdentifier: {
                        tradeRecd: true
                    }
                })
            )
        }
        else {
            console.log('err')
        }
        // getPrimarySetPositions()
        setMultiLegged([{ derivative: false, optionType: false, instruments: FS_Instruments.filter((ele) => ele?.OptionType == "XX").map((ele) => ele?.CompanyName), selectedInstrument: "", selectedLots: "", orderType: '', BuyorSell: false, limitPrice: '', lotSize: [] }])
    }

    const getPrimarySetPositions = () => {
        // if (props?.location?.state?.params?.primary) {

        // }
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.PRIMARY_SET_POSITION,
                    reqObj: { email: location?.state?.params?.primary }
                },
                storeKey: STORE_KEYS.PRIMARY_SET_POSITION,
                uniqueScreenIdentifier: {
                    setUserPos: true
                }
            })
        );
    };

    const getNonPrimarySetPositions = () => {
        // if (props?.location?.state?.params?.primary) {

        // }
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.NON_PRIMARY_SET_POSITION,
                    reqObj: { email: nonPrimaryDetials }
                },
                storeKey: STORE_KEYS.NON_PRIMARY_SET_POSITION,
                uniqueScreenIdentifier: {
                    setUserPos: true
                }
            })
        );
    };

    useEffect(() => {
        if (nonPrimaryDetials !== '') {
            console.log(nonPrimaryDetials, "sdASDV")
            getNonPrimarySetPositions()
        }
    }, [nonPrimaryDetials])

    useEffect(() => {
        const x = setInterval(() => {
            getPrimarySetPositions()
        }, 2000)
        return () => {
            clearInterval(x)
        }
    }, [])

    //  Straddle Strangle Strategies Logic
    const [selectedStrategy, setSelectedStrategy] = useState(0)
    const handleClickChip = (chipToDelete) => {
        console.log(chipToDelete)
        setSelectedStrategy(chipToDelete?.key)
    };


    const placeStrategy = (e, type) => {
        console.log(e, "ashj")
        const newObj = { ...e, name: params?.id }
        if (type == "shortStraddle") {
            placeShortStraddle(newObj)
        }
        if (type == "shortStrangle") {
            placeShortStrangle(newObj)
        }
        if (type == "longStraddle") {
            placeLongStraddle(newObj)
        }
        if (type == "longStrangle") {
            placeLongStrangle(newObj)
        }
        if (type == "bullSpread") {
            placeBullSpread(newObj)
        }
        if (type == "bearSpread") {
            placeBearSpread(newObj)
        }
    }
    const placeShortStraddle = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_SHORT_STRADDLE,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_SHORT_STRADDLE,
                uniqueScreenIdentifier: {
                    setStraddle: true
                }
            })
        );
    };
    const placeShortStrangle = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_SHORT_STRANGLE,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_SHORT_STRANGLE,
                // uniqueScreenIdentifier: {
                //     apiKeyRecd: true
                // }
            })
        );
    };
    const placeLongStraddle = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_LONG_STRADDLE,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_LONG_STRADDLE,
                // uniqueScreenIdentifier: {
                //     apiKeyRecd: true
                // }
            })
        );
    };
    const placeLongStrangle = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_LONG_STRANGLE,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_LONG_STRANGLE,
                // uniqueScreenIdentifier: {
                //     apiKeyRecd: true
                // }
            })
        );
    };
    const placeBullSpread = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_BULL_CALL,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_BULL_CALL,
                // uniqueScreenIdentifier: {
                //     apiKeyRecd: true
                // }
            })
        );
    };
    const placeBearSpread = (e) => {
        dispatch(
            executeACGAction({
                payload: {
                    requestType: 'POST',
                    urlPath: ACTION_CODES.SET_BEAR_PUT,
                    reqObj: e
                },
                storeKey: STORE_KEYS.SET_BEAR_PUT,
                // uniqueScreenIdentifier: {
                //     apiKeyRecd: true
                // }
            })
        );
    };

    // Trail Stop Loss State
    const [trail, setTrail] = useState(false)
    const changeTrailValues = (e) => {
        if (!trail) {
            setTrailPrice('')
        }
        setTrail(!trail)
    }
    const [trailPrice, setTrailPrice] = useState('')
    const changeTrail = (e) => {
        setTrailPrice(e.target.value)
    }
    // console.log(location.state.params.email, "locProps")
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <SetToolbar
                backLink={paths.dashboard.set}
                orderNumber={params?.id}
            />
            <Grid container spacing={3}>
                <Grid xs={12} md={5}>
                    <Autocomplete
                        fullWidth
                        id="combo-box-demo"
                        options={FS_Instruments}
                        getOptionLabel={(option) => option.CompanyName}
                        renderInput={(params) => <TextField {...params} label="Instruments" margin="none" />}
                        renderOption={(props, option) => (
                            <li {...props} key={option.TradingSymbol}>
                                {option.CompanyName}
                            </li>
                        )}
                        onChange={(e) => setToken(e)}
                    />
                </Grid>
                <Grid xs={12} md={3}>
                    <TextField label={"Quantity"} variant="outlined" onChange={(e) => changeQuickLots(e)} type="number" value={quickLots} style={{ width: '100%' }} />
                </Grid>
                <Grid xs={12} md={2}>
                    <div style={{ marginTop: '5px' }}>
                        <Switches type="Trailing" change={(e) => changeTrailValues(e)} checked={trail} />
                    </div>
                </Grid>
                {trail ?
                    <Grid xs={12} md={2}>
                        <TextField label={"Trail Price"} variant="outlined" onChange={(e) => changeTrail(e)} type="number" value={trailPrice} style={{ width: '100%' }} />
                    </Grid>
                    : null}

            </Grid>
            <div style={{ display: 'flex', gap: '7%', marginLeft: '1%', position: 'absolute', zIndex: '3', marginTop: '1.3%' }}>
                <Button
                    color="success"
                    variant="contained"
                    onClick={quickBuySubmit}
                    disabled={selectedChartSymbol !== '' && selectedChartSymbol != undefined && quickLots !== '' && !trail ? false : selectedChartSymbol !== '' && selectedChartSymbol != undefined && quickLots !== '' && trail && trailPrice !== '' ? false : true}
                >
                    Buy
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    onClick={quickSellSubmit}
                    disabled={selectedChartSymbol !== '' && selectedChartSymbol != undefined && quickLots !== '' && !trail ? false : true}
                >
                    Sell</Button>
            </div>
            {state.primaryUserDetail?.message ? <Chart symbol={chartToken == undefined ? '86145' : chartToken} fsGetUserKeys={state?.primaryUserDetail?.message} theme={settings?.themeMode} layout={settings.themeLayout} width="100%" /> : null}

            <Card style={{ padding: '15px', overflow: 'visible', marginTop: '10px', marginBottom: '-8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0px', marginLeft: '7px' }}>
                    <div style={{ flex: '80%' }}>
                        <div className="headinglabel">Place Orders</div>
                    </div>
                    <div style={{ flex: '20%' }}>
                        <Switches type="strategies" change={() => setIsStrategy(!isStrategy)} checked={isStrategy} />
                    </div>
                </div>
                {!isStrategy ?
                    <div>
                        {multiLegged?.map((ele, index) => {
                            return (
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                    <div style={{ marginTop: '10px' }}>
                                        <Switches type="Futures" change={(e) => changeLegValues(e, index, 'derivative')} checked={ele?.derivative} />
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        {ele?.derivative ? <Switches type="options" change={(e) => changeLegValues(e, index, 'optionType')} checked={ele?.optionType} /> : null}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        {!ele?.derivative ? <Switches type="LONG/SHORT" change={(e) => changeLegValues(e, index, 'BuyorSell')} checked={ele?.BuyorSell} /> : null}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        {ele?.derivative ? <Switches type="BUY/SELL" change={(e) => changeLegValues(e, index, 'BuyorSell')} checked={ele?.BuyorSell} /> : null}
                                    </div>

                                    {ele?.instruments ? <Autocompletes data={instr[index]} change={(e) => changeLegValues(e, index, 'selectedInstr')} option={ele?.derivative} style={{ width: '270px' }} value={ele?.selectedInstrument} /> : <h6 style={{ marginTop: '17px' }}>No Instruments data, please login to your broker</h6>}
                                    {ele?.instruments ? <Autocompletes data={lots[index]} type="numbers" change={(e) => changeLegValues(e, index, 'selectedLots')} value={ele?.selectedLots} style={{ width: '103px' }} /> : null}
                                    {ele?.instruments ? <Autocompletes data={['Market', 'Limit']} orderType={true} change={(e) => changeLegValues(e, index, 'orderType')} type="numbers" style={{ width: '160px', zIndex: '10 !important' }} value={ele?.orderType} /> : null}
                                    {ele?.orderType == 'Limit' ? <TextField label={"Price"} variant="outlined" onChange={(e) => changeLegValues(e, index, 'limitPrice')} type="number" value={ele?.limitPrice} style={{ width: '120px' }} /> : null}

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {index == 0 ? null : <DeleteOutlineIcon onClick={() => deleteLeg(index)} className='remove_more_icon' sx={{ color: 'green' }}></DeleteOutlineIcon>}
                                    </div>
                                    {index == 0 && singleOrder ?
                                        <div className="orderButtonDiv">
                                            <Button
                                                fullWidth
                                                type="submit"
                                                color="success"
                                                variant="contained"
                                                secondary={false}
                                                onClick={submitOrder}
                                            >
                                                Place Order
                                            </Button>
                                        </div> : null}

                                    {index == multiLegged?.length - 1 ? <AddCircleOutlineIcon onClick={addLeg} className="add_more_icon">add leg</AddCircleOutlineIcon> : null}
                                    {index == multiLegged?.length - 1 && !singleOrder ?
                                        <div className="orderButtonDiv">
                                            <Button
                                                color="success"
                                                fullWidth
                                                name="Place Order"
                                                variant="contained"
                                                onClick={submitOrder}
                                            >
                                                Place Order
                                            </Button>
                                        </div> : null}
                                </div>
                            )
                        })}
                    </div> :
                    <div>
                        <Chip click={handleClickChip} active={selectedStrategy} />
                        {isStrategy ?
                            <div>
                                {selectedStrategy == 0 ? <ShortStraddle click={(e) => placeStrategy(e, "shortStraddle")} /> : null}
                                {selectedStrategy == 1 ? <ShortStrangle click={(e) => placeStrategy(e, "shortStrangle")} /> : null}
                                {selectedStrategy == 2 ? <LongStraddle click={(e) => placeStrategy(e, "longStraddle")} /> : null}
                                {selectedStrategy == 3 ? <LongStrangle click={(e) => placeStrategy(e, "longStrangle")} /> : null}
                                {selectedStrategy == 4 ? <BullSpread click={(e) => placeStrategy(e, "bullSpread")} /> : null}
                                {selectedStrategy == 5 ? <BearSpread click={(e) => placeStrategy(e, "bearSpread")} /> : null}
                            </div>
                            : null}
                    </div>
                }
            </Card>
            {/* <br /> */}
            <div style={{ marginTop: '18px', marginBottom: '10px' }}>
                <SetPositions data={state?.primarySetPositions?.message?.data?.filter((ele) => Math.abs(Number(ele?.netQuantity)) != 0)} type="positions" admin={true} />
            </div>
            {/* <br /> */}
            <Autocomplete
                fullWidth
                options={location?.state?.params?.email.filter((ele) => ele !== location?.state?.params?.primary)}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Non Primary Users" margin="none" />}
                renderOption={(props, option) => (
                    <li {...props} key={option}>
                        {option}
                    </li>
                )}
                onChange={(e) => setNonPrimaryDetails(e.target.innerText)}
            />
            <div style={{ marginTop: '10px' }}>
                <SetPositions data={state?.NonPrimarySetPositions?.message?.data?.filter((ele) => Math.abs(Number(ele?.netQuantity)) != 0)} type="positions" admin={false} />
            </div>
        </Container>
    );
}
