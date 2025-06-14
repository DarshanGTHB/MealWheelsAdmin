import React, { useContext } from 'react'
import './Orders.css'
import FirebaseContext from '../../context/Firebase/FirebaseContext';
import LoginWarn from '../LoginWarn/LoginWarn';

const Orders = () => {
  const {user} = useContext(FirebaseContext);
  if(!user) return <LoginWarn/>

  return (

    <div>Orders</div>
  )
}

export default Orders