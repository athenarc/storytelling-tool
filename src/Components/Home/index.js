import React, { useEffect, useState } from 'react'
import { Card, Container, Row, Col, Button } from 'react-bootstrap'
import { fetchData } from '../../utils';
import { ENDPOINT } from '../../config';
import StoryItem from '../Explore/StoryItem';
import imagePlaceholder from '../../assets/image-placeholder.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const LINKS = {
    FAQ: "https://share3d.eu/support/faqs/",
    GUIDELINES: "https://share3d.gitbook.io/share-3d-guidelines/",
    TUTORIALS: "https://share3d.eu/support/",
    WEBSITE: "https://share3d.eu/",
    LEARNMORE: "https://share3d.eu/about/"
}

function NavigationMenu(props) {
    return <Container fluid className="py-3">
        <Row className="shadow mx-1" style={{ borderRadius: 10 }}>
            <Col md={3} className="d-flex m-0 p-0">
                <Card
                    style={{ borderRadius: "10px 0 0 10px" }}
                    className="flex-fill border-0">
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="f-24 font-weight-bold header-primary">Getting Started</Card.Title>
                        <Card.Title className="f-18 font-weight-bold">Create your first story</Card.Title>
                        <Card.Text className="body-secondary">
                            Full of Ideas ? Select a story type, choose your assets, and start creating story
                        </Card.Text>
                        <Button
                            className="mt-auto px-4 py-2"
                            style={{ borderRadius: 30 }}
                            onClick={() => props.history.push('/workspace')}
                            variant="primary">Start Creating</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3} className="d-flex m-0 p-0">
                <Card
                    style={{ borderRadius: 0 }}
                    className="flex-fill border-0">
                    <Card.Img className="h-100" variant="top" src={require('../../assets/story-placeholder.png')} />
                </Card>
            </Col>
            <Col md={3} className="d-flex m-0 p-0">
                <Card
                    style={{ borderRadius: 0 }}
                    className="flex-fill border-0 bg-accent color-white">
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="f-24 font-weight-bold">Useful Links</Card.Title>
                        <a href={LINKS.FAQ} className="btn btn-link color-white text-left py-2">FAQ's <FontAwesomeIcon className="ml-2" icon={faArrowRight} /></a>
                        <a href={LINKS.GUIDELINES} className="btn btn-link color-white text-left py-2">Guidelines <FontAwesomeIcon className="ml-2" icon={faArrowRight} /></a>
                        <a href={LINKS.TUTORIALS} className="btn btn-link color-white text-left py-2">Tutorials <FontAwesomeIcon className="ml-2" icon={faArrowRight} /></a>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3} className="d-flex m-0 p-0">
                <Card
                    style={{ borderRadius: "0px 10px 10px 0px" }}
                    className="flex-fill border-0">
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="f-24 font-weight-bold color-accent">Learn More</Card.Title>
                        <Row>
                            <Col sm={3}>
                                <img alt="" width={60} src={require('../../assets/logo.png')} />
                            </Col>
                            <Col sm={9}>
                                <Card.Text className="body-secondary">
                                    Interested to learn more about Share 3D? Visit our website.
                                    </Card.Text>
                            </Col>
                        </Row>
                        <a
                            href={LINKS.WEBSITE}
                            target="blank"
                            className="btn btn-secondary mt-auto px-4 py-2"
                            style={{ borderRadius: 30 }}>Go to website</a>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

function CardMenu(props) {
    return <Container>
        <Row>
            <Col>
                <h4 className="header-primary pt-5 pb-2 font-weight-bold text-center">Start you Share3D Experience!</h4>
            </Col>
        </Row>
        <Row>
            <Col md={4} className="d-flex">
                <Card className="shadow flex-fill">
                    <Card.Body className="d-flex flex-column align-items-center">
                        <Card.Title className="f-24 font-weight-bold">Explore Stories</Card.Title>
                        <Card.Text className="text-center body-secondary">
                            Discover stories created by culture professionals, educators, artists, individuals and published using the Share3D story maker tool.
                            </Card.Text>
                        <Button
                            className="mt-auto px-4 py-2"
                            style={{ borderRadius: 30 }}
                            onClick={() => props.history.push('/explore')}
                            variant="primary">Explore</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className="d-flex">
                <Card className="shadow flex-fill">
                    <Card.Body className="d-flex flex-column align-items-center">
                        <Card.Title className="f-24 font-weight-bold">Create a story</Card.Title>
                        <Card.Text className="text-center body-secondary">
                            Create a story incorporating 3D objects from your portfolio in Sketchfab and assets from Europeana. Three templates are available to help you to your create stories for educators in classrooms, other professionals, tourism guides, and more! Once completed your stories can be published and made visible to others.
                            </Card.Text>
                        <Button
                            className="mt-auto px-4 py-2"
                            style={{ borderRadius: 30 }}
                            onClick={() => props.history.push('/workspace')}
                            variant="primary">Create</Button>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={4} className="d-flex">
                <Card className="shadow flex-fill">
                    <Card.Body className="d-flex flex-column align-items-center">
                        <Card.Title className="f-24 font-weight-bold">Learn More</Card.Title>
                        <Card.Text className="text-center body-secondary">
                            Learn more about Share3D, the storymaker and other services, read our <a href="https://share3d.eu/about/" target="blank">FAQs</a> and user guidelines.
                            </Card.Text>
                        <Button
                            className="mt-auto px-4 py-2"
                            onClick={() => window.location.href = LINKS.LEARNMORE}
                            style={{ borderRadius: 30 }}
                            variant="primary">Learn More</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}

function StoryList({ title, stories }) {

    return <Container>
        <Row>
            <Col>
                <h4 className="header-primary pt-5 pb-2 font-weight-bold text-center">{title}</h4>
            </Col>
        </Row>
        <Row>
            <Col className="d-flex flex-wrap">
                {
                    stories
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
            </Col>
        </Row>
    </Container>
}


function Home(props) {

    const { isAuth } = props
    const [stories, setStories] = useState([])

    useEffect(() => {
        fetchData(ENDPOINT.STORIES_PUBLIC)
            .then(data => setStories(data))
            .catch(ex => console.log(ex))
    }, [])


    return (
        <>
            {
                isAuth
                    ? <NavigationMenu history={props.history} />
                    : <CardMenu history={props.history} />
            }
            <StoryList
                stories={stories}
                title={isAuth ? "Interesting Stories" : "Join the Share3D Storytelling Experience"} />

            <br />
            <center>
                <Button
                    style={{ borderRadius: 30 }}
                    onClick={() => props.history.push('/explore')}
                    variant="primary">Explore more stories</Button>
            </center>
            <br />
        </>

    )
}

export default Home
