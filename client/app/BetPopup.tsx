import React, { useState } from 'react';
import { balance } from './Table';

interface BetPopupProps {
    onSubmit: (amount: number) => void;
}

const BetPopup: React.FC<BetPopupProps> = ({ onSubmit }) => {
    const [amount, setAmount] = useState<number>(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > balance!) {
            setAmount(balance!);
        } else if (value <= 0) {
            setAmount(1);
        } else {
            setAmount(value);
        }
    };

    const handleBetSubmit = () => {
        onSubmit(amount);
    }


    return (
        <div className="bet-popup">
            <h2>Place your bet</h2>
            <p>Your Balance: {balance}</p>
            <input 
                type="number" 
                value={amount} 
                onChange={handleChange}
                placeholder='Enter your bet amount'
            />
            <button onClick={handleBetSubmit}>Submit Bet</button>
        </div>
    );
}

export default BetPopup;