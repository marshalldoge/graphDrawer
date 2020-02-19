import React from 'react';
import 'antd/dist/antd.css';
import './App.scss';
import LoadingGif from './assets/gif/loading.gif';
const Board = React.lazy(() => import("./views/Board/Board"));
const Loading = () => {
	return (
		 <div style={{width:"100%",height:"100%",verticalAlign:"middle",textAlign:"center"}}>
			 <img src={LoadingGif} alt={"Cargando..."}/>
		 </div>
	);
};
function App() {
	return (
		 <React.Suspense fallback={Loading()}>
			<Board/>
		 </React.Suspense>
	);
}

export default App;
