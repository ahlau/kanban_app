import uuid from 'node-uuid';
import alt from '../libs/alt';
import NoteActions from '../actions/NoteActions';

class NoteStore {
  constructor() {
    this.bindActions(NoteActions);
    this.notes = [];
    
    // Set verbose console mode:
    // alt.dispatcher.register(console.log.bind(console));

    this.exportPublicMethods({
      getNotesByIds: this.getNotesByIds.bind(this)
    })
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
      if(note.id === updatedNote.id) {
        // Object.assign mutates the first param, so we use {} as first param,
        // assign can take any number of args (acts like a merge! function)
        return Object.assign({}, note, updatedNote);
      }
      return note;
    });

    // '{notes}' is ES6 shorthand for '{notes: notes}'
    this.setState({notes});
  }

  delete(id){
    console.log("delete note ${id} - " + id)
    this.setState({
      notes: this.notes.filter(note => note.id !== id)
    });
  }

  getNotesByIds(ids){
    // ensure we're using an array
    return(ids || []).map(
      // extract matching notes
      id => this.notes.filter(note => note.id === id)
      // filter out possible empty arrays and get notes
      ).filter(a => a.length).map(a => a[0])
  }
}

export default alt.createStore(NoteStore, 'NoteStore');