import React, { useState, useEffect } from 'react'
import { Table, Row, Col, Button, Container, Modal, Form } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData, deleteData } from '../../utils'
import { ENDPOINT } from '../../config'
import imagePlaceholder from '../../assets/image-placeholder.png';
import StoryItem from './StoryItem'
library.add(faSave, faTrashAlt, faCaretRight)

const Explore = (props) => {

    const [stories, setStories] = useState([])
    const [query, setQuery] = useState("")

    useEffect(() => {
        fetchData(ENDPOINT.STORIES)
            .then(data => setStories(data))
            .catch(ex => console.log(ex))
        // return () => {
        //     cleanup
        // };
        //handleCloseModalDelete = handleCloseModalDelete.bind(this)
    }, [])


    return (
        <React.Fragment >
            <Container className="mt-5">
                <Row className="mt-5">
                    <Col md={6} className="ml-auto">
                        <Row>
                            <Col className="max-content mt-2"><h4 className="header-primary">Explore Stories</h4></Col>
                            <Col><Form.Control value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="search" className="text-right bg-secondary" /></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="mt-4 bg-dark">
                    {
                        stories
                            .filter(x => [x.description, x.title, x.createdBy.name].find(value => value && value.toLowerCase().includes(query)))
                            .map(story => {
                                let imgUrl = imagePlaceholder;
                                if (story.chapters && story.chapters.length > 0 && story.chapters[0].assets.length > 0)
                                    imgUrl = story.chapters[0].assets[0].thumbnail
                                return <StoryItem
                                    id={story.id}
                                    imgUrl={imgUrl}
                                    userName={story.createdBy.name}
                                    stars={story.starredCount}
                                    title={story.title}
                                    date={story.createdAt}
                                    comments={story.commentsCount}
                                    views={story.viewsCount}
                                    description={story.description}

                                />
                            })
                    }
                </Row>
            </Container>
        </React.Fragment>
    )

}

export default Explore

const styles = {
    itemImage: {
        width: 197,
        height: 172
    },
    maxContent: {
        maxWidth: 'max-content'
    }
}