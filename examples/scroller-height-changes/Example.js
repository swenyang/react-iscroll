import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll"
//import IScroll, {setDefaultIScrollOptions} from "../../dist/iscroll-react"
import IScroll, {setDefaultIScrollOptions}  from "../../src/IScroll"
import Li from "./Li"

import "./example.less"

class Example extends Component {
    constructor(props) {
        super(props)
        this.onLiChange = this.onLiChange.bind(this)
    }

    onLiChange() {
        if (this.refs.iscroll) {
            this.refs.iscroll.updateIScroll()
        }
    }

    render() {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push(i)
        }

        return <div className="example">
                <div className="header">Scroller's Height Changes</div>
                <IScroll ref="iscroll" iScroll={iscroll} wrapperStyle={{bottom:50}} dynamicTop>
                    <ul>{arr.map((elem, index) =>
                        <Li key={index} serial={index+1} onChange={this.onLiChange}></Li>)}
                    </ul>
                </IScroll>
                <div className="footer">
                    <a href="https://github.com/swenyang/react-iscroll" target="_blank">https://github.com/swenyang/react-iscroll</a>
                </div>
        </div>
    }
}

// call somewhere once
setDefaultIScrollOptions({
    scrollbars: true,
    mouseWheel: true,
    shrinkScrollbars: "scale",
    fadeScrollbars: true,
    click: true,
})

ReactDOM.render(<Example />, document.getElementById("root"))
