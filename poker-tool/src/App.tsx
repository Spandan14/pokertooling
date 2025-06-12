import './App.css'
import { RangeDisplay } from './components/Range'
import { createDefaultRange } from './range_mgr/utils'

function App() {
  return (
    <>
      <RangeDisplay range={createDefaultRange()} rangeMode="MOSAIC" />
    </>
  )
}

export default App
