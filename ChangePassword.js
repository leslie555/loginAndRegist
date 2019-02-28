import React from 'react';
import { connect } from 'react-redux';
import { createForm } from 'rc-form';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import LoginAndRegistContainer from './LoginAndRegistContainer';

function ChangePassword({
  changePwShowPw,
  dispatch,
  form: { getFieldProps, getFieldError, setFields, validateFields, getFieldValue },
}) {
  function submitHandler() {
    validateFields({ force: true }, (err, value) => {
      if (!err) {
        dispatch({ type: 'userModel/changePassword', payload: { ...value, errCb } });
      }
    });
  }
  function errCb(err){
    const message = err.message||err;
    if(message.indexOf('密码')>-1) {
      // 使用setFields改变errors必须带上当前的value，getFieldProps中可以不带上value
      setFields({ password: { value: getFieldValue('password'), errors: [message] } });
      return;
    }
    console.error(err);
  }
  return (
    <LoginAndRegistContainer title={`衣衣地图${global.realm==='shop'? '店铺端':(global.realm==='producer'? '品牌商端':'管理员')}`}>
      <Typography variant="h5" style={{marginTop:'1rem', marginBottom: '1rem'}}>设置密码</Typography>
      <TextField
        label="密码"
        placeholder="请输入新密码"
        type={changePwShowPw ? undefined : 'password'}
        error={Boolean(getFieldError('password'))}
        helperText={getFieldError('password')}
        fullWidth
        className={global.classes.textField}
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
                onClick={()=>{dispatch({ type: 'appModel/updateState', payload: { changePwShowPw: !changePwShowPw } });}}
              >
                {changePwShowPw ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label="重复密码"
        placeholder="请再次输入新密码"
        type={changePwShowPw ? undefined : 'password'}
        error={Boolean(getFieldError('repeatPw'))}
        helperText={getFieldError('repeatPw')}
        fullWidth
        className={global.classes.textField}
        {...getFieldProps(
          'repeatPw',
          {
            initialValue: '',
            onChange: () => {
              setFields({ repeatPw: { errors: undefined } });
            },
            validate: [
              { rules: [{ required: true, message: '请再次输入密码' }] },
              {
                trigger: 'onBlur',
                rules: [
                  {
                    validator(rule, value, callback) {
                      const password = getFieldValue('password');
                      if (value && value.length > 0 && value !== password) callback('两次输入的密码不一致');
                      else callback();
                    },
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
      <Button
        variant="contained"
        color={!getFieldValue('password') || !getFieldValue('repeatPw') ? 'secondary' : 'primary'}
        onClick={submitHandler}
        disabled={!getFieldValue('password') || !getFieldValue('repeatPw') || Boolean(getFieldError('password')) || Boolean(getFieldError('repeatPw'))}
        fullWidth
        className={global.classes.submitBtn}
        onKeyDown={(evt)=>{
          if(evt.keyCode===13) this.submitHandler();
        }}
      >提交</Button>
      <Button
        color="primary"
        onClick={() => {
          global.dispatch({type: 'appModel/queryWithAdditions', redirect: true});
        }}
        fullWidth
      >暂不设置</Button>
    </LoginAndRegistContainer>
  );
}

export default connect(({ appModel: { changePwShowPw }, routerModel }) => {
  return { changePwShowPw, routerModel };
})(createForm()(ChangePassword));
