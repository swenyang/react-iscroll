import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll"
//import IScroll, {setDefaultIScrollOptions} from "../../dist/iscroll-react"
import IScroll, {setDefaultIScrollOptions}  from "../../src/IScroll"

import "./example.less"

class Example extends Component {
    render() {
        let arr = []
        for (let i = 0; i < 5; i++) {
            arr.push(i)
        }

        return <div className="example">
                <div className="header">You Can Always Scroll</div>
                <IScroll iScroll={iscroll} wrapperStyle={{top:50, bottom:50}} alwaysScroll>
                    <ul>{arr.map((elem, index) =>
                        <li className="entry" key={index}>{"Pretty row " + (index+1)}</li>)}
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
