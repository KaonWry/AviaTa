import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/greeting')
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  return (
    <div className="App">
      <h1>Full Stack App</h1>
      <p>Backend Message: {data || 'Loading...'}</p>
    </div>
  );
}

export default App;