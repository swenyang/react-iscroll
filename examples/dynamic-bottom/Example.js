import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll"
//import IScroll, {setDefaultIScrollOptions} from "../../dist/iscroll-react"
import IScroll, {setDefaultIScrollOptions}  from "../../src/IScroll"

import "./example.less"

class Example extends Component {
    constructor(props) {
        super(props)
        this.calBottom = this.calBottom.bind(this)
    }

    calBottom() {
        return this.refs.bottom ? this.refs.bottom.clientHeight : 0
    }

    componentDidMount() {
        if (this.refs.iscroll) this.refs.iscroll.updateIScroll()
    }

    render() {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push(i)
        }

        return <div className="example">
                <div className="header">IScroll's Position to Bottom is Dynamic</div>
                <IScroll ref="iscroll" iScroll={iscroll} dynamicTop dynamicBottomFunc={this.calBottom}>
                    <ul>{arr.map((elem, index) =>
                        <li className="entry" key={index}>{"Pretty row " + (index+1)}</li>)}
                    </ul>
                </IScroll>
                <div className="footer" ref="bottom">
                    <a href="https://github.com/swenyang/react-iscroll" target="_blank">this div's height changes on different devices</a>
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
