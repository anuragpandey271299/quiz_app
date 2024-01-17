import React, { useState } from 'react'
import UserForm from '../Components/UserForm'
import styles from './UserFormPage.module.css'

function UserFormPage() {
    const [loginForm, setLoginForm] = useState(false)
    const handleSignUpClick = () => {
        setLoginForm(false)
    }
    const handleLoginClick = () => {
        setLoginForm(true)
    }
    return (
        <div className={styles.UserFormPage}>
            <div className={styles.head}>
                <h1>Quizzie App</h1>
                <div className={styles.buttons}>
                    <button className={!loginForm ? styles.selectedButton : ''} onClick={handleSignUpClick} >Sign Up</button>
                    <button className={loginForm ? styles.selectedButton : ''} onClick={handleLoginClick} >Login</button>
                </div>
                <UserForm forLogin={loginForm} />
            </div>
        </div>
    )
}

export default UserFormPage