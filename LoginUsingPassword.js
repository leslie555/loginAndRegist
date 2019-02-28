import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class LoginUsingPassword extends React.Component {
  constructor(props){
    super(props);
    this.submitHandler = this.submitHandler.bind(this);
    this.errCb = this.errCb.bind(this);
  }
  submitHandler(){
    const {form: {validateFields}, dispatch} = this.props;
    validateFields({ force: true }, (err, value) => {
      if (!err) {
        dispatch({ type: 'userModel/loginUsingPassword', payload: { ...value, errCb:this.errCb } });
        dispatch({ type: 'appModel/updateState', payload: { mobileHint: value.mobile } });
      }
    });
  }
  errCb(err){
    const {form:{getFieldValue, setFields}} = this.props;
    const message = err.message||err;
    if(message.indexOf('手机号')>-1) {
      // 使用setFields改变errors必须带上当前的value，getFieldProps中可以不带上value
      setFields({ mobile: { value: getFieldValue('mobile'), errors: [message] } });
      return;
    }
    if(message.indexOf('密码')>-1) {
      setFields({ password: { value: getFieldValue('password'), errors: [message] } });
      return;
    }
    console.error(message);
  }

  render() {
    const {
      mobileHint,
      loginShowPw,
      dispatch,
      form: { getFieldProps, getFieldValue, setFieldsValue, getFieldError, setFields },
    } = this.props;
    return (
      <React.Fragment>
        <TextField
          label="手机号"
          placeholder="请输入11位手机号码"
          error={Boolean(getFieldError('mobile'))}
          helperText={getFieldError('mobile')}
          fullWidth
          className={global.classes.textField}
          {...getFieldProps(
            'mobile',
            {
              initialValue: mobileHint || '',
              onChange: (e) => {
                const val = e.target.value;
                if(val.length > 11){
                  setTimeout(function(){ //这里必须延迟，否则不会生效，为什么，不知道
                    setFieldsValue({mobile: val.slice(0, 11)});
                  }, 0);
                }
                setFields({ mobile: { errors: undefined } });
              },
              validate: [
                { rules: [{ required: true, message: '请输入手机号' }] },
                {
                  trigger: 'onBlur',
                  rules: [
                    {
                      pattern: global.mobileRegExpStr,
                      message: '手机号格式错误',
                    },
                  ],
                },
              ],
            },
          )}
        />
        <TextField
          type={loginShowPw ? 'text' : 'password'}
          label="密码"
          placeholder="请输入密码"
          fullWidth
          className={global.classes.textField}
          error={Boolean(getFieldError('password'))}
          helperText={getFieldError('password')}
          {...getFieldProps(
            'password',
            {
              initialValue: '',
              onChange: () => {
                setFields({ password: { errors: undefined } });
              },
              validate: [
                { rules: [{ required: true, message: '请输入密码' }] },
                {
                  trigger: 'onBlur',
                  rules: [
                    { min: 6, message: '密码不应少于6位' },
                  ],
                },
              ],
            },
          )}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={()=>{dispatch({ type: 'appModel/updateState', payload: { loginShowPw: !loginShowPw } });}}
                >
                  {loginShowPw ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(evt)=>{
            if(evt.keyCode===13) this.submitHandler();
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={this.submitHandler}
          disabled={!getFieldValue('mobile') || !getFieldValue('password') || Boolean(getFieldError('mobile')) || Boolean(getFieldError('password'))}
          fullWidth
          className={global.classes.submitBtn}
          onKeyDown={(evt)=>{
            if(evt.keyCode===13) this.submitHandler();
          }}
        >登录</Button>
      </React.Fragment>
    );
  }
}

export default connect(({ appModel: { mobileHint, loginShowPw } }) => {
  return { mobileHint, loginShowPw };
})(createForm()(LoginUsingPassword));
