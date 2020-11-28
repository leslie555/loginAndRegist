import React from 'react';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';
import LoginUsingPassword from './LoginUsingPassword';
import LoginUsingMobileVerifyCode from './LoginUsingMobileVerifyCode';
import LoginAndRegistContainer from './LoginAndRegistContainer';

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={ tabIndex: 0 };
    console.log('try to revert my pr')
  }
  render() {
    const {classes} = this.props;
    const tabIndex = this.state.tabIndex;
    return (
      <LoginAndRegistContainer title={`衣衣地图${global.realm==='shop'? '店铺端':(global.realm==='producer'? '品牌商端':'管理员')}`}>
        <Tabs
          value={this.state.tabIndex}
          onChange={(evt, newVal)=>{this.setState({tabIndex: newVal})}}
          indicatorColor="primary"
          textColor="primary"
          classes={{flexContainer: classes.spaceEvenly}}
        >
          <Tab label="密码登录" />
          <Tab label="短信验证码登录" />
        </Tabs>
        {tabIndex === 0 && <LoginUsingPassword />}
        {tabIndex === 1 && <LoginUsingMobileVerifyCode />}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {tabIndex === 0 &&
            <Button
              style={{ paddingLeft: '0.2rem' }}
              onClick={() => { this.setState({ tabIndex: 1 }); }}
              color="primary"
            >忘记密码</Button>
          }
          {tabIndex === 1 && <div />}
          <Button
            style={{ paddingRight: '0.2rem' }}
            onClick={() => { this.props.dispatch(routerRedux.push('/regist')); }}
            color="primary"
          >快速注册</Button>
        </div>

        <div style={{ display:'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <span style={{}}>登录即代表您已同意衣衣地图</span>
          <span className={classes.mainColor} style={{ textDecorationLine: 'underline' }}>服务条款</span>
        </div>
      </LoginAndRegistContainer>
    );
  }
}

const styles=(theme)=>{
  const mainColor = theme.palette.primary.main;
  return {
    spaceEvenly: {
      justifyContent: 'space-evenly'
    },
    mainColor: {
      color: mainColor,
    }
  }
}

export default connect()(withStyles(styles)((Login)));
