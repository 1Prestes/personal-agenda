import ReactDOM from 'react-dom/client'
import {
  RouterProvider
} from 'react-router-dom'
import { Provider } from 'react-redux'
import 'antd/dist/reset.css'

import { store } from './store/store'
import { Router } from './Router'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
)
