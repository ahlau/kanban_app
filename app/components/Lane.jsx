import AltContainer from 'alt-container';
import React from 'react';
import Lanes from './Lanes.jsx';
import LaneActions from '../actions/LaneActions';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneStore from '../stores/LaneStore';
import Notes from './Notes.jsx';

export default class Lane extends React.Component {
  render() {
    const {lane, ...props} = this.props;

    return (
      <div {...props}>
        <div className="lane-header">
          <div className="lane-add-note">
            <button onClick={this.addNote}>
              +
            </button>
          </div>
          <div className="lane-name">{lane.name}</div>
        </div>
        <AltContainer
          stores={[NoteStore]}
          inject={{
            notes: () => NoteStore.getNotesByIds(lane.notes) || []
          }}
        >
          <Notes onEdit={this.editNote} onDelete={this.deleteNote} />
        </AltContainer>
      </div>
    );
  }

  editNote(id, task) {
    if(!task.trim()){
      return;
    }
    NoteActions.update({id, task});
  }

  addNote = (e) => {
    const laneId = this.props.lane.id;
    const note = NoteActions.create({task: 'New Task'});
    console.log("addNote - noteId:" + note.id + " - laneId:" + laneId);
    LaneActions.attachToLane({noteId: note.id, laneId}); 
  };

  deleteNote = (noteId, e) => {
    e.stopPropagation();
    laneId = this.props.lane.id;
    LaneActions.detachFromLane({noteId, laneId});
    NoteActions.delete(noteId);
  };

}
