import React, { Component, PropTypes } from 'react'

class Li extends Component {
    constructor(props) {
        super(props)
        this.state = {
            collapse: true
        }
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse
        })
    }

    // if your component has animation, call it when animation is done
    componentDidUpdate() {
        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    render() {
        return <div onClick={this.onClick} className="entry">
            {
                this.state.collapse ? `${this.props.serial} Click this entry to expand` :
                    <div style={{backgroundColor: "#ff0"}}>
                        {`${this.props.serial}`} You now have expand this entry<br/>
                        Scroll down to see if the wrapper's height is correct<br/>
                        <br/>
                        Click again to collapse<br/>
                    </div>
            }
            </div>
    }
}

Li.propTypes = {
    serial: PropTypes.number.isRequired,
    onChange: PropTypes.func
}

export default Li
