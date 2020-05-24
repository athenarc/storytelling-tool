import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addToast, postData, requestAccess } from './utils';
import { ENDPOINT } from './config'
import * as Resourses from './resources'
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './App.css';
import Origin from './Components/Origin';
import { Spinner } from 'react-bootstrap';

const md5 = require('md5');

export default function App(props) {

  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    postData(ENDPOINT.AUTH.STATUS, [], false, false)
      .then(() => {
        setIsAuth(true)
        setIsLoading(false)
      })
      .catch(() => {
        setIsAuth(false)
        setIsLoading(false)
      })
  }, [])


  const login = (email, password) => {
    const hash = md5(password)
    const credentials = `${email}:${hash}`
    setIsLoading(true)
    requestAccess(ENDPOINT.AUTH.LOGIN, [], credentials)
      .then(credentials => {
        localStorage.setItem('share3d_storytelling_credentials', JSON.stringify(credentials));
        setIsAuth(true)
        setIsLoading(false)
      }).catch(() => {
        setIsAuth(false)
        setIsLoading(false)
        // addToast('Invalid credentials', Resourses.TOAST.ERROR)
      })
  }

  const register = (form) => {
    const hash = md5(form.password)
    form.password = hash
    postData(ENDPOINT.AUTH.SIGNUP, form, true)
      .then(() => {
        addToast('Account created', Resourses.TOAST.SUCCESS)
      })
      .catch(() => {
        addToast('Failed to create account', Resourses.TOAST.ERROR)
      })
  }

  return (<React.Fragment>
    <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
    {
      isLoading
        ? <Spinner />
        : <Origin
          login={login}
          register={register}
          isAuth={isAuth}
          isLoading={isLoading}
        />
    }
  </React.Fragment>
  )
}
