import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Youtube, ArrowLeft } from 'lucide-react';

export const VideoDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [videos, setVideos] = useState<any[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        // Fetch list of videos
        axios.get(`${API_URL}/videos`)
            .then(res => {
                setVideos(res.data);
                if (res.data.length > 0) {
                    setSelectedVideo(res.data[0].id);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (selectedVideo) {
            setLoading(true);
            axios.get(`${API_URL}/videos/${selectedVideo}/history`)
                .then(res => {
                    // Transform history for chart
                    const chartData = res.data.snapshots.map((h: any) => ({
                        date: new Date(h.capturedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        views: h.viewCount
                    }));
                    setHistory(chartData);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [selectedVideo]);

    return (
        <div className="detail-view">
            <button onClick={onBack} className="back-button">
                <ArrowLeft size={20} /> Back to Markets
            </button>

            <div className="detail-header">
                <div className="icon-large" style={{ background: '#ef444420', color: '#ef4444' }}>
                    <Youtube size={32} />
                </div>
                <div>
                    <h2>MrBeast Video Stats</h2>
                    <p>Tracking view counts over time</p>
                </div>
            </div>

            {videos.length > 0 && (
                <div className="video-selector">
                    <select
                        value={selectedVideo || ''}
                        onChange={(e) => setSelectedVideo(e.target.value)}
                        className="video-select"
                    >
                        {videos.map(v => (
                            <option key={v.id} value={v.id}>{v.title}</option>
                        ))}
                    </select>
                </div>
            )}

            <div className="chart-container">
                {loading ? (
                    <div className="loading">Loading video stats...</div>
                ) : videos.length === 0 ? (
                    <div className="empty-state">No videos tracked yet.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={history}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" domain={['auto', 'auto']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="views" stroke="#ef4444" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
