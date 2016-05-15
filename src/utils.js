/**
 * Since iscroll events are call with "this" pointing to iscroll instance,
 * here we wrap it with a function while keeping "this"
 * @param func
 * @returns {Function}
 */
export function wrapFunc(func) {
    return function() {
        func(this)
    }
}

/**
 * These three functions are used to get the element's offset,
 * reference from http://javascript.info/tutorial/coordinates
 * @param elem
 * @returns {{top: number, left: number}}
 * @private
 */
function _getOffsetSum(elem) {
    var top=0, left=0
    while(elem) {
        top = top + parseInt(elem.offsetTop)
        left = left + parseInt(elem.offsetLeft)
        elem = elem.offsetParent
    }

    return {top: top, left: left}
}

function _getOffsetRect(elem) {
    var box = elem.getBoundingClientRect()

    var body = document.body
    var docElem = document.documentElement

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft

    var clientTop = docElem.clientTop || body.clientTop || 0
    var clientLeft = docElem.clientLeft || body.clientLeft || 0

    var top  = box.top + scrollTop - clientTop
    var left = box.left + scrollLeft - clientLeft

    return { top: Math.round(top), left: Math.round(left) }
}

export function getOffset(elem) {
    if (elem.getBoundingClientRect) {
        return _getOffsetRect(elem)
    } else { // old browser
        return _getOffsetSum(elem)
    }
}