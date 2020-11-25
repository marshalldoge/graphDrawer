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
import { getUrlParams, getRandomArbitrary } from "../../utils";
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
			radius: 8
		},
		startEdge: null,
		edgeWeight: 1,
		containerRect: null,
		drawingExitNodes: true,
		editMode: false,
		isConfigurationModalOpen: false,
		animationState: 0,
		animationId: null,
		fireScale: [],
		fireAnimationIds: []
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
		this.runFireAnimation();
	}

	loadGraphData = () => {
		let me = this;
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
				prevState.fireAnimationIds.push(
					 setInterval(function () {
						 me.runFireAnimation(prevState.nodes[i].idx);
					 }, getRandomArbitrary(500,900))
				);
				prevState.lastNodeIndex = Math.max(prevState.lastNodeIndex, prevState.nodes[i].id);
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

	runFireAnimation(nodeIdx) {
		let me = this;
		me.setState(prevState => {
			prevState.fireScale[nodeIdx] = getRandomArbitrary(30,90);
			return prevState;
		});
	}


	Lines = () => {
		return this.state.edges.map((edge, idx) => {
			const lineStyle = {
				stroke: edge.color,
				strokeWidth: 7,
				strokeOpacity: "70%"
			};
			return (
				 <line
					  key={idx}
					  x1={edge.startX}
					  y1={edge.startY}
					  x2={edge.endX}
					  y2={edge.endY}
					  style={lineStyle}
				 />
			)
		});
	};

	WaterLines = () => {
		return this.state.nodes.map((node,idx) => {
			if(!node.water) return null;
			const lineStyle = {
				strokeWidth: "3",
				stroke: "url(#waterGradient)",
				fill: "#fff",
				opacity: "1"
			};

			let rainLines = [];
			let dif = 10;
			let cnt = 0;
			for(let i = 0; i < 4; i++) {
				let move = "M"+(node.x+(5*i))+","+(node.y-10);
				let line = "L"+(node.x+(5*i)-15)+","+(node.y+10);
				rainLines.push(
					 <path
						  key={cnt}
						  className={"path"}
						  style={lineStyle}
						  id="svg_1"
						  d={move+line}
						  //filter={"url(#waterFilter)"}
					 />
				);
				cnt++;
			}
			return rainLines;
		});
	};

	Circles = () => {
		return this.state.nodes.map((node,idx) => {
			function getNodeStyle(idx) {
				return {
					filter: "url(#"+ idx +")"
				}
			}
			let isExit = node.exitNode ? "exit" : "";
			if (node.fireLevel === 900) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()}
						  fill={node.color}
						  fillOpacity={"80%"}
						  //className={"node " + isExit}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			}
			if(node.fireLevel < 300) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()*6}
						  fill={"url('#myGradient')"}
						  fillOpacity={"90%"}
						  strokeOpacity={"60%"}
						  //className={"node " + isExit}
						  style={getNodeStyle(node.idx)}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			}else if(node.fireLevel < 450) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()*5}
						  fill={"url('#myGradient')"}
						  fillOpacity={"90%"}
						  //strokeWidth={20}
						  //stroke={"red"}
						  //strokeOpacity={"40%"}
						  //className={"node " + isExit}
						  style={getNodeStyle(node.idx)}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			} else if(node.fireLevel < 600) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()*4}
						  fill={"url('#myGradient')"}
						  fillOpacity={"90%"}
						  strokeWidth={5}
						  stroke={"red"}
						  strokeOpacity={"13%"}
						  //className={"node " + isExit}
						  style={getNodeStyle(node.idx)}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			} else if(node.fireLevel < 750) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()*3}
						  fill={"url('#myGradient')"}
						  fillOpacity={"90%"}
						  //strokeWidth={20}
						  //stroke={"red"}
						  //strokeOpacity={"40%"}
						  //className={"node " + isExit}
						  style={getNodeStyle(node.idx)}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			} else if(node.fireLevel < 900) {
				return (
					 <circle
						  cx={node.x.toString()}
						  cy={node.y.toString()}
						  r={this.state.nodeStyle.radius.toString()*2}
						  fill={"url('#myGradient')"}
						  fillOpacity={"90%"}
						  //strokeWidth={20}
						  //stroke={"red"}
						  //strokeOpacity={"40%"}
						  //className={"node " + isExit}
						  style={getNodeStyle(node.idx)}
						  key={idx}
						  onClick={e => this.onClickNode(e,node)}
					 />
				);
			}
		})
	};

	getCircleFilters = () => {
		return this.state.nodes.map((node,idx) => {
			return (
				 <filter id={node.idx} key={idx}>
					 <feTurbulence type="turbulence" baseFrequency="0.09"
					               numOctaves="6" result="turbulence"/>
					 <feDisplacementMap in="SourceGraphic" in2="turbulence"
					                    scale={this.state.fireScale[node.idx]}
					                    xChannelSelector="R" yChannelSelector="G"
					                    result={"map"}
					 />
					 <feComposite operator="in" in="map" in2="SourceGraphic" result={"comp"}/>
					 <feBlend mode="multiply" in="comp" result="blend" />

				 </filter>
			);
		});
	};

	SVG = () => {
		return (
			 <svg className={"svg"}>
				 <defs>
					 <radialGradient id="myGradient">
						 <stop offset="1%" stopColor="rgba(246,240,44,1)" />
						 <stop offset="100%" stopColor="rgba(224,80,80,1)" />
					 </radialGradient>
					 <radialGradient id="waterGradient">
						 <stop offset="1%" stopColor="rgba(117,200,240,1)" />
						 <stop offset="100%" stopColor="rgba(80,136,224,1)" />
					 </radialGradient>
					 <filter id="displacementFilter">
						 <feTurbulence type="turbulence" baseFrequency="0.09"
						               numOctaves="6" result="turbulence"/>
						 <feDisplacementMap in2="turbulence" in="SourceGraphic"
						                    scale={this.state.fireScale[0]} xChannelSelector="R" yChannelSelector="G"/>
						 <feComposite operator="in" in="ripples" in2="SourceGraphic"/>
					 </filter>
					 <filter id="waterFilter">
						 <feTurbulence type="turbulence" baseFrequency="0.09"
						               numOctaves="6" result="turbulence"/>
						 <feDisplacementMap in2="turbulence" in="SourceGraphic"
						                    scale={this.state.fireScale[1]} xChannelSelector="R" yChannelSelector="G"/>
						 <feComposite operator="in" in="ripples" in2="SourceGraphic"/>
					 </filter>
					 {this.getCircleFilters()}
					 <radialGradient id="myGradient2" r={"20%"}>
						 <stop offset="10%" stopColor="gold" />
						 <stop offset="95%" stopColor="blue" />
					 </radialGradient>
				 </defs>
				 {this.Lines()}
				 {this.Circles()}
				 {
				 	this.WaterLines()
				 }
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
				let destNode = this.state.graph[x[1]][i][1];
				let newWeight = d[x[1]] + addedWeight + (900 - this.state.nodeMap[destNode].fireLevel);
				if(d[destNode] > newWeight) {
					d[destNode] = newWeight;
					p[destNode] = x[1];
					parentEdge[destNode] = this.state.edgeMap[x[1]][i];
					pq.push([newWeight,destNode]);
				}
			}
		}
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
				res.unshift(
					 {
						 ...this.state.nodeMap[node],
						 color: "rgb(29,188,142)"
					 });
				res.unshift(
					 {
						 ...parentEdge[node],
						 color: "rgb(29,188,142)"
					 });
				node = p[node];
			}
		}
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
		if(!this.state.editMode) {
			let commands = this.getShortestPath(node.id);
			this.runAnimation(commands);
		} else {
			if(this.state.startEdge === null) {
				this.setState(prevState => {
					prevState.startEdge = node;
					//prevState.nodes[node.idx].fireLevel = prevState.nodes[node.idx].fireLevel - 100;
					//prevState.nodes[node.idx].water = true;
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
				let nodeId =  (prevState.lastNodeIndex+1);
				prevState.lastNodeIndex = prevState.lastNodeIndex + 1;
				prevState.nodes.push(
					 {
						 id: nodeId,
						 x: x,
						 y: y,
						 exitNode: prevState.drawingExitNodes,
						 idx: prevState.nodes.length,
						 color: prevState.drawingExitNodes ? "#003152" : "#1B7183",
						 fireLevel: 900,
						 water: false
					 }
				);
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
