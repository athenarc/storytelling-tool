import React, { useState, Fragment } from 'react'
import { Card, Button, Form } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import share3dLogo from '../../assets/Share3D_Logo_Icon_White.png';

const FormSchema = {
    username: "",
    name: "",
    password: "",
    organization: "",
    email: ""
}
function Register(props) {

    const [form, setForm] = useState(FormSchema)

    const updateForm = (prop, value) => {
        setForm({ ...form, [prop]: value })
    }

    const registerForm = () => (
        <div style={styles.container}>
            <img alt="" align="center" src={share3dLogo} style={{ position: 'absolute', top: 20 }} />
            <Card style={{ width: '25rem', position: 'absolute', top: 100 }}>
                <Card.Body>
                    <Card.Title className="text-center">Register to </Card.Title>
                    <Form.Group>
                        <Form.Label>Organization</Form.Label>
                        <Form.Control type="text" value={form.organization} onChange={(e) => updateForm('organization', e.target.value)} placeholder="Enter organization" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={form.username} onChange={(e) => updateForm('username', e.target.value)} placeholder="Type a username" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" value={form.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Enter your full name" />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={form.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={form.password} onChange={(e) => updateForm('password', e.target.value)} placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" onClick={() => props.register(form)}>Register</Button>
                    <hr />
                    <Form.Text className="text-muted">
                        Have already an account? <Button variant="link" style={styles.link} onClick={() => props.history.push('/login')}>Login</Button>
                    </Form.Text>
                </Card.Body>
            </Card>
        </div>
    )

    return (
        <Fragment>
            {
                !props.isLoading && props.isAuth
                    ? <Redirect to='/' />
                    : registerForm()
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

        backgroundImage: "linear-gradient(to right, #b89122, #000000)"
        /*backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'*/
    },
    logo: {
        backgroundImage: `url(${share3dLogo})`,
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
    },
    link: {
        fontSize: 12,
        padding: 0
    }
}

export default Register
