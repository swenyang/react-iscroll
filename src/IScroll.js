import React, { Component, PropTypes } from "react"
import {wrapFunc, getOffset} from "./utils"
import "./IScroll.less"

const eventsMap = [
    ["beforeScrollStart", "onBeforeScrollStart"],
    ["scrollCancel", "onScrollCancel"],
    ["scrollStart", "onScrollStart"],
    ["scroll", "onScroll"],
    ["scrollEnd", "onScrollEnd"],
    ["flick", "onFlick"],
    ["zoomStart", "onZoomStart"],
    ["zoomEnd", "onZoomEnd"]
]

class IScroll extends Component {
    _iScroll
    _options = {}
    _listenToTouchEnd = false

    constructor(props) {
        super(props)
        let probeType
        if (props.pullDownToRefresh) {
            probeType = 2
        }
        this._options = Object.assign({
            scrollbars: true,
            mouseWheel: true,
            shrinkScrollbars: "scale",
            fadeScrollbars: true,
            click: true,
            probeType,
        }, props.options)
        this.state = {
            pullDownActive: false,
            pullDownVisible: false,
        }
        this.onScroll = this.onScroll.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onScrollStart = this.onScrollStart.bind(this)
    }

    updateIScroll() {
        let wrapper = this.refs.wrapper
        let scroller = this.refs.scroller
        if (wrapper && scroller) {
            //console.log("update iscroll")
            let offset = getOffset(wrapper.parentNode)
            console.log(offset)
            wrapper.style.top = offset.top + "px"
            //wrapper.style.bottom = offset.bottom + "px"
            scroller.style.minHeight = (wrapper.clientHeight + 1) + "px"
            if (this._iScroll) {
                //this._iScroll.destroy()
                //this._iScroll = undefined
                this._iScroll.refresh()
                return
            }
            this._iScroll = new this.props.iScroll(wrapper, this._options)
            eventsMap.map(elem => {
                if (this.props[elem[1]]) {
                this._iScroll.on(elem[0], wrapFunc(this.props[elem[1]]))
            }
        })
            if (this.props.pullDownToRefresh) {
                this._iScroll.on("scrollStart", wrapFunc(this.onScrollStart))
                this._iScroll.on("scroll", wrapFunc(this.onScroll))
                //this._iScroll.on("scrollEnd", wrapFunc(this.onScrollEnd))
            }
        }
    }

    onScrollStart() {
        if (!this._listenToTouchEnd) {
            this._listenToTouchEnd = true
            document.documentElement.addEventListener("touchend", this.onTouchEnd)
        }
    }

    onScroll(instance) {
        //console.log("srcoll ", instance.y)
        const {pullDownToRefresh} = this.props
        let showDistance = pullDownToRefresh.showDistance || 40
        let activeDistance = pullDownToRefresh.activeDistance || 110
        let pullDownActive = false, pullDownVisible = false
        if (instance.y >= showDistance) {
            pullDownVisible = true
        }
        if (instance.y >= activeDistance) {
            pullDownActive = true
        }
        if (this.state.pullDownActive !== pullDownActive || this.state.pullDownVisible !== pullDownVisible) {
            this.setState({
                pullDownVisible,
                pullDownActive,
            })
        }
        let pullDown = this.refs.pullDown
        if (pullDown) {
            pullDown.style.top = (instance.y - showDistance) + "px"
        }
    }

    onTouchEnd() {
        //console.log("touchEnd ")
        if (this.state.pullDownActive) {
            this.props.pullDownToRefresh.refresh()
        }
        this.setState({
            pullDownVisible: false,
            pullDownActive: false,
        })
    }

    componentDidMount() {
        this.updateIScroll()
    }

    componentWillUnmount() {
        if (this._iScroll) {
            this._iScroll.destroy()
            this._iScroll = null
        }
        if (this._listenToTouchEnd) {
            this._listenToTouchEnd = false
            document.documentElement.removeEventListener("touchend", this.onTouchEnd)
        }
    }

    renderPullDown() {
        if (this.state.pullDownVisible) {
            const {pullDownToRefresh} = this.props
            if (pullDownToRefresh) {
                pullDownToRefresh.labelInactive = pullDownToRefresh.labelInactive || <div id="pull-down" ref="pullDown">Pull down to refresh..</div>
                pullDownToRefresh.labelActive = pullDownToRefresh.labelActive || <div id="pull-down" ref="pullDown">Release to refresh..</div>
            }

            let label
            if (this.state.pullDownActive) {
                label = pullDownToRefresh.labelActive
            }
            else {
                label = pullDownToRefresh.labelInactive
            }
            return <div style={{position:"relative"}}>
                {label}
            </div>
        }
        return null
    }

    render() {
        const {children} = this.props

        return <div className="react-iscroll">
                <div id="wrapper" ref="wrapper">
                    <div id="scroller" ref="scroller">
                    {children}
                    </div>
                </div>
                {this.renderPullDown()}
        </div>
    }
}

IScroll.propTypes = {
    iScroll: PropTypes.any.isRequired,
    children: PropTypes.node,
    options: PropTypes.object,
    dynamicTop: PropTypes.bool, /**/

    onBeforeScrollStart: PropTypes.func,
    onScrollCancel: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollEnd: PropTypes.func,
    onFlick: PropTypes.func,
    onZoomStart: PropTypes.func,
    onZoomEnd: PropTypes.func,
    pullDownToRefresh: PropTypes.shape({
        labelInactive: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        labelActive: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        showDistance: PropTypes.number,
        activeDistance: PropTypes.number,
        refresh: PropTypes.func.isRequired,
    })
}

export default IScroll