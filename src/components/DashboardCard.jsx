import './DashboardCard.css';
import CardIcon from './CardIcon';
import { faUserGroup, faCircleExclamation, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const iconStyleMap = {
    "Check-in Rate": faUserGroup,
    "Needs Attention": faCircleExclamation,
};
const iconColorMap = {
    "Check-in Rate": 'var(--primary)',
    "Needs Attention": 'var(--accent)',
};


export default function DashboardCard({ title, number, detail, changeIndicator }) {
    const iconStyle = iconStyleMap[title] || faUserGroup;
    const iconColor = iconColorMap[title] || 'var(--primary)'
    
    return (
        <div className='card'>
            <div className='card-left'>
                {!changeIndicator && (
                    <span className='card-icon'><CardIcon icon={iconStyle} size='sm' color={iconColor} /></span>
                )}
                {changeIndicator && (
                    <span className='card-indicator-icon'>
                        {changeIndicator === 'up' && (
                            <CardIcon icon={faArrowUp} size='lg' color='#6FA876' />
                        )}
                        {changeIndicator === 'down' && (
                            <CardIcon icon={faArrowDown} size='lg' color='#C97A7A' />
                        )}
                    </span>
                )}
                <span className='card-title'>{title}</span><br />
                <span className='card-nunmber'>{number}</span><br />
                <span className='card-detail'>{detail}</span><br />
            </div>
            <div className='card-right'></div>
        </div>
    )
}