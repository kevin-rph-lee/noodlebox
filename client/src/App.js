
import './App.css';
import axios from 'axios'


function App() {

  const cookieTest = async e => {
    e.preventDefault();
    try {
      const body = 'test';
      const response = await axios.post('/users', body, {withCredentials: true})
      localStorage.setItem("test", "test");
      console.log('success!')
    } catch (err) {
      console.error(err.message);
    }
  };

  return (



    <div className="App">
      <header className="App-header">
        <button onClick={cookieTest}>Cookietest</button>
      </header>
    </div>
  );
}

export default App;
