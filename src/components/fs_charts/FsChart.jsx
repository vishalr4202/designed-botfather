import React, { useEffect, useRef, memo } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import Card from '@mui/material/Card';
const BitstampChart = (props) => {
    // console.log(props,"fdfsffsfss")
    const { symbol, fsGetUserKeys } = props;
    const chartContainerRef = useRef();
    const chartRef = useRef();
    let dataUrl;
    // const nav = useBoolean()
    useEffect(() => {
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
            height: 400,
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
        };
    }, [symbol, props?.theme, props?.layout]); // Empty dependency array to run the effect only once on component mount




    return (
        <Card sx={{ display: 'flex', alignItems: 'center', marginTop: '1%', p: 3, }} >
            <div style={{ width: '100%' }}>
                <div ref={chartContainerRef} >

                </div>
            </div>
        </Card>
    );

};

export default memo(BitstampChart);