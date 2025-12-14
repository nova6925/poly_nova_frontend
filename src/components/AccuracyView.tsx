import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';

interface ModelAccuracy {
    source: string;
    mae: number;
    rmse: number;
    accuracyPercent: number;
    totalForecasts: number;
    totalResolved: number;
}

export const AccuracyView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [data, setData] = useState<ModelAccuracy[]>([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchAccuracy = async () => {
            try {
                const res = await axios.get(`${API_URL}/weather/accuracy`);
                console.log('Accuracy data:', res.data);
                setData(res.data);
            } catch (err) {
                console.error('Error fetching accuracy:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccuracy();
    }, []);

    const getBestModel = () => {
        if (data.length === 0) return null;
        return data[0]; // Already sorted by MAE (lowest first)
    };

    const bestModel = getBestModel();

    return (
        <div className="detail-view">
            <button onClick={onBack} className="back-button">
                <ArrowLeft size={20} /> Back to Markets
            </button>

            <div className="detail-header">
                <div className="icon-large" style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                    <Trophy size={32} />
                </div>
                <div>
                    <h2>Model Accuracy Comparison</h2>
                    <p>Comparing forecast accuracy across weather models</p>
                </div>
            </div>

            {loading ? (
                <div className="loading">Loading accuracy metrics...</div>
            ) : data.length === 0 ? (
                <div className="loading">
                    No accuracy data available. Add resolutions for past dates to calculate accuracy.
                </div>
            ) : (
                <>
                    {bestModel && (
                        <div style={{
                            background: 'linear-gradient(135deg, #f59e0b20, #10b98120)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Trophy size={20} color="#f59e0b" />
                                <h3 style={{ margin: 0, color: '#f59e0b' }}>Most Accurate Model</h3>
                            </div>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                                {bestModel.source}
                            </p>
                            <p style={{ color: '#888', margin: 0 }}>
                                {bestModel.accuracyPercent}% of forecasts within ±2°F
                            </p>
                        </div>
                    )}

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            overflow: 'hidden'
                        }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Model</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>MAE (°F)</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>RMSE (°F)</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Accuracy</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Forecasts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((model, index) => (
                                    <tr key={model.source} style={{
                                        borderTop: '1px solid rgba(255,255,255,0.05)',
                                        background: index === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {index === 0 && <Trophy size={16} color="#f59e0b" />}
                                            <span style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                {model.source}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ color: model.mae < 2 ? '#10b981' : '#888' }}>
                                                {model.mae.toFixed(2)}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            {model.rmse.toFixed(2)}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                                                    {model.accuracyPercent}%
                                                </span>
                                                {index === 0 && <TrendingUp size={16} color="#10b981" />}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                                            {model.totalResolved} / {model.totalForecasts}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{
                        marginTop: '2rem',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#888'
                    }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#fff' }}>Metrics Explained:</p>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                            <li><strong>MAE</strong> (Mean Absolute Error): Average prediction error in °F. Lower is better.</li>
                            <li><strong>RMSE</strong> (Root Mean Square Error): Penalizes larger errors more. Lower is better.</li>
                            <li><strong>Accuracy</strong>: Percentage of forecasts within ±2°F of actual temperature.</li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};
