import React, { Component } from 'react';
import { Form } from "react-bootstrap";
const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class SearchText extends Component {
    constructor(props) {
        super();

        this.state = {
            value: props.value
        };
        this.triggerChange = this.triggerChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillMount() {
        this.timer = null;
    }

    handleChange(e) {
        clearTimeout(this.timer);
        const value = e.target.value
        this.setState({ value });

        this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerChange();
        }
    }

    triggerChange() {
        const { value } = this.state;

        this.props.onChange(value);
    }

    render() {
        const { className } = this.props;

        return (
            <Form.Control
                className={className}
                placeholder={'Search'}
                value={this.state.value}
                onChange={this.handleChange}
                onKeyDown={this.handleKeyDown}
            />
        );
    }
}