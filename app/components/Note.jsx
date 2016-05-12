import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

// Setup a noteSource object, which contains a begin drag handler
const noteSource = {
  beginDrag(props) {
    return {id: props.id};
  }
};

// This function is called when the source is dragged over the receiver
const noteTarget = {
  // As the hover happens, we monitor the source and target
  hover(targetProps, monitor) {
    // Get the item being called for
    const targetId = targetProps.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    if(sourceId !== targetId) {
      targetProps.onMove({sourceId, targetId});
    }
  }
};

// connect NOTE type with noteSource
// connect the state monitor
@DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
// @DropTarget allows a component to receive components annotated with @DragSource
// So, as the drag goes on, @DropTarget receives notices that it's being hovered over.
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Note extends React.Component {
  render() {
    // we'll use id and onMove later so let's extrac them from prop
    const {connectDragSource, connectDropTarget, 
      isDragging, onMove, id, editing, ...props} = this.props;
    // so with dragSource, when editing, then just the HTML as wrapped as a drop target.
    // But if we're not editing, then allow it to be a drag source.
    const dragSource = editing ? a => a : connectDragSource;

    return dragSource(connectDropTarget(
      <li style={{opacity: isDragging ? 0 : 1}}{...props}>{props.children}</li>
    ));
  }
}
