import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll"
//import IScroll from "../../dist/react-iscroll"
import IScroll from "../../src/IScroll"

import "./basic.less"

class Example extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push(i)
        }

        return <div className="basic">
                <div className="header">React Component for iScroll</div>
                <IScroll iScroll={iscroll}>
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

ReactDOM.render(<Example />, document.getElementById("root"))
