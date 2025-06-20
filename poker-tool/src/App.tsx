import './App.css'
import { RangeDisplay } from './components/Range'
import { createDefaultRange } from './range_mgr/utils'

function App() {
  return (
    <>
      <RangeDisplay tileSize={60} range={createDefaultRange()} rangeMode="SQUARE" />
    </>
  )
}

export default App
