import 'react-hot-loader/patch'

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import createStore from '/store/createStore'
import App from '/components/App'

const store = createStore()
const render = Component => {
	ReactDOM.render(
		<AppContainer>
			<Component store={store} />
		</AppContainer>,
		document.getElementById('root')
	)
}

// ws.addEventListener('open', () => console.info('Connected'))
// ws.addEventListener('close', () => console.info('Disconnected'))
// ws.addEventListener('message', )

render(App)

// Hot Module Replacement API
if (module.hot) {
	module.hot.accept(() => {
		render(App)
	})
}
