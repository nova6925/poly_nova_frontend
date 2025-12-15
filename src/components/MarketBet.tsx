import { useState } from 'react';

interface Market {
    id: string;
    title: string;
    tokenId: string | null;
    active: boolean;
}

interface EventData {
    eventId: string;
    eventTitle: string;
    markets: Market[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function MarketBet() {
    const [slug, setSlug] = useState('');
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [betAmount, setBetAmount] = useState(5);
    const [betResult, setBetResult] = useState<string | null>(null);

    const searchMarket = async () => {
        if (!slug.trim()) return;

        setLoading(true);
        setError('');
        setEventData(null);

        try {
            const res = await fetch(`${API_URL}/markets/search?slug=${encodeURIComponent(slug)}`);
            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to fetch market');
                return;
            }

            setEventData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const placeBet = async (market: Market, side: 'YES' | 'NO') => {
        if (!market.tokenId) {
            setBetResult('❌ No token ID for this market');
            return;
        }

        setBetResult('Placing bet...');

        try {
            const res = await fetch(`${API_URL}/markets/bet`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tokenId: market.tokenId,
                    amount: betAmount,
                    side,
                    marketTitle: market.title
                })
            });
            const data = await res.json();

            if (!res.ok) {
                setBetResult(`❌ ${data.error}`);
                return;
            }

            setBetResult(`✅ Bet placed on "${market.title}" (${side})`);
        } catch (err: any) {
            setBetResult(`❌ ${err.message}`);
        }
    };

    return (
        <div className="market-bet">
            <h2>🎲 Market Betting</h2>

            {/* Search Section */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Enter market slug (e.g., highest-temperature-in-nyc-on-december-15)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchMarket()}
                />
                <button onClick={searchMarket} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && <div className="error">{error}</div>}

            {/* Event Info */}
            {eventData && (
                <div className="event-info">
                    <h3>{eventData.eventTitle}</h3>
                    <p>Event ID: {eventData.eventId}</p>

                    {/* Bet Amount */}
                    <div className="bet-amount">
                        <label>Bet Amount: $</label>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            min={1}
                            max={100}
                        />
                    </div>

                    {/* Market List */}
                    <div className="markets-grid">
                        {eventData.markets.map((market) => (
                            <div key={market.id} className={`market-card ${market.active ? '' : 'inactive'}`}>
                                <h4>{market.title}</h4>
                                <p className="token-id">Token: {market.tokenId?.slice(0, 10)}...</p>
                                <div className="bet-buttons">
                                    <button
                                        className="btn-yes"
                                        onClick={() => placeBet(market, 'YES')}
                                        disabled={!market.tokenId}
                                    >
                                        BUY YES
                                    </button>
                                    <button
                                        className="btn-no"
                                        onClick={() => placeBet(market, 'NO')}
                                        disabled={!market.tokenId}
                                    >
                                        BUY NO
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bet Result */}
                    {betResult && <div className="bet-result">{betResult}</div>}
                </div>
            )}

            <style>{`
                .market-bet {
                    padding: 20px;
                    max-width: 900px;
                    margin: 0 auto;
                }
                .search-section {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .search-section input {
                    flex: 1;
                    padding: 12px;
                    border: 1px solid #333;
                    border-radius: 8px;
                    background: #1a1a2e;
                    color: #fff;
                    font-size: 14px;
                }
                .search-section button {
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    font-weight: 600;
                }
                .search-section button:disabled {
                    opacity: 0.6;
                }
                .error {
                    color: #ff6b6b;
                    padding: 10px;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .event-info h3 {
                    color: #667eea;
                    margin-bottom: 10px;
                }
                .bet-amount {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 15px 0;
                }
                .bet-amount input {
                    width: 80px;
                    padding: 8px;
                    border: 1px solid #333;
                    border-radius: 6px;
                    background: #1a1a2e;
                    color: #fff;
                }
                .markets-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                .market-card {
                    background: #16213e;
                    border: 1px solid #333;
                    border-radius: 12px;
                    padding: 15px;
                }
                .market-card.inactive {
                    opacity: 0.5;
                }
                .market-card h4 {
                    margin: 0 0 10px 0;
                    color: #fff;
                }
                .token-id {
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 12px;
                }
                .bet-buttons {
                    display: flex;
                    gap: 10px;
                }
                .btn-yes, .btn-no {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                }
                .btn-yes {
                    background: #4ade80;
                    color: #000;
                }
                .btn-no {
                    background: #f87171;
                    color: #000;
                }
                .btn-yes:disabled, .btn-no:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                }
                .bet-result {
                    margin-top: 20px;
                    padding: 15px;
                    background: #1a1a2e;
                    border-radius: 8px;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}
