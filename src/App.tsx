import { useState } from 'react'
import './App.css'
import { Toggle } from "@sb-labs/basic-components/dist"
import { MemoryRouter, Routes, Route, Navigate} from "react-router"
import { Front, Blog, Crypto, Projects, Art, Page } from "./components/"
/* Blog */
import { HelloWebpage } from './components/'
/* Crypto */
import { DigitalAssets, TODO } from './components/'
/* Projects */

/* Art */
import { StevesTees } from './components/'
function App() {

  const [theme, setTheme] = useState("light")

  return (
    <div className={`root ${theme}`}>
      <div className={`App `}>
        <div className='toggle-box'><Toggle id="toggle" active={theme === "light" ?  false : true} theme={ theme } onClick={() => {setTheme(theme === "light" ? "dark" : "light") }}/></div>
        <br/>
        <br/>
        
        <MemoryRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Navigate to="/front/blog"/>} />
              <Route path="front" element ={<Front theme={theme}/>}>
                  <Route path="blog" element={<Blog/>} />
                  <Route path='crypto' element={<Crypto/>} />
                  <Route path='projects' element={<Projects/>} />
                  <Route path='art' element={<Art/>} />
              </Route>
              <Route path="page">
                {/* Blog */}
                <Route path="Hello Webpage" element={<Page title="Hello Webpage" date="2023 Oct 2 " content={<HelloWebpage/>}/>}/>
                {/* Crypto*/}
                <Route path="TODO" element={<Page title="TODO" date="2023 Oct 12" content={<TODO/>}/>}/>
                <Route path="Digital Assets" element={<Page title="Digital Assets" date="2023 Oct 9" content={<DigitalAssets/>}/>}/>
                {/* Projects*/}
                {/* Art */}
                <Route path="Steves' Tees" element={<Page title="Steves' Tees" date="2023 Oct 9" content={<StevesTees theme={theme}/>}/>}/>
              </Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </div>
    </div>
  )
}

export default App
