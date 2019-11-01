import React, { Component } from 'react';
import { Slide } from 'react-slideshow-image';
import { fetchData } from '../../utils';
import { ENDPOINT } from '../../config';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'
import HorizontalTimeline from 'react-horizontal-timeline'

const properties = {
    duration: 50000000,
    transitionDuration: 500,
    infinite: true,
    indicators: true,
    arrows: true,
}

export default class StoryView extends Component {

    // api.gotoAnnotation(0);

    constructor(props) {
        super(props)
        this.state = {
            api: null,
            story: null,
            chpaterIndex: 0,
        }
        this.getStoryById = this.getStoryById.bind(this)
        this.handleChangeSlide = this.handleChangeSlide.bind(this)
    }

    handleChangeSlide(oldIndex, newIndex) {
        this.setState({ chpaterIndex: newIndex })
    }

    handle3dNavigation(direction) {
        if (this.state.story.chapters.length <= 1) return
        const totalChapters = this.state.story.chapters.length - 1
        const index = this.state.chpaterIndex


        if (direction === 'next') {
            if (index === totalChapters - 1) {
                this.state.api.gotoAnnotation(0)
            } else {
                this.state.api.gotoAnnotation(index + 1)
            }

        } else {
            if (index === 0) {
                this.state.api.gotoAnnotation(totalChapters - 1)
            } else {
                this.state.api.gotoAnnotation(index - 1)
            }

        }
    }

    componentDidMount() {
        this.setState({ chpaterIndex: 0 })
        this.getStoryById(this.props.match.params.id)
    }

    getStoryById(id) {
        fetchData(ENDPOINT.STORIES + `/${id}`)
            .then((data) => {
                this.setState({ story: data })
                return data
                // if (!data.chapters[0]) props.history.push('/workspace')
            })
            .then((story) => {
                this.setIframe(story)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })
    }

    setIframe(story) {
        const iframe = document.getElementById('api-frame');
        if (!iframe) return
        const version = '1.5.2';
        const client = new window.Sketchfab(version, iframe);
        const uid = story.chapters[0].assets[0].uid

        client.init(
            uid,
            {
                annotations_visible: story.chapters.length > 1,
                success: (api) => {
                    api.load()
                    api.start()
                    api.addEventListener('viewerready', () => {
                        this.setState({ api })
                        story.chapters.forEach(ch => {
                            this.handleAnnotation(api, ch)
                        });
                    });
                    // this.setSketchFab(api)
                    // this.apiEventListeners()
                    api.addEventListener('annotationSelect', (index) => {
                        this.setState({ chpaterIndex: index })
                    });
                    api.addEventListener(
                        'click',
                        (info) => {
                            // this.handleObjectClick(api, info)
                            if (info.position3D && this.state.currentChapterId) {
                                // this.handleAnnotation(api, info)
                                this.setState({ currentPosition: info.position3D })
                            }
                        },
                        { pick: 'slow' }
                    );
                },
                error: function onError() {
                    console.log('Viewer error')
                }
            }
        )
    }

    handleAnnotation = (api, chapter) => {
        let chapterDesc = chapter.description;
        if (chapter.assets && chapter.assets[0]) {
            chapterDesc = chapter.description + "<br/><img alt='' src='" + chapter.assets[0].thumbnail + "' height='30' style={styles.embedImage} />"
        }
        api.getAnnotationList((err, annotations) => {
            annotations.forEach((an, index) => {
                // IMPORTANT: Quick Fix
                api.removeAnnotation(index);
                api.removeAnnotation(index);
            })

            api.getCameraLookAt((err, camera) => {
                const position = JSON.parse(chapter.position);
                if (position)
                    api.createAnnotation(
                        position,
                        [0, 0, 0],
                        [position[0] * 3, position[1] * 3, position[2] * 2],
                        camera.target,
                        chapter.title,
                        chapterDesc
                    );
            })

        });
    }

