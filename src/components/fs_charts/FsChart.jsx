import React, { useEffect, useRef, memo } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import Card from '@mui/material/Card';
const BitstampChart = (props) => {
    // console.log(props,"fdfsffsfss")
    const { symbol, fsGetUserKeys } = props;
    const chartContainerRef = useRef();
    const chartRef = useRef();
    let dataUrl;

    const rsiContainerRef = useRef();
    const rsiChartRef = useRef();

    const macdContainerRef = useRef();
    const macdChartRef = useRef();

    const closingPrices = [];
    const gainValues = [];
    const lossValues = [];

    const period = 14; // RSI period length
    const ema12Period = 12; // EMA period for 12-day EMA in MACD
    const ema26Period = 26; // EMA period for 26-day EMA in MACD

    let ema12 = 0;
    let ema26 = 0;
    let macdLine = 0;
    let signalLine = 0;
    let macdHistogram = 0;

    const rsiBuyThreshold = 80;
    const macdHistogramBuyThreshold = 0; // Example: Buy if MACD Histogram is above 0
    let generalRSI = 0;

    function calculateRSI() {
        if (closingPrices.length < period + 1) {
            return null;
        }

        let avgGain = 0;
        let avgLoss = 0;

        for (let i = 1; i < closingPrices.length; i++) {
            const priceDiff = closingPrices[i] - closingPrices[i - 1];
            if (priceDiff > 0) {
                gainValues.push(priceDiff);
                lossValues.push(0);
            } else {
                gainValues.push(0);
                lossValues.push(-priceDiff);
            }
        }

        avgGain = gainValues.slice(0, period).reduce((a, b) => a + b, 0) / period;
        avgLoss = lossValues.slice(0, period).reduce((a, b) => a + b, 0) / period;

        for (let i = period; i < gainValues.length; i++) {
            avgGain = (avgGain * (period - 1) + gainValues[i]) / period;
            avgLoss = (avgLoss * (period - 1) + lossValues[i]) / period;
        }

        const RS = avgGain / avgLoss;
        const RSI = 100 - (100 / (1 + RS));
        generalRSI = RSI.toFixed(2);
        console.log(`Current RSI: ${RSI.toFixed(2)}`);
        return RSI.toFixed(2);
    }

    function calculateEMA(period, previousEMA, currentPrice) {
        const multiplier = 2 / (period + 1);
        return (currentPrice - previousEMA) * multiplier + previousEMA;
    }

    function calculateMACD() {
        if (closingPrices.length < ema26Period) {
            return null;
        }

        ema12 = calculateEMA(ema12Period, ema12, closingPrices[closingPrices.length - 1]);
        ema26 = calculateEMA(ema26Period, ema26, closingPrices[closingPrices.length - 1]);
        macdLine = ema12 - ema26;

        if (closingPrices.length >= ema26Period + 8) {
            if (signalLine === 0) {
                signalLine = macdLine;
            } else {
                signalLine = calculateEMA(9, signalLine, macdLine);
            }
        }

        macdHistogram = macdLine - signalLine;

        console.log(`Current MACD Line: ${macdLine.toFixed(2)}`);
        console.log(`Current Signal Line: ${signalLine.toFixed(2)}`);
        console.log(`Current MACD Histogram: ${macdHistogram.toFixed(2)}`);
        return macdLine.toFixed(2);
    }
    // const nav = useBoolean()
    useEffect(() => {
        console.log(symbol, "sym")
        // Connect to Bitstamp WebSocket
        const socket = symbol || fsGetUserKeys ? new WebSocket('wss://norenapi.thefirstock.com/NorenWSTP/') : new WebSocket('wss://ws.bitstamp.net');

        // const socket = new WebSocket('wss://ws.bitstamp.net')
        // const socket = new WebSocket('wss://norenapi.thefirstock.com/NorenWSTP/');
        // const apiCall = {
        //   t: 'c',
        //   uid: 'VR2991',
        //   actid: 'VR2991_API',
        //   susertoken:
        //     '254fb446b4859be4f1754c3a267306fd14c1c5c5c8b43dc0d95c2bec50a1e014',
        //   source: 'API',
        // };

        const apiCall = symbol || fsGetUserKeys ?
            {
                t: 'c',
                uid: fsGetUserKeys?.uid,
                actid: fsGetUserKeys?.actid,
                susertoken: fsGetUserKeys?.susertoken,
                source: 'API',
            }
            : {
                event: "bts:subscribe",
                data: { channel: "live_trades_btcusd" },
            };
        // const apiCall ={
        //       event: "bts:subscribe",
        //       data: { channel: "live_trades_btcusd"},
        //     }

        // Create a lightweight-chart instance
        chartRef.current = createChart(chartContainerRef.current, {
            // minWidth: (window.innerWidth / 100) * 30,
            width: chartContainerRef.width,
            layout: {
                background: 'red',
                color: 'red',
                textColor: 'white',
            },
            layout: {
                background: { color: 'transparent' },
                textColor: props?.theme == 'light' ? 'black' : 'white',
            },
            rightPriceScale: {
                visible: true,
                borderVisible: false,
            },
            leftPriceScale: {
                visible: false,
            },

            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: 'center',
                vertAlign: 'center',
                color: 'rgba(217, 222, 220, 1)',
                text: 'Botfather',
            },
            crosshair: { mode: CrosshairMode.Normal },
            height: 330,
            timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },

        });

        rsiChartRef.current = createChart(rsiContainerRef.current, {
            // minWidth: (window.innerWidth / 100) * 30,
            width: rsiContainerRef.width,
            layout: {
                background: 'red',
                color: 'red',
                textColor: 'white',
            },
            layout: {
                background: { color: 'transparent' },
                textColor: props?.theme == 'light' ? 'black' : 'white',
            },
            rightPriceScale: {
                visible: true,
                borderVisible: false,
            },
            leftPriceScale: {
                visible: false,
            },

            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: 'center',
                vertAlign: 'center',
                color: 'rgba(217, 222, 220, 1)',
                text: 'RSI',
            },
            crosshair: { mode: CrosshairMode.Normal },
            height: 80,
            timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },

        });


        macdChartRef.current = createChart(macdContainerRef.current, {
            // minWidth: (window.innerWidth / 100) * 30,
            width: macdContainerRef.width,
            layout: {
                background: 'red',
                color: 'red',
                textColor: 'white',
            },
            layout: {
                background: { color: 'transparent' },
                textColor: props?.theme == 'light' ? 'black' : 'white',
            },
            rightPriceScale: {
                visible: true,
                borderVisible: false,
            },
            leftPriceScale: {
                visible: false,
            },

            watermark: {
                visible: true,
                fontSize: 24,
                horzAlign: 'center',
                vertAlign: 'center',
                color: 'rgba(217, 222, 220, 1)',
                text: 'MACD',
            },
            crosshair: { mode: CrosshairMode.Normal },
            height: 80,
            timeScale: { timeVisible: true, secondsVisible: true, barSpacing: 10, rightOffset: 2 },

        });

        const lineSeries = chartRef.current.addLineSeries({
            // lineColor: 'green',
            color: 'rgba(78, 181, 141, 0.67)',
            lastPriceAnimation: 1,
            type: 'solid',
            autoScale: false,
        });
        lineSeries.priceScale().applyOptions({
            scaleMargins: {
                // positioning the price scale for the area series
                top: 0.1,
                bottom: 0.4,
            },
        });


        const rsiLineSeries = rsiChartRef.current.addLineSeries({
            // lineColor: 'green',
            color: 'tomato',
            lastPriceAnimation: 1,
            type: 'solid',
            autoScale: false,
        });
        rsiLineSeries.priceScale().applyOptions({
            scaleMargins: {
                // positioning the price scale for the area series
                top: 0.1,
                bottom: 0.4,
            },
        });

        const macdLineSeries = macdChartRef.current.addLineSeries({
            // lineColor: 'green',
            color: 'blue',
            lastPriceAnimation: 1,
            type: 'solid',
            autoScale: false,
        });
        macdLineSeries.priceScale().applyOptions({
            scaleMargins: {
                // positioning the price scale for the area series
                top: 0.1,
                bottom: 0.4,
            },
        });

        const volumeSeries = chartRef.current.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            lastValueVisible: false,
            priceScaleId: '', // set as an overlay by setting a blank priceScaleId
            // set the positioning of the volume series
            // scaleMargins: {
            //   top: 0.8, // highest point of the series will be 70% away from the top
            //   bottom: 0,
            // },
        });
        // verticalSeries.setData(opens.map(open => ({ time: open, value: 1 })))
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9, // highest point of the series will be 70% away from the top
                bottom: 0,
            },
            layout: {
                poasition: 'left'
            }
        });
        // Set up WebSocket event listeners
        socket.onopen = () => {
            socket.send(JSON.stringify(apiCall));
            // console.log('WebSocket connection opened');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Update chart data
            // console.log(data, fsGetUserKeys.actid, 'data')

            if (data?.uid) {
                // 'NSE|26000'
                socket.send(JSON.stringify({ t: 'd', k: symbol && symbol == '26000' ? 'NFO|71441' : `NFO|${symbol}` }));
                // socket.send(JSON.stringify({ t: 'o', actid: 'VR2991_API' }));  
            }
            if (data?.lp) {
                lineSeries.update({ time: Number(data?.ft) + 19800, value: Number(data?.lp) })
                volumeSeries.update({ time: Number(data?.ft) + 19800, value: Number(data?.v) })
                if (closingPrices?.length > 50) {
                    closingPrices.shift()
                }
                closingPrices.push(data?.lp)
                const rsi = calculateRSI();
                const macd = calculateMACD();
                rsiLineSeries.update({ time: Number(data?.ft) + 19800, value: Number(rsi) })
                macdLineSeries.update({ time: Number(data?.ft) + 19800, value: Number(macd) })
            }
            // else{
            //  lineSeries.update({ time: Number(data?.data?.timestamp)+ 19800, value: Number(data?.data?.price) });
            //  volumeSeries.update({time: Number(data?.data?.timestamp) + 19800, value: Number(data?.data?.amount)})
            // }
            // console.log(data,"data")

        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };


        // Clean up WebSocket and chart on component unmount
        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
            if (chartRef.current) {
                chartRef.current.remove();
            }
            if (rsiChartRef.current) {
                rsiChartRef.current.remove();
            }
            if (macdChartRef.current) {
                macdChartRef.current.remove();
            }
        };
    }, [symbol, props?.theme, props?.layout]); // Empty dependency array to run the effect only once on component mount




    return (
        <div>
            <Card sx={{ display: 'flex', alignItems: 'center', marginTop: '1%' }} >
                <div style={{ width: '100%' }}>
                    <div ref={chartContainerRef} >

                    </div>
                </div>
            </Card>
            <div style={{ marginTop: '0.5%' }}>
                <Card>
                    <div ref={rsiContainerRef} >

                    </div>
                </Card>
                <Card style={{ marginTop: '0.5%' }}>
                    <div ref={macdContainerRef}>

                    </div>
                </Card>
            </div>

        </div>
    );

};

export default memo(BitstampChart);