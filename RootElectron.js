import React from 'react';
import { connect } from 'react-redux';
import { routerRedux } from 'dva/router';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { withStyles } from '@material-ui/core/styles';
import LoginUsingPassword from '../loginAndRegist/LoginUsingPassword';
import LoginUsingMobileVerifyCode from '../loginAndRegist/LoginUsingMobileVerifyCode';
import Typography from '@material-ui/core/Typography';
import logoShop from '../loginAndRegist/logo_shop.png';
import logoProducer from '../loginAndRegist/logo_producer.png';
import electronPrefacePic from './shop/imgs/electronPrefacePic.jpg';

class RootElectron extends React.Component {
  constructor(props){
    super(props);
    this.state={ tabIndex: 0 };
  }
  render() {
    const {classes} = this.props;
    const tabIndex = this.state.tabIndex;
    return (
      <div style={{width:'100%', height:'100%', display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#eee'}}>
        <div style={{width:'45rem', height:'30rem', display:'flex'}}>
          <div style={{
            height:'100%', width:'40%',
            backgroundImage: `url(${electronPrefacePic})`,
            backgroundSize: '100% 100%',
          }}>
            <div className={classes.leftPanel}>
              <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center'
              }}>
                <img src={global.realm==='shop'?logoShop:logoProducer} style={{width:'120px', height:'120px',marginTop:'3rem'}}/>
                <Typography variant="h3" style={{color:'#fff', marginTop:'0.5rem', fontWeight:'900'}}>衣衣地图</Typography>
                <Typography variant="h6" style={{color:'#fff', marginTop:'0.5rem', fontWeight:'500'}}>{global.realm==='shop'? '店铺端':(global.realm==='producer'? '品牌商端':'管理员')}</Typography>
              </div>
              {/*<Button style={{alignSelf:'flex-end', paddingLeft: '1rem',paddingRight: '1rem', textDecoration: 'underline', color:'#fff'}}
                href={`https://yiyimap-apk.cdn.bcebos.com/${global.realm==='shop'?'Rec 0007':'Rec 0007'}.mp4`} 
                target="_blank"  rel="noopener noreferrer"
              >
                操作指导视频
              </Button>*/}
            </div>
          </div>
          <div 
            style={{height:'100%', display:'flex', flexDirection:'column', 
              justifyContent:'space-around', flexGrow: 1, padding:'2rem', backgroundColor:'#fff'
            }}
          >
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
          </div>
        </div>
      </div>
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
    },
    leftPanel: {
      height: '100%', 
      backgroundColor: mainColor+'dd',
      display:'flex',
      justifyContent:'space-between',
      flexDirection:'column'
    }
  }
}

export default connect()(withStyles(styles)((RootElectron)));
