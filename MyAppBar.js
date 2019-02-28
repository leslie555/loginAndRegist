import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import {connect} from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { routerRedux } from 'dva/router';
import MoreIcon from '@material-ui/icons/MoreVert';
import logoCustomer from '../loginAndRegist/logo_customer.png';
import logoShop from '../loginAndRegist/logo_shop.png';
import logoProducer from '../loginAndRegist/logo_producer.png';

const styles = {
  root: {
    flexGrow: 1,
  },
  appTitle: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    cursor: 'pointer'
  },
};

class MyAppBar extends React.Component {
  state={}
  render(){
    const { mainTitle, subTitle, showConsoleEntryBtn, showLoginRegistBtn, userId, classes, actions, dispatch } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <img src={global.realm==='customer'?logoCustomer:(global.realm==='producer'?logoProducer:logoShop)} style={{height: 40, marginRight: 10, cursor: 'pointer'}} onClick={()=>{dispatch(routerRedux.push('/'))}}/>
            <div className={classes.appTitle} onClick={()=>{dispatch(routerRedux.push('/'))}}>
              <Typography variant="h5" color="inherit">
                {mainTitle}
              </Typography>
              <Typography variant="body2" color="inherit" style={{marginLeft: '0.3rem'}}>
                {subTitle}
              </Typography>
            </div>
            <Hidden xsDown>
              {actions&&actions.map((action, index)=>{
                // if(!action.href) {
                return (
                  <Button color="inherit" key={index} onClick={action.cb}
                  >{action.text}</Button>
                )
                // }
                // else {
                //   return (
                //     <Button color="inherit" key={index} 
                //       href={action.href} target="_blank" rel="noopener noreferrer"
                //     >{action.text}</Button>
                //   );
                // }
              })}
              {showConsoleEntryBtn&&userId&&
                <Button color="inherit" onClick={()=>{
                  global.dispatch(routerRedux.push((global.realm==='shop'?'/consoleOfShop/inShopCommoditiesManage':(global.realm==='producer'?'/console/shops':'/console/setInf'))));
                }}>进入控制台</Button>
              }
              {showLoginRegistBtn&&userId&&
                <Button color="inherit" onClick={showLogoutDialog}>退出登录</Button>
              }
              {showLoginRegistBtn&&!userId&&
                <Button color="inherit" onClick={()=>{
                  global.dispatch(routerRedux.push('/login'));
                }}>登录</Button>
              }
              {showLoginRegistBtn&&!userId&&
                <Button color="inherit" onClick={()=>{
                  global.dispatch(routerRedux.push('/regist'));
                }}>注册</Button>
              }
            </Hidden>
            <Hidden smUp>
              <IconButton aria-haspopup="true"
                onClick={(evt)=>{this.setState({mobileMoreAnchorEl: evt.target})}}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </AppBar>
        <Menu
          anchorEl={this.state.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(this.state.mobileMoreAnchorEl)}
          onClose={this.handleMobileMenuClose}
        >
          {actions&&actions.map((action, index)=>(
            <MenuItem key={index} 
              onClick={()=>{
                this.setState({mobileMoreAnchorEl: null}); 
                if(action.cb) setTimeout(function(){action.cb()},0);
              }}
            >{action.text}</MenuItem>
          ))}
          {showConsoleEntryBtn&&userId&&
            <MenuItem onClick={()=>{
              global.dispatch(routerRedux.push((global.realm==='shop'?'/consoleOfShop/inShopCommoditiesManage':(global.realm==='producer'?'/console/shops':'/console/setInf'))));
            }}>进入控制台</MenuItem>
          }
          {showLoginRegistBtn&&userId&&
            <MenuItem onClick={()=>{
              this.setState({mobileMoreAnchorEl: null}); 
              showLogoutDialog();
              // global.MyDialog.confirm({
              //   message: '您确认要退出登录吗？',
              //   actions:[
              //     {text: '取消'},
              //     {
              //       text: '退出登录', color: 'primary', autoFocus:  true,
              //       cb:showLogoutDialog,
              //     },
              //   ]
              // });
            }}>退出登录</MenuItem>
          }
          {showLoginRegistBtn&&!userId&&
            <MenuItem onClick={()=>{
              global.dispatch(routerRedux.push('/login'));
            }}>登录</MenuItem>
          }
          {showLoginRegistBtn&&!userId&&
            <MenuItem onClick={()=>{
              global.dispatch(routerRedux.push('/regist'));
            }}>注册</MenuItem>
          }
        </Menu>
      </div>
    );
  }

  handleMobileMenuClose = ()=>{
    this.setState({mobileMoreAnchorEl: null});
  }

}

export default connect(
  function({userModel:{id: userId}}){
    return {userId}
  }
)(withStyles(styles)(MyAppBar));

export const showLogoutDialog = ()=>{
  global.MyDialog.confirm({
    message: '您确认要退出登录吗？',
    actions:[
      {text: '取消'},
      {
        text: '退出本设备', color: 'primary', autoFocus:  true,
        cb(){
          global.dispatch({type:'userModel/logout', payload:{}});
        }
      },
      {
        text: '退出所有设备', color: 'primary', autoFocus:  true,
        cb(){
          global.dispatch({type:'userModel/logout', payload:{exitAllDevices:true}});
        }
      },
    ]
  });
}