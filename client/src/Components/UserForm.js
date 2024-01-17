import React,{useState} from 'react'
import styles from './UserForm.module.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserForm({forLogin}) {
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [confirmPassword,setConfirmPassword]=useState('')
    const [submitted,setSubmitted]=useState(false)
    const handleSubmit =(e)=>{
        e.preventDefault()
        setSubmitted(true)
        if(password!==confirmPassword){
            toast.error('Passwords did not match')
            return
        }
    }
  return (
    <div className={styles.UserForm}>
    <form onSubmit={handleSubmit}>
        <div className={styles.allInputs}>
        {!forLogin&&(
        <div className={styles.inputs}>
            <label>Name</label>
            <input name='name' value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder={(submitted && !name) ? 'Enter name':''}
            style={{borderColor : submitted && !name ? 'rgb(225, 25, 25)' : '' }}
            type='text' />
        </div>
        )}
        <div className={styles.inputs}>
            <label>Email</label>
            <input name='email' value={email} 
            onChange={(e)=>setEmail(e.target.value)}
            placeholder={(submitted && !email) ? 'Enter email':''}
            style={{borderColor : submitted && !email ? 'red' : '' }}
            type='email' />
        </div>
        <div className={styles.inputs}>
            <label>Password</label>
            <input name='password' value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            placeholder={(submitted && !password) ? 'Enter password':''}
            style={{borderColor : submitted && !password ? 'red' : '' }}
            type='password' />
        </div>
        {!forLogin&&(
        <div className={styles.inputs}>
            <label>Confirm Password</label>
            <input name='password' value={confirmPassword} 
            onChange={(e)=>setConfirmPassword(e.target.value)}
            placeholder={(submitted && !confirmPassword) ? 'Enter password again':''}
            style={{borderColor : submitted && !confirmPassword ? 'red' : '' }}
            type='password' />
        </div>
        )}
        </div>
        <button className={styles.btn} type='submit'>{forLogin?'Login':'Sign up'}</button>
    </form>
    <ToastContainer position='top-center' />
    </div>
  )
}

export default UserForm