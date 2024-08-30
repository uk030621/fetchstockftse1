"use client";

import { useEffect, useState } from 'react';

export default function Home() {
    const [prices, setPrices] = useState({});
    //if you want to add FTSE use '^FTSE' to the list
    const stockSymbols = ['BATS.L', 'NG.L', 'GRG.L', 'SHEL.L', 'SVT.L','LLOY.L','UU.L','BP.L','SGE.L']; // Stock symbols

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
            <h1>FTSE Stock Market Portfolio</h1>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '50%' }}>
                <thead className = "table-heading">
                    <tr>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: 'grey' }}>Index / Symbol</th>
                        <th style={{ border: '1px solid black', padding: '8px', backgroundColor: 'grey' }}>Value (£)</th>
                    </tr>
                </thead>
                <tbody>
                    {stockSymbols.map(symbol => (
                        <tr key={symbol}>
                            <td style={{ border: '1px solid black', padding: '8px' }}>{symbol}</td>
                            <td style={{ border: '1px solid black', padding: '8px' }}>
                                {prices[symbol] !== undefined ? `${prices[symbol]}` : 'Loading...'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
