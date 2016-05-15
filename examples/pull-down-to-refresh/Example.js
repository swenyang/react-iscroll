import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iscroll from "iscroll/build/iscroll-probe"
//import IScroll, {setDefaultIScrollOptions} from "../../dist/iscroll-react"
import IScroll, {setDefaultIScrollOptions}  from "../../src/IScroll"
import "whatwg-fetch"

import "./example.less"

class Example extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stargazers: null,
            page: 1,
            error: null,
            isLoading: true,
        }
        this.fetchStargazers = this.fetchStargazers.bind(this)
    }

    componentWillMount() {
        this.fetchStargazers()
    }

    componentDidUpdate() {
        if (this.refs.iscroll) {
            this.refs.iscroll.updateIScroll()
        }
    }

    fetchStargazers() {
        this.setState({
            ...this.state,
            isLoading: true,
        })
        fetch(`https://api.github.com/repos/facebook/react/stargazers?page=${this.state.page}`)
            .then(response => response.json())
            .then(json => {
                this.setState({
                    page: this.state.page + 1,
                    stargazers: json,
                    error: null,
                    isLoading: false,
                })
            }).catch(error => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                    error: error.message
                })
        })
    }

    renderList() {
        if (this.state.error) {
            return this.state.error
        }
        else if (this.state.stargazers) {
            if (this.state.stargazers instanceof Array) {
                return <ul>{this.state.stargazers.map((elem, index) =>
                    <li className="entry" key={index}>
                        <img src={elem.avatar_url} alt="avatar" height="50" width="50"/>
                        {elem.login}
                    </li>)}
                </ul>
            }
            else return this.state.stargazers.message
        }
        else {
            return "Loading data from github.."
        }
    }

    render() {
        return <div className="example">
                <div className="header">Async Request & Pull Down to Refresh</div>
                <IScroll ref="iscroll" iScroll={iscroll} wrapperStyle={{bottom:50}} dynamicTop
                    pullDownToRefresh={{onRefresh: this.fetchStargazers}}>
                    {this.renderList()}
                </IScroll>
                <div className="footer">
                    <a href="https://github.com/swenyang/react-iscroll" target="_blank">{
                        this.state.isLoading ? "Now loading.." : "Done"}
                    </a>
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
