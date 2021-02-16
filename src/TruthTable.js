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

    componentDidUpdate(){
        console.log('updating');
        this.drawTruthTable();
        this.addText();
    }

    addText = () => {
        const itr = this.props.literals.values();
        let literal = itr.next();
        while (!literal.done) {
            this.writeText({ text: literal.value, x: 180, y: 70 });
            literal = itr.next();
        }
    }

    // Draws lines to represent the shortest path from the start
    // to end building.
    drawTruthTable = () => {
        let ctx = this.canvas.current.getContext('2d');
        ctx.strokeStyle = 'black';
        let numLiterals = 2;
        let numSpaces = numLiterals + 1;
        let topLeft = (this.state.width - numSpaces * 100) / 2;
        let firstLineX = topLeft + 100;
        for (let i = 0; i < numLiterals; i++) {
            let startX = firstLineX + 100 * i;
            let startY = 0;
            let endX = startX;
            let endY = startY + 200;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        let startX = topLeft;
        let startY = 30;
        let endX = startX + 100 * numSpaces;
        let endY = startY;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    writeText = (info, style = {}) => {
        const { text, x, y } = info;
        const { fontSize = 20, fontFamily = 'Arial', color = 'black', textAlign = 'left', textBaseline = 'top' } = style;
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
