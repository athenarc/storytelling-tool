import React from 'react'

export default function Checkbox({ id, checked, onChange, label }) {
    return (
        <div className="checkbox" onClick={onChange}>
            <div className="round">
                <input type="checkbox" checked={checked} onChange={onChange} id={id} />
                <label htmlFor={id}></label>
            </div>
            <div className="label">{label}</div>
        </div>
    )
}