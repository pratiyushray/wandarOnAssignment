import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="card">
                <h1>Dashboard</h1>
                <p style={{ margin: '1rem 0' }}>
                    Welcome, <strong>{user?.username}</strong>! You have successfully accessed a protected route.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <h3>Your Data:</h3>
                    <pre style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
                <button
                    onClick={logout}
                    className="btn"
                    style={{ marginTop: '2rem', background: '#e2e8f0', color: '#1e293b' }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
