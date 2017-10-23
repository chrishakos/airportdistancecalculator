import React from "react";
import classnames from "classnames";


export default class AirportSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      airports: [],
      selectedAirport: "",
      cursor: null
    };
  }

  update(property) {
    return e => {
      this.setState({ [property]: e.target.value, airports: [] }, this.searchAirports);
    };
  }

  searchAirports(){
    if (this.state.query.length > 1){
    let airports = $.ajax({
        method: 'GET',
        url: `/api/airports`,
        data: {query: `${this.state.query.toLowerCase()}`}
      })
      .done((response) => {
        console.log(response);
        this.setState( {airports: response});})
      .fail((xhr) => {
        console.log('error', xhr);
      });
    }
  }

  selectAirport(airport) {
    this.setState({
      query: airport.name + ", "+ airport.state_abv + " (" + airport.code + ")",
      selectedAirport : airport,
      airports: []}, this.props.updateAirport(this.props.type, airport));
  }

  handleKeyPress(e){
    if (this.state.cursor === null && e.key === "ArrowDown"){
      this.setState({cursor: 0}, () =>{
        this.refs[this.state.cursor].focus();
        let airport = this.state.airports[this.state.cursor];
        this.setState({query: airport.name + ", "+ airport.state_abv + " (" + airport.code + ")"});
      });
    } else if (this.state.cursor >= 0 && e.key === "ArrowDown"){
      this.setState({cursor: this.state.cursor + 1}, () =>{
        this.refs[this.state.cursor].focus();
        let airport = this.state.airports[this.state.cursor];
        this.setState({query: airport.name + ", "+ airport.state_abv + " (" + airport.code + ")"});
      });
    } else if (this.state.cursor > 0 && e.key === "ArrowUp"){
      this.setState({cursor: this.state.cursor - 1}, () =>{
        this.refs[this.state.cursor].focus();
        let airport = this.state.airports[this.state.cursor];
        this.setState({query: airport.name + ", "+ airport.state_abv + " (" + airport.code + ")"});
      });
    } else if (this.state.cursor === 0 && e.key === "ArrowUp"){
      this.setState({cursor: null});
    } else if (this.state.cursor >= 0 && e.key === "Enter"){
      this.selectAirport(this.state.airports[this.state.cursor]);
    } else if (this.state.cursor >= 0 &&
                e.key != "ArrowUp" ||
                e.key != "ArrowDown" ||
                e.key != "Enter") {
      this.setState({cursor: null});
                }
  }

  render(){
    return (
      <div className='airport-search-body'>
          <input
            className="airport-search-bar"
            placeholder={`Search ${this.props.type} Airport...`}
            type="text"
            value={this.state.query}
            onChange={this.update("query")}
            onKeyDown={this.handleKeyPress.bind(this)}/>
            <ul className="airport-result-list"
            id="style-8">
              {this.state.airports.map((airport, index) => {
                return <li
                className={`airport-result ${this.state.cursor === index ? 'active' : ''}`}
                ref={index}
                key={index}
                onClick={() => {
                  this.selectAirport(airport);
                }}
                ><div className="airport-name">{airport.name} ({airport.code})</div>
                  <div className="airport-location">{airport.city}, {airport.state_abv}</div>
                 </li>;
              })}
            </ul>
        </div>
    );
  }

}

// jwQERXuHQ0MNMrYVgYCHi
// 3g6kfQh3hHfwr99dxyttp7Ap60tG1tCKrZF1P4Ms
//
// https://api.aerisapi.com/[:endpoint]/[:action]?client_id=jwQERXuHQ0MNMrYVgYCHi&client_secret=3g6kfQh3hHfwr99dxyttp7Ap60tG1tCKrZF1P4Ms
// https://api.aerisapi.com/places/airports/search?query=country:us,city:^a&client_id=jwQERXuHQ0MNMrYVgYCHi&client_secret=3g6kfQh3hHfwr99dxyttp7Ap60tG1tCKrZF1P4Ms
// https://api.aerisapi.com/places/airports/search?limit=50&query=country:us,city:^a&client_id=jwQERXuHQ0MNMrYVgYCHi&client_secret=3g6kfQh3hHfwr99dxyttp7Ap60tG1tCKrZF1P4Ms
// https://api.aerisapi.com/places/airports/search?limit=50&filter=largeairport&query=country:us,city:^newa&client_id=jwQERXuHQ0MNMrYVgYCHi&client_secret=3g6kfQh3hHfwr99dxyttp7Ap60tG1tCKrZF1P4Ms


// 52ca743c
// 79c559a7e52a22c3c8f7f84279a6c49f
