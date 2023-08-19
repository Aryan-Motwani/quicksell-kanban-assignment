import List from "./List";
import {cards} from './data';
import {data} from './api-data';
import { ReactComponent as Controls } from './icons/controls.svg';
import React, { Component } from 'react'
import Form from "./Form";
import "./app.css"

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {DataisLoaded : false, groupingMode : "status", orderingMode : "priority", cat : false, addToggle : false};
    this.handleSelectOne = this.handleSelectOne.bind(this);
    this.handleSelectTwo = this.handleSelectTwo.bind(this);
    this.add = this.add.bind(this);
    this.delete = this.delete.bind(this);
    this.toggleCat = this.toggleCat.bind(this);
    this.handleClickOutsideDropdowns = this.handleClickOutsideDropdowns.bind(this);
    this.handleAddToggle = this.handleAddToggle.bind(this);

  }

  componentDidMount() {
    document.addEventListener("click", this.handleClickOutsideDropdowns);
      fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
          .then((res) => res.json())
          .then((json) => {
              this.setState({
                  items: json,
                  DataisLoaded: true
              });
              
          })
    }

    componentWillUnmount() {
      document.removeEventListener("click", this.handleClickOutsideDropdowns);
    }

    compareProperty(a, b, property) {
      const value1 = a[property]
      const value2 = b[property]
      if(typeof a == String){
        value1 = a[property].toUpperCase();
        value2 = b[property].toUpperCase();
      }
  
      let comparison = 0;
  
      if (value1 > value2) {
          comparison = 1;
      } else if (value1 < value2) {
          comparison = -1;
      }
      return comparison;
  }

    handleSelectOne(e){
      this.setState({groupingMode : e.target.value})
    }
    handleSelectTwo(e){
      this.setState({orderingMode : e.target.value})
    }

    add(newCard){
      console.log("hi");
      let {items} = this.state; 
      items.tickets.push(newCard);
     this.setState({items, addToggle : false});
    }

    delete(str){
      let {items} = this.state;
      let idx;
      items.tickets.forEach((i,j) => {
        if(i.title == str){
          idx = j;
        }
      });
      items.tickets.splice(idx,1);
      this.setState({items});
    }

    toggleCat(){
      if(this.state.cat)
        this.setState({cat : false});
      else
      this.setState({cat : true});
    }

    handleClickOutsideDropdowns(event) {
      const dropdownsContainer = document.querySelector(".app-dropdowns");
    const displaySelect = document.querySelector(".display-select"); // Adjust the class name accordingly
    if (
      dropdownsContainer &&
      !dropdownsContainer.contains(event.target) &&
      displaySelect && 
      !displaySelect.contains(event.target)
    ) {
      this.setState({ cat: false });
    }
  }

  handleAddToggle(){
    console.log("toggle");
    if(this.state.addToggle)
      this.setState({addToggle : false});
    else
      this.setState({addToggle : true});
  }

  render() {

    if(this.state.DataisLoaded){
      console.log(this.state);

      let property = this.state.groupingMode.toLocaleLowerCase() == "userid" ? "userId" : this.state.groupingMode.toLocaleLowerCase();
      let boards = {};
      
      this.state.items.tickets.forEach(i => {
        if(boards[i[property.split(" ").join("-")]]){
          boards[i[property.split(" ").join("-")]].push(i);
        }else{
          boards[i[property.split(" ").join("-")]] = [i];
        }
      })

      let priorityNames = ["No Priority", "Low", "Medium", "High", "Urgent"];
      console.log(data.users)

      let userNames = {};
      data.users.forEach(i => {
        userNames[i.id] = i.name;
      })
      console.log(userNames);

      if(property == "priority"){
        let newBoards = {};
        Object.keys(boards).forEach(i => {
          newBoards[priorityNames[i]] = boards[i];
        })
        boards = newBoards;
      }else if(property == "userId"){
        let newBoards = {};
        Object.keys(boards).forEach(i => {
          newBoards[userNames[i]] = boards[i];
        })
        boards = newBoards;
      }


      console.log(boards);
      Object.keys(boards).forEach(i => {
        boards[i].sort((a, b) => this.compareProperty(a, b, this.state.orderingMode.toLocaleLowerCase()));
      })


      
      
      
      
      return (
        <div className="App">
          {/* <div className="overlay">
            <p>Hello World</p>
          </div> */}
          {this.state.cat &&
          <div className="app-dropdowns">
            <div className="main-drops">
                Grouping :  
            <select onChange={this.handleSelectOne} value={this.state.groupingMode}>
                <option>Status</option>
                <option>Priority</option>
                <option>UserId</option>
              </select>
            </div>
            <div>
            Ordering :  
            <select onChange={this.handleSelectTwo} value={this.state.orderingMode}>
                <option>Title</option>
                <option>Priority</option>
              </select>
            </div>
          
          </div>
          }
            <nav>
              <button className="display-btn" onClick={this.toggleCat}>
                <span className="btn-content">
                  <Controls className="task-bar-icon" width="1rem" />
                  Display
                </span>
              </button>
            </nav>
          {this.state.addToggle && <Form handleAddToggle={this.handleAddToggle} addToggle={this.state.addToggle} add={this.add} delete={this.delete}/>}
          <div className="main-lists">
          {Object.keys(boards).map((i) => {
          return (
            <List
              key={i}
              groupingMode={this.state.groupingMode}
              delete={this.delete}
              title={i}
              data={boards[i]}
              handleAddToggle={this.handleAddToggle}
            />
          );
        })}
          </div>
        </div>
      )
    }
  }
}

    
