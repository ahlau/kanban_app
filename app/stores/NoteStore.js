import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions.js';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
  }

  create(note) {
    const notes = this.notes;
    note.id = uuid.v4();
    this.setState({
      notes: notes.concat(note)
    });

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
}

export default alt.createStore(NoteStore, 'NoteStore');