import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { STORY_TYPES } from '../../resources'

export default function Workspace(props) {

    return (
        <Container className="mt-5">
            <Row>
                <Col md={3} style={styles.divider}>
                    <h4 className="header-primary">Create a story</h4>
                    <p className="body-secondary">Discover 3D models in Europeana and Sketchfab and create exceptional stories! Nomatter your incentive, you can use the storytelling tool for fun, for professional work, for educational purposes, and for creativity!</p>
                    <h4 className="header-primary">Pick a template</h4>
                    <p className="body-secondary">Select a template that fits best with your needs, objects, story to communicate and of course imagination! There are three available options to choose from; a story with an object’s hotspots, a story like a slideshow, and a story where time is critical.</p>
                </Col>

                <Col md={9}>

                    <Row>
                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.HOTSPOTS}`} className="btn btn-primary">Object + hotspots</Link>
                            <p className="body-secondary mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>
                        </Col>
                        <Col className="my-auto" sm={6}><img alt="" src={require('../../assets/story-3.png')} width={200} /></Col>

                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.SLIDESHOW}`} className="btn btn-primary">Slideshow</Link>
                            <p className="body-secondary mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>
                        </Col>
                        <Col className="my-auto" sm={6}><img alt="" src={require('../../assets/story-2.png')} width={200} /></Col>

                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.TIMELINE}`} className="btn btn-primary">Timeline</Link>
                            {/* <Link to={`/workspace/${STORY_TYPES.TIMELINE}`} className="btn btn-primary">Timeline</Link> */}
                            <p className="body-secondary mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>
                        </Col>
                        <Col className="my-auto" sm={6}><img alt="" src={require('../../assets/story-1.png')} width={200} /></Col>

                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

const styles = {
    divider: {
        borderRight: "3px solid #B89122"
    }
}