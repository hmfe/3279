import React, { Component } from "react";
import PropTypes from "prop-types";
import { Table, Button } from "semantic-ui-react";

var searchedHistoryList = [];

export class Autocomplete extends Component {
  static propTypes = {
    items: PropTypes.instanceOf(Array)
  };

  static defaultProperty = {
    items: []
  };

  constructor(props) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    };
  }
  state = this.initialState;
  firstEditable = React.createRef();

  onChange = e => {
    const { items } = this.props;
    const userInput = e.currentTarget.value;

    const filteredSuggestions = items.filter(
      item => item.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    this.setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput: e.currentTarget.value
    });
  };

  // The user selected an item in the list
  onClick = e => {
    this.setState({
      activeSuggestion: 1,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    });

    searchedHistoryList.push({
      id: searchedHistoryList.length,
      item: e.currentTarget.innerText,
      datetime: new Date().toLocaleString()
    });
  };

  onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = this.state;

    // The user pressed the Return (Enter) key
    if (e.keyCode === 13) {
      this.setState({
        activeSuggestion: 1,
        showSuggestions: false,
        userInput: ""
      });

      searchedHistoryList.push({
        id: searchedHistoryList.length,
        item: filteredSuggestions[activeSuggestion],
        datetime: new Date().toLocaleString()
      });
    }
  };

  deleteRow = id => {
    searchedHistoryList.splice(id, 1);
    this.setState(searchedHistoryList);
  };

  deleteAllRows = e => {
    searchedHistoryList.splice(0, searchedHistoryList.length);
    this.setState(searchedHistoryList);
  };

  render() {
    const {
      onChange,
      onClick,
      onKeyDown,
      state: { filteredSuggestions, showSuggestions, userInput }
    } = this;

    let suggestionsListComponent;
    if (showSuggestions && userInput) {
      if (filteredSuggestions.length) {
        suggestionsListComponent = (
          <ul class="items">
            {filteredSuggestions.map((item, index) => {
              return (
                <li key={item} onClick={onClick}>
                  {item}
                </li>
              );
            })}
          </ul>
        );
      } else {
        suggestionsListComponent = (
          <div class="no-suggestions">
            <em>No suggestions</em>
          </div>
        );
      }
    }
    if (searchedHistoryList.length === 0) {
      return (
        <React.Fragment>
          <input
            type="search"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
          />
          {suggestionsListComponent}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />

        <input
          type="search"
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={userInput}
        />
        {suggestionsListComponent}

        <br />
        <br />

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="headerSearch">
                Search History
              </Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell>
                <button
                  className="btn"
                  onClick={() => {
                    this.deleteAllRows();
                  }}
                >
                  Clear All
                </button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {searchedHistoryList.map(search => {
              return (
                <Table.Row key={search.id}>
                  <Table.Cell
                    className="narrow"
                    data-column="item"
                    data-row={search.id}
                    onFocus={this.highlightAll}
                    onChange={this.handleContentEditableUpdate}
                  >
                    {search.item}
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    className="datetimeCell"
                    data-column="datetime"
                    data-row={search.id}
                    onFocus={this.highlightAll}
                    onChange={this.handleContentEditableUpdate}
                  >
                    {search.datetime}
                  </Table.Cell>
                  <Table.Cell className="narrow" textAlign="right">
                    <Button
                      className="btn"
                      onClick={() => {
                        this.deleteRow(search.id);
                      }}
                    >
                      <i className="material-icons">close</i>
                    </Button>
                  </Table.Cell>
                </Table.Row>
              );
            })}
            <Table.Row>
              <Table.Cell
                className="narrow"
                data-column="item"
                innerRef={this.firstEditable}
                onChange={this.handleContentEditable}
              />
              <Table.Cell
                className="narrow"
                data-column="datetime"
                onFocus={this.highlightAll}
                onChange={this.handleContentEditable}
              />
            </Table.Row>
          </Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

export default Autocomplete;
