import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './NeedsAttentionBox.css';

export default function NeedsAttentionBox({ logs }) {
    // Filter for members needing attention from the passed logs
    const flaggedMembers = useMemo(() => {
        if (!logs || logs.length === 0) return [];
        
        return logs.filter(log => {
            // Flag if mood is low (1) OR workload is high (1)
            return log.mood === 1 || log.workload === 1;
        });
    }, [logs]);

    const getReasonText = (member) => {
        if (member.mood === 1 && member.workload === 1) {
            return 'Low mood & Overwhelmed';
        }
        if (member.mood === 1) {
            return 'Low mood';
        }
        return 'Overwhelmed';
    };

    const getSeverity = (member) => {
        if (member.mood === 1 && member.workload === 1) return 'critical';
        if (member.mood === 1) return 'high';
        return 'medium';
    };

    if (flaggedMembers.length === 0) {
        return (
            <section className='needs-attention-box'>
                <div className='attention-header'>
                    <FontAwesomeIcon icon={faExclamationTriangle} className='attention-icon' />
                    <h3>Attention Needed</h3>
                </div>
                <p className='no-flags'>Great! No team members need immediate attention.</p>
            </section>
        );
    }

    return (
        <section className='needs-attention-box'>
            <div className='attention-header'>
                <FontAwesomeIcon icon={faExclamationTriangle} className='attention-icon' />
                <h3>Attention Needed</h3>
            </div>
            <div className='flagged-members-row'>
                {flaggedMembers.map((member) => (
                    <div key={member.id} className={`flag-item severity-${getSeverity(member)}`}>
                        <div className='flag-content'>
                            <p className='member-name'>{member.first_name} {member.last_name}</p>
                            <p className='flag-reason'>{getReasonText(member)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}