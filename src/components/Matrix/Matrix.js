import React, {Component} from "react";
import {Row, Col, Typography} from 'antd';
import 'antd/dist/antd.css';
import './_Matrix.scss';



class Matrix extends Component {

	Title = value => {
		return (
			<div className={"title"}>
				{value}
			</div>
		);
	};

	Cell = value => {
		return (
			 <div className={"cell"}>
				 {value}
			 </div>
		)
	};

	TopTitle = () => {
		let rows = [];
		//console.log("Props: ",this.props);
		let empty = true;
		let nodes = [];
		for(let i = 0;i<this.props.nodes.length;i++) {
			nodes.push(
				 <Col key={i}>
					 {this.Title(this.props.nodes[i].id)}
				 </Col>
			);
		}
		rows.push(
			 <Row key={0} type="flex">
				 {nodes}
			 </Row>
		);
		return (
			 <div className={"topTitleCtn"}>
				 {rows}
			 </div>
		);
	};

	LeftTitle = () => {
		let rows = [];
		//console.log("Props: ",this.props);
		let empty = true;
		let nodes = [];
		nodes.push(
			 <Row key={"-1"}>
				 {this.Title("Nodes")}
			 </Row>
		);
		for(let i = 0;i<this.props.nodes.length;i++) {
			nodes.push(
				 <Row key={i}>
					 {this.Title(this.props.nodes[i].id)}
				 </Row>
			);
		}
		rows.push(
			 <Col key={0} type="flex">
				 {nodes}
			 </Col>
		);
		return (
			 <Row className={"leftTitleCtn"}>
				 {rows}
			 </Row>
		);
	};

	Container = () => {
		let rows = [];
		//console.log("Props: ",this.props);
		let empty = true;
		for(let i = 0;i<this.props.nodes.length;i++) {
			let nodes = [];
			for(let j = 0;j<this.props.nodes.length;j++) {
				let hashValue = i * this.props.nodes.length + j;
				let cellValue = this.props.edges[hashValue]? this.props.edges[hashValue] : "NO";
				nodes.push(
					 <Col key={hashValue}>
						 {this.Cell(cellValue)}
					 </Col>
				);
			}
			rows.push(
				 <Row key={i} type="flex">
					 {nodes}
				 </Row>
			);
		}

		return (
			<div className={"matrixCtn"}>
				{rows}
			</div>
		);
	};

	render() {
		//console.log("Node being created: with posotion: ",this.props.x,"-",this.props.y);
		return (
			 <Row type="flex" justify="center" align="middle">
				 <Col>
					 {this.LeftTitle()}
				 </Col>
				 <Col>
					 {this.TopTitle()}
					 {this.Container()}
				 </Col>
			 </Row>
		);
	}
}

export default Matrix;
