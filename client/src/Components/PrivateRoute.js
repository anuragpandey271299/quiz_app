import React from 'react'
import { Navigate } from 'react-router-dom'

function PrivateRoute({Cmp}) {
    const jw_token=localStorage.getItem('jwtoken')
    if(jw_token){
        return <Cmp />
    }else{
        return <Navigate to={'/'} />
    }
}

export default PrivateRoute