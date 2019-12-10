import React from 'react'
import { Navbar, Dropdown, SplitButton, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import imagePerson from '../assets/ico-person.png';
import { ENDPOINT } from '../config'
import { TOAST } from '../resources'
import { postData, addToast } from '../utils'

const logout = () => {
    postData(ENDPOINT.AUTH.LOGOUT, [], false, false)
        .then(() => window.location.reload())
        .catch(() => addToast('Failed to logout', TOAST.ERROR))
}

const userProfile = () => {
    /*postData(ENDPOINT.AUTH.LOGOUT, [], false, false)
        .then(() => window.location.reload())
        .catch(() => addToast('Failed to logout', TOAST.ERROR))*/
}

const userPassword = () => {
    ;
}

export default function Header({ isAuth }) {

    return (
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