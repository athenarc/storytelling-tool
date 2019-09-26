import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Form } from 'react-bootstrap'
import NavButtons from '../Common/NavButtons'
import Assets from '../Assets'
import { STORY_TYPES } from '../../resources'
import { fetchData, postData } from '../../utils'
import { ENDPOINT } from '../../config'

export default function SlideForm(props) {

    const chapterSchema = {
        title: "",
        description: ""
    }

    const { chapter, updateChapter, showAssetsInsideStoryForm, toggleAssetsInsideStoryForm } = props
    const [localStory, setLocalStory] = useState({})
    const [localChapter, setLocalChapter] = useState({})
    const [storyType, setStoryType] = useState()


    const onAssetsLoad = () => {
        updateChapter(localChapter)
        toggleAssetsInsideStoryForm()
    }

    useEffect(() => {
        setLocalChapter(chapter)
        fetchData(ENDPOINT.STORIES + `/${props.match.params.storyId}`)
            .then((data) => {
                setLocalStory(data)
                if (data.category == 1) setStoryType(STORY_TYPES.SLIDESHOW)
                if (data.category == 2) setStoryType(STORY_TYPES.HOTSPOTS)
                if (data.category == 3) setStoryType(STORY_TYPES.TIMELINE)
                const lChapter = data.chapters.find(x => x.id == props.match.params.chapterId)
                if (lChapter) setLocalChapter(lChapter)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })

    }, [chapter])



    const onSave = () => {
        console.log(chapter)
        console.log(localChapter)
        postData(ENDPOINT.STORIES + `/${props.match.params.storyId}/chapters`, {
            title: chapter.title,
            description: chapter.description,
        }).then((data) => {

            postData(ENDPOINT.STORIES + `/${props.match.params.storyId}/chapters/${data.chapters[data.chapters.length - 1].id}/assets`, {
                ...chapter.assets[0]
            }).then(() => {
                props.history.push(`/editor/${props.match.params.storyId}`)
            }).catch(ex => console.log(ex))

        }).catch(ex => console.log(ex))
    }


    const goBack = () => {
        showAssetsInsideStoryForm
            ? toggleAssetsInsideStoryForm()
            : props.history.push('/workspace')
    }

    const goBackStory = () => {
        showAssetsInsideStoryForm
            ? toggleAssetsInsideStoryForm()
            : props.history.push(`/editor/${props.match.params.storyId}`)
    }

    const getStoryCategory = () => {
        console.log('getStoryCategory=' + storyType)
        switch (storyType) {
            case STORY_TYPES.SLIDESHOW: return 1
            case STORY_TYPES.HOTSPOTS: return 2
            case STORY_TYPES.TIMELINE: return 3
            default: return
        }
    }
    const getStoryTitle = () => {
        console.log('getStoryTitle=' + storyType)
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
        updateChapter({
            ...localChapter,
            assets: [{ ...model }]
        })

        toggleAssetsInsideStoryForm()
    }

    const getChapterAssets = () => {
        console.log('local chapter assets')
        console.log(chapter)
        if (chapter && chapter.assets)
            return chapter.assets.map(asset => {
                return <Col md={6} className="p-9">
                    <img style={{ width: 100 + '%' }} alt="" src={asset.thumbnail} />
                </Col>
            })

    }

    const getContent = () => {
        return <Container className="mt-5">
            <Row>
                <Col lg={8}>
                    <Row>
                        <Col lg={7}>
                            <Button className="primary">{getStoryTitle()}</Button>
                            <p className="body-secondary mt-2">Please add this chapter's data.</p>
                        </Col>
                        <Col lg={5}>{getStoryImage()}</Col>

                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <Form.Group>
                                <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter title</Form.Label>
                                <Form.Control value={localChapter.title} onChange={(e) => setLocalChapter({ ...localChapter, title: e.target.value })} type="text" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter Description</Form.Label>
                                <Form.Control value={localChapter.description} onChange={(e) => setLocalChapter({ ...localChapter, description: e.target.value })} as="textarea" rows="3" />
                            </Form.Group>
                            <Container className="mt-5">
                                <Row>
                                    {getChapterAssets()}
                                </Row>
                            </Container>
                            <Form.Group>
                                <Button onClick={onAssetsLoad} className="primary">Select Asset</Button>
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
            {showAssetsInsideStoryForm && <NavButtons onPrevious={goBack} />}
            {!showAssetsInsideStoryForm && <NavButtons onPrevious={goBackStory} hasSave={localChapter.title && localChapter.description && chapter.assets.length > 0} onSave={onSave} />}
        </>
    )
}
