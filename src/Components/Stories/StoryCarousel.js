import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import Iframe from 'react-iframe';
import { fetchData } from '../../utils';
import { ENDPOINT } from '../../config';
import { Container, Row, Col } from 'react-bootstrap'

const properties = {
    duration: 50000000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
    onChange: (oldIndex, newIndex) => {
        console.log(`slide transition from ${oldIndex} to ${newIndex}`);
    }
}

export default function StoryCarousel(props) {

    const [story, setStory] = useState(null)


    useEffect(() => {
        fetchData(ENDPOINT.STORIES + `/${props.match.params.id}`)
            .then((story) => {
                setStory(story)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })

    }, [])


    const getChapters = () => {
        const chapters = story ? story.chapters : []
        return chapters
            .filter(ch => ch.assets[0])
            .map((ch, index) => {
                const asset = ch.assets[0]
                return <div className="each-slide" style={{ position: 'relative' }} key={index}>
                    {!asset.embedUrl &&
                        <div style={{ 'backgroundImage': `url(${asset.thumbnail})`, height: 480 }} />
                    }
                    {asset.embedUrl &&
                        <iframe id="modelEmbedded" src={asset.embedUrl} className="w-100" style={{ height: 480 }}></iframe>
                    }
                </div>
            })
    }

    const getValue = (prop) => {
        return story ? story[prop] : '-'
    }



    return (
        <Container className="d-flex flex-column" style={{ height: "calc(100vh - 80px)" }}>
            <Row className="py-5">
                <h2 className="header-primary">View Story</h2>
            </Row>
            <Row style={{ flex: 1 }}>
                <Col sm={3} className="p-0">
                    <div className="d-flex flex-column" style={{ height: 100 + '%' }}>

                        <div className="d-flex flex-column" style={styles.overlay}>
                            <div className="font-weight-bold">{getValue('title')}</div>
                            <div className="mt-2">Published: {new Date(getValue('createdAt')).toDateString()}</div>
                            <div className="font-italic"> Category: Category {getValue('category')}</div>
                        </div>

                        <div className="d-flex bg-white p-1  align-items-center">
                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 mr-auto f-12">User</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('viewsCount')}</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('commentsCount')}</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('starredCount')}</div>
                        </div>

                        <div className="d-flex " style={{ flex: 1 }}>
                            <div style={{ flex: 1 }} className="body-secondary f-14">{getValue('description')}</div>
                            {/* <div className="d-flex flex-column">
                                <img className="mt-auto" alt="" src={require('../../assets/ico-person.png')} width="30" height="30" />
                                <img alt="" src={require('../../assets/ico-person.png')} width="30" height="30" />
                                <img alt="" src={require('../../assets/ico-person.png')} width="30" height="30" />
                                <img alt="" src={require('../../assets/ico-person.png')} width="30" height="30" />
                            </div> */}
                        </div>

                    </div>
                </Col>
                <Col sm={9} className="p-0">
                    <Slide {...properties}>
                        {getChapters()}
                    </Slide>
                </Col>
            </Row>

        </Container>

    )
}


const styles = {
    text: { fontFamily: "museo-sans, sans-serif", color: "#fff" },
    overlay: {
        backgroundColor: 'rgba(184, 145, 32, 0.8)',
        padding: 8,
        color: '#fff',
        fontFamily: "museo-sans, sans-serif",
        fontSize: 14
    },
    image: { height: 180, width: 'auto', margin: 'auto' },
    imageContainer: { flex: 1, backgroundColor: '#fff', position: 'relative' },
    container: { flex: 1, minWidth: 200, margin: 4 }
}