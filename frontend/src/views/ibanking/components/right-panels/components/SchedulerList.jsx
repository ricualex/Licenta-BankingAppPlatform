import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css';
import config from '../../../../../config';

const SchedulerList = () => {
    const [schedulerData, setSchedulerData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedulerData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const response = await axios.get(config.fetchSchedulerApi, {
                    params: {
                      userKey: userId
                    }
                  });
                setSchedulerData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching scheduler data:', error);
                setLoading(false);
            }
        };

        fetchSchedulerData();
    }, []);

    const handleDelete = async (destinationName) => {
        try {
            await axios.delete(config.deleteScheduleApi, {
                params: { destinationName }
            });
            setSchedulerData(schedulerData.filter(payment => payment.destinationName !== destinationName));
        } catch (error) {
            console.error('Error deleting scheduled payment:', error);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>
                    Loading...
                </h1>
            </div>
        );
    }

    return (
        <div className="scheduler-list">
            <h2>Scheduled Payments</h2>
            <ul>
                {schedulerData.map((payment) => (
                    <li key={payment.id} className="scheduler-item">
                        <div><strong>Name:</strong> {payment.destinationName}</div>
                        <div><strong>Amount:</strong> {payment.amount} RON</div>
                        <div><strong>Days until payment:</strong> {payment.daysUntilPayment}</div>
                        <button onClick={() => handleDelete(payment.destinationName)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SchedulerList;
