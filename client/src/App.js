import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import CalcPage from './CalcPage';
import SplashPage from './SplashPage';

function App() {
  return (
	<Router>
		<div className="App">
		  <header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<Link to="/">Home</Link>
			<Link to="/calc">Calculator</Link>
			<div>
				<Route exact path="/" component={SplashPage} />
				<Route exact path="/calc" component={CalcPage} />
			</div>
		  </header>
		</div>
	</Router>
  );
}

export default App;
