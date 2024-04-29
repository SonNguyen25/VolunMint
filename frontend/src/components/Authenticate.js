// components/Authenticate.js
import React, { useState } from 'react';

function Authenticate() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    const authenticateUser = async () => {
        try {
            const res = await fetch('/api/auth');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to authenticate');
            }

            setUser(data.user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <button onClick={authenticateUser}>Authenticate</button>
            {user && <div>Welcome, {user.email}</div>}
            {error && <div>Error: {error}</div>}
        </div>
    );
}

export default Authenticate;
