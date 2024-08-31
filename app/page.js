"use client";

import { useEffect, useState } from 'react';

export default function Home() {
    const [prices, setPrices] = useState({});
    //if you want to add FTSE use '^FTSE' to the list
    const stockSymbols = ['BATS.L', 'NG.L', 'GRG.L', 'SHEL.L', 'SVT.L','LLOY.L','UU.L','BP.L','SGE.L','BT-A.L']; // Stock symbols

    // Number of shares held for each stock
    const sharesHeld = {
        'BATS.L': 500,
        'NG.L': 1521,
        'GRG.L': 500,
        'SHEL.L': 534,
        'SVT.L': 425,
        'LLOY.L': 16493,
        'UU.L': 764,
        'BP.L': 1500,
        'SGE.L': 475,
        'BT-A.L': 2050,
    };



    useEffect(() => {
        async function fetchData() {
            const fetchedPrices = {};

            for (const symbol of stockSymbols) {
                try {
                    const response = await fetch(`/api/stock?symbol=${symbol}`);
                    const data = await response.json();
                    
                    // Divide the price by 100 and format to 2 decimal places
                    fetchedPrices[symbol] = data.price !== undefined 
                        ? (data.price / 100).toFixed(2) 
                        : 'Error';
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    fetchedPrices[symbol] = 'Error';
                }
            }

            setPrices(fetchedPrices);
        }

        fetchData();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>My FTSE Portfolio</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>StocK symbol</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Price per share (£)</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Shares held (n)</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Total value (£)</th>
                    </tr>
                </thead>
                <tbody>
                    {stockSymbols.map(symbol => {
                        const pricePerShare = prices[symbol];
                        const totalValue = pricePerShare !== undefined && pricePerShare !== 'Error'
                            ? (pricePerShare * sharesHeld[symbol]).toFixed(2)
                            : 'Error';

                        return (
                            <tr key={symbol}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{symbol}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {pricePerShare !== undefined ? `${pricePerShare}` : 'Loading...'}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{sharesHeld[symbol]}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {totalValue !== undefined ? `${totalValue}` : 'Loading...'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
