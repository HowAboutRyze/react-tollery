import React from 'react';
import BaseInput from './BaseInput';

class ChineseName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.verification = this.verification.bind(this)
    }

    verification(e) {
        let v = e.target.value
        // 必须是中文字符
        if (/[\u4e00-\u9fa5]/.test(v)) {
            this.setState({
                value: v
            })
        }
    }

    render() {
        return <BaseInput label={'名字'}
                          type={'input'}
                          value={this.state.value}
                          onChange={this.verification}>
            <span style={{color: 'red'}}>只允许输入中文字符</span>
        </BaseInput>
    }
}

export default ChineseName;