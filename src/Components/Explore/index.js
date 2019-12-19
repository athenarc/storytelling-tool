import React, { useState, useEffect } from 'react'
import { Row, Col, Container, Form } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSave, faTrashAlt, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import { fetchData } from '../../utils'
import { ENDPOINT } from '../../config'
import imagePlaceholder from '../../assets/image-placeholder.png';
import StoryItem from './StoryItem'
import Checkbox from '../lib/Checkbox'

library.add(faSave, faTrashAlt, faCaretRight)

const Explore = (props) => {

    const [stories, setStories] = useState([])
    const [query, setQuery] = useState("")
    const [filter, setFilter] = useState({
        hotspot: true,
        timeline: true,
        slideshare: true
    })

    useEffect(() => {
        fetchData(ENDPOINT.STORIES_PUBLIC)
            .then(data => setStories(data))
            .catch(ex => console.log(ex))
    }, [])

    const handleChange = prop => _ => {
        setFilter(prevFIlter => ({
            ...prevFIlter,
            [prop]: !prevFIlter[prop]
        }))
    }


    return (
        <React.Fragment >
            <Container fluid className="p-3">
                <Row>
                    <Col xs={12} className="ml-auto">
                        <Row className="my-auto">
                            <Col className="max-content mt-2"><h4 className="header-primary font-weight-bold">Explore Stories</h4></Col>
                            <Col className="my-auto"><Form.Control value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="search" className="text-right bg-secondary" /></Col>
                            <Col className="max-content my-auto"><div className="f-12 body-secondary">Filter by type:</div></Col>
                            <Col className="max-content my-auto"><Checkbox label="Hotspot" checked={filter.hotspot} onChange={handleChange('hotspot')} /></Col>
                            <Col className="max-content my-auto"><Checkbox label="Timeline" checked={filter.timeline} onChange={handleChange('timeline')} /></Col>
                            <Col className="max-content my-auto"><Checkbox label="Slideshow" checked={filter.slideshare} onChange={handleChange('slideshare')} /></Col>
                        </Row>
                    </Col>
                </Row>
                <Row className="p-3">
                    {
                        stories
                            .filter(x => [x.description, x.title, x.createdBy.name].find(value => value && value.toLowerCase().includes(query)))
                            .filter(x => {
                                if (filter.slideshare && x.category === 1) return true
                                if (filter.hotspot && x.category === 2) return true
                                if (filter.timeline && x.category === 3) return true
                                return false
                            })
                            .map(story => {
                                let imgUrl = imagePlaceholder;
                                if (story.chapters && story.chapters.length > 0 && story.chapters[0].assets.length > 0)
                                    imgUrl = story.chapters[0].assets[0].thumbnail
                                return <StoryItem
                                    key={story.id}
                                    id={story.id}
                                    imgUrl={imgUrl}
                                    userName={story.createdBy.name}
                                    stars={story.starredCount}
                                    title={story.title}
                                    date={story.createdAt}
                                    comments={story.commentsCount}
                                    views={story.viewsCount}
                                    description={story.description}
                                    category={story.category}
                                />
                            })
                    }
                </Row>
            </Container>
        </React.Fragment>
    )

}

export default Explore