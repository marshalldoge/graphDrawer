import React, {Component} from "react";
import {Row, Col, Typography} from 'antd';
import 'antd/dist/antd.css';
import './_Node.scss';



class Node extends Component {

	nodeStyles = {
		position: "absolute",
		left: this.props.x,
		top: this.props.y,
		width: this.props.radius+"px",
		height: this.props.radius+"px"
	};

	startEdge = (e) => {
		console.log("Startign edge");
		e.stopPropagation();
	};

	endEdge = (e) => {
		console.log("Ending edge");
		e.stopPropagation();
	};

	render() {
		console.log("Node being created: with posotion: ",this.props.x,"-",this.props.y);
		return (
			 <div
				  style={this.nodeStyles}
				  className={"node"}
				  onMouseDown={this.startEdge}
				  onMouseUp={this.endEdge}
			 >
				 <p>{this.props.index}</p>
			 </div>
		);
	}
}

export default Node;
