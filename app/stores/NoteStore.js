import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions.js';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this),
      deleteAll: this.deleteAll.bind(this)
    });
  }

  getNotesByIds(ids) {
    // 1 Make sure we're operating over an array, and map over the ids
    // 2. Extract matching notes
    // 3. filter out possible empty arrays and get notes
    return (ids || []).map( id => this.notes.filter(note => note.id === id)).filter(a => a.length).map(a => a[0]);
  }

  create(note) {
    const notes = this.notes;
    note.id = uuid.v4();
    this.setState({
      notes: notes.concat(note)
    });
    return note;
  }

  update(updatedNote) {
    const notes = this.notes.map(note => {
      if (note.id === updatedNote.id) {
        // Object.assign is kind of like merge, 
        // with the {} first param, note attributes are 
        // merged into updatedNote
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });
    this.setState({notes});
  }

  delete(id) {
    const notes = this.notes.filter(note => note.id !== id)
    this.setState({notes});
  }

  deleteAll() {
    this.setState({notes: []});
  }
}

export default alt.createStore(NoteStore, 'NoteStore');
