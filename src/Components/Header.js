import React from 'react'
import { Navbar, Dropdown, SplitButton, NavDropdown, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import imagePerson from '../assets/ico-person.png';

export default function Header(props) {

    const { user, logout } = props
    return (
        <Navbar variant="light" className="bg-white" style={styles.navbar} expand="lg">
            <Navbar.Brand href="./"><img src={require('../assets/brand.png')} width={180} /></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavLink to="/home" style={styles.navlink}>Home</NavLink>
                    <NavLink to="/workspace" style={styles.navlink}>Workspace</NavLink>
                    <NavLink to="/assets" style={styles.navlink}>My Assets</NavLink>
                    <NavLink to="/editor" style={styles.navlink}>My Stories</NavLink>
                    <img src={imagePerson} style={{ marginLeft: '15px', marginRight: '-25px', marginTop: '5px', height: '30px' }} />
                    <SplitButton variant={'link'} >
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