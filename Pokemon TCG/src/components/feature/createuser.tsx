import { useState } from 'react';
import './CreateUser.css';

interface CreateUserModalProps {
    onCreateUser: (username: string) => void;
    onClose: () => void;
}

const CreateUserModal = ({ onCreateUser, onClose }: CreateUserModalProps) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            onCreateUser(username.trim());
            onClose();
        }
    };

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={(e) => e.stopPropagation()}>
                <h2>Create New User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="inputGroup">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submitButton">
                        Create User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;