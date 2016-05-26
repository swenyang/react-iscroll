import React, { Component, PropTypes } from "react"
import {wrapFunc, getOffset} from "./utils"
import "./IScroll.less"

const iScrollEventsMap = [
    ["beforeScrollStart", "onBeforeScrollStart"],
    ["scrollCancel", "onScrollCancel"],
    ["scrollStart", "onScrollStart"],
    ["scroll", "onScroll"],
    ["scrollEnd", "onScrollEnd"],
    ["flick", "onFlick"],
    ["zoomStart", "onZoomStart"],
    ["zoomEnd", "onZoomEnd"]
]

let defaultIScrollOptions = {}

/**
 * set default iScroll options for massive usage convenience
 * @param options see http://iscrolljs.com/
 */
export const setDefaultIScrollOptions = (options) => {
    Object.assign(defaultIScrollOptions, options)
}

class IScroll extends Component {
    // reference to iscroll instance
    _iScroll

    // the iscroll options
    _options = {}

    // touchend listener is used for PullDownToRefresh
    _listenToTouchEnd = false

    constructor(props) {
        super(props)

        Object.assign(this._options, defaultIScrollOptions, props.options)
        if (props.pullDownToRefresh) {
            this._options.probeType = 2
        }

        this.state = {
            pullDownActive: false,
            pullDownVisible: false,
        }
        this.onScroll = this.onScroll.bind(this)
        this.onTouchEnd = this.onTouchEnd.bind(this)
        this.onScrollStart = this.onScrollStart.bind(this)
    }

    /**
     * Since IScroll don't know children updated or not, you might need to call this function manually.
     * e.g. on async data loaded, or on children's state changed
     * TODO: should be called automatically on needed, manual call is inconvenient
     */
    updateIScroll() {
        let wrapper = this.refs.wrapper
        let scroller = this.refs.scroller
        if (wrapper && scroller) {
            const {props} = this

            // apply wrapper's dynamic properties
            if (props.dynamicTop) {
                wrapper.style.top = getOffset(wrapper.parentNode).top + "px"
            }
            if (props.dynamicBottomFunc) {
                wrapper.style.bottom = props.dynamicBottomFunc() + "px"
            }

            if (props.alwaysScroll) {
                scroller.style.minHeight = (wrapper.clientHeight + 1) + "px"
            }

            // If iscroll instance exists, just update
            if (this._iScroll) {
                this._iScroll.refresh()
                return
            }
            // Create new iscroll instance here
            this._iScroll = new props.iScroll(wrapper, this._options)

            // Register listeners for events
            iScrollEventsMap.map(elem => {
                if (props[elem[1]]) {
                    this._iScroll.on(elem[0], wrapFunc(props[elem[1]]))
                }
            })

            // If PullDownToRefresh is enabled, we need to register more listeners
            if (props.pullDownToRefresh) {
                this._iScroll.on("scrollStart", wrapFunc(this.onScrollStart))
                this._iScroll.on("scroll", wrapFunc(this.onScroll))
                //this._iScroll.on("scrollEnd", wrapFunc(this.onScroll))
            }
        }
    }

    /**
     * expose a function to get iScroll instance
     * @returns {*}
     */
    get iScrollInstance() {
        return this._iScroll
    }

    onScrollStart() {
        if (!this._listenToTouchEnd) {
            this._listenToTouchEnd = true
            document.documentElement.addEventListener("touchend", this.onTouchEnd)
        }
    }

    /**
     * on iscroll scroll event, we update the PullDownToRefresh component's state and position
     * @param iScrollInstance
     */
    onScroll(iScrollInstance) {
        const {pullDownToRefresh} = this.props
        let appearDistance = pullDownToRefresh.appearDistance || 20
        let activeDistance = pullDownToRefresh.activeDistance || 55

        let pullDownVisible = iScrollInstance.y >= appearDistance
        let pullDownActive = iScrollInstance.y >= activeDistance

        if (this.state.pullDownActive !== pullDownActive || this.state.pullDownVisible !== pullDownVisible) {
            this.setState({
                pullDownVisible,
                pullDownActive,
            })
        }
        let pullDown = this.refs.pullDown
        if (pullDown) {
            pullDown.style.top = (iScrollInstance.y - pullDown.clientHeight - 5) + "px"
        }
    }

    onTouchEnd() {
        if (this.state.pullDownActive) {
            this.props.pullDownToRefresh.onRefresh()
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
                pullDownToRefresh.labelInactive = pullDownToRefresh.labelInactive || <div>Pull down to refresh..</div>
                pullDownToRefresh.labelActive = pullDownToRefresh.labelActive || <div>Release to refresh..</div>
            }

            let label
            if (this.state.pullDownActive) {
                label = pullDownToRefresh.labelActive
            }
            else {
                label = pullDownToRefresh.labelInactive
            }
            return <div style={{position:"relative"}}>
                <div id="pull-down" ref="pullDown">{label}</div>
            </div>
        }
        return null
    }

    render() {
        const {children, wrapperStyle} = this.props

        return <div className="react-iscroll">
                <div id="wrapper" ref="wrapper" style={wrapperStyle}>
                    <div id="scroller" ref="scroller">
                    {children}
                    </div>
                </div>
                {this.renderPullDown()}
        </div>
    }
}

IScroll.propTypes = {
    iScroll: PropTypes.func.isRequired,
    options: PropTypes.object,
    children: PropTypes.node,

    // iscroll events
    onBeforeScrollStart: PropTypes.func,
    onScrollCancel: PropTypes.func,
    onScrollStart: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollEnd: PropTypes.func,
    onFlick: PropTypes.func,
    onZoomStart: PropTypes.func,
    onZoomEnd: PropTypes.func,

    // On mobile devices, sometimes we wish user can always scroll,
    // even the scroller's height is smaller than the wrapper's.
    // However, iscroll itself doesn't provide this option,
    // thus we dynamically set scroller's height to slightly bigger than wrapper's height
    // default: true
    alwaysScroll: PropTypes.bool,

    // Calculate the wrapper's top dynamically
    // default: true
    dynamicTop: PropTypes.bool,

    // Calculate the wrapper's bottom dynamically,
    // since we can't use the wrapper's height for calculation, so I exposed a function
    // notes: because IScroll is mounted before the parent,
    // if you want to use this feature, make sure to call updateIScroll() when parent is mounted,
    // just like the async load
    dynamicBottomFunc: PropTypes.func,

    // If wrapper's position is static, provide here..
    wrapperStyle: PropTypes.shape({
        top: PropTypes.number,
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
    }),

    // If you want to enabled PullDownToRefresh feature,
    // ensure the iScroll prop you passed is "iscroll-probe"
    pullDownToRefresh: PropTypes.shape({
        // you can customize the PullDownToRefresh labels
        labelInactive: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        labelActive: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        // PullDownToRefresh label appears when iscroll's y distance bigger than this value
        appearDistance: PropTypes.number,
        // PullDownToRefresh active label appears when iscroll's y distance bigger than this value
        activeDistance: PropTypes.number,
        // onRefresh func
        onRefresh: PropTypes.func.isRequired,
    }),
}

IScroll.defaultProps = {
    alwaysScroll: true,
    dynamicTop: false,
}

export default IScroll