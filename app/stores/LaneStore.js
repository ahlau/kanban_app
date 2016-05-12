// LaneStore.js
import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from './NoteStore';
import NoteActions from '../actions/NoteActions';
import update from 'react-addons-update';

// this is just a class, doesn't need to extend React.Component
class LaneStore {
  constructor() {

    // bind late actions to this class's methods
    this.bindActions(LaneActions);

    // initialize lanes
    this.lanes = [];
  }

  create(lane) {
    const lanes = this.lanes;
    // create a lane ID
    lane.id = uuid.v4();

    lane.notes = lane.notes || [];

    this.setState({
      lanes : lanes.concat(lane)
    });
    console.log("Created new lane: " + lane.id)
  }

  update(updatedLane) {
    const lanes = this.lanes.map((lane) => {
      if (lane.id === updatedLane.id) {
        return Object.assign({}, lane, updatedLane);
      }
      return lane;
    });
    this.setState({lanes});
  }

  delete(id) {
    // const lane = this.lanes.filter(lane => lane.id === id)[0];
    // if(lane){
    //   console.warn("deleting lane " + lane.id + ", and notes: " + lane.notes)
    //   const notes = NoteStore.getNotesByIds(lane.notes);
    //   notes.map( note => NoteActions.delete(note.id) );
    // }
    // else {
      // else if the source and target lanes are different, cut from one, paste in the other
      // else if the source and target lanes are different, cut from one, paste in the other
    //   console.warn("lane not found for id: " + id)
    // }
    this.setState({lanes: this.lanes.filter(lane => lane.id !== id)});
  }

  deleteAll(){
    this.setState({lanes: []});
    NoteStore.deleteAll();
  }

  attachToLane({laneId, noteId}) {
    const lanes = this.lanes.map(lane => {
      // remove note from previous lane
      if(lane.notes.includes(noteId)) {
        lane.notes = lane.notes.filter(id => id !== noteId);
      }
      if(lane.id === laneId) {
        if(lane.notes.includes(noteId)) {
          console.warn("Already attached to lane", lanes);
        }
        else {
          lane.notes.push(noteId);
        }
      }
      return lane;
    });
    this.setState({lanes});
  }

  detachFromLane({laneId, noteId}) {
    const lanes = this.lanes.map(lane => {
      if(lane.id === laneId) {
        lane.notes = lane.notes.filter(note => note.id !== noteId);
      }
      return lane;
    });
    this.setState({lanes});
  }

  // move the source note to the target note's position
  move({sourceId, targetId}){
    // get lanes
    const lanes = this.lanes;
    // find the source lane
    const sourceLane = lanes.filter(lane => lane.notes.includes(sourceId))[0];
    // find the target lane
    const targetLane = lanes.filter(lane => lane.notes.includes(targetId))[0];
    // get the source note index
    const sourceNoteIndex = sourceLane.notes.indexOf(sourceId)
    // get the target note index
    const targetNoteIndex = targetLane.notes.indexOf(targetId)
    // if source lane === target lane, then move the note
    if(sourceLane === targetLane) {
      // we'll use splice to accomplish this
      sourceLane.notes = update(sourceLane.notes, {
        $splice: [
          [sourceNoteIndex, 1],
          [targetNoteIndex, 0, sourceId]
        ]
      });
    } else {
      // get rid of source
      sourceLane.notes.splice(sourceNoteIndex, 1)
      // else if the source and target lanes are different, cut from one, paste in the other
      targetLane.notes.splice(sourceNoteIndex, 0, sourceId);
    }
    // save state
    this.setState({lanes});
  }
}

// Clever, create a store using the logic encapsulated in LaneStore
export default alt.createStore(LaneStore, 'LaneStore');
