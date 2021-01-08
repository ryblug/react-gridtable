import './App.css';
import Table from './components/table'

function App() {
  const rowCount = 6
  const cellPerRow = 6
  const cells = Array.from({ length: rowCount * cellPerRow }, () => false)
  return (
    <div className="App">
      <Table cells={cells} cellPerRow={cellPerRow} rowCount={rowCount} />
    </div>
  )
}

export default App;
