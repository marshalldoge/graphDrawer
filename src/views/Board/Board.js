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
		edges: [],
		lastNodeIndex: -1,
		collapsed: false,
		nodeStyle: {
			radius: 20
		},
		startEdge: null,
		containerRect: null
	};

	componentDidMount() {
		this.getRectsInterval = setInterval(() => {
			this.setState(prevState => {
				const containerRect = this.containerRef.current.getBoundingClientRect();
				//console.log('cont rect: ',containerRect);
				prevState.containerRect = containerRect;
				return prevState;
			});
		}, 5000);
	}

	dfs = (treeNode) => {
		console.log("DFS At ",treeNode.attributes.value);
		console.log("Verifying: ",this.state.treeNodeModalInputValue,"<",treeNode.attributes.value," ?");
		let posLeft = null;
		let posRight = null;
		for(let i = 0; i<treeNode.children.length;i++) {
			console.log("Checking: ",treeNode.children[i].attributes.position);
			if (treeNode.children[i].attributes.position === 'right') {
				posRight = i;
			}
			if (treeNode.children[i].attributes.position === 'left') {
				posLeft = i;
			}
		}
		console.log(posLeft," -- ",posRight );
		if(parseInt(this.state.treeNodeModalInputValue) < parseInt(treeNode.attributes.value)){
			//check if it has two chidlren
			console.log("Going left!");
			if(posLeft != null) {
				treeNode.children[posLeft] = this.dfs(treeNode.children[posLeft]);
			}else{
				console.log("Found free space left! at idx",treeNode.attributes.value);
				treeNode.children.unshift( {
					name: (this.state.treeSize+1).toString(),
					attributes: {
						value: this.state.treeNodeModalInputValue,
						position: 'left'
					},
					nodeSvgShape: {
						shape: 'circle',
						shapeProps: {
							r: 10,
							fill: this.state.treeNodeColor
						},
					},
					children: []
				});
			}
		}else{
			console.log("Going right!");
			if(posRight != null) {
				console.log("There is a right Child already, goingt to it");
				treeNode.children[posRight] = this.dfs(treeNode.children[posRight]);
			}else{
				console.log("Found free space right! at idx",treeNode.attributes.value);
				treeNode.children.push( {
					name: (this.state.treeSize+1).toString(),
					attributes: {
						value: this.state.treeNodeModalInputValue,
						position: 'right',
					},
					nodeSvgShape: {
						shape: 'circle',
						shapeProps: {
							r: 10,
							fill: this.state.treeNodeColor,
						},
					},
					children: []
				});
			}
		}
		return treeNode;
	};

	Lines = () => {
		return this.state.edges.map((edge, idx) => {
			const lineStyle = {
				stroke: "#003152",
				strokeWidth: 10
			};
			return (
				 <line key={idx} x1={edge.startX} y1={edge.startY} x2={edge.endX} y2={edge.endY} style={lineStyle} />
			)
		});
	};

	SVG = () => {

		return (
			 <svg className={"svg"}>
				 {this.Lines()}
			 </svg>
		)
	};

	EdgeCreation = (e,node) => {
		e.stopPropagation();
		console.log('Clicked node ',node);
		if(this.state.startEdge === null) {
			this.setState(prevState => {
				prevState.startEdge = node;
				return prevState;
			})
		} else {
			let rect = e.target.getBoundingClientRect();
			this.setState(prevState => {
				let endEdge = node;
				console.log('edge: ',{
					start: prevState.startEdge.id,
					end: endEdge.id,
					startX: prevState.startEdge.x,
					startY: prevState.startEdge.y,
					endX: endEdge.x,
					endY: endEdge.y
				});
				console.log('RECT: ',this.state.containerRect);
				prevState.edges.push(
					 {
						 start: prevState.startEdge.id,
						 end: endEdge.id,
						 startX: prevState.startEdge.x - this.state.containerRect.left + this.state.nodeStyle.radius/2,
						 startY: prevState.startEdge.y - this.state.containerRect.top + this.state.nodeStyle.radius/2,
						 endX: endEdge.x - this.state.containerRect.left + this.state.nodeStyle.radius/2,
						 endY: endEdge.y - this.state.containerRect.top + this.state.nodeStyle.radius/2
					 }
				);
				prevState.startEdge = null;
				console.log("Edges: ",prevState.edges);
				return prevState;
			})
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
				zIndex: 10
			};
			return (
				 <div className={"node"} style={nodeStyle} key={idx} onClick={e => this.EdgeCreation(e,node)}>

				 </div>
			);
		})
	};

	createNode = (e) => {
		var rect = e.target.getBoundingClientRect();
		let x = e.clientX - this.state.nodeStyle.radius/2;
		let y = e.clientY - this.state.nodeStyle.radius/2;
		let me = this;
		me.setState((prevState) => {
			console.log("Crating new node");
			let nodeId =  (prevState.lastNodeIndex+1);
			prevState.lastNodeIndex = prevState.lastNodeIndex + 1;
			prevState.nodes.push(
				 {
					 id: nodeId,
					 x: x,
					 y: y
				 }
			);
			console.log("Creating node, new array: ",prevState.nodes);
			return prevState;
		});
	};

	render() {
		//console.log("MAIN RETURN :",this.state.competData);
		return (
            <Layout style={{ minHeight: '100vh' }}>
                <Layout className="site-layout bodyCtn">
                    <Content style={{ margin: '0 16px' }}>
                        <div className={"mainCtn"}>
	                        <Row className={"map-ctn"} type="flex" justify="space-around" align="middle">
		                        <Col className={"map-sub-ctn"} span={23}>
			                        <div
				                         className={"map-image-ctn"} onClick={this.createNode}
				                         ref={this.containerRef}
			                        >
				                        {this.SVG()}
			                        </div>
		                        </Col>
	                        </Row>
                        </div>
	                    {this.Nodes()}
                    </Content>
                </Layout>
            </Layout>
        );
	}
}

export default Board;
