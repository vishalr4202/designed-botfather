import FSInstrument from 'src/utils/FSInstruments/fsInstruments.json';
import { useEffect, useState } from 'react';
import Autocomplete from 'src/components/Autocomplete/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const longStraddle = (props) => {
    const { click } = props
    const [symbol, setSymbol] = useState([])
    const [selectedSymbol, setSelectedSymbol] = useState('')
    const [strikePrice, setStrikePrice] = useState([])
    const [selectedStrike, setSelectedStrike] = useState('')
    const [lots, setLots] = useState([]);
    const [selectedLots, setSelectedLots] = useState('')
    const [expiry, setExpiry] = useState([])
    const [selectedExpiry, setSelectedExpiry] = useState('')

    useEffect(() => {
        const unique = [...new Set(FSInstrument.map(item => item.Symbol))]
        setSymbol(unique)
    }, [])

    const setInstruments = (e) => {
        setSelectedSymbol(e.target.innerText)
    }

    const setStrike = (e) => {
        setSelectedStrike(e.target.innerText)
    }
    const setUserLots = (e) => {
        setSelectedLots(e.target.innerText)
    }
    const setUserSelectedExpiry = (e) => {
        setSelectedExpiry(e.target.innerText)
    }
    useEffect(() => {
        let price;
        let lots = [];
        if (selectedSymbol == 'NIFTY') {
            price = [...new Set(FSInstrument.filter((ele) => ele.Symbol == 'NIFTY').map(item => item.StrikePrice))]
            setStrikePrice([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'NIFTY').map(item => item.StrikePrice.toString()))])
            setExpiry([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'NIFTY').map(item => item.Expiry))])
            for (let i = 1; i <= 36; i++) {
                lots.push(i.toString())
            }
        }
        if (selectedSymbol == 'BANKNIFTY') {
            price = [...new Set(FSInstrument.filter((ele) => ele.Symbol == 'BANKNIFTY').map(item => item.StrikePrice))]
            setStrikePrice([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'BANKNIFTY').map(item => item.StrikePrice.toString()))])
            setExpiry([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'BANKNIFTY').map(item => item.Expiry))])
            for (let i = 1; i <= 36; i++) {
                lots.push(i.toString())
            }
        }
        if (selectedSymbol == 'FINNIFTY') {
            price = [...new Set(FSInstrument.filter((ele) => ele.Symbol == 'FINNIFTY').map(item => item.StrikePrice))]
            setStrikePrice([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'FINNIFTY').map(item => item.StrikePrice.toString()))])
            setExpiry([...new Set(FSInstrument.filter((ele) => ele.Symbol == 'FINNIFTY').map(item => item.Expiry))])
            for (let i = 1; i <= 45; i++) {
                lots.push(i.toString())
            }
        }
        setLots(lots)
        setSelectedStrike('')
    }, [selectedSymbol])

    useEffect(() => {
        console.log(FSInstrument)
    }, [selectedStrike])

    const clickHandler = () => {
        const reqbody = {
            symbol: selectedSymbol,
            strikePrice: selectedStrike,
            expiry: selectedExpiry,
            quantity: selectedSymbol == 'NIFTY' ? String(Number(selectedLots) * 50) : selectedSymbol == 'BANKNIFTY' ? String(Number(selectedLots) * 15) : String(Number(selectedLots) * 45),
        }
        if (selectedSymbol !== '' && selectedStrike !== '' && selectedExpiry !== '' && selectedLots !== '') {
            click(reqbody)
            setTimeout(() => {
                setSelectedSymbol('')
                setSelectedStrike('')
                setSelectedLots('')
                setSelectedExpiry('')
            }, 1000)

        } else {
            console.log('fieldsMissing')
        }
    }
    return (
        <>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                <Autocomplete data={symbol} change={(e) => setInstruments(e)} value={selectedSymbol} style={{ width: '180px' }} />
                <Autocomplete data={strikePrice} change={(e) => setStrike(e)} value={selectedStrike} style={{ width: '180px' }} price={true} />
                <Autocomplete data={lots} change={(e) => setUserLots(e)} value={selectedLots} style={{ width: '180px' }} type="number" />
                <Autocomplete data={expiry} change={(e) => setUserSelectedExpiry(e)} value={selectedExpiry} style={{ width: '180px' }} expiry={true} />
            </div>
            <div style={{ width: '200px', margin: '0 auto', paddingBottom: '10px' }}>
                <Button
                    color="success"
                    fullWidth
                    name="Place Order"
                    variant="contained"
                    onClick={clickHandler}
                    style={{ marginTop: '25px' }}
                >
                    Place Order
                </Button>
            </div>
        </>
    )
}
export default longStraddle
