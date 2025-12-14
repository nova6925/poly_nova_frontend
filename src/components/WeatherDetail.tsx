import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CloudRain, ArrowLeft } from 'lucide-react';

interface Forecast {
    id: number;
    source: string;
    targetDate: string;
    predictedHigh: number;
}

interface GroupedForecasts {
    [source: string]: Forecast[];
}

export const WeatherDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [fetching, setFetching] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchData = async () => {
        try {
            console.log('Fetching weather data...');
            const res = await axios.get(`${API_URL}/weather/forecasts`);
            const grouped: GroupedForecasts = res.data;

            console.log('Raw API Response:', grouped);
            console.log('Sources:', Object.keys(grouped));

            // Fetch resolutions (actual temperatures)
            const resolutionsRes = await axios.get(`${API_URL}/weather/resolutions`);
            const resolutions = resolutionsRes.data;
            console.log('Resolutions:', resolutions);

            const dateMap = new Map<string, any>();

            Object.entries(grouped).forEach(([source, forecasts]) => {
                console.log(`Processing ${source}:`, forecasts.length, 'forecasts');
                forecasts.forEach(f => {
                    const fullDate = new Date(f.targetDate);
                    const dateKey = fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    console.log(`  Date: ${f.targetDate} -> ${dateKey}, Temp: ${f.predictedHigh}`);
                    if (!dateMap.has(dateKey)) {
                        dateMap.set(dateKey, { date: dateKey, sortDate: fullDate });
                    }
                    dateMap.get(dateKey)[source] = f.predictedHigh;
                });
            });

            // Add actual temperatures from resolutions
            resolutions.forEach((r: any) => {
                const fullDate = new Date(r.targetDate);
                const dateKey = fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (dateMap.has(dateKey)) {
                    dateMap.get(dateKey)['Actual'] = r.actualHigh;
                    console.log(`  Added actual temp for ${dateKey}: ${r.actualHigh}°F`);
                }
            });

            const chartData = Array.from(dateMap.values())
                .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime())
                .map(({ sortDate, ...rest }) => rest);

            console.log('Final Chart Data:', chartData);
            setData(chartData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFetch = async () => {
        if (!startDate) return;
        setFetching(true);
        try {
            console.log('Triggering collection for:', startDate);
            await axios.post(`${API_URL}/weather/collect`, { startDate });
            setTimeout(() => {
                fetchData();
                setFetching(false);
            }, 3000);
        } catch (err) {
            console.error('Error triggering collection:', err);
            setFetching(false);
        }
    };

    return (
        <div className="detail-view">
            <button onClick={onBack} className="back-button">
                <ArrowLeft size={20} /> Back to Markets
            </button>

            <div className="detail-header">
                <div className="icon-large" style={{ background: '#3b82f620', color: '#3b82f6' }}>
                    <CloudRain size={32} />
                </div>
                <div>
                    <h2>NYC Temperature Forecast</h2>
                    <p>Comparing NWS, ECMWF, and OpenWeatherMap models</p>
                </div>
            </div>

            <div className="controls" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                    style={{
                        background: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        outline: 'none'
                    }}
                />
                <button
                    onClick={handleFetch}
                    disabled={fetching || !startDate}
                    style={{
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        opacity: fetching || !startDate ? 0.7 : 1
                    }}
                >
                    {fetching ? 'Fetching...' : 'Fetch Forecast'}
                </button>
            </div>

            <div className="chart-container">
                {loading ? (
                    <div className="loading">Loading forecasts...</div>
                ) : data.length === 0 ? (
                    <div className="loading">No forecast data available. Try fetching data for a specific date.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" unit="°F" domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Bar dataKey="Actual" fill="#ffffff" name="Actual" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="NWS" fill="#3b82f6" name="NWS (Official)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="ECMWF" fill="#10b981" name="ECMWF (Open-Meteo)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="OWM" fill="#f59e0b" name="OpenWeatherMap" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
