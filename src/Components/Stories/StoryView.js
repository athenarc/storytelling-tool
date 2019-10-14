import React, { Component, Fragment, useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { fetchData, postData, post } from '../../utils'
import { ENDPOINT } from '../../config'
import NavButtons from '../Common/NavButtons'
import { STORY_TYPES } from '../../resources'
import Assets from '../Assets'


export default class StoryView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            localStory: null,
            showEdit: false,
            currentChapterId: null,
            showAssetPicker: false,
            currentPosition: null
        }
        this.getStoryById = this.getStoryById.bind(this)
    }


    componentDidMount() {
        this.setState({ localStory: this.props.story })
        this.getStoryById(this.props.match.params.id)
        this.handleNewChapter = this.handleNewChapter.bind(this)
        this.handleChapter = this.handleChapter.bind(this)
        this.handleAssetClick = this.handleAssetClick.bind(this)
        this.handleAnnotation = this.handleAnnotation.bind(this)
        this.setIframe = this.setIframe.bind(this)
    }



    getStoryById(id) {
        fetchData(ENDPOINT.STORIES + `/${id}`)
            .then((data) => {
                this.setState({ localStory: data })
                return data
                // if (!data.chapters[0]) props.history.push('/workspace')
            })
            .then((localStory) => {
                this.setIframe(localStory)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })
    }

    handleNewChapter = (id) => {
        const chapter = this.state.localStory.chapters.find(x => x.id === id)
        if (!id) {
            this.setState({
                localStory: {
                    ...this.state.localStory,
                    chapters: [
                        ...this.state.localStory.chapters,
                        { id: -1, title: "", description: "", position: "", assets: [] }
                    ]
                }
            })
        }
        this.setState({
            currentChapterId: chapter ? chapter.id : -1,
            showEdit: true,
        })
    }

    handleChapter = (prop) => (event) => {
        const value = event.target.value
        this.setState({
            localStory: {
                ...this.state.localStory,
                chapters: [
                    ...this.state.localStory.chapters.map(ch => {
                        if (ch.id === this.state.currentChapterId) {
                            return {
                                ...ch,
                                [prop]: value
                            }
                        }
                        return ch
                    }),
                ]

            }
        })
    }

    handleSaveChapter = () => {
        const currentChapter = this.state.localStory && this.state.localStory.chapters.find(x => x.id === this.state.currentChapterId)
        // New chapter
        if (currentChapter.id === -1) {
            const payload = {
                title: currentChapter.title,
                description: currentChapter.description,
                position: this.wrapPosition()
            }
            postData(ENDPOINT.STORIES + `/${this.state.localStory.id}/chapters`, payload)
                .then((data) => {
                    const payload = { ...currentChapter.assets[0] }
                    postData(ENDPOINT.STORIES + `/${this.state.localStory.id}/chapters/${data.chapters[data.chapters.length - 1].id}/assets`, payload)
                        .then(() => {
                            this.setState({ showEdit: false })
                            // force update the current story after one save
                            this.getStoryById(this.state.localStory.id)
                        }).catch(ex => console.log(ex))
                }).catch(ex => console.log(ex))
        } else {
            // TODO: update chapter here...


        }
    }


    handleNewStory = () => {
        const { localStory } = this.state

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

                    this.getStoryById(_story.id)

                }).catch(ex => console.log(ex))

            }).catch(ex => console.log(ex))

        }).catch(ex => console.log(ex))
    }

    handleAssetClick = (model) => {
        this.setState({
            localStory: {
                ...this.state.localStory,
                chapters: [
                    ...this.state.localStory.chapters.map(ch => {
                        if (ch.id === this.state.currentChapterId) {
                            return {
                                ...ch,
                                assets: [{ ...model }]
                            }
                        }
                        return ch
                    })
                ]
            },
            showAssetPicker: false
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
                success: (api) => {
                    api.load()
                    api.start()
                    api.addEventListener('viewerready', () => {
                        story.chapters.forEach(ch => {
                            this.handleAnnotation(api, ch)
                        });
                    });
                    // this.setSketchFab(api)
                    // this.apiEventListeners()
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

        const createAnnotation = (err, camera) => api.createAnnotation(
            JSON.parse(chapter.position),
            [0.1229991557663267, -3.5779795878788656, -0.5151466147866559],
            camera.position,
            camera.target,
            chapter.title,
            chapter.description
        );

        const addCustomAnotations = () => api.getCameraLookAt((err, camera) => createAnnotation(err, camera));

        api.getAnnotationList(function (err, annotations) {
            annotations.forEach((an, index) => {
                api.removeAnnotation(index);
            })
            addCustomAnotations()
        });

    }



    handleBack() {
        this.props.history.push('/workspace')
    }

    wrapPosition() {
        return this.state.currentPosition
            ? JSON.stringify([this.state.currentPosition[0], this.state.currentPosition[1], this.state.currentPosition[2]])
            : null
    }


    render() {
        const { localStory, currentChapterId, showAssetPicker, showEdit } = this.state
        const currentChapter = localStory && localStory.chapters.find(x => x.id === currentChapterId)

        const getIntroPreview = () => {
            if (!localStory) return null
            if (!localStory.chapters[0]) return null
            const chapter = localStory && localStory.chapters[0]
            const asset = chapter.assets[0]
            const hasModel = asset.embedUrl
            if (hasModel) {
                return <iframe src={asset.embedUrl} id="api-frame" className="w-100" style={{ height: 480 }}></iframe>
            } else {
                return <img style={{ width: 100 + '%' }} alt="" src={asset.thumbnail} />
            }
        }

        const getSlides = (chapters) => {
            const items = chapters.map(ch => {
                return <li style={{ display: 'flex' }} className="m-2">
                    <a className="body-primary p-2 mr-auto">{ch.title}</a>
                    <Button onClick={() => this.handleNewChapter(ch.id)} className="btn btn-primary">Edit</Button>
                </li>
            })
            items.push(<li style={{ display: 'flex' }} className="m-2">
                <a className="body-primary p-2 mr-auto">Slide</a>
                <Button disabled={localStory && localStory.chapters.find(x => x.id === -1)} onClick={() => this.handleNewChapter(null)} className="btn btn-primary">Add</Button>
            </li>)
            return items
        }

        const getChapterAssets = () => {
            if (currentChapter && currentChapter.assets[0])
                return currentChapter.assets.map(asset => {
                    return <Col md={12} className="mb-3 px-0">
                        <img style={{ width: 100 + '%' }} alt="" src={asset.thumbnail} />
                    </Col>
                })

        }

        return (
            <Fragment>
                <Container className={`mt-5 ${showAssetPicker ? 'd-none' : ''}`} >
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
                            {getIntroPreview()}
                        </Col>
                        <Col className="p-3">
                            {localStory && !localStory.id && <Form.Control as="textarea" rows="12" />}
                            {localStory && localStory.id && getSlides(localStory.chapters)}
                        </Col>
                        {showEdit &&
                            <Col>
                                <Form.Group>
                                    <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter title</Form.Label>
                                    <Form.Control value={currentChapter.title} onChange={this.handleChapter('title')} type="text" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter Description</Form.Label>
                                    <Form.Control value={currentChapter.description} onChange={this.handleChapter('description')} as="textarea" rows="3" />
                                </Form.Group>
                                <Container className="mt-3">
                                    <Row >
                                        {getChapterAssets()}
                                    </Row>
                                </Container>
                                <Form.Group>
                                    <Button variant="primary" onClick={() => this.setState({ showAssetPicker: true })}>Select Asset</Button>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Text className="text-muted">
                                        For
                                                </Form.Text>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="secondary" className="mx-1" disabled>Delete</Button>
                                    <Button variant="secondary" className="mx-1" onClick={this.handleSaveChapter}>Save</Button>
                                </Form.Group>

                            </Col>}
                    </Row>
                    <NavButtons onPrevious={this.handleBack} hasSave={localStory && !localStory.id} onSave={this.handleNewStory} />
                </Container>
                <span className={`mt-5 ${!showAssetPicker ? 'd-none' : ''}`}>
                    <Assets onAssetClick={this.handleAssetClick} />
                    <NavButtons onPrevious={() => this.setState({ showAssetPicker: true })} />
                </span>
            </Fragment>
        )
    }
}
