import './Logo.css';

export default function Logo({ size = 100 }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            viewBox="0 0 1200 200"
            className="teampulse-logo"
        >
            {/* Logo Text */}
            <text
                x='0'
                y="70%"
                textAnchor="start"
                dominantBaseline="middle"
                fontFamily="var(--font-body)"
                fontWeight="530"
                fontSize="128"
                letterSpacing="0.036em"
                fill="var(--text-dark)"
            >
                teampulse
            </text>

            {/* Pulse Dot */}
            <circle
                cx="377"
                cy="140"
                r="22"
                className="pulse-dot"
            />

        </svg>
    );
}
