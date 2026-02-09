import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CardIcon({ icon, size = "sm", color='var(--primary)' }) {
    return (
        <FontAwesomeIcon 
            icon={icon}
            size={size}
            style={{ color: color }} 
        />
    );
}