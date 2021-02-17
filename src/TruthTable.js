import React, {Component} from 'react';

let numLiterals, ctx, value, parsed, literals, rows,
    topLeft, valueSpace, literalList, values, middle;

class TruthTable extends Component {


    constructor(props) {
        super(props);
        this.state = {
            width: 800,
            height: 800
        };
        this.canvas = React.createRef();
    }

    componentDidUpdate() {
        value = this.props.value;
        parsed = this.props.parsed;
        literals = this.props.literals;
        this.drawTruthTable();
    }

    drawTruthTable = () => {
        if (this.props.submitted && literals !== null) {
            numLiterals = literals.size;
            let canvas = this.canvas.current;
            ctx = canvas.getContext('2d');
            // clears drawing board
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;

            let numSpaces = numLiterals + 1;
            topLeft = (this.state.width - numSpaces * 100) / 2;
            rows = Math.pow(2, numLiterals);
            this.drawVerticalLines();

            valueSpace = 10 * value.length + 50;
            this.drawHorizontalLine();

            this.writeLiterals();

            this.writeTruthValues();

            this.writeResult();
        }
    };

    writeResult = (y) => {
        let result = false;
        for (let i = 0; i < parsed.length; i++) {
            let c = parsed[i];
            if (c === "&") {
                result = this.and(values.get(parsed[i - 1]),
                    values.get(parsed[i + 1]));
            } else if (c === "v") {
                result = this.or(values.get(parsed[i - 1]),
                    values.get(parsed[i + 1]));
            } else if (c === "~") {
                result = this.not(values.get(parsed[i + 1]));
            }
        }
        if (result) {
            this.writeText({text: 'T', x: middle, y: y});
        } else {
            this.writeText({text: 'F', x: middle, y: y});
        }
    }

    writeLiterals = () => {
        literalList = [];
        const itr = literals.values();
        let literal = itr.next();
        let x = topLeft + 45;
        while (!literal.done) {
            this.writeText({text: literal.value, x: x, y: 5});
            literalList.push(literal.value);
            literal = itr.next();
            x += 98;
        }
        if (valueSpace > 100) {
            x -= 20;
        } else {
            x -= 47;
            x += (100 - 10 * value.length) / 2;
        }
        this.writeText({text: value, x: x, y: 5});
    }

    drawHorizontalLine = () => {
        let startX = topLeft;
        let startY = 30;
        let endX = startX + 100 * numLiterals
        if (valueSpace > 100) {
            middle = endX + valueSpace / 2 - 5;
            endX += valueSpace;
        } else {
            middle = endX + 45;
            endX += 100;
        }
        let endY = startY;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    writeTruthValues = () => {
        let firstX = topLeft + 45;
        let y = 15;
        // row
        for (let i = 0; i < rows; i++) {
            y += 30;
            values = new Map();
            // col
            for (let j = 0; j < numLiterals; j++) {
                let divisor = Math.pow(2, numLiterals - j - 1);
                let group = Math.floor(i / divisor);
                // first half of rows
                if (group % 2 === 0) {
                    this.writeText({text: 'T', x: firstX + 98 * j, y: y});
                    values.set(literalList[j], true);
                } else {
                    this.writeText({text: 'F', x: firstX + 98 * j, y: y});
                    values.set(literalList[j], false);
                }
            }
            this.writeResult(y);
        }
    }

    drawVerticalLines = () => {
        let firstLineX = topLeft + 100;
        for (let i = 0; i < numLiterals; i++) {
            let startX = firstLineX + 100 * i;
            let startY = 0;
            let endX = startX;
            let endY = startY + (rows + 1) * 30 + 10;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }

    writeText = (info, style = {}) => {
        const {text, x, y} = info;
        const {fontSize = 20, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top'} = style;
        let ctx = this.canvas.current.getContext('2d');
        ctx.beginPath();
        ctx.font = fontSize + 'px ' + fontFamily;
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        ctx.stroke();
    }

    and = (x, y) => {
        console.log(x);
        console.log(y);
        return x && y;
    }

    or = (x, y) => {
        return x | y;
    }

    not = (x) => {
        return !x;
    }

    render() {
        return (
            <canvas ref={this.canvas} width={this.state.width} height={this.state.height}/>
        )
    }
}

export default TruthTable;