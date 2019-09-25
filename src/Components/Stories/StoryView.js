import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { fetchData, postData } from '../../utils'
import { ENDPOINT } from '../../config'
import NavButtons from '../Common/NavButtons'
import { STORY_TYPES } from '../../resources'
import { Link } from 'react-router-dom'

const StoryView = (props) => {
    const { story, updateStory, setStory } = props
    const [introduction, setIntroduction] = useState()
    const [localStory, setLocalStory] = useState()

    useEffect(() => {
        setLocalStory(story)
        fetchData(ENDPOINT.STORIES + `/${props.match.params.id}`)
            .then((data) => {
                setLocalStory(data)
                // if (!data.chapters[0]) props.history.push('/workspace')
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })
    }, [props.match.params.id])

    const onBack = () => {
        console.log('back')
        props.history.push(getStoryCategory())
    }

    const getStoryCategory = () => {
        switch (story.category) {
            case 1: return `/workspace/${STORY_TYPES.SLIDESHOW}`
            case 2: return `/workspace/${STORY_TYPES.HOTSPOTS}`
            case 3: return `/workspace/${STORY_TYPES.TIMELINE}`
            default: return '/workspace'
        }
    }

    const onSave = () => {
        postData(ENDPOINT.STORIES, {
            title: localStory.title,
            description: localStory.description,
            category: localStory.category
        }).then((_story) => {

            postData(ENDPOINT.STORIES + `/${_story.id}/chapters`, {
                title: localStory.chapters[0].title,
                description: localStory.chapters[0].description,
            }).then((data) => {

                postData(ENDPOINT.STORIES + `/${_story.id}/chapters/${data.chapters[0].id}/assets`, {
                    ...localStory.chapters[0].assets[0]
                }).then(() => {

                    props.history.push(`/editor/${_story.id}`)

                }).catch(ex => console.log(ex))

            }).catch(ex => console.log(ex))

        }).catch(ex => console.log(ex))
    }

    const getSlides = (chapters) => {
        const items = chapters.map(ch => {
            return <li style={{ display: 'flex' }} className="m-2">
                <a className="body-primary p-2 mr-auto">{ch.title}</a>
                <Link to={`/slide/${localStory.id}/${ch.id}`} className="btn btn-primary">Edit</Link>
            </li>
        })
        items.push(<li style={{ display: 'flex' }} className="m-2">
            <a className="body-primary p-2 mr-auto">Slide</a>
            <Link to={`/slide/${localStory.id}/new`} className="btn btn-primary">Add</Link>
        </li>)
        return items
    }

    const imgUrl = localStory && localStory.chapters[0] && localStory.chapters[0].assets[0] && localStory.chapters[0].assets[0].thumbnail
    return (
        <Container className="mt-5">
            <Row>
                <Col><h4 className="header-primary">{localStory && localStory.title}</h4></Col>
            </Row>
            <Row>
                <Col md={6}></Col>
                <Col md={6}>
                    {localStory && !localStory.id && <Form.Label className="body-secondary">Introduction</Form.Label>}
                </Col>
            </Row>
            <Row>
                <Col md={6} className="p-3">
                    {imgUrl && <img style={{ width: 100 + '%' }} alt="" src={imgUrl} />}
                </Col>
                <Col className="p-3">
                    {localStory && !localStory.id && <Form.Control as="textarea" rows="12" />}
                    {localStory && localStory.id && getSlides(localStory.chapters)}
                </Col>
            </Row>
            <NavButtons onPrevious={onBack} hasSave={true} onSave={onSave} />
        </Container>
    )
}
export default StoryView