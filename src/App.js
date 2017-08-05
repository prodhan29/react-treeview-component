import React, { Component } from 'react';
import TreeData from './sample.data.js';

export default class Treeview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: TreeData,
      editableNode: ''
    }
  }

  addRoot = () => {
    let root = {
      name: '',
      exportValue: '',
      showChildren: true,
      editMode: true,
      children: []
    }

    this.setState({
      data: root
    });
  }

  handleEditChange = (e, value) => {
    value[e.target.name] = e.target.value;
    this.setState({ value });
  }

  deleteNode = (parent, index) => {
    parent.splice(index, 1);
    this.setState({ parent });
  }

  makeEditable = (value) => {
    this.state.editableNode = JSON.parse(JSON.stringify(value));
    value.editMode = true;
    this.setState({ value });
  }

  closeForm = (value, parent, index) => {
    if (value.name !== '' && value.exportValue !== '') {
      value.name = this.state.editableNode.name;
      value.exportValue = this.state.editableNode.exportValue;
      value.editMode = false;
      this.setState({ value });
    }
    else {
      console.log(index);
      parent.splice(index, 1);
      this.setState({ parent });
    }
  }

  doneEdit = (value) => {
    value.editMode = false;
    this.setState({ value });
  }

  toggleView = (ob) => {
    ob.showChildren = !ob.showChildren;
    this.setState({ ob });
  }

  addMember = (parent) => {
    let newChild = {
      name: '',
      exportValue: '',
      showChildren: false,
      editMode: true,
      children: []
    }
    parent.push(newChild);
    this.setState({ parent });
  }

  addChild = (node) => {
    node.showChildren = true;
    node.children.push({
      name: '',
      exportValue: '',
      showChildren: false,
      editMode: true,
      children: []
    });
    this.setState({ node });
  }

  nodeEditForm = (value, parent, index) => {
    return (
      <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
        <form className="node_edit_form">
          <div className="field name">
            <input value={value.name}
              type="text"
              name='name'
              placeholder='Option'
              onChange={(e)=> { this.handleEditChange(e, value) }}
            />
          </div>
          <div className="field code">
            <input value={value.exportValue}
              type="text"
              name='exportValue'
              placeholder='Value'
              onChange={(e)=> { this.handleEditChange(e, value) }}
            />
          </div>
          <div className="field action_node">
            <span className="fa fa-check" onClick={(e)=> { this.doneEdit(value) }}></span>
            <span className="fa fa-close" onClick={(e)=> { this.closeForm(value, parent, index) }}></span>
          </div>
        </form>
      </div>
    )
  }

  makeChildren = (node) => {
    if (typeof node === 'undefined' || node.length === 0) return null;

    let children;
    children = node.map((value, index)=> {

      let item = null;

      // A node has children and want to show her children
      if (value.children.length > 0 && value.showChildren) {
        let babies = this.makeChildren(value.children);
        let normalMode = (
          <div className="node">
            <i className="fa fa-minus-square-o"></i>{value.name}
            <span className="actions">
              <i className="fa fa-close" onClick={(e)=> { e.stopPropagation(); this.deleteNode(node, index) }}></i>
              <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i>
            </span>
          </div>
        )
        item = (
          <li key={index} onClick={(e) => { e.stopPropagation(); this.toggleView(value) }}>
            {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
            {babies}
          </li>
        )
      }

      // A node has children but don't want to showing her children
      else if (value.children.length > 0 && !value.showChildren) {
        item = (
          <li key={index} onClick={(e)=> { e.stopPropagation(); this.toggleView(value) }}>
            <div className="node"><i className="fa fa-plus-square-o"></i>{value.name}</div>
          </li>
        );
      }

      // A node has no children
      else if (value.children.length === 0) {
        let normalMode = (
          <div className="node"><i className="fa fa-square-o"></i>{value.name}
            <span className="actions">
              <i className="fa fa-plus" onClick={(e)=> { e.stopPropagation(); this.addChild(value) }}> </i>
              <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i>
              <i className="fa fa-close" onClick={(e)=> { e.stopPropagation(); this.deleteNode(node, index) }}></i>
            </span>
          </div>
        );

        item = (
          <li key={index} onClick={(e) => e.stopPropagation()}>
            {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
          </li>
        );
      }
      return item;
    });

    return (
      <ul >
        {children}
        <li>
          <div className="node add_node" onClick={(e)=> { e.stopPropagation();this.addMember(node) }}>
            <i className="fa fa-square" ></i>
            <a >Add New</a>
          </div>
        </li>
      </ul>
    );
  }

  getNodes = () => {
    if (typeof this.state.data.name === 'undefined') return null;
    let children = this.makeChildren(this.state.data.children);
    let root = (
      <span className="root">{this.state.data.name}
        <span className="actions"> &nbsp;  &nbsp;
                    <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(this.state.data) }}> edit </i>
          <i className="fa fa-plus" onClick={(e)=> { e.stopPropagation(); this.addChild(this.state.data) }}> Add_child </i>
        </span>
      </span>

    )
    return (
      <div className="tree">
        {(this.state.data.editMode) ? this.nodeEditForm(this.state.data) : root}
        {children}
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-offset-4 col-md-3">
          <div className="group_dropdown_content">
            {this.getNodes()}
          </div>
        </div>
      </div>
    );
  }
}

//------------- Showing children ----------
/*
<ul>
    <li>
        <div className="node">
            <i className="fa fa-minus-square-o"></i>Dhaka (DHK)
            <span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span>
        </div>
        <ul>
            <li><div className="node"><i className="fa fa-square-o"></i>Satgram (SAT)<span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span></div></li>
            <li><div className="node"><i className="fa fa-square-o"></i>Satgram (SAT)<span className="actions"><i className="fa fa-close"></i><i className="fa fa-pencil"></i> </span></div></li>
            <li><div className="node add_node"><i className="fa fa-square"></i><a href="">Add New</a> </div></li>
        </ul>
    </li>
</ul>
*/

//------------- Don't show children -------
/*
<ul>
    <li><div className="node"><i className="fa fa-plus-square-o"></i>Mymenshingh (MYM)</div></li>
    <li><div className="node"><i className="fa fa-plus-square-o"></i>Rangpur (RAN)</div></li>
</ul>
*/


// ---------------- Editing mode -----------
/*
<div className="node node_edit">
    <form className="node_edit_form">
        <div className="field name"><input value="Gopalganj" type="text" /> </div>
        <div className="field code"><input value="GOP" type="text" /> </div>
        <div className="field action_node">
            <span className="fa fa-check"></span>
            <span className="fa fa-close"></span>
        </div>
    </form>
</div>
*/

