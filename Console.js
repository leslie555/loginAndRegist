import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConsoleList from '../components/ConsoleList';
import AppBarInConsole from '../loginAndRegist/AppBarInConsole';
import withWidth from '@material-ui/core/withWidth';


class Console extends React.Component {

  handleDrawerToggle = () => {
    const {consoleMenuShow, dispatch} = this.props;
    dispatch({type:'appModel/updateState', payload:{consoleMenuShow: !consoleMenuShow}})
  };

  UNSAFE_componentWillMount(){
    if(global.OS==='android'||global.OS==='ios') {
      alert('本页面对手机浏览器的支持尚在开发中，请使用电脑浏览器操作，推荐使用新版的火狐浏览器！')
    } else if(
      navigator.userAgent.toLowerCase().indexOf('chrome')<0
      &&navigator.userAgent.toLowerCase().indexOf('firefox')<0
    ){
      alert('建议您使用新版的火狐浏览器，使用其它浏览器可能出现错误！')
    }
  }

  render() {
    const { consoleMenuShow, loginState,brandsArray, classes, children } = this.props;
    if(loginState !== global.LoginStateConsts.logined||!brandsArray) return null;

    return (
      <div className={classes.root}>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            open={consoleMenuShow}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <ConsoleList/>
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              docked: classes.drawerDocked,
              paper: classes.drawerPaper,
            }}
          >
            <ConsoleList/>
          </Drawer>
        </Hidden>
        <div className={classes.rightPart}>
          <AppBarInConsole />
          <main className={classes.content}>
            {children}
            {/*<Button variant={width==='xs'?undefined:'extendedFab'} color="secondary" className={classes.feedbackBtn}>
              <EditIcon/>
              问题反馈
            </Button>*/}
          </main>
        </div>
      </div>
    );
  }
}

Console.propTypes = {
  classes: PropTypes.object.isRequired,
  appBarTitle: PropTypes.string.isRequired,
};


const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  drawerDocked: {
    height: '100%'
  },
  drawerPaper: {
    width: '16rem',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
    backgroundImage: `url(${global.consoleListBackImg})`,
    backgroundSize: '100% 100%', 
  },
  rightPart: {
    flexGrow: 1,
    overflowY: 'auto',
    backgroundColor: '#eee',
  },
  content: {
    height:'100%',
    boxSizing:'border-box',
    [theme.breakpoints.up('md')]: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    paddingTop: '70px',
  },
  // feedbackBtn:{
  //   position:'fixed', 
  //   height:'42px',
  //   right:'3rem', 
  //   bottom:'1.5rem', 
  //   [theme.breakpoints.only('xs')]: {
  //     right:'0.3rem', 
  //     bottom:'0.6rem', 
  //   },
  // }
});



export default connect(
  function({appModel: {loginState, consoleMenuShow}, brandModel: {brandsArray}}){
    return {loginState, consoleMenuShow, brandsArray}
  }
)(withStyles(styles)(withWidth()(Console)));
