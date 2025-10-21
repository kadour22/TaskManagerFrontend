import React from 'react'
import TaskManagerApp from './components/TaskManagerApp'
import AuthComponents from './components/AuthComponents'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthComponents/>}/>
        <Route path='/tasks' element={<TaskManagerApp/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App