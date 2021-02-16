import React, {Component} from 'react';
import "./Style.css";
import TruthTable from "./TruthTable";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            parsed: [],
            literals: new Set()
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Changes the background color to light purple when website first starts.
    componentDidMount() {
        document.body.style.backgroundColor = "#D8BFD8"
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit = (event) => {
        let value = event.target.value;
        let parsed = this.parseValue(value);
        this.setState(
            {value: value,
                parsed: parsed,
                literals: this.getLiterals(parsed)},
        );
    }

    parseValue = (value) => {
        let result = []
        for (let i = 0; i < value.length; i++) {
            result[i] = value.charAt(i);
        }
        return result;
    };

    getLiterals = (parsed) => {
        let result = new Set();
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].charCodeAt(0) >= 65 &&
                parsed[i].charCodeAt(0) <= 90) {
                result.add(parsed[i]);
            }
        }
        return result;
    }

    render() {
        return (
            <div align="center">
                <b><font size="6">Simply Logic</font></b>
                <br/>
                <p><font size="4">Enter a sentence you want to
                generate a truth table for:</font></p>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.value} onChange={this.handleChange}/>
                    <input type="submit" value="Submit" />
                </form>
                <br/>
                <TruthTable literals={this.state.literals}/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default App;