import AltContainer from 'alt-container';
import React from 'react';
import Notes from './Notes.jsx';

import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class App extends React.Component {

  /* Functionality from this code is replaced by AltContainer
  // constructor(props) {
  //   // if you don't call this, then this.props is not iniitalized
  //   super(props);

  //   // initialize the state of the app
  //   this.state = NoteStore.getState();
  // }

  // componentDidMount() {
  //   NoteStore.listen(this.storeChanged);
  // }

  // componentWillUnmount() {
  //   NoteStore.unlisten(this.storeChanged);
  // }

  // storeChanged = (state) => {
  //   // this method requires a property initializer because it defaults to 
  //   // 'undefined' without the property initializer setting the "this" method.
  //   this.setState(state);
  // }
  */
 
  // property initializer feature of ES7 for addNote binds it to this automatically.
  addNote = () => {
    // setting state requires that you pass in the entire state object! ooooh.
    // Functional style
    // this.setState({
    //    // concat returns an array, push only returns length
    //   notes: this.state.notes.concat({
    //   id: uuid.v4(),
    //   task: 'New task'
    // });

    // Imperative style{}
    NoteActions.create({task: 'New task'});
  }

  editNote = (id, task) => {
    if(!task.trim()) {
      // if there's nothing there, return
      return;
    } 
    NoteActions.update({id, task});
  }

  deleteNote = (id, e) => {
    e.stopPropagation();
    NoteActions.delete(id);
  }

  render() {
    return (
      <div>
        <button className="add-note" onClick={this.addNote}>Add Note</button>
        <AltContainer stores={[NoteStore]} inject={{ notes: () => NoteStore.getState().notes}}>
          <Notes onEdit={this.editNote} onDelete={this.deleteNote}/>
        </AltContainer>
      </div>
    );
  }
}