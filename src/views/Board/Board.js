import React, {Component} from "react";
import {Row, Col, Button, Typography, message} from 'antd';
import { Graph } from "react-d3-graph";
import 'antd/dist/antd.css';
import Modal from 'react-modal';
import './_Board.scss';

const { Title } = Typography;
const Matrix = React.lazy(() => import("../../components/Matrix/Matrix"));

class Board extends Component {

	state = {
		nodes:[],
		inputType: "node",
		nodeRadius: 200,
		data: {
			nodes: [{ id: "0",x: window.innerWidth/2 - 40, y: window.innerHeight/2 - 40 }],
			links: [],
		},
		lastActionType: null,
		actionHistory: [],
		linkSource: null,
		linkTarget: null,
		isAddLinkLabelModalOpen: false,
		//isAddNodeLabelModalOpen
		clickedLink: null,
		addLabelInputValue: "",
		directed: true,
		isMobile: window.innerWidth<480,
		graphMap: {
			"0": {}
		},
		erasedNodes: false
	};

	myConfig = {
		//nodeHighlightBehavior: true,
		linkHighlightBehavior: true,
		automaticRearrangeAfterDropNode: true,
		directed: this.state.directed,
		staticGraph: false,
		d3: {
			alphaTarget: 0.05,
			gravity: -500,
			linkLength: 200,
			linkStrength: 2
		},
		node: {
			color: "#C05D4F",
			size: 900,
			fontSize: 20,
			fontColor: "#3C4655",
			highlightStrokeColor: "#2E4052",
			highlightFontSize: 20,
			highlightFontWeight: "bolder",
			cx: 200,
			cy:200
		},
		link: {
			highlightColor: "lightblue",
			renderLabel: true,
			fontWeight: "normal",
			fontSize: 13,
			strokeWidth: 4,
			highlightStrokeColor: "#3C4655"
		},
		height: 500,
		width: window.innerWidth*0.95
	};

	//Get actual index in array of some node Id
	getNodeIndex = nodeId => {
		let length = this.state.data.nodes.length;
		for( let  i = 0; i < length; i++) {
			if(this.state.data.nodes[i].id === nodeId) {
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
								id: nodeId,
								color: "#446984"
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
					console.log("From ",prevState.linkSource," to ",nodeId);
					if (prevState.graphMap[parseInt(prevState.linkSource)][nodeId] === undefined) {


						prevState.graphMap[prevState.linkSource] = {
							...prevState.graphMap[prevState.linkSource],
							[nodeId]: true

						};

						console.log("AFTER graphMap: ", prevState.graphMap);

						//Creating the node for view
						prevState.data.nodes[prevState.linkSource] = {
							id: prevState.linkSource,
							color: "#C05D4F"
						};

						prevState.data.links.push(
							 {
								 source: prevState.linkSource,
								 target: nodeId,
								 label: ""
							 }
						);
						prevState.clickedLink = {
							source: prevState.linkSource,
							target: nodeId
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
		window.alert(`Right clicked node ${nodeId}`);
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
		console.log(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
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

	eraseAll = () => {
		let me = this;
		me.setState((prevState) => {
			prevState.data.links = [];
			prevState.data.nodes = [{ id: "0" }];
			prevState.graphMap = {
				"0": {}
			};
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
				let nodeId =  prevState.data.nodes.length.toString();
				prevState.data.nodes.push(
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
			hash[hashValue] = this.state.data.links[i].label;
		}
		for(let i = 0; i < length; i++) {
			let inverseHashValue =
				 this.getNodeIndex(this.state.data.links[i].target)*nodesLength+
				 this.getNodeIndex(this.state.data.links[i].source);
			if(hash[inverseHashValue]===undefined && !this.state.directed)hash[inverseHashValue] = this.state.data.links[i].label;
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

	handleChange = e => {
		let me = this;
		me.setState({addLabelInputValue: e.target.value});
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
				  contentLabel="Add Edge"
				  ariaHideApp={false}
			 >
				 <Row>
					 <Col span={18}>
						 <input
							  className={"linkLabelInput"}
							  type="text"
							  value={this.state.addLabelInputValue}
							  onChange={this.handleChange}
							  placeholder={"Weight..."}
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


	render() {
		return (
			 <div className={"mainCtn"}>
				 <Row type="flex" justify="space-around" align="middle">
					 <h1 className={"boardTitle"}>Graph Drawer</h1>
				 </Row>
				 <Row type="flex" justify="space-around" align="middle">
					 <Button type="normal" icon="dribbble" size={'large'}
					         onClick={e => this.setTypeInput(e,"node")}
					         disabled={this.state.inputType === "node"}
					 >
						 Draw/Move Nodes
					 </Button>
					 <Button type="normal" icon="arrows-alt" size={'large'}
					    onClick={e => this.setTypeInput(e,"edge")}
					         disabled={this.state.inputType === "edge"}
					 >
						 Draw Links
					 </Button>
					 <Button type="danger" icon="reload" size={'large'}
					         onClick={this.undoAction}
					         disabled={!this.state.lastActionType || this.state.erasedNodes}
					 >
						 Undo
					 </Button>
					 <Button type="danger" icon="highlight" size={'large'}
					         onClick={this.eraseNode}
					 >
						 Erase
					 </Button>
					 <Button type="danger" icon="delete" size={'large'}
					         onClick={this.eraseAll}
					 >
						 Clean
					 </Button>
				 </Row>
				 <Row type="flex" justify="space-around" align="middle">
					 <Col span={23}>
						 <div className={"board"}>
							 <div className={"graphCtn"} onClick={this.createNode}>
								 <Graph
									  ref="graph"
									  id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
									  data={this.state.data}
									  config={this.myConfig}
									  onClickNode={this.onClickNode}
									  onRightClickNode={this.onRightClickNode}
									  onClickGraph={this.onClickGraph}
									  onClickLink={this.onClickLink}
									  onRightClickLink={this.onRightClickLink}
									  onNodePositionChange={this.onNodePositionChange}
								 />
							 </div>
						 </div>
					 </Col>
				 </Row>
				 <br/>
				 <Row type="flex" justify="space-around" align="middle">

						 <h1 className={"boardTitle"}>Adjacency Matrix</h1>
				 </Row>
				 <Row type="flex" justify={this.state.isMobile? "start" :"space-around"} align="middle">
					 <Col justify={this.state.isMobile? "start" :"space-around"} span={15}>
						 {this.ProcessedMatrix()}
					 </Col>
				 </Row>
				 <br/>
				 <br/>
				 {this.AddLinkLabelModal()}
			 </div>
		);
	}
}

export default Board;
