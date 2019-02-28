import React from 'react';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { withRouter } from 'dva/router';
import Forward from '@material-ui/icons/Forward';
import {showLogoutDialog} from '../loginAndRegist/MyAppBar';
import { routerRedux } from 'dva/router';

class AppBarInConsole extends React.Component {

  handleDrawerOpen = () => {
    this.props.dispatch({type:'appModel/updateState', payload:{consoleMenuShow: true}})
  };

  render(){
    const {location:{pathname}, classes, dispatch} = this.props;
    const consoleAppBarTitle = global.pathPageNameMap[pathname];
    
    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="Open drawer"
            onClick={this.handleDrawerOpen}
            className={classes.navIconHide}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="primary" className={classes.title}
          >
            {consoleAppBarTitle}
          </Typography>
          <div style={{flexGrow: 1,}}/>
          <Button style={{color: '#000'}} 
            onClick={()=>{
              if(global.realm==='producer'&&typeof global.enteringShopIndex!=='undefined'){
                dispatch(routerRedux.push('/console/shops'));
              } else {
                showLogoutDialog();
              }
            }}
          >
            <Forward />
            {global.realm==='producer'&&typeof global.enteringShopIndex!=='undefined'?'返回店铺列表':'退出登录'}
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

const styles = theme => ({
  root:{
    backgroundColor: '#fff', 
    boxShadow: 'unset', 
    [theme.breakpoints.up('md')]: {
      paddingLeft:'256px'
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  title: {
    marginLeft: '0.5rem',
  },
});

//withRouter必须放在最外层
export default withRouter(connect()(withStyles(styles)(AppBarInConsole)));


