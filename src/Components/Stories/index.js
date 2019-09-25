import React, { useState, useEffect } from 'react'
import { Table, Row, Col, Button, Container } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData } from '../../utils'
import { ENDPOINT } from '../../config'
library.add(faSave, faTrashAlt, faCaretRight)

const Stories = (props) => {

    const [stories, setStories] = useState([])

    useEffect(() => {
        fetchData(ENDPOINT.STORIES)
            .then(data => setStories(data))
            .catch(ex => console.log(ex))
        // return () => {
        //     cleanup
        // };
    }, [])

    const getStoryItem = (story) => {
        return <Row className="mt-2">
            <Col style={styles.maxContent}>
                <img style={styles.itemImage} />
            </Col>
            <Col style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 className="header-primary">{story.title}</h4>
                <div className="body-secondary">{story.description}</div>
                <Row className="mt-auto">
                    <Col style={styles.maxContent}><Button>Published</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary" onClick={() => props.history.push(`/editor/${story.id}`)}>View</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary">Edit</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary">Delete</Button></Col>
                    <Col style={styles.maxContent}><Button variant="secondary">Share</Button></Col>
                </Row>
            </Col>
        </Row>
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col><Button className="w-100" size="lg">My Stories</Button></Col>
            </Row>
            {
                stories.map(story => getStoryItem(story))
            }
        </Container>
    )

}

export default Stories

const styles = {
    itemImage: {
        width: 197,
        height: 172
    },
    maxContent: {
        maxWidth: 'max-content'
    }
}