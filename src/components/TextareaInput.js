import React from 'react';
import BaseInput from './BaseInput';

class TextareaInput extends React.Component {
    render() {
        return <BaseInput label={'个人情况'} type={'textarea'}>
            <span style={{color: 'red'}}>请务必填写</span>
        </BaseInput>
    }
}

export default TextareaInput;