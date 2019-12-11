import React, { useState, useEffect } from 'react'
import { Navbar, Dropdown, SplitButton, Nav, Modal, Button, Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import imagePerson from '../assets/ico-person.png';
import { ENDPOINT } from '../config'
import { TOAST } from '../resources'
import { fetchData, updateData, postData, addToast, getUser } from '../utils'



export default function Header({ isAuth }) {

    const UserDetailsSchema = {
        id: 0,
        active: 0,
        name: "",
        password: "",
        organization: "",
        email: ""
    }
    
    const [showModalProfile, setShowModalProfile] = useState(false)
    const [userDetails, setUserDetails] = useState(UserDetailsSchema)
    

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
    
    const handleCloseModalProfile = () => {
       setShowModalProfile(false)
    }
    
    
    const userPassword = () => {
        ;
    }
    
    const updateForm = (prop, value) => {
        setUserDetails({ ...userDetails, [prop]: value })
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
                                <img alt="" src={imagePerson} style={{ marginLeft: '15px', marginRight: '-25px', marginTop: '5px', height: '30px' }} />
                                <SplitButton variant={'link'} title="" alignRight>
                                    <Dropdown.Item eventKey="3" onClick={userProfile}>Profile</Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={userPassword}>Change Password</Dropdown.Item>
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