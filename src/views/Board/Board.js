import React, {Component} from "react";
import {Row, Col, InputNumber, Typography, Button, Menu, Layout, Switch} from 'antd';
import {
	DownloadOutlined,
} from '@ant-design/icons';
import { Graph } from "react-d3-graph";
import Tree from 'react-d3-tree';
import ReactApexChart from "react-apexcharts";
import 'antd/dist/antd.css';
import Modal from 'react-modal';
import './_Board.scss';
import { johnson } from '../../algorithms/johnson';
import { asignacion } from '../../algorithms/asignacion';
import { noroeste } from '../../algorithms/noroeste';
import { trees } from '../../algorithms/arboles';
import { compet } from '../../algorithms/compet';
import { sort } from '../../algorithms/sort';
import { getUrlParams } from "../../utils";
import { PriorityQueue } from "../../algorithms/PriorityQueue";

const { Title } = Typography;
const Matrix = React.lazy(() => import("../../components/Matrix/Matrix"));
const RawMatrix = React.lazy(() => import("../../components/RawMatrix/RawMatrix"));
const SelfLoopLabels = React.lazy(() => import("../../components/SelfLoopLabels/SelfLoopLabels"));
const TreeNode = React.lazy(() => import("../../components/TreeNode/TreeNode"));
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Board extends Component {

	constructor(props) {
		super(props);
		this.containerRef = React.createRef();
		this.getRectsInterval = null;
	}

	state = {
		inputType: "node",
		nodeRadius: 200,
		nodes: [],
		nodeMap: {},
		edges: [],
		edgeMap: [],
		graph: {},
		lastNodeIndex: -1,
		collapsed: false,
		nodeStyle: {
			radius: 10
		},
		startEdge: null,
		edgeWeight: 1,
		containerRect: null,
		drawingExitNodes: true,
		editMode: false,
		isConfigurationModalOpen: false,
		animationState: 0,
		animationId: null
	};

	componentDidMount() {
		this.setState(prevState => {
			const containerRect = this.containerRef.current.getBoundingClientRect();
			//console.log('cont rect: ',containerRect);
			prevState.containerRect = containerRect;
			return prevState;
		});
		this.getRectsInterval = setInterval(() => {
			this.setState(prevState => {
				const containerRect = this.containerRef.current.getBoundingClientRect();
				//console.log('cont rect: ',containerRect);
				prevState.containerRect = containerRect;
				return prevState;
			});
		}, 5000);

		this.loadGraphData();
	}

	loadGraphData = () => {
		this.setState(prevState => {
			prevState.editMode = getUrlParams("editMode");
			prevState.nodes = JSON.parse(localStorage.getItem("nodes")) || [];
			prevState.edges = JSON.parse(localStorage.getItem("edges")) || [];
			let graph = {};
			let nodeMap = {};
			let edgeMap = {};
			for(let  i = 0; i < prevState.nodes.length; i++) {
				graph[prevState.nodes[i].id] = [];
				edgeMap[prevState.nodes[i].id] = [];
				nodeMap[prevState.nodes[i].id] = prevState.nodes[i];
			}
			prevState.nodeMap = nodeMap;
			for(let  i = 0; i < prevState.edges.length; i++) {
				//if(graph[prevState.edges[i].start] === undefined) graph[prevState.edges[i].start] = [];
				//if(graph[prevState.edges[i].end] === undefined) graph[prevState.edges[i].start] = [];
				edgeMap[prevState.edges[i].start].push(prevState.edges[i]);
				edgeMap[prevState.edges[i].end].push(prevState.edges[i]);
				graph[prevState.edges[i].start].push([prevState.edges[i].weight,prevState.edges[i].end]);
				graph[prevState.edges[i].end].push([prevState.edges[i].weight,prevState.edges[i].start]);
			}
			prevState.edgeMap = edgeMap;
			prevState.graph = graph;
		});
	};

	drawPath(commands) {
		let me = this;
		if(commands.length > 0) {
			//console.log('Comans to draw path: ',commands);
			let drawingPathAnimation = setInterval(function () {
				me.setState((prevState) => {
					//console.log("Animating command", prevState.animationState, commands[prevState.animationState]);
					if (commands[prevState.animationState].weight === undefined) {
						let aux = {
							...prevState.nodes[commands[prevState.animationState].idx],
							color: commands[prevState.animationState].color
						};

						//console.log("Node to draw PREV: ", aux);
						prevState.nodes[commands[prevState.animationState].idx] = aux;
					} else {
						let aux = {
							...prevState.edges[commands[prevState.animationState].idx],
							color: commands[prevState.animationState].color
						};
						//console.log("Edge to draw PREV: ", aux);
						prevState.edges[commands[prevState.animationState].idx] = aux;
					}
					prevState.animationState = prevState.animationState + 1;
					if (prevState.animationState === commands.length) {
						prevState.animationState = 0;
						clearInterval(drawingPathAnimation);
					}
					return prevState;
				})

			}, 80);
		}
	};

	runAnimation(commands) {
		let me = this;
		if (this.state.animationId) {
			clearInterval(this.state.animationId);
		}
		let animationId = setInterval(function () {
			//me.cleanStyles(me.drawPath(commands));
			setTimeout(me.cleanStyles(me.drawPath(commands)), 2000);
		}, 2000);
		me.setState({animationId: animationId})
	}


	Lines = () => {
		return this.state.edges.map((edge, idx) => {
			const lineStyle = {
				stroke: edge.color,
				strokeWidth: 7
			};
			return (
				 <line key={idx} x1={edge.startX} y1={edge.startY} x2={edge.endX} y2={edge.endY} style={lineStyle} />
			)
		});
	};

	Circles = () => {
		return this.state.nodes.map((node,idx) => {
			let nodeStyle = {
				position:"absolute",
				top: node.y.toString() + "px",
				left: node.x.toString() + "px",
				width: this.state.nodeStyle.radius.toString() + "px",
				height: this.state.nodeStyle.radius.toString() + "px",
				backgroundColor: node.color,
				zIndex: 10
			};
			let isExit = node.exitNode ? "exit" : "";
			return (
				 <circle
					  cx={node.x.toString()}
					  cy={node.y.toString()}
					  r={this.state.nodeStyle.radius.toString()}
					  fill={node.color}
					  //className={"node " + isExit}
					  style={nodeStyle}
					  key={idx}
					  onClick={e => this.onClickNode(e,node)}
				 />
			);
		})
	}

	SVG = () => {
		return (
			 <svg className={"svg"}>
				 {this.Lines()}
				 {this.Circles()}
			 </svg>
		)
	};

	getShortestPath = (initNode) => {
		let comparator = (a,b) => {
				 if (a[0] === b[0]) {
					 return a[1] > b[1];
				 } else {
					 return a[0] > b[0];
				 }
			 };
		let d = [],p = [], parentEdge = [];
		let reachedExitNodes = [];
		let inf = 9999999999;
		for(let i = 0; i < this.state.nodes.length; i++) {
			d.push(inf);
			p.push(-1);
			parentEdge.push(null);
		}
		let pq = new PriorityQueue(comparator);
		d[initNode] = 0;
		pq.push([0,initNode]);
		while(pq.size() !== 0) {
			let x = pq.pop();
			if(this.state.nodeMap[x[1]].exitNode)reachedExitNodes.push(x[1]);
			for(let i = 0; i < this.state.graph[x[1]].length; i++) {
				let addedWeight = this.state.graph[x[1]][i][0];
				let newWeight = d[x[1]] + addedWeight;
				let destNode = this.state.graph[x[1]][i][1];
				if(d[destNode] > newWeight) {
					d[destNode] = newWeight;
					p[destNode] = x[1];
					parentEdge[destNode] = this.state.edgeMap[x[1]][i];
					pq.push([newWeight,destNode]);
				}
			}
		}
		console.log('Dist: ',d);
		console.log('Exit nodes reached: ',reachedExitNodes);
		console.log('Parent edges: ',parentEdge);
		let res = [];
		if(reachedExitNodes.length > 0) {
			let minPos = 0;
			let mini = inf;
			for(let i = 0; i < reachedExitNodes.length; i++) {
				if(mini > d[reachedExitNodes[i]]){
					mini = d[reachedExitNodes[i]];
					minPos = i;
				}
			}
			let node = reachedExitNodes[minPos];
			while(node !== -1) {
				res.unshift({
					...this.state.nodeMap[node],
					color: "#3DCAB9"
				});
				res.unshift(
					 {
						 ...parentEdge[node],
						 color: "#3DCAB9"
					 });
				node = p[node];
			}
		}
		console.log('Path to exit: ',res);
		return res;
	};

	cleanStyles(callback){
		this.setState(prevState => {
			prevState.nodes = prevState.nodes.map(node => {
				node.color = node.exitNode ? "#003152" : "#1B7183";
				return node;
			});
			prevState.edges = prevState.edges.map(edge => {
				edge.color = "#618186";
				return edge;
			});
			prevState.animationState = 0;
			return prevState;
		},callback);
	};

	onClickNode = (e,node) => {
		e.stopPropagation();
		console.log('Clicked node ',node);
		if(!this.state.editMode) {
			console.log('not in edit mode');
			let commands = this.getShortestPath(node.id);
			this.runAnimation(commands);
		} else {
			if(this.state.startEdge === null) {
				this.setState(prevState => {
					prevState.startEdge = node;
					return prevState;
				})
			} else {
				let rect = e.target.getBoundingClientRect();
				this.setState(prevState => {
					let endEdge = node;
					prevState.edges.push(
						 {
							 start: prevState.startEdge.id,
							 end: endEdge.id,
							 weight: prevState.edgeWeight,
							 isOut: prevState.drawingExitNodes,
							 startX: prevState.startEdge.x,
							 startY: prevState.startEdge.y,
							 endX: endEdge.x,
							 endY: endEdge.y,
							 color: "#618186",
							 idx: prevState.edges.length
						 }
					);
					prevState.startEdge = null;
					console.log("Edges: ",prevState.edges);
					return prevState;
				})
			}
		}
	};

	Nodes = () => {
		return this.state.nodes.map((node,idx) => {
			let nodeStyle = {
				position:"absolute",
				top: node.y.toString() + "px",
				left: node.x.toString() + "px",
				width: this.state.nodeStyle.radius.toString() + "px",
				height: this.state.nodeStyle.radius.toString() + "px",
				backgroundColor: node.color,
				zIndex: 10
			};
			let isExit = node.exitNode ? "exit" : "";
			return (
				 <div className={"node " + isExit} style={nodeStyle} key={idx} onClick={e => this.onClickNode(e,node)}>

				 </div>
			);
		})
	};

	createNode = (e) => {
		var rect = e.target.getBoundingClientRect();
		let x = e.clientX - this.state.containerRect.left;
		let y = e.clientY - this.state.containerRect.top;
		let me = this;
		if(this.state.editMode) {
			me.setState((prevState) => {
				console.log("Crating new node");
				let nodeId =  (prevState.lastNodeIndex+1);
				prevState.lastNodeIndex = prevState.lastNodeIndex + 1;
				prevState.nodes.push(
					 {
						 id: nodeId,
						 x: x,
						 y: y,
						 exitNode: prevState.drawingExitNodes,
						 idx: prevState.nodes.length,
						 color: prevState.drawingExitNodes ? "#003152" : "#1B7183"
					 }
				);
				console.log("Creating node, new array: ",prevState.nodes);
				return prevState;
			});
		}
	};

	ConfigurationModal = () => {
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

		function onChange(value) {
			console.log('changed', value);
			me.setState({edgeWeight: value})
		}

		function onSwitchChange(checked) {
			console.log(`switch to ${checked}`);
			me.setState({drawingExitNodes: checked})
		}

		return (
			 <Modal
				  isOpen={this.state.isConfigurationModalOpen}
				  onRequestClose={() => this.setState({isConfigurationModalOpen: false})}
				  style={customStyles}
				  contentLabel="Add Edge"
				  ariaHideApp={false}
			 >
				 <Row justify={"center"}>
					 <Col span={20}>
						 <Switch className={"switch"} checkedChildren="Sal." unCheckedChildren="Cam." checked={this.state.drawingExitNodes} onChange={onSwitchChange}/>
					 </Col>
				 </Row>
				 <br/>
				 <Row>
					 <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
				 </Row>
				 <br />
				 <Row justify={"center"}>
					 <Button type="primary" icon={<DownloadOutlined />} size={'middle'} onClick={() => {
					 	localStorage.setItem("edges",JSON.stringify(this.state.edges));
					 	localStorage.setItem("nodes",JSON.stringify(this.state.nodes));
					 }} />
				 </Row>
			 </Modal>
		);
	};

	render() {
		//console.log("MAIN RETURN :",this.state.competData);
		return (
            <Layout style={{ minHeight: '100vh' }}>
                <Layout className="site-layout bodyCtn">
                    <Content style={{ margin: '0 16px' }}>
                        <div className={"mainCtn"}>
	                        <Row className={"map-ctn"} type="flex" justify="space-around" align="middle">
		                        <Col className={"map-sub-ctn"} span={24}>
			                        <Row justify={"center"} align={"middle"}>
				                        <div
					                         className={"map-image-ctn"} onClick={this.createNode}
					                         ref={this.containerRef}
				                        >
					                        {this.SVG()}
				                        </div>
			                        </Row>
			                        <Row justify={"center"} align={"middle"}>
				                        { this.state.editMode && (
					                            <div onClick={(e) => this.setState({isConfigurationModalOpen: true})}>
							                        Abrir Configuración
						                        </div>
				                            )
				                        }
			                        </Row>
		                        </Col>
	                        </Row>
                        </div>
	                    {
	                    	//this.Nodes()
	                    }
	                    {this.ConfigurationModal()}
                    </Content>
                </Layout>
            </Layout>
        );
	}
}

export default Board;
