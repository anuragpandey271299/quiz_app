import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

function PrivateRoute({ Cmp }) {
    const jw_token = localStorage.getItem('jwtoken')
    if (jw_token) {
        try {
            const decodedJWT = jwtDecode(jw_token)
            const isJWTExpired = Date.now() >= decodedJWT.exp * 1000
            if (!isJWTExpired) {
                return <Cmp />
            }else{
                localStorage.clear()
                return <Navigate to={'/'} />
            }
        } catch (error) {
            console.log(error)
        }
    } else {
        return <Navigate to={'/'} />
    }
}

export default PrivateRoute