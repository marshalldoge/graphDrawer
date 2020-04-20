import React, {Component} from "react";
import {Row, Col, Button, Typography, message, Menu, Layout, Radio} from 'antd';
import {
    ArrowsAltOutlined,
    DeleteOutlined,
    DribbbleOutlined,
    HeatMapOutlined,
    HighlightOutlined,
    PlayCircleOutlined,
    RadarChartOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Graph } from "react-d3-graph";
import 'antd/dist/antd.css';
import Modal from 'react-modal';
import './_Board.scss';
import { johnson } from '../../algorithms/johnson';
import { asignacion } from '../../algorithms/asignacion';
import { noroeste } from '../../algorithms/noroeste';

const { Title } = Typography;
const Matrix = React.lazy(() => import("../../components/Matrix/Matrix"));
const SelfLoopLabels = React.lazy(() => import("../../components/SelfLoopLabels/SelfLoopLabels"));
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Board extends Component {

	state = {
		nodes:[],
		inputType: "node",
		nodeRadius: 200,
		data: {
			nodes: [{ id: "0",x: window.innerWidth/6 - 40, y: window.innerHeight/4 - 40, left: 0, right: 0 }],
			links: [],
		},
		nodesPosition: [{ id: "0",x: window.innerWidth/2 - 40, y: window.innerHeight/2 - 40 }],
		lastNodeIndex: 0,
		selfLoopLabels: [],
		lastActionType: null,
		actionHistory: [],
		linkSource: null,
		linkTarget: null,
		isAddLinkLabelModalOpen: false,
		isMaxOrMinModalOpen: false,
		isNodeInputModalOpen: false,
		//isAddNodeLabelModalOpen
		clickedLink: null,
		clickedNode: null,
		addLabelInputValue: "",
		directed: true,
		isMobile: window.innerWidth<480,
		graphMap: {
			"0": {}
		},
		erasedNodes: false,
		animationState: 0,
		collapsed: false,
		algorithmPicked: "jhonson",
		maximizeAlgorithm: true,
		isMessageModalOpen: false,
		messageText: "",
		nodeInputModalName: "",
		nodeInputModalValue: ""
	};

	//Hide or Show the sider
	onCollapse = collapsed => {
		console.log(collapsed);
		this.setState({ collapsed });
	};

	// Function that receives a node and returns a JSX view.
	viewGenerator = node => {
		let nodeColor;
		let nodeCtn, bottomCtn, nodeId, leftBlock, rightBlock;
		switch (this.state.algorithmPicked) {
			case "jhonson":
				nodeColor = node.color ? node.color : "#f6edcf";
				nodeCtn = {
					borderRadius: "40px",
					width: "60px",
					height: "60px",
					backgroundColor: nodeColor,
					fontSize: "15px"
				};
				bottomCtn = {
					width: "60px",
					height: "30px",
					minHeight: "40px",
					textAlign: "center",
				};

				leftBlock = {
					width: "50%",
					/*float: left;*/
					display: "inline-block",
					borderTopStyle: "solid",
					borderColor: "black transparent transparent transparent",
					borderStyle: "solid solid solid solid",
					borderWidth: "1px 0 0 0"
				};

				rightBlock = {
					width: "50%",
					/*float: left;*/
					display: "inline-block",
					borderTopStyle: "solid",
					borderColor: "black transparent transparent black",
					borderStyle: "solid solid solid solid",
					borderWidth: "1px 0 0 1px"
				};

				nodeId = {
					width: "100%",
					height: "30px",
					textAlign: "center",
					paddingTop: "8px"
				};

				let leftValue = node.left !== undefined ? node.left : "NULL";
				let rightValue = node.right !== undefined ? node.right : "NULL";
				//console.log("Drawing: ", node.id, " L: ", node.left, "R: ",node.right);
				return (
					 <div style={nodeCtn}>
						 <div style={nodeId}>
							 {node.id}
						 </div>
						 <div style={bottomCtn}>
							 <div style={leftBlock}>
								 {leftValue}
							 </div>
							 <div style={rightBlock}>
								 {rightValue}
							 </div>
						 </div>
					 </div>
				);
				break;
			case "asignation":
				nodeColor = node.color ? node.color : "#f6edcf";
				nodeCtn = {
					borderRadius: "40px",
					width: "60px",
					height: "60px",
					backgroundColor: nodeColor,
					fontSize: "15px"
				};
				nodeId = {
					width: "100%",
					height: "30px",
					textAlign: "center",
					paddingTop: "8px"
				};
				return (
					 <div style={nodeCtn}>
						 <div style={nodeId}>
							 {node.id}
						 </div>
					 </div>
				);
				break;
			case "noroeste":
				nodeColor = node.color ? node.color : "#f6edcf";
				nodeCtn = {
					borderRadius: "40px",
					width: "60px",
					height: "60px",
					backgroundColor: nodeColor,
					fontSize: "15px"
				};
				bottomCtn = {
					width: "60px",
					height: "30px",
					minHeight: "40px",
					textAlign: "center",
					borderColor: "black transparent transparent transparent",
					borderStyle: "solid solid solid solid",
					borderWidth: "1px"
				};

				nodeId = {
					width: "100%",
					height: "30px",
					textAlign: "center",
					paddingTop: "8px"
				};

				let nodeInputModalName = node.nodeInputModalName !== undefined ? node.nodeInputModalName : "";
				let nodeInputModalValue = node.nodeInputModalValue !== undefined ? node.nodeInputModalValue : "";
				//console.log("Drawing: ", node.id, " L: ", node.left, "R: ",node.right);
				return (
					 <div style={nodeCtn}>
						 <div style={nodeId}>
							 {nodeInputModalName}
						 </div>
						 <div style={bottomCtn}>
							 {nodeInputModalValue}
						 </div>
					 </div>
				);
				break;
		}

	};

	myConfig = {
		//nodeHighlightBehavior: true,
		linkHighlightBehavior: true,
		automaticRearrangeAfterDropNode: true,
		directed: this.state.directed,
		staticGraph: true,
		maxZoom: 8.0,
		d3: {
			alphaTarget: 0.05,
			gravity: -500,
			linkLength: 200,
			linkStrength: 2
		},
		node: {
			size: 900,
			fontSize: 20,
			fontColor: "#3C4655",
			highlightStrokeColor: "#2E4052",
			highlightFontSize: 20,
			highlightFontWeight: "bolder",
			renderLabel: false,
			cx: 200,
			cy:200,
			viewGenerator: this.viewGenerator,
		},
		link: {
			highlightColor: "lightblue",
			renderLabel: true,
			fontWeight: "normal",
			fontSize: 13,
			strokeWidth: 6,
			highlightStrokeColor: "#3C4655",
			type: "CURVE_SMOOTH"
		},
		height: 500,
		width: window.innerWidth*0.95
	};

	// Get actual index in array of some node Id
	getNodeIndex = nodeId => {
		let length = this.state.data.nodes.length;
		for( let  i = 0; i < length; i++) {
			if(this.state.data.nodes[i].id === nodeId) {
				return i;
			}
		}
	};
	getNodePositionIndex = nodeId => {
		let length = this.state.data.nodes.length;
		for( let  i = 0; i < length; i++) {
			if(this.state.nodesPosition[i].id === nodeId) {
				return i;
			}
		}
	};

	/**
	 * Play stopped animations.
	 */
	restartGraphSimulation = () => this.refs.graph.restartSimulation();

	/**
	 * If you have moved nodes you will have them restore theirs positions
	 * when you call resetNodesPositions.
	 */
	resetNodesPositions = () => this.refs.graph.resetNodesPositions();
	// graph event callbacks
	onClickGraph = () => {
		let me = this;
		/*
		me.setState ((prevState) =>{
			console.log("Crating new node");
			prevState.data.nodes.push(
				 {id: prevState.data.nodes.length.toString()}
			);
			prevState.lastActionType = "node";
			return prevState;
		});
		//me.resetNodesPositions();
		me.restartGraphSimulation();

		 */
	};

	onClickNode = (nodeId) => {
		let me = this;
		switch(this.state.inputType) {
			case "node":
			me.setState((prevState) => {
				switch (this.state.algorithmPicked) {
					case "jhonson":
						break;
					case "asignation":
						break;
					case "noroeste":
						this.setState({
							isNodeInputModalOpen: true,
							clickedNode: nodeId
						});
						break;
				}
				return prevState;
			});
			break;
			case "edge":
			console.log("Creating link");
			if(this.state.linkSource === null) {
				this.setState({linkSource:nodeId});
				me.setState ((prevState) =>{
					console.log("Crating new edge from ",nodeId);
					let length = prevState.data.nodes.length;
					for(let i = 0; i < length; i++) {
						if(prevState.data.nodes[i].id === nodeId) {
							prevState.data.nodes[i] = {
								...prevState.data.nodes[i],
								id: nodeId,
								color: "#446984",
								left: prevState.data.nodes[i].left,
								right: prevState.data.nodes[i].right
							};
						}
					}
					/*
					for(let i = 0; i < prevState.data.nodes.length; i++) {
						if(prevState.data.nodes[i].id === nodeId) {
							prevState.data.nodes[i]= {
								id: nodeId,
								color: "#446984"
							};
							break;
						}
					}
					 */

					prevState.lastActionType = "edge";
					return prevState;
				});
			} else {
				console.log("To: ", nodeId);
				me.setState((prevState) => {
					// Making the conection fro graphMap
					console.log("BEFORE graphMap: ", prevState.graphMap," with ",prevState.graphMap[parseInt(prevState.linkSource)]);
					console.log("Data: ",prevState.data);
					console.log("From ",prevState.linkSource," to ",nodeId);
					if (prevState.graphMap[parseInt(prevState.linkSource)][nodeId] === undefined) {


						prevState.graphMap[prevState.linkSource] = {
							...prevState.graphMap[prevState.linkSource],
							[nodeId]: true

						};

						console.log("AFTER graphMap: ", prevState.graphMap);

						//Creating the node for view
						prevState.data.nodes[prevState.linkSource] = {
							...prevState.data.nodes[prevState.linkSource],
							id: prevState.linkSource,
							left: prevState.data.nodes[prevState.linkSource].left,
							right: prevState.data.nodes[prevState.linkSource].right,
							color: "#f6edcf"
						};

						prevState.data.links.push(
							 {
								 source: prevState.linkSource,
								 target: nodeId,
								 label: "",
								 ro: ""
							 }
						);
						prevState.clickedLink = {
							source: prevState.linkSource,
							target: nodeId,
							ro: ""
						};
						prevState.lastActionType = "link";
						prevState.actionHistory.push("link");
						prevState.linkSource = null;
						prevState.isAddLinkLabelModalOpen = true;
					} else {
						message.error('The nodes are already connected!');
					}

					/*
					for(let i = 0; i < prevState.data.nodes.length; i++) {
						if(prevState.data.nodes[i].id === prevState.linkSource) {
							prevState.data.nodes[i]= {
								id: prevState.linkSource,
								color: "#C05D4F"
							};
							break;
						}
					}

					 */
					return prevState;
				}, me.restartGraphSimulation);
				me.restartGraphSimulation();
			}
			break;
			case "erase":
				console.log("Erasing node");
				me.setState((prevState) => {
					console.log("This is the nodes array: ",prevState.data.nodes);
					for(let i = 0; i < prevState.data.nodes.length; i++) {
						console.log("NodeId ",nodeId," ",typeof nodeId, " vs ",prevState.data.nodes[i].id, " ", typeof prevState.data.nodes[i].id);
						if(prevState.data.nodes[i].id === nodeId) {
							prevState.data.nodes.splice(i,1);
							break;
						}
					}
					console.log("This is the links array: ",prevState.data.links);
					prevState.data.links = prevState.data.links.filter(l => l.source !== nodeId && l.target !== nodeId);
					console.log("new data: ",prevState.data);

					for (let i = 0; i < prevState.selfLoopLabels.length; i++) {
						console.log("SelfLoopLabels NodeId ", nodeId, " ", typeof nodeId, " vs ", prevState.selfLoopLabels[i].id, " ", typeof prevState.selfLoopLabels[i].id);
						if (prevState.selfLoopLabels[i].id === nodeId) {
							prevState.selfLoopLabels.splice(i, 1);
							break;
						}
					}


					prevState.lastActionType = "erase";
					prevState.erasedNodes = true;
					return prevState;
				});
				break;
		}
	};

	onDoubleClickNode = function(nodeId) {
		window.alert(`Double clicked node ${nodeId}`);
	};

	onRightClickNode = function(event, nodeId) {
		console.log("OPEEEENNNN MODALLLLL!!!");
	};

	onMouseOverNode = function(nodeId) {
		window.alert(`Mouse over node ${nodeId}`);
	};

	onMouseOutNode = function(nodeId) {
		window.alert(`Mouse out node ${nodeId}`);
	};

	onClickLink = (source, target)  => {
		let me = this;
		this.setState(
			 {
				 isAddLinkLabelModalOpen: true,
				 clickedLink: {source: source, target: target}}
				 );
		//window.alert(`Clicked link between ${source} and ${target}`);
	};

	onRightClickLink = function(event, source, target) {
		window.alert(`Right clicked link between ${source} and ${target}`);
	};

	onMouseOverLink = function(source, target) {
		window.alert(`Mouse over in link between ${source} and ${target}`);
	};

	onMouseOutLink = function(source, target) {
		window.alert(`Mouse out link between ${source} and ${target}`);
	};

	onNodePositionChange = function(nodeId, x, y) {
		let me = this;
		console.log(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
		/*this.setState((prevState) => {
			let nodeId = prevState.data.nodes.length.toString();
			prevState.nodesPosition[me.getNodeIndex(nodeId)] =
				 {
					 x: x,
					 y: y
				 };
		});

		 */
		//window.alert(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
	};

	setTypeInput = (e,type) => {
		console.log("InputType: ",type);
		this.setState({inputType: type});
		this.restartGraphSimulation();
	};

	undoAction = (e) => {
		let me = this;
		if(this.state.actionHistory.length > 0){
			if (this.state.actionHistory[this.state.actionHistory.length-1] === "node") {
				me.setState((prevState) => {
					console.log("Undoing node: ",prevState.data.node);
					prevState.data.nodes.pop();
					prevState.actionHistory.pop();
					console.log("To new  node array: ",prevState.data.node);
					return prevState;
				});
			} else {
				me.setState((prevState) => {
					console.log("Undoing link: ",prevState.data.node);
					prevState.data.links.pop();
					prevState.actionHistory.pop();
					console.log("To new  node link: ",prevState.data.node);
					return prevState;
				});
			}
		}
		/*
		if(this.state.lastActionType) {
			if (this.state.lastActionType === "node") {
				me.setState((prevState) => {
					prevState.data.nodes.pop();
					return prevState;
				});
			} else {
				me.setState((prevState) => {
					prevState.data.links.pop();
					return prevState;
				});
			}
		}

		 */
	};

	runAnimation(commands) {
		let me = this;
		let animation = setInterval(function(){
			me.setState((prevState) => {
				console.log("Animating command",prevState.animationState);
				if (commands[prevState.animationState].type === "node") {
					let aux = {
						...prevState.data.nodes[commands[prevState.animationState].id],
						color: commands[prevState.animationState].color,
						left: commands[prevState.animationState].left ? commands[prevState.animationState].left : prevState.data.nodes[commands[prevState.animationState].id].left,
						right: commands[prevState.animationState].right ? commands[prevState.animationState].right : prevState.data.nodes[commands[prevState.animationState].id].right,
						nodes: prevState.data.nodes
					};

					//console.log("Node to draw PREV: ", aux);
					prevState.data.nodes[commands[prevState.animationState].id] = aux;
				}else {
					for (let j = 0; j < prevState.data.links.length; j++) {
						if (
							 prevState.data.links[j].source === commands[prevState.animationState].source.toString() &&
							 prevState.data.links[j].target === commands[prevState.animationState].target.toString()
						) {
							let newRo = commands[prevState.animationState].ro !== undefined ? commands[prevState.animationState].ro : (prevState.data.links[j].ro === "" ? 0 : prevState.data.links[j].ro);
							let newLabel = commands[prevState.animationState].label !== undefined ?  commands[prevState.animationState].label : prevState.data.links[j].label.split("(")[0];
							prevState.data.links[j] = {
								...prevState.data.links[j],
								label: newLabel + "(" + newRo + ")",
								color: commands[prevState.animationState].color
							}
						}
					}
				}
				prevState.animationState = prevState.animationState + 1;
				if(prevState.animationState === commands.length) clearInterval(animation);
				return prevState;
			} )

		}, 1000);
	};

	MessageProccesser = () => {
		let msgs = this.state.messageText.split('#');
		let res = [];
		for(let i = 0; i < msgs.length; i++) {
			if(i === 0){
				res.push(
					 <Row justify="center">
						 <Col span={24}>
							 <Row justify="center">
								 <p key={i} className={"messageModalTitle"}>{msgs[i]}</p>
							 </Row>
						 </Col>
					 </Row>
				);
			}else{
				res.push(
					 <Row justify="center">
						 <Col span={24}>
							 <Row justify="center">
								 <p key={i} className={"assignation"}>{msgs[i]}</p>
							 </Row>
						 </Col>
					 </Row>
				);
			}
		}
		return res;
	};


	callAlgorithm = () => {
		let me = this;
		let commands, nodesLength, length, matrix, maxOrMin, answer, message;
		switch (this.state.algorithmPicked) {
			case "jhonson":
				nodesLength = this.state.data.nodes.length;
				length = this.state.data.links.length;
				matrix = [];
				for(let i = 0; i < nodesLength; i++){
					let row = [];
					for(let j = 0; j < nodesLength; j++){
						row.push(0);
					}
					matrix.push(row);
				}
				console.log("empty matrix: ",matrix);
				for(let i = 0; i < length; i++) {
					matrix[this.state.data.links[i].source][this.state.data.links[i].target] = parseInt(this.state.data.links[i].label);
				}
				console.log("Filled matrix: ",matrix);
				/*
				let answer = johnson([[0,3,0,0,2,0],
					[0,0,7,6,0,0],
					[0,0,0,6,0,0],
					[0,0,0,0,0,3],
					[0,0,0,4,0,0],
					[0,0,0,0,0,0]]);
				 */
				commands = johnson(matrix);
				console.log("Andwer from Jhonson algorithm: ",commands);
				this.closeMaxOrMinModalOpen();
				this.runAnimation(commands);
				this.setState({erasedNodes: true});
				break;
			case "asignation":
				nodesLength = this.state.data.nodes.length;
				length = this.state.data.links.length;
				matrix = [];
				for(let i = 0; i < nodesLength; i++){
					let row = [];
					for(let j = 0; j < nodesLength; j++){
						row.push(0);
					}
					matrix.push(row);
				}
				console.log("empty matrix: ",matrix);
				for(let i = 0; i < length; i++) {
					matrix[this.state.data.links[i].source][this.state.data.links[i].target] = parseInt(this.state.data.links[i].label);
				}
				console.log("Filled matrix: ",matrix);
				/*
				let answer = johnson([[0,3,0,0,2,0],
					[0,0,7,6,0,0],
					[0,0,0,6,0,0],
					[0,0,0,0,0,3],
					[0,0,0,4,0,0],
					[0,0,0,0,0,0]]);
				 */
				maxOrMin = this.state.maximizeAlgorithm? "max":"min";
				console.log("Se va a ",maxOrMin," la solución");
				answer =  asignacion(matrix, maxOrMin);
				commands = answer["array"];
				message = answer["message"];
				console.log("Andwer from asignation algorithm: ",answer);
				this.closeMaxOrMinModalOpen();
				this.runAnimation(commands);
				this.setState({
					erasedNodes: true,
					messageText: message,
					isMessageModalOpen: true
				});
				break;
			case "noroeste":
				//noroeste
				nodesLength = this.state.data.nodes.length;
				length = this.state.data.links.length;
				matrix = [];
				for(let i = 0; i < nodesLength; i++){
					let row = [];
					for(let j = 0; j < nodesLength; j++){
						row.push(0);
					}
					matrix.push(row);
				}
				console.log("empty matrix: ",matrix);
				for(let i = 0; i < length; i++) {
					matrix[this.state.data.links[i].source][this.state.data.links[i].target] = parseInt(this.state.data.links[i].label);
				}
				console.log("Filled matrix: ",matrix);
				/*
				let answer = johnson([[0,3,0,0,2,0],
					[0,0,7,6,0,0],
					[0,0,0,6,0,0],
					[0,0,0,0,0,3],
					[0,0,0,4,0,0],
					[0,0,0,0,0,0]]);
				 */
				maxOrMin = this.state.maximizeAlgorithm? "max":"min";
				console.log("Se va a ",maxOrMin," la solución");
				answer =  noroeste(matrix,this.state.data.nodes, maxOrMin);
				commands = answer["array"];
				message = answer["message"];
				console.log("Andwer from asignation algorithm: ",answer);
				this.closeMaxOrMinModalOpen();
				//this.runAnimation(commands);
				this.setState({
					erasedNodes: true,
					messageText: message,
					isMessageModalOpen: true
				});

				break;
		}
	};

	runAlgorithm = () => {
		this.clearDirtyGraph();
		switch (this.state.algorithmPicked) {
			case "jhonson":
				this.setState({
					animationState: 0
				});
				this.callAlgorithm();
				break;
			case "asignation":
				this.setState({
					isMaxOrMinModalOpen: true,
					animationState: 0
				});
				break;
			case "noroeste":
				this.setState({
					isMaxOrMinModalOpen: true,
					animationState: 0
				});
				break;
		}
	};

	clearDirtyGraph = () => {
		let me = this;
		me.setState((prevState) => {
			for(let i = 0; i < prevState.data.links.length; i++) {
				prevState.data.links[i].label = prevState.data.links[i].label.split("(")[0];
				prevState.data.links[i].color = "#f6edcf";
			}
			for(let i = 0; i < prevState.data.nodes.length; i++) {
				prevState.data.nodes[i].color = "#f6edcf";
			}
			return prevState;
		});
	};

	eraseAll = () => {
		let me = this;
		me.setState((prevState) => {
			prevState.data.links = [];
			prevState.data.nodes = [{ id: "0", left: 0, right: 0 }];
			prevState.graphMap = {
				"0": {}
			};
			prevState.selfLoopLabels = [];
			return prevState;
		});
	};

	eraseNode = () => {
		let me = this;
		me.setState((prevState) => {
			prevState.inputType = "erase";
			return prevState;
		});
	};

	createNode = (e) => {
		if(this.state.inputType === "node") {
			var rect = e.target.getBoundingClientRect();
			let x = e.clientX - rect.left;
			let y = e.clientY - rect.top;
			let me = this;
			me.setState((prevState) => {
				console.log("Crating new node");
				let nodeId =  (prevState.lastNodeIndex + 1).toString();
				prevState.lastNodeIndex = prevState.lastNodeIndex + 1;
				prevState.data.nodes.push(
					 {
						 id: nodeId,
						 x: x,
						 y: y,
						 left: 0,
						 right: 0
					 }
				);
				prevState.nodesPosition.push(
					 {
						 id: nodeId,
						 x: x,
						 y: y
					 }
				);
				prevState.lastActionType = "node";
				prevState.actionHistory.push("node");
				prevState.graphMap[nodeId] = {};
				console.log("Creating node, new array: ",prevState.data.nodes);
				return prevState;
			});
			me.restartGraphSimulation();
		}
	};

	ProcessedMatrix = () => {
		let hash = {};
		let nodesLength = this.state.data.nodes.length;
		let length = this.state.data.links.length;
		for(let i = 0; i < length; i++) {
			let hashValue =
				 this.getNodeIndex(this.state.data.links[i].source)*nodesLength+
				 this.getNodeIndex(this.state.data.links[i].target);
			hash[hashValue] = this.state.data.links[i].label.split("(")[0];
		}
		for(let i = 0; i < length; i++) {
			let inverseHashValue =
				 this.getNodeIndex(this.state.data.links[i].target)*nodesLength+
				 this.getNodeIndex(this.state.data.links[i].source);
			if(hash[inverseHashValue]===undefined && !this.state.directed)hash[inverseHashValue] = this.state.data.links[i].label.split("(")[0];
		}
		console.log("Graph map: ",this.state.graphMap);
		console.log("Hash: ",hash);

		return (
			 <Matrix
				  nodes={this.state.data.nodes}
				  edges={hash}
			 />
		);
	};

	closeAddLinkLabelModal = () => {
		this.setState({isAddLinkLabelModalOpen: false});
	};
	closeMaxOrMinModalOpen = () => {
		this.setState({isMaxOrMinModalOpen: false});
	};
	closeNodeInputModalOpen = () => {
		this.setState({isMaxOrMinModalOpen: false});
	};
	closeMessageModal = () => {
		this.setState({isMessageModalOpen: false});
	};
	handleChange = e => {
		let me = this;
		me.setState({addLabelInputValue: e.target.value});
	};
	handleInputNodeModalNameChange = e => {
		let me = this;
		me.setState({nodeInputModalName: e.target.value});
	};
	handleInputNodeModalValueChange = e => {
		let me = this;
		me.setState({nodeInputModalValue: e.target.value});
	};

	saveNodeInfo = () => {
		let me = this;
		me.setState((prevState) => {
			for(let i = 0; i < prevState.data.nodes.length; i++) {
				if(prevState.data.nodes[i].id === prevState.clickedNode) {
					prevState.data.nodes[i] = {
						...prevState.data.nodes[i],
						nodeInputModalName: prevState.nodeInputModalName,
						nodeInputModalValue: prevState.nodeInputModalValue
					}
				}
			}
			prevState.nodeInputModalName = "";
			prevState.nodeInputModalValue = "";
			prevState.isNodeInputModalOpen = false;
			return prevState;
		});
	};

	addLinkLabel = (e) => {
		let me = this;
		if (e.keyCode === 13) {
			console.log("Clicked enter!");
			console.log("This is the linked clicked: ",this.state.clickedLink);
			for (let i = 0; i < this.state.data.links.length; i++) {
				if (
					 this.state.data.links[i].target === this.state.clickedLink.target &&
					 this.state.data.links[i].source === this.state.clickedLink.source
				) {
					me.setState((prevState) => {

						//Self loop case
						if(prevState.clickedLink.target === prevState.clickedLink.source) {
							console.log("Self loop to be added to ",prevState.nodesPosition[this.getNodePositionIndex(prevState.clickedLink.target)]);
							console.log("In ",prevState.nodesPosition);
							prevState.selfLoopLabels.push(
								 {
									 id: prevState.clickedLink.target,
									 label: prevState.addLabelInputValue,
									 x: prevState.nodesPosition[this.getNodePositionIndex(prevState.clickedLink.target)].x-60,
									 y: prevState.nodesPosition[this.getNodePositionIndex(prevState.clickedLink.target)].y-8
								 }
							);
						}

						prevState.data.links[i].label = prevState.addLabelInputValue;
						prevState.isAddLinkLabelModalOpen = false;
						prevState.addLabelInputValue = "";
						prevState.clickedLink = null;


						return prevState;
					});
					break;
				}
			}
		}
	};
	addLinkLabelEnterButton = () => {
		let me = this;
		console.log("Clicked enter!");
		console.log("This is the linked clicked: ",this.state.clickedLink);
		for (let i = 0; i < this.state.data.links.length; i++) {
			if (
				 this.state.data.links[i].target === this.state.clickedLink.target &&
				 this.state.data.links[i].source === this.state.clickedLink.source
			) {
				me.setState((prevState) => {
					prevState.data.links[i].label = prevState.addLabelInputValue;
					prevState.isAddLinkLabelModalOpen = false;
					prevState.addLabelInputValue = "";
					prevState.clickedLink = null;
					return prevState;
				});
				break;
			}
		}
	};

	AddLinkLabelModal = () => {
		let me = this;
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)'
			}
		};
		return (
			 <Modal
				  isOpen={this.state.isAddLinkLabelModalOpen}
				  onRequestClose={this.closeAddLinkLabelModal}
				  style={customStyles}
				  contentLabel="Añadir arco"
				  ariaHideApp={false}
			 >
				 <Row>
					 <Col span={18}>
						 <input
							  className={"linkLabelInput"}
							  type="text"
							  value={this.state.addLabelInputValue}
							  onChange={this.handleChange}
							  placeholder={"Peso..."}
							  onKeyUp={this.addLinkLabel}
							  autoFocus
						 />
					 </Col>
					 <Col span={6}>
						 <div className={"enterButton"} onClick={this.addLinkLabelEnterButton}>
							 <p>Enter</p>
						 </div>
					 </Col>
				 </Row>
			 </Modal>
		);
	};

	AddNodeLabelModal = () => {
		let me = this;
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)'
			}
		};
		return (
			 <Modal
				  isOpen={this.state.isAddLinkLabelModalOpen}
				  onRequestClose={this.closeAddLinkLabelModal}
				  style={customStyles}
				  contentLabel="Add Edge"
				  ariaHideApp={false}
			 >
				 <Row>
					 <Col span={20}>
						 <input
							  className={"linkLabelInput"}
							  type="text"
							  value={this.state.addLabelInputValue}
							  onChange={this.handleChange}
							  placeholder={"Node Name..."}
							  onKeyUp={this.addLinkLabel}
							  autoFocus
						 />
					 </Col>
					 <Col span={4}>
						 <div className={"enterButton"}>
							 <p>Enter</p>
						 </div>
					 </Col>
				 </Row>
			 </Modal>
		);
	};

	Logo = () => {
		if(this.state.collapsed) {
			return (
				 <div className={"logoCtn"}>
					 <img className={"logoCollapsed"} src={require("../../assets/logos/logoCollapsed.png")}/>
				 </div>
			);
		} else {
			return (
				 <div className={"logoCtn"}>
					 <img className={"logo"} src={require("../../assets/logos/logo.png")}/>
				 </div>
			);
		}
	};

	MaxOrMinModal = () => {
		let me = this;
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)'
			}
		};
		return (
			 <Modal
				  isOpen={this.state.isMaxOrMinModalOpen}
				  onRequestClose={this.closeMaxOrMinModalOpen}
				  style={customStyles}
				  contentLabel="MAX or MIN"
				  ariaHideApp={false}
			 >
				 <Row justify="center">
					 <Col span={18}>
						 <p className={"modalQuestion"}>¿Quieres maximizar o minimizar?</p>
					 </Col>
				 </Row>
				 <Row justify="center">
					 <Col span={18}>
						 <Row justify="center">
						 <Radio.Group>
							 <Radio.Button value="minimize" onClick={() => this.setState({maximizeAlgorithm: false})}>Minimize</Radio.Button>
							 <Radio.Button value="maximize" onClick={() => this.setState({maximizeAlgorithm: true})}>Maximize</Radio.Button>
						 </Radio.Group>
						 </Row>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="center">
					 <Col span={18}>
						 <div className={"enterButton"} onClick={this.callAlgorithm}>
							 <p>Correr Algoritmo</p>
						 </div>
					 </Col>
				 </Row>
			 </Modal>
		);
	};

	MessageModal = () => {
		let me = this;
		const customStyles = {
			overlay: {
				backgroundColor: 'transparent'
			},
			content : {
				top                   : '30%',
				left                  : '80%',
				right                 : 'auto',
				bottom                : 'auto',
				//marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)',
				width                 : '300px'
			}
		};
		return (
			 <Modal
				  isOpen={this.state.isMessageModalOpen}
				  onRequestClose={this.closeMessageModal}
				  style={customStyles}
				  contentLabel="MAX or MIN"
				  ariaHideApp={false}
			 >
				 <Row justify="center">
					 <Col span={10}>
						 <p className={"modalQuestion"}>Respuesta</p>
					 </Col>
				 </Row>
				 {this.MessageProccesser()}
				 <br/>
				 <Row justify="center">
					 <Col span={18}>
						 <div className={"enterButton"} onClick={this.closeMessageModal}>
							 <p>Aceptar</p>
						 </div>
					 </Col>
				 </Row>
			 </Modal>
		);
	};

	NodeInputModal = () => {
		let me = this;
		const customStyles = {
			content : {
				top                   : '50%',
				left                  : '50%',
				right                 : 'auto',
				bottom                : 'auto',
				marginRight           : '-50%',
				transform             : 'translate(-50%, -50%)'
			}
		};
		return (
			 <Modal
				  isOpen={this.state.isNodeInputModalOpen}
				  onRequestClose={this.closeNodeInputModalOpen}
				  style={customStyles}
				  contentLabel="MAX or MIN"
				  ariaHideApp={false}
			 >
				 <Row justify="center">
					 <Col span={18}>
						 <p className={"modalQuestion"}>Introduzca los datos del nodo</p>
					 </Col>
				 </Row>
				 <Row justify="center">
					 <Col span={18}>
						 <Row justify="center">
							 <input
								  className={"linkLabelInput"}
								  type="text"
								  value={this.state.nodeInputModalName}
								  onChange={this.handleInputNodeModalNameChange}
								  placeholder={"Nombre"}
								  onKeyUp={this.addLinkLabel}
								  autoFocus
							 />
						 </Row>
						 <Row justify="center">
							 <input
								  className={"linkLabelInput"}
								  type="text"
								  value={this.state.nodeInputModalValue}
								  onChange={this.handleInputNodeModalValueChange}
								  placeholder={"Valor"}
								  onKeyUp={this.addLinkLabel}
							 />
						 </Row>
					 </Col>
				 </Row>
				 <br/>
				 <Row justify="center">
					 <Col span={18}>
						 <div className={"enterButton"} onClick={this.saveNodeInfo}>
							 <p>Guardar Nodo</p>
						 </div>
					 </Col>
				 </Row>
			 </Modal>
		);
	};

	setAlgorithmPicked = (e,alg) => {
		console.log("Algoritmo escogido: ",alg);
		this.setState({algorithmPicked: alg});
	};


	render() {
		return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    {this.Logo()}
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" onClick={e => this.setAlgorithmPicked(e,"jhonson")}>
                            <RadarChartOutlined />
                            <span>Jhonson</span>
                        </Menu.Item>
                        <Menu.Item key="2" onClick={e => this.setAlgorithmPicked(e,"asignation")}>
                            <HeatMapOutlined />
                            <span>Asignación</span>
                        </Menu.Item>
	                    <Menu.Item key="3" onClick={e => this.setAlgorithmPicked(e,"noroeste")}>
		                    <HeatMapOutlined />
		                    <span>NorOeste</span>
	                    </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout bodyCtn">
                    <Content style={{ margin: '0 16px' }}>
                        <div className={"mainCtn"}>
                            <Row type="flex" justify="space-around" align="middle">
                                <br/>
                            </Row>
                            <Row type="flex" justify="space-around" align="middle">
                                <Button type="normal" icon={<DribbbleOutlined />} size={'large'}
                                        onClick={e => this.setTypeInput(e,"node")}
                                        disabled={this.state.inputType === "node"}
                                >
                                   NODOS
                                </Button>
                                <Button type="normal" icon={<ArrowsAltOutlined />} size={'large'}
                                        onClick={e => this.setTypeInput(e,"edge")}
                                        disabled={this.state.inputType === "edge"}
                                >
                                    ARCOS
                                </Button>
                                <Button type="danger" icon={<ReloadOutlined />} size={'large'}
                                        onClick={this.undoAction}
                                        disabled={!this.state.lastActionType || this.state.erasedNodes}
                                >
                                    DESHACER
                                </Button>
                                <Button type="danger" icon={<HighlightOutlined />} size={'large'}
                                        onClick={this.eraseNode}
                                >
                                    BORRAR
                                </Button>
                                <Button type="danger" icon={<DeleteOutlined />} size={'large'}
                                        onClick={this.eraseAll}
                                >
                                    LIMPIAR
                                </Button>
                                <Button className={"runButton"} type="normal" icon={<PlayCircleOutlined />} size={'large'}
                                        onClick={this.runAlgorithm}
                                >
                                    INICIAR
                                </Button>
                            </Row>
                            <Row type="flex" justify="space-around" align="middle">
                                <Col span={23}>
                                    <div className={"board"}>
                                        <div className={"graphCtn"}>
                                            <Graph
                                                 ref="graph"
                                                 id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                                                 data={this.state.data}
                                                 config={this.myConfig}
                                                 onClickNode={this.onClickNode}
                                                 onRightClickNode={this.onRightClickNode}
                                                 onClickGraph={this.createNode}
                                                 onClickLink={this.onClickLink}
                                                 onRightClickLink={this.onRightClickLink}
                                                 onNodePositionChange={this.onNodePositionChange}
                                            />
                                            <SelfLoopLabels
                                                 data = {this.state.selfLoopLabels}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <br/>
                            <Row type="flex" justify="space-around" align="middle">

                                <h1 className={"boardTitle"}>Matriz de Adyacencia</h1>
                            </Row>
                            <Row type="flex" justify={this.state.isMobile? "start" :"space-around"} align="middle">
                                <Col justify={this.state.isMobile? "start" :"space-around"} span={15}>
                                    {this.ProcessedMatrix()}
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            {this.AddLinkLabelModal()}
	                        {this.MaxOrMinModal()}
	                        {this.MessageModal()}
	                        {this.NodeInputModal()}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>
        );
	}
}

export default Board;
