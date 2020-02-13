import React, { Component, Fragment } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { fetchData, postData, deleteData, updateData } from '../../utils'
import { ENDPOINT } from '../../config'
import NavButtons from '../lib/NavButtons'
import Assets from '../Assets'
import "react-datepicker/dist/react-datepicker.css";

export default class StoryEditor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            story: null,
            storyCopy: null,
            showEdit: false,
            currentChapterId: null,
            showAssetPicker: false,
            currentPosition: null,
            showEditTitle: false
        }
        this.getStoryById = this.getStoryById.bind(this)
        this.handleTitleTyping = this.handleTitleTyping.bind(this)
    }


    componentDidMount() {
        this.setState({ story: this.props.story })
        this.getStoryById(this.props.match.params.id)
        this.handleNewChapter = this.handleNewChapter.bind(this)
        this.handleChapterChange = this.handleChapterChange.bind(this)
        this.handleAssetClick = this.handleAssetClick.bind(this)
        this.handleAnnotation = this.handleAnnotation.bind(this)
        this.setIframe = this.setIframe.bind(this)
    }


    handleTitleTyping(e) {
        if (e.key === "Enter") {
            this.handleUpdateStory()
        }
        // if (e.keyCode === "Escape") {
        //     alert("hit")
        //     this.setState({ showEditTitle: false })
        // }
    }

    handleUpdateProp = (prop) => (e) => {
        this.setState({
            story: {
                ...this.state.story,
                [prop]: e.target.value
            }
        })
    }

    handleUpdateStory() {
        const story = this.state.story
        updateData(ENDPOINT.STORIES + `/${story.id}`, story)
            .then(() => this.setState({ showEditTitle: false }))
            .catch(ex => console.log(ex))
    }

    getStoryById(id) {
        fetchData(ENDPOINT.STORIES + `/${id}`)
            .then((data) => {
                this.setState({ story: data, storyCopy: data })
                return data
            })
            .then((story) => {
                console.log(story)
                this.setIframe(story)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })
    }

    handleNewChapter = (id) => {
        const chapter = this.state.story.chapters.find(x => x.id === id)
        if (!id) {
            this.setState({
                story: {
                    ...this.state.story,
                    chapters: [
                        ...this.state.story.chapters,
                        {
                            id: -1,
                            title: "",
                            description: "",
                            position: "",
                            assets: [],
                            startDate: "",
                            endDate: ""
                        }
                    ]
                }
            })
        }
        this.setState({
            currentChapterId: chapter ? chapter.id : -1,
            showEdit: true,
            currentPosition: chapter ? chapter.position : null
        })
    }

    handleChapterChange = (prop) => (event) => {
        const value = event.target ? event.target.value : event
        this.setState({
            story: {
                ...this.state.story,
                chapters: [
                    ...this.state.story.chapters.map(ch => {
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
        const currentChapter = this.state.story && this.state.story.chapters.find(x => x.id === this.state.currentChapterId)
        // New chapter
        if (currentChapter.id === -1) {
            const payload = {
                title: currentChapter.title,
                description: currentChapter.description,
                position: currentChapter.position,
                startDate: currentChapter.startDate,
                endDate: currentChapter.endDate
            }
            postData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters`, payload)
                .then((data) => {
                    this.setState({ showEdit: false })
                    this.setState({ currentPosition: null })
                    if (!currentChapter.assets[0]) return this.getStoryById(this.state.story.id)
                    const payload = { ...currentChapter.assets[0] }
                    postData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${data.chapters[data.chapters.length - 1].id}/assets`, payload)
                        .then(() => {
                            // force update the current story after one save
                            this.getStoryById(this.state.story.id)
                        }).catch(ex => console.log(ex))
                }).catch(ex => console.log(ex))
        } else {
            // TODO: update chapter here...
            const payload = {
                title: currentChapter.title,
                description: currentChapter.description,
                position: currentChapter.position,
                startDate: currentChapter.startDate,
                endDate: currentChapter.endDate
            }
            updateData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${currentChapter.id}`, payload)
                .then((data) => {
                    this.setState({ showEdit: false })
                    this.setState({ currentPosition: null })
                    if (!currentChapter.assets[0]) return this.getStoryById(this.state.story.id)

                    const payload = { ...currentChapter.assets[0] }
                    const assetCopy = this.state.storyCopy.chapters.find(x => x.id === currentChapter.id).assets[0]


                    if (assetCopy && assetCopy.id) {
                        deleteData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${currentChapter.id}/assets/${assetCopy.id}`, payload)
                            .then(() => {
                                postData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${currentChapter.id}/assets`, payload)
                                    .then(() => {
                                        this.getStoryById(this.state.story.id)
                                    }).catch(ex => console.log(ex))
                            }).catch(ex => console.log(ex))
                    } else {
                        postData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${currentChapter.id}/assets`, payload)
                            .then(() => {
                                this.getStoryById(this.state.story.id)
                            }).catch(ex => console.log(ex))
                    }

                }).catch(ex => console.log(ex))
        }
    }

    handleAssetClick = (model) => {
        this.setState({
            story: {
                ...this.state.story,
                chapters: [
                    ...this.state.story.chapters.map(ch => {
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
                annotations_visible: story.chapters.length > 1,
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
                            const chapterIndex = this.state.story.chapters.findIndex(x => x.id === this.state.currentChapterId)
                            const currentChapter = this.state.story.chapters[chapterIndex]

                            if (info.position3D && currentChapter) {

                                const position = info.position3D
                                // Annotation is already set, need to update
                                if (currentChapter.position) {
                                    api.removeAnnotation(chapterIndex - 1) // First chapter is the intro
                                }
                                api.getCameraLookAt((err, camera) => {
                                    if (position)
                                        api.createAnnotation(
                                            position,
                                            [0, 0, 0],
                                            [position[0] * 3, position[1] * 3, position[2] * 2],
                                            camera.target,
                                            currentChapter.title,
                                            currentChapter.description
                                        );
                                })
                                currentChapter.position = JSON.stringify([info.position3D[0], info.position3D[1], info.position3D[2]])
                                // this.handleAnnotation(api, info)
                                this.setState(prevState => ({
                                    currentPosition: info.position3D,
                                    story: {
                                        ...prevState.story,
                                        chapters: prevState.story.chapters.map(chapter => {
                                            if (chapter.id === this.state.currentChapterId) {
                                                return currentChapter
                                            }
                                            return chapter
                                        })
                                    }
                                }))
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
                        chapter.description
                    );
            })
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
        const { story, currentChapterId, showAssetPicker, showEdit } = this.state
        const currentChapter = story && story.chapters.find(x => x.id === currentChapterId)

        const getSlideText = (category) => {
            switch (category) {
                case 1: return "Slide"
                case 2: return "Hotspot"
                case 3: return "Slide"
                default: return "Slide"
            }
        }

        const getIntroPreview = () => {
            if (!story) return null
            if (!story.chapters[0]) return null
            const chapter = story && story.chapters[0]
            const asset = chapter.assets[0]
            const hasModel = asset.embedUrl
            if (hasModel) {
                return <iframe title="api-iframe" src={asset.embedUrl} id="api-frame" className="w-100" style={{ height: 480 }}></iframe>
            } else {
                return <img style={{ width: 100 + '%' }} alt="" src={asset.thumbnail} />
            }
        }

        const getSlides = (chapters) => {
            const items = chapters.map(ch => {
                return <li key={ch.id} style={{ display: 'flex' }} className="m-2">
                    <button className="btn btn-link body-primary p-2 mr-auto">{ch.title}</button>
                    <Button onClick={() => this.handleNewChapter(ch.id)} className="btn btn-primary">Edit</Button>
                </li>
            })
            items.push(<li key={-2} style={{ display: 'flex' }} className="m-2">
                <button className="btn btn-link body-primary p-2 mr-auto"></button>
                <Button disabled={story && story.chapters.find(x => x.id === -1)} onClick={() => this.handleNewChapter(null)} className="btn btn-secondary">Add {getSlideText(story.category)}</Button>
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

        const deleteChpater = () => {
            const chapter = this.state.story.chapters.find(x => x.id === this.state.currentChapterId)
            if (chapter.id === -1) {
                this.setState({
                    showEdit: false,
                    story: {
                        ...this.state.story,
                        chapters: this.state.story.chapters.filter(x => x.id !== -1)
                    }
                })
                this.getStoryById(this.state.story.id)
            } else {
                deleteData(ENDPOINT.STORIES + `/${this.state.story.id}/chapters/${chapter.id}`)
                    .then(() => {
                        this.setState({ showEdit: false })
                        this.getStoryById(this.state.story.id)
                    }).catch(ex => console.log(ex))
            }
        }

        const canSave = () => {
            const currentChapter = this.state.story && this.state.story.chapters.find(x => x.id === this.state.currentChapterId)
            if (!currentChapter.description || !currentChapter.title) return false
            if (story.category === 2 && story.chapters[0].assets[0].embedUrl && !this.state.currentPosition && this.state.currentChapterId !== this.state.story.chapters[0].id) {
                return false
            }
            // if (story.category === 3 && (!story.endDate || !story.startDate) && canDelete()) {
            //     return false
            // }
            return true
        }

        const canDelete = () => {
            if (this.state.currentChapterId === this.state.story.chapters[0].id) {
                return false
            }
            return true
        }

        const getRequiredInputDescription = () => {
            if (this.state.currentChapterId === this.state.story.chapters[0].id) return <></>
            const currentChapter = this.state.story && this.state.story.chapters.find(x => x.id === this.state.currentChapterId)
            if (!currentChapter.description || !currentChapter.title) return <div className="text-danger">Chapter title and chapter description are required fields.</div>
            if (story.category === 2 && story.chapters[0].assets[0].embedUrl && !this.state.currentPosition) return <div className="text-danger">Please click somewhere on the model to add the chapter.</div>
            return <div className="text-success">Ready to save chapter.</div>
        }

        const title = story ? story.title : ""
        const description = story ? story.description : ""


        return (
            <Fragment>
                <Container className={`mt-5 ${showAssetPicker ? 'd-none' : ''}`} >
                    <Row>
                        <Col style={{ width: "max-content" }}>
                            {
                                !this.state.showEditTitle &&
                                <>
                                    <h4 className="header-primary">{title}</h4>
                                    <p className="body-secondary">{description}</p>
                                </>
                            }
                            {
                                this.state.showEditTitle &&
                                <>
                                    <input
                                        onKeyPress={this.handleTitleTyping}
                                        className="form-control mb-2"
                                        style={{ width: 400 }}
                                        value={title}
                                        onChange={this.handleUpdateProp("title")} />
                                    <textarea
                                        onKeyPress={this.handleTitleTyping}
                                        className="form-control mb-2"
                                        style={{ width: 400 }}
                                        value={description}
                                        onChange={this.handleUpdateProp("description")} />
                                </>
                            }
                        </Col>
                    </Row>
                    {this.state.showEditTitle && <>
                        <Row>
                            <Col>
                                <Button className="btn btn-primary" onClick={() => this.handleUpdateStory()}>Save</Button>
                            </Col>
                        </Row>
                    </>}
                    {!this.state.showEditTitle && <>
                        <Row>
                            <Col>
                                <Button className="btn btn-primary" onClick={() => this.setState({ showEditTitle: true })} disabled={this.state.showEditTitle}>Edit</Button>
                                <Button className="btn btn-secondary ml-2" onClick={() => this.props.history.push(`/stories/${story.id}/view`)}>Preview</Button>
                            </Col>
                        </Row>
                    </>}
                    <Row>
                        <Col md={6} className="p-3">
                            {getIntroPreview()}
                        </Col>
                        <Col className="p-3">
                            {story && getSlides(story.chapters)}
                        </Col>
                        {showEdit &&
                            <Col>
                                <Form.Group>
                                    <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter title</Form.Label>
                                    <Form.Control value={currentChapter.title} onChange={this.handleChapterChange('title')} type="text" />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Chapter Description</Form.Label>
                                    <Form.Control value={currentChapter.description} onChange={this.handleChapterChange('description')} as="textarea" rows="3" />
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
                                        {getRequiredInputDescription()}
                                    </Form.Text>
                                </Form.Group>
                                {story.category === 3 && canDelete() &&
                                    <div className="d-flex">
                                        <Form.Group>
                                            <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>Date</Form.Label>
                                            <Form.Control value={currentChapter.startDate} onChange={this.handleChapterChange('startDate')} />
                                        </Form.Group>
                                        {/* <Form.Group className="ml-2">
                                            <Form.Label className="body-secondary" style={{ fontWeight: 500 }}>To</Form.Label>
                                            <Form.Control value={currentChapter.endDate} onChange={this.handleChapterChange('endDate')} />
                                        </Form.Group> */}
                                    </div>
                                }
                                <Form.Group>
                                    <Button variant="secondary" className="mx-1" disabled={!canDelete()} onClick={deleteChpater}>Delete</Button>
                                    <Button variant="secondary" className="mx-1" disabled={!canSave()} onClick={this.handleSaveChapter}>Save</Button>
                                </Form.Group>

                            </Col>}
                    </Row>
                </Container>
                <span className={`mt-5 ${!showAssetPicker ? 'd-none' : ''}`}>
                    <Assets onAssetClick={this.handleAssetClick} />
                    <NavButtons onPrevious={() => this.setState({ showAssetPicker: false })} />
                </span>
            </Fragment>
        )
    }
}
