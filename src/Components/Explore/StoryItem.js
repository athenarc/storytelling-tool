import React from 'react'
import { Link } from 'react-router-dom'

export default function StoryItem(props) {
    const { imgUrl, userName, views, comments, stars, description, date, title, id } = props

    let _desc = ""
    if (description.length > 70)
        _desc = description.substring(0, 70) + '..';
    else
        _desc = description

    return (
        <div key={id} className="d-flex flex-column" style={styles.container}>
            <Link to={`/story/${id}`}>
                <div className="d-flex story-item" style={styles.imageContainer}>
                    <img style={styles.image} alt="" src={imgUrl} />
                    <div className="overlay d-flex flex-column p-3" style={styles.overlay}>
                        <div className="font-weight-bold" style={styles.text}>{_desc}</div>
                        <div className="mt-auto" style={styles.text}>{title}</div>
                        <div className="font-italic" style={styles.text}>{new Date(date).toDateString()}</div>
                    </div>
                </div>
            </Link>
            <div className="bg-white d-flex p-1 border-top align-items-center" style={{ alignItems: 'center' }}>

                <img width="20" height="20" alt="" src={require('../../assets/ico-person.png')} />
                <div className="mr-auto f-12 body-secondary">{userName}</div>

                <img width="20" height="20" alt="" src={require('../../assets/ico-person.png')} />
                <div className="f-12 body-secondary">{comments}</div>

                <img width="20" height="20" alt="" src={require('../../assets/ico-person.png')} />
                <div className="f-12 body-secondary">{views}</div>

                <img width="20" height="20" alt="" src={require('../../assets/ico-person.png')} />
                <div className="f-12 body-secondary">{stars}</div>

            </div>
        </div>
    )
}

const styles = {
    text: { fontFamily: "museo-sans, sans-serif", color: "#fff" },
    overlay: {
        position: 'absolute',
        width: 100 + '%',
        height: 100 + '%',
        backgroundColor: 'rgba(184, 145, 32, 0.8)'
    },
    image: { height: 180, width: 'auto', margin: 'auto', maxWidth: 100 + '%' },
    imageContainer: { flex: 1, backgroundColor: '#fff', position: 'relative' },
    container: { flex: 1, minWidth: 250, margin: 4 }
}