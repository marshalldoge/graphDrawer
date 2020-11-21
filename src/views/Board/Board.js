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

	state = {
		nodes:[],
		inputType: "node",
		nodeRadius: 200,
		data: {
			nodes: [{ id: "0",x: window.innerWidth/6 - 40, y: window.innerHeight/4 - 40, left: 0, right: 0 }],
			links: [],
		},
		collapsed: false
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

	};

	treeNode = (node) => {
		let nodeColor, nodeCtn, nodeId;
		nodeColor = node.color ? node.color : "#f6edcf";
		nodeCtn = {
			borderRadius: "40px",
			width: "30px",
			height: "30px",
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
		height: 800,
		width: window.innerWidth*0.95
	};

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

	addTreeNodeToGraph = () => {
		let me = this;
		console.log("Adding tree node");
		//treeNodeModalInputValue
		if(this.state.treeArray.length===0){
			me.setState((prevState) => {
				prevState.treeData = [
					{
						name: "0",
						attributes: {
							value: prevState.treeNodeModalInputValue,
							position: 'right'
						},
						nodeSvgShape: {
							shape: 'circle',
							shapeProps: {
								r: 10,
								fill: this.state.treeNodeColor,
							},
						},
						children: []
					}
				];
				prevState.isTreeNodeModalOpen = false;
				prevState.treeArray.push(parseInt(prevState.treeNodeModalInputValue));
				prevState.treeNodeModalInputValue = "";
				prevState.treeSize = prevState.treeSize + 1;
				return prevState;
			});
		}else{
			let found = false;
			for(let i =0; i < this.state.treeArray.length; i++) {
				if(this.state.treeArray[i]===parseInt(this.state.treeNodeModalInputValue)){
					found = true;
				}
			}
			if(!found){
				let tree = this.dfs(this.state.treeData[0]);
				console.log("Final tree: ",tree);
				me.setState((prevState) => {
					prevState.isTreeNodeModalOpen = false;
					prevState.treeArray.push(parseInt(prevState.treeNodeModalInputValue));
					prevState.treeNodeModalInputValue = "";
					prevState.treeSize = prevState.treeSize + 1;
					prevState.treeData = [tree];
					return prevState;
				});
			}else{
				me.setState((prevState) => {
					prevState.isTreeNodeModalOpen = false;
					prevState.treeNodeModalInputValue = "";
					return prevState;
				});
			}
		}
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

	GraphDrawerBoard = () => {
		return (
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
		)
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
			                        <div className={"map-image-ctn"}>

			                        </div>
		                        </Col>
	                        </Row>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
	}
}

export default Board;
