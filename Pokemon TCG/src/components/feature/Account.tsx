import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface AccountProps {
    userData: UserData;
    setIsLoggedIn: (value: boolean) => void;
    setUserData: (data: UserData) => void;
}

const Account: React.FC<AccountProps> = ({ userData, setIsLoggedIn, setUserData }) => {
    const navigate = useNavigate();

    const handleSignOut = () => { 
        setIsLoggedIn(false);
        setUserData({ username: '', email: '', password: '' });
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    const handleDeleteAccount = () => {
        const passwordPrompt = prompt('Enter your password to delete the account:');

        if (passwordPrompt !== null) {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            let updatedUsers = new Array(storedUsers.length - 1);
            let isPasswordCorrect = false;
            let index = 0;

            for (let i = 0; i < storedUsers.length; i++) {
                if (storedUsers[i].username === userData.username && storedUsers[i].password === passwordPrompt) {
                    isPasswordCorrect = true;
                } else {
                    updatedUsers[index] = storedUsers[i];
                    index++;
                }
            }

            if (isPasswordCorrect) {
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                localStorage.removeItem('loggedInUser');
                setIsLoggedIn(false);
                setUserData({ username: '', email: '', password: '' });
                navigate('/login');
                alert('Account deleted successfully');
            } else {
                alert('Incorrect password. Account not deleted.');
            }
        }
    };

    return (
        <div className='accountContainer'>
            <h1>My Details</h1>
            <hr />
            <div className='accountInfo'>
                <h2>Personal Information</h2>
                <label htmlFor='enteredUsername'>Username: </label>
                <div className='inputBox2 userUsername'>
                    <input className='enteredUsername' title="Username" value={userData.username} disabled />
                </div>
                <label htmlFor='enteredEmail'>Email: </label>
                <div className='inputBox2 userEmail'>
                    <input className='enteredEmail' title="Email" value={userData.email} disabled />
                </div>
                <label htmlFor='enteredPassword'>Password: </label>
                <div className='inputBox2 userPassword'>
                    <input className='enteredPassword' title="Password" value={userData.password} type="password" disabled />
                </div>
            </div>
            <hr />
            <div className='accountSignOut'>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
            <div className='accountDelete'>
                <button onClick={handleDeleteAccount}>Delete Account</button>
            </div>
        </div>
    );
};

export default Account;