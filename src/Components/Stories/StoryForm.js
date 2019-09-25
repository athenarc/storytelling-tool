import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import NavButtons from '../Common/NavButtons'
import Assets from '../Assets'
import { STORY_TYPES } from '../../resources'

export default function StoryForm(props) {

    const { story, updateStory, showAssetsInsideStoryForm, toggleAssetsInsideStoryForm } = props
    const [_story, setStory] = useState({})
    const storyType = props.match.params.type

    const onNext = () => {
        updateStory({ ..._story, category: getStoryCategory() })
        toggleAssetsInsideStoryForm()
    }

    useEffect(() => {
        //if (showAssetsInsideStoryForm) toggleAssetsInsideStoryForm()
        setStory(story)
    }, [story])

    const goBack = () => {
        showAssetsInsideStoryForm
            ? toggleAssetsInsideStoryForm()
            : props.history.push('/workspace')
    }

    const getStoryCategory = () => {
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return 1
            case STORY_TYPES.HOTSPOTS: return 2
            case STORY_TYPES.TIMELINE: return 3
            default: return
        }
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

    const onAssetClick = (model) => {
        updateStory({
            ...story,
            chapters: [{
                title: "Introduction",
                description: "Intorucation Slide",
                assets: [{
                    ...model
                }]
            }]
        })
        props.history.push('/editor/new')
    }

    const getContent = () => {
        return <Container className="mt-5">
            <Row>
                <Col lg={8}>

                    <Row>
                        <Col lg={7}>
                            <Button className="primary">{getStoryTitle()}</Button>
                            <p className="body-secondary mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.</p>
                        </Col>
                        <Col lg={5}>{getStoryImage()}</Col>

                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <Form.Group>
                                <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Story title</Form.Label>
                                <Form.Control value={_story.title} onChange={(e) => setStory({ ..._story, title: e.target.value })} type="text" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Description</Form.Label>
                                <Form.Control value={_story.description} onChange={(e) => setStory({ ..._story, description: e.target.value })} as="textarea" rows="3" />
                            </Form.Group>

                        </Col>
                    </Row>


                </Col>
            </Row>

        </Container>
    }
    return (
        <>
            {!showAssetsInsideStoryForm ? getContent() : <Assets onAssetClick={onAssetClick} />}
            <NavButtons onPrevious={goBack} onNext={onNext} hasNext={_story.title && _story.description && !showAssetsInsideStoryForm} />
        </>
    )
}
