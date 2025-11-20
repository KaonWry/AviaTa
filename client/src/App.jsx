import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/greeting')
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error('Error fetching data:', err));
    
    fetch('http://localhost:3001/api/username')
      .then((res) => res.json())
      .then((data) => setUsername(data.message))
      .catch((err) => console.error('Error fetching username:', err));
  }, []);

  return (
    <div className="App">
      <h1>Full Stack App</h1>
      <p>Your name: {username || 'Loading...'}</p>
      <p>Backend Message: {data || 'Loading...'}</p>
    </div>
  );
}

export default App;