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

export default function Header() {

    return (
        <Navbar variant="light" className="bg-white" style={styles.navbar} expand="lg">
            <Navbar.Brand href="/"><img alt="" src={require('../assets/brand.png')} width={180} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavLink to="/" style={styles.navlink}>Home</NavLink>
                    <NavLink to={`/workspace`} style={styles.navlink}>Workspace</NavLink>
                    <NavLink to={`/assets`} style={styles.navlink}>My Assets</NavLink>
                    <NavLink to={`/stories`} style={styles.navlink}>My Stories</NavLink>
                    <img alt="" src={imagePerson} style={{ marginLeft: '15px', marginRight: '-25px', marginTop: '5px', height: '30px' }} />
                    <SplitButton variant={'link'} title="" alignRight>
                        <Dropdown.Item eventKey="1" onClick={logout}>Logout</Dropdown.Item>
                    </SplitButton>
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