    render() {
        const { story, chpaterIndex } = this.state
        const is3dModel = story && story.category === 2 && story.chapters[0].assets[0].embedUrl
        const _chIndex = is3dModel ? chpaterIndex + 1 : chpaterIndex

        const getChapters = () => {
            const chapters = story ? story.chapters : []
            return chapters
                .filter(ch => ch.assets[0])
                .map((ch, index) => {
                    const asset = ch.assets[0]
                    return <div className="each-slide" style={{ position: 'relative' }} key={index}>
                        {!asset.embedUrl &&
                            <div className="carousel-image-container" style={{ 'backgroundImage': `url(${asset.thumbnail})`, height: 480 }} />
                            // <div className="carousel-image-container">
                            //     <img alt="" src={asset.thumbnail} styles={{ height: 480, maxWidth: 100 + '%' }} />
                            // </div>
                        } {
                            asset.embedUrl &&
                            <iframe className="w-100" src={asset.embedUrl} style={{ height: 480 }}></iframe>

                        }
                    </div>
                })
        }

        const getValue = (prop, inSlide) => {
            if (inSlide) {
                const chapters = story && story.chapters[_chIndex]
                const asset = chapters && chapters.assets[0]
                return asset ? asset[prop] : '-'
            }
            return story ? story[prop] : '-'
        }
        const getCategoryTitle = (category) => {
            switch (category) {
                case 1: return "Slideshow"
                case 2: return "Hotspot"
                case 3: return "Timeline"
                default: return "-"
            }
        }

        const getCommonView = () => {

            const chapter = story.chapters[this.state.chpaterIndex]
            // const asset = chapter.assets[0]

            return <Row style={{ flex: 1 }} className="pb-5">
                <Col sm={3} className="p-0">
                    <div className="d-flex flex-column" style={{ height: 100 + '%' }}>

                        <div className="d-flex flex-column" style={styles.overlay}>
                            <div className="font-weight-bold">{getValue('description')}</div>
                            <div className="mt-2">Published: {new Date(getValue('createdAt')).toDateString()}</div>
                            <div className="font-italic"> Category: {getCategoryTitle(story.category)}</div>
                        </div>

                        <div className="d-flex bg-white p-1  align-items-center">
                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 mr-auto f-12">{story.createdBy.name}</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('viewsCount')}</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('commentsCount')}</div>

                            <img className="mx-1" alt="" width="20" height="20" src={require('../../assets/ico-person.png')} />
                            <div className="mx-1 body-secondary f-12">{getValue('starredCount')}</div>
                        </div>

                        <div className="d-flex flex-column py-2" style={{ flex: 1, maxHeight: 400, overflow: 'auto' }}>
                            <h5 className="header-primary">{chapter && chapter.title}</h5>
                            <div style={{ flex: 1 }} className="body-secondary f-14">
                                {chapter && chapter.description}
                                <br />
                                {/* {
                                    story.category === 1 &&
                                    <img alt="" src={asset && asset.thumbnail} style={{ maxWidth: 240, maxHeight: 240 }} />
                                } */}
                            </div>

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
                    {
                        is3dModel
                            ? <div className="react-slideshow-container">
                                <div onClick={() => this.handle3dNavigation('previous')} className="nav" data-type="prev"><span></span></div>
                                <iframe id="api-frame" className="w-100" style={{ height: 480 }}></iframe>
                                <div onClick={() => this.handle3dNavigation('next')} className="nav" data-type="next"><span></span></div>
                            </div>
                            : <Slide onChange={this.handleChangeSlide} {...properties}>
                                {getChapters()}
                            </Slide>
                    }
                </Col>
            </Row>
        }

        const getTimelineView = () => {
            const dates = story.chapters.map(ch => {
                return ch.startDate || story.startDate
            })
            const chapter = story.chapters[this.state.chpaterIndex]
            const asset = chapter.assets[0]

            const dateFormatter = (date) => {
                return <span className="events-date-view">{date}</span>
            }

            return <Row>
                <Col>
                    {/* Bounding box for the Timeline */}
                    <div className='d-flex justify-content-between mb-4'>
                        <div className="d-flex flex-column p-5">
                            <h4 className="header-primary">
                                {chapter.title}
                            </h4>
                            <div className="body-secondary">
                                {chapter.description}
                            </div>
                        </div>
                        <div className="d-flex">
                            <img alt="" src={asset && asset.thumbnail} style={{ width: 700, maxHeight: 400 }} />
                        </div>
                        {/* any arbitrary component can go here */}
                    </div>
                    <div className="d-flex" style={{ width: '100%', height: '100px', margin: '0 auto' }}>
                        <HorizontalTimeline
                            styles={{ background: 'transparent', foreground: '#fff', outline: '#707070' }}
                            index={this.state.chpaterIndex}
                            getLabel={dateFormatter}
                            indexClick={(index) => {
                                this.setState({ chpaterIndex: index, previous: this.state.chpaterIndex });
                            }}
                            values={dates} />
                    </div>
                </Col>
            </Row>
        }

        const getPreview = () => {
            if (!story)
                return <Spinner size={50} classes={"my-4"} />
            else if (story.category === 3)
                return getTimelineView()
            else
                return getCommonView()
        }

        return (
            <Container className="d-flex flex-column" style={{ height: "calc(100vh - 80px)" }}>
                <Row className="py-5">
                    <h2 className="header-primary">{getValue('title')}</h2>
                </Row>
                {getPreview()}
            </Container>
        )
    }
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
    embedImage: {
        maxWidth: 30,
        maxHeight: 30
    },
    image: { height: 180, width: 'auto', margin: 'auto' },
    imageContainer: { flex: 1, backgroundColor: '#fff', position: 'relative' },
    container: { flex: 1, minWidth: 200, margin: 4 }
}