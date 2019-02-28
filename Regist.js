import React from 'react';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import { createForm } from 'rc-form';
import CountDownBtn from './CountDownBtn';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import LoginAndRegistContainer from './LoginAndRegistContainer';
import Typography from '@material-ui/core/Typography';


class Regist extends React.Component {
  constructor(props){
    super(props);
    this.state={};
    this.getVerifyCodeBtnClickHandler = this.getVerifyCodeBtnClickHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.errCb = this.errCb.bind(this);
  }
  getVerifyCodeBtnClickHandler(){
    const {form:{validateFields}, dispatch} = this.props;
    validateFields(['mobile'], { force: true }, (err, value) => {
      if (!err) {
        dispatch({ type: 'userModel/getVerifyCode', payload: { ...value, purpose: 'regist', errCb:this.errCb } });
        dispatch({ type: 'appModel/updateState', payload: { mobileHint: value.mobile } });
      }
    });
  }

  submitHandler(){
    const {form:{validateFields}, dispatch} = this.props;
    validateFields({ force: true }, (err, value) => {
      if (!err) {
        dispatch({ type: 'userModel/regist', payload: { ...value, errCb:this.errCb } });
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
    if(message.indexOf('验证码')>-1) {
      setFields({ verifyCode: { value: getFieldValue('verifyCode'), errors: [message] } });
      return;
    }
    console.error(message);
  }
  render() {
    const {
      dispatch,
      mobileHint,
      form: { getFieldProps, getFieldError, setFields, setFieldsValue, getFieldValue },
    } = this.props;
    const submitBtnDisabled = !getFieldValue('mobile') || !getFieldValue('verifyCode')
      || Boolean(getFieldError('mobile')) || Boolean(getFieldError('verifyCode'));
    return (
      <LoginAndRegistContainer title={`衣衣地图${global.realm==='shop'? '店铺端':(global.realm==='producer'? '品牌商端':'管理员')}`}>
        <Typography variant="h5" style={{marginTop:'1rem', marginBottom: '1rem'}}>注册</Typography>
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
        <div 
          style={{display: 'flex', alignItems: 'center'}}
        >
          <TextField
            label="短信验证码"
            placeholder="请输入4位短信验证码"
            error={Boolean(getFieldError('verifyCode'))}
            helperText={getFieldError('verifyCode')&&getFieldError('verifyCode')[0]}
            className={global.classes.textField}
            style={{flexGrow: 1}}
            {...getFieldProps(
              'verifyCode',
              {
                initialValue: '',
                onChange: () => {
                  setFields({ verifyCode: { errors: undefined } });
                },
                validate: [
                  { rules: [{ required: true, message: '请输入短信验证码' }] },
                  {
                    trigger: 'onBlur',
                    rules: [
                      {
                        len: 4,
                        message: '短信验证码应为4位',
                      },
                      {
                        pattern: '\\d{4}',
                        message: '短信验证码为纯数字',
                      },
                    ],
                  },
                ],
              },
            )}
            onKeyDown={(evt)=>{
              if(evt.keyCode===13) this.submitHandler();
            }}
          />
          <CountDownBtn
            onClick={this.getVerifyCodeBtnClickHandler}
            text="获取验证码"
            newText="重新获取"
            prefix="regist"
          />
        </div>
        <Button
          variant="contained"
          color={submitBtnDisabled ? 'secondary' : 'primary'}
          onClick={this.submitHandler}
          disabled={submitBtnDisabled}
          fullWidth
          className={global.classes.submitBtn}
          onKeyDown={(evt)=>{
            if(evt.keyCode===13) this.submitHandler();
          }}
        >注册</Button>
        <Button
          color="primary"
          style={{ paddingLeft: '0.2rem' }}
          onClick={() => { dispatch(routerRedux.push('/login')); }}
        >登录&nbsp;&nbsp;&nbsp;</Button>
      </LoginAndRegistContainer>
    );
  }
}


export default connect(({ appModel: { mobileHint } }) => {
  return { mobileHint };
})(createForm()(Regist));
