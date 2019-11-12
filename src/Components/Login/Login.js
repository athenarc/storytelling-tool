import React, { useState, Fragment } from 'react'
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import backgroundImage from '../../assets/background.jpg';
import ResetPassword from './ResetPassword';

function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [openReset, setOpenReset] = useState(false)

    const loginForm = () => (
        <div style={styles.container}>
            <Card style={{ width: '25rem' }}>
                <Card.Body>
                    <Card.Title className="text-center">Welcome back</Card.Title>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" onClick={() => props.login(email, password)}>Login</Button>
                    <hr />
                    <Container>
                        <Row>
                            <Col>
                                <Form.Text className="text-muted text-center">
                                    Don't have an account? <Button variant="link" style={styles.link} onClick={() => props.history.push('/register')}>Register</Button>
                                </Form.Text>
                            </Col>
                            <Col>
                                <Form.Text className="text-muted text-center">
                                    Forgotten password? <Button variant="link" style={styles.link} onClick={() => setOpenReset(true)}>Reset here</Button>
                                </Form.Text>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
            <ResetPassword
                handleClose={() => setOpenReset(false)}
                show={openReset}
            />
        </div>
    )
    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/home' />
                    : loginForm()
            }
        </Fragment>
    )
}

const styles = {
    container: {
        height: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Login
