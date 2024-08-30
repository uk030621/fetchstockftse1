// app/api/stock/route.js

import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');

    try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.chart.result || data.chart.result.length === 0) {
            throw new Error(`No data returned for symbol: ${symbol}`);
        }

        const price = data.chart.result[0].meta.regularMarketPrice;

        return NextResponse.json({ price });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
