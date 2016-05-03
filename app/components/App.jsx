import React from 'react';
import Notes from './Notes.jsx';
import uuid from 'node-uuid';

export default class App extends React.Component {

  constructor(props) {
    // if you don't call this, then this.props is not iniitalized
    super(props);
    this.state = {
      notes: [
        {
          id: uuid.v4(),
          task: 'Learn Webpack'
        },
        {
          id: uuid.v4(),
          task: 'Learn React'
        },
        {
          id: uuid.v4(),
          task: 'Do Laundry'
        }
      ]
    };
  }

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
    this.state.notes.push({
      id: uuid.v4(),
      task: 'New Task'
    });
    this.setState({ notes: this.state.notes });
  }

  editNote = (id, task) => {
    if(!task.trim()) {
      // if there's nothing there, return
      return;
    } 
    const notes = this.state.notes.map(note =>{
      if (note.id === id && task) {
        note.task = task;
      }
      return note;
    });
    this.setState({notes});
  }

  deleteNote = (id, e) => {
    e.stopPropagation();
    this.setState({ 
      notes: this.state.notes.filter( note => note.id !== id )
    });
  }

  render() {
    const notes = this.state.notes;

    return (
      <div>
        <button className="add-note" onClick={this.addNote}>Add Note</button>
        <Notes notes={this.state.notes} onEdit={this.editNote} onDelete={this.deleteNote}/>
      </div>
    );
  }
}