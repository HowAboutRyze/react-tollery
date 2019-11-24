import React from 'react';

// 基础组件
class BaseInput extends React.Component {
    render() {
        let left = {display: 'inline-block', width: '100px'}
        let right = {display: 'inline-block', width: '200px', boxSizing: 'border-box'}
        let DOM
        let changeFn
        if (this.props.onChange) {
            changeFn = e => {
                this.props.onChange(e)
            }
        } else {
            changeFn = () => {
            }
        }
        // 首先，根据类型选择需要的输入框
        if (this.props.type === 'input' | !this.props.type) {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <input style={right} type="text"
                       onChange={changeFn}
                       value={this.props.value}/>
            </span>
        } else if (this.props.type === 'textarea') {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <textarea style={right} type="text" onChange={changeFn}
                          value={this.props.value}/>
            </span>
        }
        return <div style={{height: '200px'}}>
            {DOM}
            {/* 其次，允许将额外补充内容添加到这里，实用this.props.children作为slot插槽 */}
            {this.props.children}
        </div>
    }
}
export default BaseInput;
