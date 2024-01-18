import React, { useState } from 'react'
import styles from './UserForm.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

function UserForm({ forLogin, onFormSubmit }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitted, setSubmitted] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitted(true)
        if (!forLogin) {
            if(!name||!email||!password){
                return
            }
            if (password !== confirmPassword) {
                toast.error('Passwords did not match')
                return
            }
            const response = await axios.post('http://localhost:5000/signupuser', { name, email, password })
            console.log(response.data)
            if(response.status===201){
                toast.success('Registered successfully')
                onFormSubmit(true)
            }else{
                alert('invalid')
            }
        }else{
            if(!email||!password){
                toast.warning('Email and password required')
                return
            }
            const response = await axios.post('http://localhost:5000/loginuser',{email,password})
            console.log(response.data)
            if(response.status===200){
                toast.success('LoggedIn successfully')
            }
        }
    }
    return (
        <div className={styles.UserForm}>
            <form onSubmit={handleSubmit}>
                <div className={styles.allInputs}>
                    {!forLogin && (
                        <div className={styles.inputs}>
                            <label>Name</label>
                            <input name='name' value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={(submitted && !name) ? 'Enter name' : ''}
                                style={{ borderColor: submitted && !name ? 'rgb(225, 25, 25)' : '' }}
                                type='text' />
                        </div>
                    )}
                    <div className={styles.inputs}>
                        <label>Email</label>
                        <input name='email' value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={(submitted && !email) ? 'Enter email' : ''}
                            style={{ borderColor: submitted && !email ? 'red' : '' }}
                            type='email' />
                    </div>
                    <div className={styles.inputs}>
                        <label>Password</label>
                        <input name='password' value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={(submitted && !password) ? 'Enter password' : ''}
                            style={{ borderColor: submitted && !password ? 'red' : '' }}
                            type='password' />
                    </div>
                    {!forLogin && (
                        <div className={styles.inputs}>
                            <label>Confirm Password</label>
                            <input name='password' value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={(submitted && !confirmPassword) ? 'Enter password again' : ''}
                                style={{ borderColor: submitted && !confirmPassword ? 'red' : '' }}
                                type='password' />
                        </div>
                    )}
                </div>
                <button className={styles.btn} type='submit'>{forLogin ? 'Login' : 'Sign up'}</button>
            </form>
            <ToastContainer position='top-center' />
        </div>
    )
}

export default UserForm