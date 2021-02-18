import React, {Component} from 'react';
import "./Style.css";
import TruthTable from "./TruthTable";
import TextBox from "./TextBox";

let bool = ["&", "v", "~", "(", ")", "->", "<->"]

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: '',
            value: '',
            parsed: [],
            literals: null,
            submitted: false,
            error: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Changes the background color to light purple when website first starts.
    componentDidMount() {
        document.body.style.backgroundColor = "#D8BFD8"
    }

    handleChange(event) {
        this.setState({
            value: event.target.value,
            textValue: event.target.value, submitted: false
        });
    }

    handleSubmit() {
        this.setState({
            submitted: true,
            error: false
        })
        let value = this.state.value.toUpperCase()
        value = value.replaceAll("V", "v");
        if (!this.isValidParentheses(value)) {
            this.throwError("parentheses");
        }
        let parsed = this.parseValue(value);
        let literals = this.getLiterals(parsed);
        this.setState({
            value: value,
            textValue: '',
            parsed: parsed,
            literals: literals
        });
    }

    parseValue = (value) => {
        let result = [];
        let index = 0;
        for (let i = 0; i < value.length; i++) {
            let c = value.charAt(i);
            // next 2 chars
            let next2 = '' + c + value.charAt(i + 1);
            // next 3 chars
            let next3 = '' + next2 + value.charAt(i + 2);
            if (next2 === "->") {
                result[index] = next2;
                i++;
            } else if (next3 === "<->") {
                result[index] = next3;
                i += 2;
            } else {
                result[index] = c;
            }
            index++;
        }
        return result;
    };

    isBinary = (c) => {
        return c === "&" || c === "v" || c === "->" || c === "<->";
    }

    isValid = (prev, c, next) => {
        let isValidPrev = this.isValidPrev(prev);
        let isValidNext = this.isValidNext(next);
        if (c === "~" || c === "(") {
            return isValidNext && (this.isBinary(prev) ||
                prev === "~" || prev === undefined || prev === "(");
        } else if (this.isBinary(c)) {
            return isValidPrev && isValidNext;
        } else if (c === ")") {
            return isValidPrev;
        }
    }

    isValidParentheses = (value) => {
        if (!value.includes("(") && !value.includes(")")) {
            return true;
        }
        let s = [];
        for (let i = 0; i < value.length; i++) {
            let c = value.charAt(i);
            if (c === "(") {
                s.push(c);
            }
            if (c === ')') {
                if (s.length === 0) {
                    return false;
                }
                let last = s[s.length - 1];
                if (c === ')' && last === '(') {
                    s.pop();
                } else {
                    return false;
                }
            }
        }
        return s.length === 0;
    }

    getLiterals = (parsed) => {
        let result = new Set();
        let incorrectSym = new Set();
        for (let i = 0; i < parsed.length; i++) {
            let c = parsed[i];
            let prev = parsed[i - 1];
            let next = parsed[i + 1];
            if (this.isLiteral(c)) {
                if (this.isLiteral(next)) {
                    this.throwError("symbols");
                    break;
                }
                result.add(c);
            } else if (!bool.includes(c) && !incorrectSym.has(c)) {
                this.throwError(c);
                incorrectSym.add(c);
            } else if (!this.isValid(prev, c, next)) {
                this.throwError("syntax");
                break;
            }
        }
        return result;
    };

    isLiteral = (c) => {
        if (c !== undefined) {
            return c.charCodeAt(0) >= 65 &&
                c.charCodeAt(0) <= 90;
        }
        return false;
    }

    isValidPrev = (prev) => {
        return this.isLiteral(prev) || prev === ")";
    }

    isValidNext = (next) => {
        return this.isLiteral(next) || next === "~" || next === "(";
    }

    throwError = (c) => {
        this.reset();
        this.setState({
            error: true
        });
        if (c === "parentheses") {
            alert("Incorrect format: Parentheses don't match.")
        } else if (c === "symbols") {
            alert("Incorrect format: Cannot have more than one symbol in a row; " +
                "Symbols must be one letter.")
        } else if (c === "syntax") {
            alert("Incorrect format: Check syntax.")
        } else if (c === " ") {
            alert("Incorrect format: Enter an atomic sentence without spaces.");
        } else {
            alert("Incorrect format: " + c + " is not a valid character.");
        }
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
                    Key: and: &, or: v, not: ~, conditional: ->, biconditional: &lt;-> <br/>
                    Enter an atomic sentence you want to
                    generate a truth table for:
                </font></p>
                <TextBox handleChange={this.handleChange} value={this.state.textValue}/>
                <button onClick={() => {
                    this.handleSubmit();
                }}><font size="4">Submit</font>
                </button>
                <br/>
                <br/>
                <TruthTable value={this.state.value} parsed={this.state.parsed}
                            literals={this.state.literals} submitted={this.state.submitted}
                            error={this.state.error}/>
                <br/>
                <br/>
            </div>
        );
    }
}

export default App;