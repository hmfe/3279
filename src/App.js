import React, { Component } from "react";
import Autocomplete from "./Autocomplete";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = { contacts: [] };

  componentDidMount() {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then(response => {
        const newContacts = response.data.map(c => {
          return c.name;
        });
        const newState = Object.assign({}, this.state, {
          contacts: newContacts
        });
        this.setState(newState);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="App" class="center">
        <h1>Simple Search Application</h1>
        <Autocomplete items={this.state.contacts} />
      </div>
    );
  }
}

export default App;
