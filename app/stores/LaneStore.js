// LaneStore.js
import uuid from 'node-uuid';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from './NoteStore';
import NoteActions from '../actions/NoteActions';

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
       if(lane.id === laneId) {
         if(lane.notes.includes(noteId)) {
           console.warn("This lane already includes this note", lanes);
         } else {
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
}

// Clever, create a store using the logic encapsulated in LaneStore
export default alt.createStore(LaneStore, 'LaneStore');
