import React, { Component } from 'react';
import { ReactComponent as BarOne } from './icons/new/bar-1.svg';
import { ReactComponent as BarTwo } from './icons/new/bar-2.svg';
import { ReactComponent as BarThree } from './icons/new/bar-3.svg';
import { ReactComponent as BarFour } from './icons//new/bar-4.svg';
import { ReactComponent as ThreeDots } from './icons/three-dots.svg';

import { ReactComponent as Avatar } from './icons/avatar.svg';
import { ReactComponent as Fr } from './icons/frr.svg';

export default class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFullTitle: false
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  toggleFullTitle = () => {
    this.setState(prevState => ({
      showFullTitle: !prevState.showFullTitle
    }));
  };

  handleDelete(e){
    this.props.delete(this.props.task.title);
  }

  render() {
    const priorityIcons = [ThreeDots, BarOne, BarTwo, BarThree, BarFour];
    const { task } = this.props;
    const PriorityIcon = priorityIcons[task.priority]; // Get the appropriate SVG component
    const { showFullTitle } = this.state;
    

    return (
      <div className='task-main' 
      >
        <div className='task-sub'>
          <p className='task-cam'>CAM-{this.props.idx+1}</p>
          <p
            className='task-title'
            onClick={this.toggleFullTitle}
            title={showFullTitle ? task.title : ''}
          >
            {showFullTitle
              ? task.title
              : task.title.length > 72
              ? task.title.slice(0, 69) + '...'
              : task.title}
          </p>
          <div className='f-req-div'>

          { this.props.groupingMode != "Priority" &&
            (<div>
            {PriorityIcon && (
              <PriorityIcon  className='task-priority-div task-bar-icon' width='1rem' />
              )}
            </div>)
            }
          <p  className='f-req-p'>
            <Fr className='fr-icon' width='1rem' />&nbsp;
            Feature Request</p>
            </div>
        </div>
        <div>
        </div>
        { this.props.groupingMode != "UserId" &&
          <div className='avatar-container'>
          <Avatar onClick={this.handleDelete} className='avatar task-bar-icon' />
        </div>
        }
      </div>
    );
  }
}
