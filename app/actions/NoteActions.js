import alt from "../libs/alt";

// a generator for creating these CRUD actions
export default alt.generateActions('create', 'update', 'delete', 'deleteAll');