import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneStore from '../stores/LaneStore';
import Notes from './Notes.jsx';
import Editable from './Editable.jsx';
import {DragDropContext} from 'react-dnd';
import {DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;

    // console.log('source: ' + sourceId + ', target: ' + targetProps.lane.id + ", notes: " + targetProps.lane.notes.length);
    // if the lane is empty, then show these console log statements.
    if(!targetProps.lane.notes.length) {
      console.log('empty lane - source: ' + sourceId + ", target: " + targetProps.lane.id);
      LaneActions.attachToLane({
        laneId: targetProps.lane.id,
        noteId: sourceId
      });
    }
  }
};

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Lane extends React.Component {
  render() {
    const {connectDropTarget, lane, ...props} = this.props;

    return connectDropTarget(
      <div {...props}>
        <div className="lane-header" onClick={this.activateLaneEdit}>
          <div className="lane-add-note">
            <button onClick={this.addNote}>+</button>
          </div>
          <Editable className="lane-name" editing={lane.editing} value={lane.name} onEdit={this.editName} />
          <div className="lane-delete">
            <button onClick={this.deleteLane}>X</button>
          </div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes) || []
          }}
        >
          <Notes 
            onValueClick={this.activateNoteEdit}
            onEdit={this.editNote}
            onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  editNote(id, task) {
    if(!task.trim()){
      NoteActions.update({id, editing: false});
      return;
    }
    NoteActions.update({id, task, editing: false});
  }

  addNote = (e) => {
    e.stopPropagation();
    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New Task'});
    LaneActions.attachToLane({noteId: note.id, laneId}); 
  };

  deleteNote = (noteId, e) => {
    e.stopPropagation();
    const laneId = this.props.lane.id;
    LaneActions.detachFromLane({noteId, laneId});
    NoteActions.delete(noteId);
  };

  editName = (name) => {
    const laneId = this.props.lane.id;
    if (!name.trim()){
      // don't update name, just end the editing state
      LaneActions.update({id: laneId, editing: false});
      return;
    }
    LaneActions.update({id: laneId, name, editing: false})
  }

  deleteLane = () => {
    const lane = this.props.lane;
    // delete notes attached to lane
    lane.notes.map(noteId => NoteActions.delete(noteId));
    // delete lane
    LaneActions.delete(lane.id);
  }

  activateLaneEdit = () => {
    const laneId = this.props.lane.id;
    LaneActions.update({id: laneId, editing: true});
  }

  activateNoteEdit(id) {
    NoteActions.update({id, editing: true});
  }
}
