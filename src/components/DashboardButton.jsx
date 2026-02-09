import './DashboardButton.css'


export default function DashboardButton({
    text = "button",
    width = "auto",
    isActive,
    onClick,
    fontSize,
    padding,
    letterSpacing,
    height,
    borderRadius,
    style = {}
}) {
    return (
        <button
            className={`dashboard-btn ${isActive ? "selected" : ""}`}
            style={{
                width,
                fontSize,
                padding,
                height,
                borderRadius,
                letterSpacing,
                ...style // allows passing additional inline styles safely
            }}
            onClick={onClick}
        >
            {text}
        </button>
    );
}