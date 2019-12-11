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
                    <p className="body-secondary">Discover 3D models in Europeana and Sketchfab and create exceptional stories! No matter your incentive, you can use the storytelling tool for fun, for professional work, for educational purposes, and for creativity!</p>
                    <h4 className="header-primary">Pick a template</h4>
                    <p className="body-secondary">Select the template that fits best with your needs and the story that you want to communicate.  There are three available options to choose from; a story based on <b>hotspots</b> on an object, a story like a <b>slideshow</b>, and a story with a <b>timeline</b> is critical.</p>
                </Col>

                <Col md={9}>

                    <Row>
                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.HOTSPOTS}`} className="btn btn-primary">Object + hotspots</Link>
                            <p className="body-secondary mt-2">Object + hotspots - Choose a hero object and add hotspots that you can use to tell your story using text and images or other digital media from Europeana and Sketchfab</p>
                        </Col>
                        <Col className="my-auto" sm={6}><img alt="" src={require('../../assets/story-3.png')} width={200} /></Col>

                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.SLIDESHOW}`} className="btn btn-primary">Slideshow</Link>
                            <p className="body-secondary mt-2">Slideshow - Choose a series of digital assets from Europeana and Sketchfab and add text to tell your story in the form of a slideshow.</p>
                        </Col>
                        <Col className="my-auto" sm={6}><img alt="" src={require('../../assets/story-2.png')} width={200} /></Col>

                        <Col sm={6} className="p-3">
                            <Link to={`/workspace/${STORY_TYPES.TIMELINE}`} className="btn btn-primary">Timeline</Link>
                            {/* <Link to={`/workspace/${STORY_TYPES.TIMELINE}`} className="btn btn-primary">Timeline</Link> */}
                            <p className="body-secondary mt-2">Timeline -  Choose a series of digital assets from Europeana and Sketchfab that relate to moments in time that are relevant for your story.</p>
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