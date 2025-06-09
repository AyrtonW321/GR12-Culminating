import { useState } from 'react';
import { User } from "../assets/UserClass";
import './settings.css';

interface SettingsProps {
    closeModal: () => void;
    onCreateNewUser: () => void;
    currentUser: User | null;
}

interface FormData {
    username: string;
    allergies: string;
    preferredCuisine: string;
    spice: string;
    diet: string;
}

const Settings = ({ closeModal, onCreateNewUser, currentUser }: SettingsProps) => {
    const [formData, setFormData] = useState<FormData>({
        username: currentUser?.username || '',
        allergies: '',
        preferredCuisine: '',
        spice: '',
        diet: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currentUser) {
            currentUser.updateProfile(formData.username);
        }
        closeModal();
    };

return (
    <div className="modalOverlay" onClick={closeModal}>
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h1>User Settings</h1>
            <form onSubmit={handleSubmit} className='userSettingsContainer'>
                <div className='textInputContainer'>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        autoComplete='off'
                    />
                </div>

                <div className='buttonsRow'>
                    <button type="submit" className="saveButton">
                        Save Settings
                    </button>
                    <button 
                        className="createUserButton"
                        onClick={(e) => {
                            e.preventDefault();
                            closeModal();
                            onCreateNewUser();
                        }}
                    >
                        Create New User
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default Settings;