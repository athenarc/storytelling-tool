import React from 'react'
import { Button } from 'react-bootstrap'

export default function NavButtons({ onNext, hasNext, onPrevious, onSave, hasSave }) {
    return (
        <>
            {onPrevious && <img style={styles.btnLeft} onClick={onPrevious} alt="" src={require('../../assets/arrow-left.png')} className="btn-arrow" width={15} />}
            {hasNext && <div style={styles.btnRight} onClick={onNext}>
                <Button variant="secondary" disabled={!onNext} className="mr-2">Next</Button>
                <img alt="" src={require('../../assets/arrow-right.png')} className="btn-arrow" width={15} />
            </div>}
            {hasSave && <Button onClick={onSave} disabled={!onSave} style={styles.btnSave} variant="secondary" className="mr-2">Save</Button>}
        </>
    )
}

const styles = {
    btnLeft: {
        position: 'fixed',
        top: 49 + '%',
        left: 0,
        margin: 20
    },
    btnRight: {
        position: 'fixed',
        top: 49 + '%',
        right: 0,
        margin: 20
    },
    btnSave: {
        position: 'fixed',
        right: 30,
        bottom: 5 + '%',
        margin: 20
    },
}