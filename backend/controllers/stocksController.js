// controllers/stocksController.js
const getData = async (req, res) => {
    try {
        // Dynamically import fetch
        const { default: fetch } = await import('node-fetch');

        // Fetch current market data
        const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
        url.searchParams.append('vs_currency', 'usd');
        url.searchParams.append('order', 'market_cap_desc');
        url.searchParams.append('per_page', 100);
        url.searchParams.append('page', 1);
        url.searchParams.append('sparkline', false);

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const marketData = await response.json();

        // Slice marketData to get only the first 4 coins
        const topCoins = marketData.slice(0, 100);

        // Fetch historical data for each coin
        const historicalPromises = topCoins.map(async (coin) => {
            try {
                const historicalUrl = new URL(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart`);
                historicalUrl.searchParams.append('vs_currency', 'usd');
                historicalUrl.searchParams.append('days', '30');
                
                const historicalResponse = await fetch(historicalUrl.toString());
                if (!historicalResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const historicalData = await historicalResponse.json();

                // Calculate the step size to get approximately one price per day
                const stepSize = Math.floor(historicalData.prices.length / 30);

                // Extract one price per day
                const filteredPrices = historicalData.prices
                    .filter((_, index) => index % stepSize === 0) // Keep approximately one price per day
                    .map(price => price[1]); // Extract the price values

                // Ensure that we get exactly 30 prices (one for each day)
                const dailyPrices = [];
                for (let i = 0; i < 30; i++) {
                    dailyPrices.push(filteredPrices[i] || filteredPrices[filteredPrices.length - 1]);
                }

                return {
                    id: coin.id,
                    prices: dailyPrices,
                };
            } catch (error) {
                // Return default prices in case of error
                return {
                    id: coin.id,
                    prices: new Array(30).fill(0), // Default values for 30 days
                };
            }
        });

        const historicalData = await Promise.all(historicalPromises);

        // Combine market data with historical data
        const combinedData = marketData.map(coin => {
            const historical = historicalData.find(data => data.id === coin.id);
            return {
                rank: coin.market_cap_rank,
                name: coin.name,
                logo: coin.image,
                marketCap: `$${coin.market_cap.toLocaleString()}`,
                price: `$${coin.current_price.toFixed(5)}`,
                today: `${coin.price_change_percentage_24h.toFixed(2)}%`,
                price30Days: historical ? historical.prices : new Array(30).fill(0), // Default values if not found
                country: "Global", // Placeholder since country data is not provided
                countryCode: "UN", // Placeholder country code
            };
        });

        res.json(combinedData);
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error);
        //res.status(500).json({ error: 'Failed to fetch data' });
    }
};

module.exports = { getData };






