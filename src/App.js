import React, {Component} from 'react';
import "./Style.css";
import TruthTable from "./TruthTable";
import TextBox from "./TextBox";
let bool = ["&", "v", "~"]

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: '',
            value: '',
            parsed: [],
            literals: null,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Changes the background color to light purple when website first starts.
    componentDidMount() {
        document.body.style.backgroundColor = "#D8BFD8"
    }

    handleChange(event) {
        this.setState({value: event.target.value,
            textValue: event.target.value, submitted: false});
    }

    handleSubmit() {
        this.setState({
            submitted: true
        })
        let value = this.state.value;
        let parsed = this.parseValue(value);
        let literals = this.getLiterals(parsed);
        this.setState({
            textValue: '',
            parsed: parsed,
            literals: literals
        });
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
            let c = parsed[i];
            console.log(c)
            if (c.charCodeAt(0) >= 65 &&
                c.charCodeAt(0) <= 90) {
                result.add(c);
            } else if (!bool.includes(c)) {
                this.throwError();
            }
        }
        return result;
    };

    throwError = () => {
        this.reset();
        alert("Incorrect format.");
    }

    reset = () => {
        this.setState({
            textValue: '',
            value: '',
            parsed: [],
            literals: null,
            submitted: false
        });
    }

    render() {
        return (
            <div align="center">
                <b><font size="6">Simply Logic</font></b>
                <br/>
                <p><font size="4">
                    Key: and: &, or: v, not: ~ <br/>
                    Enter a sentence you want to
                    generate a truth table for:
                </font></p>
                <TextBox handleChange={this.handleChange} value={this.state.textValue}/>
                <button onClick={() => {
                    this.handleSubmit();
                }}><font size="3">Submit</font>
                </button>
                <br/>
                <br/>
                <TruthTable value={this.state.value} parsed={this.state.parsed}
                            literals={this.state.literals} submitted={this.state.submitted}/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default App;