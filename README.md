# React-IScroll
Encapsulating iScroll as a react component

## [iScroll][]
iScroll is a high performance, small footprint, dependency free, multi-platform javascript scroller.

## [React][]
A declarative, efficient, and flexible JavaScript library for building user interfaces.

## React-IScroll
Since [iScroll][] doesn't provide [React][] version, I found it's very inconvenient to make iScroll work with React. So I decided to write a React component encapsulating iScroll.

## How to Use
Install from npm:
```js
npm i iscroll-react
```
Use React-IScroll in your project:
```js
import IScroll from "iscroll-react"
import React, { Component } from 'react'
import iscroll from "iscroll"

class SomeComponent extends Component {
	render() {
		return <IScroll iScroll={iscroll}>
			These contents can be scrolled.
		</IScroll>
	}
}
```

## Props
You can provide props for React-IScroll to use some features.
- `iScroll`

	*Required*, iScroll library, see [here](http://iscrolljs.com/#iscroll-versions) for different versions of iScroll. Remember that if you use pull-down-to-refresh feature, please provide `iscroll-probe.js`.

- `options`

	iScroll options, see [here](http://iscrolljs.com/#configuring) for all options. It's directly provided to iScroll. Note that if you are using pull-down-to-refresh feature, options will be appended an attribute: `probeType: 2`

	Since you may use React-IScroll many times in your project, setting iScroll options many times would be redundant. To simplify this, I added a `setDefaultIScrollOptions` function. Initialized once, iScroll will copy the default props on construct.

	```js
	import {setDefaultIScrollOptions}  from "iscroll-react"

	setDefaultIScrollOptions({
	    scrollbars: true,
	    mouseWheel: true,
	    shrinkScrollbars: "scale",
	    fadeScrollbars: true,
	    click: true,
	})
	```

- iScroll events

	iScroll itself provide some custom events, here I just wrapped them. All below events will be called with the iScroll instance, e.g. `onBeforeScrollStart(iScrollInstance)`, you can do whatever like reading iScroll properties or calling functions.
	- `onBeforeScrollStart` <= `beforeScrollStart`
	- `onScrollCancel` <= `scrollCancel`
	- `onScrollStart` <= `scrollStart`
	- `onScroll` <= `scroll`
	- `onScrollEnd` <= `scrollEnd`
	- `onFlick` <= `flick`
	- `onZoomStart` <= `zoomStart`
	- `onZoomEnd` <= `zoomEnd`

- `alwaysScroll`

	By setting this value to true, the scroller can be scrolled even the scroller's height is smaller than the wrappers. Default is `true`.

- `dynamicTop`

	Calculate the wrapper's top dynamically. Default is `false`.

- `dynamicBottomFunc`

	Calculate the wrapper's bottom dynamically, since we can't use the wrapper's height for calculation, so I exposed a function.

	*Notes: because React-IScroll is mounted before the parent, if you want to use this feature, make sure to call `updateIScroll()` when the parent is mounted.*

- `wrapperStyle`

	If your wrapper's position is static, using this option the fast set wrapper's CSS attributes: `top`, `bottom`, `left` and `right`. If not specified, all will be `0`.

	*Note that `top` and `bottom` might be override by `dynamicTop` and `dynamicBottomFunc`.*

- `pullDownToRefresh`

	If you want to use pull-down-to-refresh feature, set this value. This option has sub props:

	- `labelInactive`

		Node showed when scroller is pulled down but not active. You can provide either your React Component or simply a string.

	- `labelActive`

		Node showed when pulldown is active. Provide either a React Component or string.

	- `appearDistance`

		If scroller's pull-down distance exceeds this value, `labelInactive` will be showed. Default is `20`.

	- `activeDistance`

		If scroller's pull-down distance exceeds this value, `labelActive` will be showed. Default is `55`.

		*Notes: if you have set the page's viewport, the above two values should be adjusted to get best experience.*

	- `onRefresh`

		*Required*, When touch is released, this function will be called if the pulldown is active.

## Functions
- `IScroll.updateIScroll`

	Update iScroll by calling `iScrollInstance.refresh()` and calculate wrapper's positions. Since React-IScroll don't know children updated or not, you might need to call this function manually, e.g. on async data loaded, or on children's state changed.

	```js
	import IScroll from "iscroll-react"
	import React, { Component } from 'react'
	import iscroll from "iscroll"

	class SomeComponent extends Component {
	    componentDidUpdate() {
	        if (this.refs.iscroll) {
	            this.refs.iscroll.updateIScroll()
	        }
	    }

		render() {
			return <IScroll iScroll={iscroll} ref="iscroll">
				These contents can be scrolled.
			</IScroll>
		}
	}
	```

- `IScroll.iScrollInstance`

    Used to get the iScroll instance, if initialized.

- `setDefaultIScrollOptions`

	As is explained above, it's used to set iScroll's default options.

## Examples
Clone this repo and run `npm run examples`, then navigate to <http://localhost:8080/> to see examples.
- Basic Scroll
- Always Scroll
- Dynamic Top
- Dynamic Bottom
- Scroller's Height Changes
- Async Request & Pull Down to Refresh

[iScroll]: http://iscrolljs.com/
[React]: https://github.com/facebook/react/