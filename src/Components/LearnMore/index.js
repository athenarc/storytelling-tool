import React, { useState, Fragment } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';

function LearnMore(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const learnMore = () => (
        <div style={styles.wrapper}>
            <div style={styles.container} className="mt-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
        </div>
    )
    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/' />
                    : learnMore()
            }
        </Fragment>
    )
}

const styles = {
    wrapper: {
        width: 100 + '%',
        height: '100vh',
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column'
    },
    container: {
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F1F1'
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default LearnMore
