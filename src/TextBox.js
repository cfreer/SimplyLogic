import React, {Component} from 'react';

class TextBox extends Component {

    render() {
        return (
            <form>
                <input type="text" value={this.props.value} onChange={this.props.handleChange}/>
            </form>
        );
    }
}

export default TextBox;
