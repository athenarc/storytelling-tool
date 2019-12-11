import React, { Fragment, useState, useEffect } from 'react'
import { STORY_TYPES } from '../../resources'
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import NavButtons from '../lib/NavButtons'
import "react-datepicker/dist/react-datepicker.css";
import Assets from '../Assets'
import { postData } from '../../utils'
import { ENDPOINT } from '../../config'

const StorySchema = {
    id: null,
    title: "",
    description: "",
    category: null,
    chapters: [{
        title: "Introduction",
        description: "",
        assets: []
    }],
    startDate: null,
    endDate: null
}

export default function StoryForm(props) {

    const storyType = props.match.params.type
    const [step, setStep] = useState(0)
    const [story, setStory] = useState({ ...StorySchema })

    const getStoryCategory = React.useCallback((storyType) => {
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return 1
            case STORY_TYPES.HOTSPOTS: return 2
            case STORY_TYPES.TIMELINE: return 3
            default: return
        }
    }, [])

    useEffect(() => {
        setStory({
            ...StorySchema,
            category: getStoryCategory(storyType)
        })
    }, [storyType, getStoryCategory])


    const handleUpdateProp = (prop) => (e) => {
        const value = e.target ? e.target.value : e
        // reset end date if the start date is changed
        const storyToUpdate = { ...story, [prop]: value }
        if (prop === "startDate" && prop !== "endDate") {
            storyToUpdate.endDate = null
        }
        setStory(storyToUpdate)
    }

    const updateChapterDescription = (e) => {
        setStory({
            ...story,
            chapters: [{
                ...story.chapters[0],
                description: e.target.value

            }]
        })
    }

    const handleAssetClick = (model) => {
        setStory({
            ...story,
            chapters: [{
                ...story.chapters[0],
                assets: [{
                    ...model
                }]
            }]
        })
        setStep(step + 1)
    }

    const handlePrevious = () => {
        if (step === 0) {
            window.history.back()
        } else {
            setStep(step - 1)
        }
    }

    const handleNext = () => {
        setStep(step + 1)
    }

    const hasRequiredToGoNext = () => {
        if (!story.title || !story.description) return false
        if (!story.chapters[0].assets[0] && step === 1) return false
        if (step === 2) return false
        return true
    }
    const hasRequiredToSave = () => {
        return step === 2 && story.chapters[0].description
    }

    const onSave = () => {
        postData(ENDPOINT.STORIES, {
            title: story.title,
            description: story.description,
            category: story.category,
            startDate: story.startDate,
            endDate: story.endDate
        }).then((_story) => {

            postData(ENDPOINT.STORIES + `/${_story.id}/chapters`, {
                title: story.chapters[0].title,
                description: story.chapters[0].description,
            }).then((data) => {

                postData(ENDPOINT.STORIES + `/${_story.id}/chapters/${data.chapters[0].id}/assets`, {
                    ...story.chapters[0].assets[0]
                }).then(() => {

                    props.history.push('/stories/' + _story.id + "/edit")

                }).catch(ex => console.log(ex))

            }).catch(ex => console.log(ex))

        }).catch(ex => console.log(ex))
    }

    const getStoryTitle = () => {
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return "Slideshow"
            case STORY_TYPES.HOTSPOTS: return "Hotspots"
            case STORY_TYPES.TIMELINE: return "Timeline"
            default: return <></>
        }
    }

    const getStoryImage = () => {
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return <img className="ml-auto d-block" alt="" src={require('../../assets/story-2.png')} width={200} />
            case STORY_TYPES.HOTSPOTS: return <img className="ml-auto d-block" alt="" src={require('../../assets/story-3.png')} width={200} />
            case STORY_TYPES.TIMELINE: return <img className="ml-auto d-block" alt="" src={require('../../assets/story-1.png')} width={200} />
            default: return <></>
        }
    }

    const getStoryText = () => {
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return "Slideshow - Choose a series of digital assets from Europeana and Sketchfab and add text to tell your story in the form of a slideshow." 
            case STORY_TYPES.HOTSPOTS: return "Object + hotspots - Choose a hero object and add hotspots that you can use to tell your story using text and images or other digital media from Europeana and Sketchfab"
            case STORY_TYPES.TIMELINE: return "Timeline -  Choose a series of digital assets from Europeana and Sketchfab that relate to moments in time that are relevant for your story."
            default: return
        }
    }

    const stepOne = () => {
        return <Container className="mt-5">
            <Row>
                <Col lg={8}>

                    <Row>
                        <Col lg={7}>
                            <Button className="primary">{getStoryTitle()}</Button>
                                <p className="body-secondary mt-2">{getStoryText()}</p>
                        </Col>
                        <Col lg={5}>{getStoryImage()}</Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Form.Group>
                                <Form.Label
                                    className="body-secondary"
                                    style={{ fontWeight: 500 }}>
                                    Story title
                                            </Form.Label>
                                <Form.Control
                                    value={story.title}
                                    onChange={handleUpdateProp("title")}
                                    type="text" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label
                                    className="body-secondary"
                                    style={{ fontWeight: 500 }}>
                                    Description
                                    </Form.Label>
                                <Form.Control
                                    value={story.description}
                                    onChange={handleUpdateProp("description")}
                                    as="textarea"
                                    rows="3" />
                            </Form.Group>

                            {storyType === STORY_TYPES.TIMELINE &&
                                <div className="d-flex">
                                    <Form.Group>
                                        <Form.Label
                                            className="body-secondary"
                                            style={{ fontWeight: 500 }}>
                                            From
                                    </Form.Label>
                                        <Form.Control
                                            value={story.startDate}
                                            onChange={handleUpdateProp("startDate")} />
                                    </Form.Group>
                                    <Form.Group className="ml-2">
                                        <Form.Label
                                            className="body-secondary"
                                            style={{ fontWeight: 500 }}>
                                            To
                                    </Form.Label>
                                        <Form.Control
                                            value={story.endDate}
                                            onChange={handleUpdateProp("endDate")} />
                                    </Form.Group>
                                </div>
                            }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    }

    const stepThree = () => {
        let preview = null
        const asset = story.chapters[0].assets[0]
        const hasModel = asset && asset.embedUrl
        if (hasModel) {
            preview = <iframe title="api-iframe" src={asset.embedUrl} id="api-frame" className="w-100" style={{ height: 480 }}></iframe>
        } else {
            preview = <img style={{ width: 100 + '%' }} alt="" src={asset.thumbnail} />
        }
        return <Container className="mt-5">
            <Row>
                <Col>
                    <h4 className="header-primary">{story.title}</h4>
                </Col>
            </Row>
            <Row>
                <Col md={6}></Col>
                <Col md={6}>
                    <Form.Label
                        className="body-secondary">
                        {story.chapters[0].title}
                    </Form.Label>
                </Col>
            </Row>
            <Row>
                <Col md={6} className="p-3">
                    {preview}
                </Col>
                <Col className="p-3">
                    <Form.Control
                        value={story.chapters[0].description}
                        onChange={updateChapterDescription}
                        as="textarea"
                        rows="12" />
                </Col>
            </Row>
        </Container>
    }


    const stepTwo = () => {
        return <Assets onAssetClick={handleAssetClick} />
    }


    const getUiForStep = (step) => {
        switch (step) {
            case 0: return stepOne()
            case 1: return stepTwo()
            case 2: return stepThree()
            default: return stepOne()
        }
    }

    return (
        <Fragment>
            {getUiForStep(step)}
            <NavButtons
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasSave={hasRequiredToSave()}
                onSave={onSave}
                hasNext={hasRequiredToGoNext()}
            />
        </Fragment>
    )
}
