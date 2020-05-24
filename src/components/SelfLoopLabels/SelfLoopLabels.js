import React, {Component} from "react";
import {Row, Col, Typography} from 'antd';
import 'antd/dist/antd.css';
import './_SelfLoopLabels.scss';



class SelfLoopLabels extends Component {

	state = {
	};

	labelStyles = (labelData) => {
		return {
			position: "absolute",
			left: labelData.x,
			top: labelData.y,
			width: "10px",
			height: "20px"
		};
	};

	startEdge = (e) => {
		console.log("Startign edge");
		e.stopPropagation();
	};

	endEdge = (e) => {
		console.log("Ending edge");
		e.stopPropagation();
	};

	label = (labelData) => {
		return (
			 <div key={labelData.x+"_"+labelData.y} className={"selfLoopLabelCtn"} style={this.labelStyles(labelData)}>
			    <p>{labelData.label}</p>
			 </div>
		);
	};

	labels = () => {
		let me = this;
		let labels = [];
		for(let i = 0; i < this.props.data.length; i++) {
			labels.push(this.label(this.props.data[i]))
		}
		return labels;
	};

	render() {
		let me = this;
		//console.log("Label being created: with posiotion: ",this.props.x,"-",this.props.y);
		return (
			 <div>
				 {me.labels()}
			 </div>
		);
	}
}

export default SelfLoopLabels;
