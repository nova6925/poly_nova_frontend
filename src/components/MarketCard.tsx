import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MarketCardProps {
    title: string;
    icon: React.ReactNode;
    value: string;
    trend?: string;
    color: string;
    onClick: () => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ title, icon, value, trend, color, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="market-card"
            style={{ '--card-accent': color } as React.CSSProperties}
        >
            <div className="card-header">
                <div className="icon-wrapper" style={{ backgroundColor: `${color}20`, color: color }}>
                    {icon}
                </div>
                <span className="trend">{trend}</span>
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <div className="value">{value}</div>
            </div>
            <div className="card-footer">
                <span>View Details</span>
                <ArrowRight size={16} />
            </div>
        </div>
    );
};
