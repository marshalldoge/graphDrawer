import React, {Component} from "react";
import {Row, Col, Typography} from 'antd';
import 'antd/dist/antd.css';
import './_RawMatrix.scss';



class RawMatrix extends Component {

	state = {
		isMobile: window.innerWidth<480
	};

	Title = value => {
		return (
			 <div className={"title"}>
				 {value}
			 </div>
		);
	};

	Cell = (value,type) => {
		return (
			 <div className={"cell "+(type?type:"")}>
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
		let lenght = this.props.data.length;
		let cnt = 0;
		let type="bold";
		for(let i = 0; i < lenght; i++) {
			let nodes = [];
			for(let j = 0; j < this.props.data[i].length; j++) {
				if(i===0 || j===0 || i === lenght-1 || j===this.props.data[i].length-1){
					type="bold";
				}else{
					type="";
				}
				if(j!==0 && j!==this.props.data[i].length-1){
					type+=" thin";
				}
				nodes.push(
					 <Col key={cnt}>
						 {this.Cell(this.props.data[i][j],type)}
					 </Col>
				);
				cnt++;
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
		if(this.state.isMobile) {
			console.log("Is mobile matrix!");
			return (
				 <div className={"matrixMobileCtn"}>
					 <div className={"matrixMobileInnerCtn"}>
						 <Row type="flex" justify="center" align="middle">
							 <Col>
								 {this.Container()}
							 </Col>
						 </Row>
					 </div>
				 </div>
			);
		}else{
			return (
				 <Row className="RawMatrixCtn" type="flex" justify="center" align="middle">
					 <Col>
						 {this.Container()}
					 </Col>
				 </Row>
			);
		}
	}
}

export default RawMatrix;
