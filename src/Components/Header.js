import React, { useState, useEffect } from 'react'
import { Navbar, Dropdown, SplitButton, Nav, Modal, Button, Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import imagePerson from '../assets/ico-person.png';
import { ENDPOINT } from '../config'
import { TOAST } from '../resources'
import { fetchData, updateData, postData, addToast, getUser } from '../utils'

const md5 = require('md5');


export default function Header({ isAuth }) {

    const UserDetailsSchema = {
        id: 0,
        active: 0,
        name: "",
        password: "",
        organization: "",
        email: ""
    }
    
    const PasswordSchema = {
        password: ""
    }
    const PasswordSchema2 = {
        password: ""
    }

    const [showModalProfile, setShowModalProfile] = useState(false)
    const [userDetails, setUserDetails] = useState(UserDetailsSchema)
    const [userPassword, setUserPassword] = useState(PasswordSchema)
    const [userPassword2, setUserPassword2] = useState(PasswordSchema2)
    const [showModalPassword, setShowModalPassword] = useState(false)


    const logout = () => {
        postData(ENDPOINT.AUTH.LOGOUT, [], false, false)
            .then(() => window.location.reload())
            .catch(() => addToast('Failed to logout', TOAST.ERROR))
    }
    
    
    const userProfile = () => {
        const userObj  = getUser()
        setShowModalProfile(true)
        console.log( 'user.id = '+userObj.id )
        fetchData(ENDPOINT.USERS + `/${userObj.id}`)
            .then((data) => {
                console.log( data )
                setUserDetails(data)
            })
            .catch((ex) => {
                addToast('Failed to fetch user details', TOAST.ERROR)
            })       
    }
    
    const updateProfile = () => {
        const userObj  = getUser()
        updateData(ENDPOINT.USERS + `/${userObj.id}`, userDetails)
        .then((data) => {
            handleCloseModalProfile();
        })
        .catch((ex) => {
            addToast('Failed to fetch user details', TOAST.ERROR)
        })
        
    }
    
        
    const updatePassword = () => {
        const userObj  = getUser()
        console.log(userPassword.password+":"+userPassword2.password)
        if(userPassword.password != userPassword2.password) {
            addToast('Passwords do not match', TOAST.ERROR)
            return;
        }
        const hash = md5(userPassword.password)
        setUserPassword(hash)
        postData(ENDPOINT.USERS + `/${userObj.id}/password`, userPassword.password)
        .then((data) => {
            handleCloseModalPassword();
        })
        .catch((ex) => {
            addToast('Failed to fetch user details', TOAST.ERROR)
        })
        
    }


    const handleCloseModalProfile = () => {
       setShowModalProfile(false)
    }
     
    const handleCloseModalPassword = () => {
        setShowModalPassword(false)
     }   
    
    const userPasswordModal = () => {
        const userObj  = getUser()
        setShowModalPassword(true)
    }
    
    const updateForm = (prop, value) => {
        setUserDetails({ ...userDetails, [prop]: value })
    }
    const updatePasswordForm = (prop, value) => {
        setUserPassword({ ...userPassword, [prop]: value })
    }
    const updatePasswordForm2 = (prop, value) => {
        setUserPassword2({ ...userPassword2, [prop]: value })
    }
    
    const deleteAccount = () => {
        ;
    }

    
    return (
        <React.Fragment>
            <Navbar variant="light" className="bg-white" style={styles.navbar} expand="lg">
                <Navbar.Brand href="/"><img alt="" src={require('../assets/brand.png')} width={180} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {isAuth &&
                            <>
                                <NavLink to="/" style={styles.navlink}>Home</NavLink>
                                <NavLink to={`/workspace`} style={styles.navlink}>Create a story</NavLink>
                                <NavLink to={`/assets`} style={styles.navlink}>Search Assets</NavLink>
                                <NavLink to={`/stories`} style={styles.navlink}>My Stories</NavLink>
                                <NavLink to={`/uploads`} style={styles.navlink}>My Uploads</NavLink>
                                <img alt="" src={imagePerson} style={{ marginLeft: '15px', marginRight: '-25px', marginTop: '5px', height: '30px' }} />
                                <SplitButton variant={'link'} title="" alignRight>
                                    <Dropdown.Item eventKey="3" onClick={userProfile}>Profile</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={userPasswordModal}>Change Password</Dropdown.Item>
                                    <Dropdown.Item eventKey="1" onClick={logout}>Logout</Dropdown.Item>
                                </SplitButton>
                            </>}
                        {!isAuth &&
                            <>
                                <NavLink to={`/login`} style={styles.navlink}>Login</NavLink>
                                <NavLink to={`/register`} style={styles.navlink}>Register</NavLink>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            
            <Modal show={showModalProfile} onHide={handleCloseModalProfile}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                            <Form.Label>Organization</Form.Label>
                            <Form.Control type="text" value={userDetails.organization} onChange={(e) => updateForm('organization', e.target.value)} placeholder="Enter organization" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={userDetails.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="Type a username" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={userDetails.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group controlId="formBasicEmail">
                            <Button variant="danger" className="pull-right" onClick={() => deleteAccount()}>
                            Delete Account
                            </Button>
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateProfile()}>
                        Update Profile
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalProfile}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalPassword} onHide={handleCloseModalPassword}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={userPassword.password} onChange={(e) => updatePasswordForm('password', e.target.value)} placeholder="Enter your password" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password (verify)</Form.Label>
                            <Form.Control type="password" value={userPassword2.name} onChange={(e) => updatePasswordForm2('password', e.target.value)} placeholder="Enter you password (verify)" />
                        </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updatePassword()}>
                        Update Password
                    </Button>
                    <Button variant="secondary" onClick={handleCloseModalPassword}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    )
}

const styles = {
    navlink: {
        margin: 8,
        font: "Regular 25px/32px Rubrik New",
        letterSpacing: 0.82,
        color: "#B89122",
    },
    iconPerson: {
        backgroundImage: `url(${imagePerson})`,
        backgroundPosition: 'bottom',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
    }
}