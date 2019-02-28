import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConsoleListOfShop from '../components/ConsoleListOfShop';
import AppBarInConsole from '../../AppBarInConsole';
import withWidth from '@material-ui/core/withWidth';
import { routerRedux } from 'dva/router';
import {storeDataToModels} from '../models/appModel';
import Cookies from 'js-cookie';


class ConsoleOfShop extends React.Component {

  handleDrawerToggle = () => {
    const {consoleMenuShow,  dispatch} = this.props;
    dispatch({type:'appModel/updateState', payload:{consoleMenuShow: !consoleMenuShow}})
  };

  UNSAFE_componentWillMount(){
    let {shopModel, producerId,inShopCommoditiesModel, dispatch} = this.props;
    if(global.OS==='android'||global.OS==='ios') {
      alert('本页面对手机浏览器的支持尚在开发中，请使用电脑浏览器操作，推荐使用新版的火狐浏览器！')
    } else if(
      navigator.userAgent.toLowerCase().indexOf('chrome')<0
      &&navigator.userAgent.toLowerCase().indexOf('firefox')<0
    ){
      alert('建议您使用新版的火狐浏览器，使用其它浏览器可能出现错误！')
      return;
    }
    if(global.realm==='producer'&&typeof global.enteringShopIndex === 'undefined'){ //页面被刷新了
      global.enteringShopIndex = Number(Cookies.get('enteringShopIndex'));
      global.enteringShopId = Number(Cookies.get('enteringShopId'));
      if(!global.enteringShopId || typeof global.enteringShopIndex !== 'number') {
        dispatch(routerRedux.push('/console/shops'));
        return;
      }
    }
    if(global.realm==='producer'){
      if(!inShopCommoditiesModel||!(inShopCommoditiesModel instanceof Array)){
        if(producerId){
          this.downloadData();
        } else { //刷新页面后需要等待producer信息下载后再下载店铺信息
          const intervalHandler = setInterval(()=>{
            producerId = this.props.producerId; //重新获取一次新的producerId
            if(producerId) {
              this.downloadData();
              clearInterval(intervalHandler);
            }
          }, 500);
        }
      }
    }
  }
  downloadData = ()=>{
    let {producerId, shopsModel, dispatch} = this.props;
    global.myFetch({
      url: `${global.serverBaseUrl}/producers/${producerId}/shops`,
      data:{filter:{where:{id:global.enteringShopId}, include: [{inShopCommodities: 'commodity'}, 'coupons']}}
    })
      .then((result)=>{
        storeDataToModels(result[0]);
      });
    if(!shopsModel||!shopsModel.shopArr){
      global.myFetch({
        url:`${global.serverBaseUrl}/producers/${producerId}/shops`,
        data:{filter:{include: 'coupons'}}
      }).then((resp)=>{
        dispatch({type:'shopsModel/updateState', payload:{shopArr: resp.reverse()}})
      })
    }
  }

  componentWillUnmount(){
    if(global.realm==='shop'){
      return;
    }
    if(global.realm==='producer'&&typeof global.enteringShopIndex === 'undefined'){ //页面被刷新了
      return;
    }
    const {shopModel, shopArr, dispatch} = this.props;
    let oldShopModel = shopArr[global.enteringShopIndex];
    //页面刷新后global.enteringShopIndex已经不能反应本shop中shopArr中的index
    if(oldShopModel.id !== shopModel.id){
      for(let i=0;i<shopArr.length;i++) {
        if(shopArr[i].id === shopModel.id){
          global.enteringShopIndex = i;
          oldShopModel = shopArr[i];
          break;
        }
      }
    }
    if(JSON.stringify(shopModel)!==JSON.stringify(oldShopModel)){
      const newShopArr = [...shopArr];
      newShopArr[global.enteringShopIndex] = shopModel;
      dispatch({type:'shopsModel/updateState', payload:{shopArr: newShopArr}})
    }
    dispatch({type:'inShopCommoditiesModel/replace', payload:{}});
    dispatch({type:'commodityOrderModel/replace', payload:{}});
    dispatch({type:'couponsModel/replace', payload:{}});
    dispatch({type:'gettedCouponModel/replace', payload:{}});
    dispatch({type:'shopModel/replace', payload:{}});
    dispatch({type:'concernModel/replace', payload:{}});
    dispatch({type:'editAddressModel/replace', payload:{}});
    dispatch({type:'editShopModel/replace', payload:{}});
    dispatch({type:'editCouponModel/replace', payload:{}});
    dispatch({type:'editPriceModel/replace', payload:{}});
    dispatch({type:'addInShopCommodityModel/replace', payload:{}});
    dispatch({type:'useCouponModel/replace', payload:{}});
    dispatch({type:'couponFinanceModel/replace', payload:{}});
    dispatch({type:'editInShopCommodityModel/replace', payload:{}});
    global.enteringShopIndex = undefined;
    global.enteringShopId = undefined;
    Cookies.remove('enteringShopIndex');
    Cookies.remove('enteringShopId');
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
            <ConsoleListOfShop/>
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
            <ConsoleListOfShop/>
          </Drawer>
        </Hidden>
        <div className={classes.rightPart}>
          <AppBarInConsole />
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    );
  }
}

ConsoleOfShop.propTypes = {
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
});



export default connect(
  function({
    appModel: {loginState, consoleMenuShow}, 
    brandModel: {brandsArray}, 
    shopModel, shopsModel, producerModel,
    inShopCommoditiesModel
  }){
    return {
      loginState, consoleMenuShow, brandsArray, shopModel, 
      shopsModel,
      shopArr:shopsModel&&shopsModel.shopArr,
      producerId:producerModel&&producerModel.id, inShopCommoditiesModel
    }
  }
)(withStyles(styles)(withWidth()(ConsoleOfShop)));
