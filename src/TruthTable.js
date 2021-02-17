import React, {Component} from 'react';

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
        this.drawTruthTable(this.props.value, this.props.parsed, this.props.literals);
    }

    drawTruthTable = (value, parsed, literals) => {
        if (this.props.submitted && literals !== null) {
            let canvas = this.canvas.current;
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'black';
            let numLiterals = literals.size;
            let numSpaces = numLiterals + 1;
            let topLeft = (this.state.width - numSpaces * 100) / 2;
            let firstLineX = topLeft + 100;
            let rows = Math.pow(2, numLiterals);
            for (let i = 0; i < numLiterals; i++) {
                let startX = firstLineX + 100 * i;
                let startY = 0;
                let endX = startX;
                let endY = startY + (rows + 1) * 30 + 10;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            let startX = topLeft;
            let startY = 30;
            let valueSpace = 10 * value.length + 50;
            let endX = startX + 100 * numLiterals
            if (valueSpace > 100) {
                endX += valueSpace;
            } else {
                endX += 100;
            }
            let endY = startY;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = 2;
            ctx.stroke();
            const itr = literals.values();
            let literal = itr.next();
            let x = topLeft + 45;
            let firstX = x;
            while (!literal.done) {
                this.writeText({text: literal.value, x: x, y: 5});
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
            // writes truth values
            let y = 15;
            // row
            for (let i = 0; i < rows; i++) {
                y += 30;
                // col
                for (let j = 0; j < numLiterals; j++) {
                    let divisor = Math.pow(2, numLiterals - j - 1);
                    let group = Math.floor(i / divisor);
                    // first half of rows
                    if (group % 2 === 0) {
                        this.writeText({text: 'T', x: firstX + 98 * j, y: y});
                    } else {
                        this.writeText({text: 'F', x: firstX + 98 * j, y: y});
                    }
                }
            }
        }
    };

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

    render() {
        return (
            <canvas ref={this.canvas} width={this.state.width} height={this.state.height}/>
        )
    }
}

export default TruthTable;