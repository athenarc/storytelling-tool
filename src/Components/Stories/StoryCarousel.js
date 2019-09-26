import React, { useState, useEffect } from 'react';
import { Slide } from 'react-slideshow-image';
import Iframe from 'react-iframe';
import { fetchData } from '../../utils';
import { ENDPOINT } from '../../config';

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
                console.log(story)
                setStory(story)
            })
            .catch((ex) => {
                // props.history.push('/workspace')
            })

    }, [])


    const getChapters = () => {
        const chapters = story ? story.chapters : []
        return chapters.map((ch, index) => {
            const asset = ch.assets[0]
            return <div className="each-slide" style={{ position: 'relative' }} key={index}>
                {!asset.embedUrl &&
                    <>
                        <span className="card d-flex flex-column justify-content-end" style={{ position: 'absolute', right: 0, minWidth: 200 }}>
                            <h5 className="header-primary">{ch.title}</h5>
                            <div className="body-secondary f-12">{ch.description}</div>
                        </span>
                        <div style={{ 'backgroundImage': `url(${asset.thumbnail})`, height: 600 }} />
                    </>
                }
                {asset.embedUrl &&
                    <>
                        <span className="card d-flex flex-column justify-content-end" style={{ position: 'absolute', right: 0, minWidth: 200 }}>
                            <h5 className="header-primary">{ch.title}</h5>
                            <div className="body-secondary">{ch.description}</div>
                        </span>
                        <iframe id="modelEmbedded" src={asset.embedUrl} className="w-100" style={{ height: 600 }}></iframe>
                    </>
                }
            </div>
        })
    }

    return (
        <div className="slide-container">
            <Slide {...properties}>
                {getChapters()}
            </Slide>
        </div>
    )
}