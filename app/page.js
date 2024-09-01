"use client";

import { useEffect, useState } from 'react';

export default function Home() {
    const [prices, setPrices] = useState(null);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

    const stockSymbols = [
        'BATS.L', 
        'NG.L', 
        'GRG.L', 
        'SHEL.L', 
        'SVT.L',
        'LLOY.L', 
        'UU.L', 
        'BP.L', 
        'SGE.L', 
        'BT-A.L', 
        'AV.L', 
        'FGP.L', 
        'CNA.L', 
        'BARC.L', 
        'IMB.L',
        'MKS.L', 
        'IAG.L', 
        'GSK.L', 
        'CCL.L',
        'VOD.L',
        'HLN.L',
        'ENT.L'
    ];

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
        'AV.L': 505,
        'FGP.L': 1562,
        'CNA.L': 1761,
        'BARC.L': 795,
        'IMB.L': 83,
        'MKS.L': 453,
        'IAG.L': 775,
        'GSK.L': 46,
        'CCL.L': 46,
        'VOD.L': 477,
        'HLN.L': 58,
        'ENT.L': 23,
    };

    useEffect(() => {
        async function fetchData() {
            const promises = stockSymbols.map(async (symbol) => {
                try {
                    const response = await fetch(`/api/stock?symbol=${symbol}`);
                    const data = await response.json();

                    const pricePerShare = data.price !== undefined 
                        ? (data.price / 100).toFixed(2) 
                        : 'Error';

                    if (pricePerShare !== 'Error') {
                        const totalValue = Math.round(pricePerShare * sharesHeld[symbol]);
                        return {
                            symbol: symbol,
                            pricePerShare: pricePerShare,
                            sharesHeld: sharesHeld[symbol],
                            totalValue: totalValue.toLocaleString()
                        };
                    } else {
                        return {
                            symbol: symbol,
                            pricePerShare: 'Error',
                            sharesHeld: sharesHeld[symbol],
                            totalValue: 'Error'
                        };
                    }
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    return {
                        symbol: symbol,
                        pricePerShare: 'Error',
                        sharesHeld: sharesHeld[symbol],
                        totalValue: 'Error'
                    };
                }
            });

            const fetchedPrices = await Promise.all(promises);

            const portfolioValue = fetchedPrices.reduce((sum, stock) => {
                const totalValue = stock.totalValue !== 'Error' ? parseInt(stock.totalValue.replace(/,/g, '')) : 0;
                return sum + totalValue;
            }, 0);

            // Sort stocks by total value in descending order
            fetchedPrices.sort((a, b) => {
                const aValue = a.totalValue !== 'Error' ? parseInt(a.totalValue.replace(/,/g, '')) : 0;
                const bValue = b.totalValue !== 'Error' ? parseInt(b.totalValue.replace(/,/g, '')) : 0;
                return bValue - aValue;
            });

            setPrices(fetchedPrices);
            setTotalPortfolioValue(Math.round(portfolioValue).toLocaleString());
        }

        fetchData();
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 className='heading'>FTSE Stock Portfolio</h1>
            <h2 className="sub-heading" style={{ marginTop: '20px' }}>
                Total Portfolio Value: £{totalPortfolioValue}
            </h2>
            {prices === null ? (
                <p>Loading...</p>
            ) : (
                <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                    <thead className='table-heading'>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Stock Symbol</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Price per share (£)</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Shares held</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f2f2f2' }}>Total value (£)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map(stock => (
                            <tr key={stock.symbol}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{stock.symbol}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {stock.pricePerShare !== undefined ? `${stock.pricePerShare}` : 'Loading...'}
                                </td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{stock.sharesHeld}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    {stock.totalValue !== undefined ? `${stock.totalValue}` : 'Loading...'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
