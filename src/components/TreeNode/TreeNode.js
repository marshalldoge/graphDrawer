import React, {Component} from "react";

class TreeNode extends React.PureComponent {
	render() {
		const {className, nodeData} = this.props;
		//console.log("Tree node props: ",this.props);
		return (
			 <div className={className}>
				 <h2>{nodeData.attributes.value}</h2>
			 </div>
		)
	}
}

export default TreeNode;
