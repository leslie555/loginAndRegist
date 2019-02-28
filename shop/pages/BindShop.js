import React from 'react';
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { routerRedux, withRouter } from 'dva/router';

class BindShop extends React.Component{
  state={
    code:''
  }
  render(){
    const {code,error} = this.state;
    const {dispatch} = this.props;
    return (
      <Paper 
        style={{height:'30rem', display:'flex', flexDirection:'column', justifyContent:'center', 
          alignItems:'center'
        }}
      >
        <div>
          <TextField
            label="请输入店铺接入码"
            value={code}
            onChange={(evt)=>{
              this.setState({code:evt.target.value.trim(), error: undefined})
            }}
            error={Boolean(error)}
            helperText={error}
            fullWidth
            onKeyDown={(evt)=>{
              if(evt.keyCode===13) this.submitHandler();
            }}
          />
          <Button variant="contained" color="primary" fullWidth style={{marginTop: '3rem'}}
            onClick={this.submitHandler}
          >提交</Button>
        </div>
      </Paper>
    );
  }
  submitHandler = ()=>{
    const {code} = this.state;
    const {myUserId, dispatch} = this.props;
    if(myUserId){
      global.Toast.error('请勿重复绑定店铺！');
      return;
    }
    const match = code.match(/^(\d+)-(\d{6})$/);
    if(!code) {
      this.setState({error:'请输入接入码'})
      return;
    }
    if(!match) {
      this.setState({error:'接入码格式错误'})
      return;
    }
    global.myFetch({
      url:`${global.serverBaseUrl}/myUsers/me/bindShop`,
      method:'post',
      data:{shopId:match[1], bindCode:match[2]}
    }).then(()=>{
      dispatch({
        type: 'appModel/queryWithAdditions',
        redirect: '/consoleOfShop/setShop'
      });
    }).catch((err)=>{
      console.error(err);
      global.Toast.error('操作失败，请检查您输入的接入码是否正确！');
    })
  }
}

const styles={
}

export default connect(
  function({shopModel: {myUserId}}){
    return {myUserId};
  }
)(withStyles(styles)(BindShop));

