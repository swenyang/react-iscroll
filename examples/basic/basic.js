import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll/build/iscroll-probe"
//import iscroll from "iscroll"
//import IScroll from "../../dist/react-iscroll"
import IScroll, {setDefaultIScrollOptions}  from "../../src/IScroll"

import "./basic.less"

class Example extends Component {
    constructor(props) {
        super(props)
        this.calBottom = this.calBottom.bind(this)
    }

    componentDidMount() {
        this.refs.iscroll.updateIScroll()
    }

    calBottom() {
        return this.refs.bottom ? this.refs.bottom.clientHeight : 0
    }

    render() {
        let arr = []
        for (let i = 0; i < 50; i++) {
            arr.push(i)
        }

        return <div className="basic">
                <div className="header">React Component for iScroll</div>
                <IScroll iScroll={iscroll} wrapper={{dynamicTop:true}} dynamicBottomFunc={this.calBottom}
                         ref="iscroll" pullDownToRefresh={{onRefresh:()=>{}}}>
                    <ul>{arr.map((elem, index) =>
                        <li className="entry" key={index}>{"Pretty row " + (index+1)}</li>)}
                    </ul>
                </IScroll>
                <div className="footer" ref="bottom">
                    <a href="https://github.com/swenyang/react-iscroll" target="_blank">https://github.com/swenyang/react-iscroll</a>
                </div>
        </div>
    }
}

setDefaultIScrollOptions({
    scrollbars: true,
    mouseWheel: true,
    shrinkScrollbars: "scale",
    fadeScrollbars: true,
    click: true,
})

ReactDOM.render(<Example />, document.getElementById("root"))
