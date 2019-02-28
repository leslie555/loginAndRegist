import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { routerRedux, withRouter } from 'dva/router';
import {connect} from 'react-redux';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import StoreIcon from '@material-ui/icons/StoreRounded';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import SettingsIcon from '@material-ui/icons/Settings';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PaymentIcon from '@material-ui/icons/Payment';
import Announcement from '@material-ui/icons/Announcement';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import SyncIcon from '@material-ui/icons/Sync';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import { FaQrcode } from 'react-icons/fa';

import logoLineShop from '../../logoLine_shop.png';


const {unknown, logined, notLogined, checkFailed}=global.LoginStateConsts;

const listItemTextProps = {
  primaryTypographyProps: {
    style: {color: '#fff'}
  }
};

class ConsoleListOfShop extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      //目的是选择子列表的情况下可以刷新页面
      couponListExpand: window.location.hash.slice(1).indexOf('coupon')>-1,
      feedbackListExpand: window.location.hash.slice(1).indexOf('feedback')>-1
    };
  }
  handleListItemClick(event, newValue) {
    if(newValue.indexOf('coupon')<0&&newValue.indexOf('feedback')<0) {
      this.setState({couponListExpand: false, feedbackListExpand:false});
    }
    this.props.dispatch({type:'appModel/updateState', payload:{consoleMenuShow: false}})
    this.props.dispatch(routerRedux.push(newValue));
  }

 
  render(){
    const {email, loginState, shopSetted,shopId, location:{pathname}, classes, dispatch} = this.props;
    if(loginState === notLogined) {
      dispatch(routerRedux.push('/login'));
    }
    if(loginState === logined && shopId&&!shopSetted &&  pathname !== '/consoleOfShop/setShop' &&  pathname !== '/consoleOfShop/feedback/createFeedback') {
      dispatch(routerRedux.push('/consoleOfShop/setShop'));
    }
    const mobile = email.match(/\d+/)[0];
    return (
      <div>  
        <div className={classes.drawerTitle} onClick={()=>{dispatch(routerRedux.push('/'))}}>
          <img src={logoLineShop} style={{height: '2.5rem', marginRight: '0.5rem'}}/>
          <Typography variant="h6" color="primary" style={{fontWeight: 'bold'}}>衣衣地图</Typography>
          <Typography variant="subtitle2" color="primary" style={{position: 'relative', top:'0.3rem'}}>店铺管理端</Typography>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', borderTop: '1px solid white', borderBottom: '1px solid white', padding:'1rem 0.5rem'}}>
          <Typography style={{color: '#fff'}}>账号</Typography>
          <Typography style={{color: '#fff'}}>{`${mobile.slice(0,3)}****${mobile.slice(-4)}`}</Typography>
        </div>
        <List  component="nav">
          <ListItem
            disabled={!shopSetted}
            button
            selected={pathname === '/consoleOfShop/inShopCommoditiesManage'}
            onClick={event => this.handleListItemClick(event, '/consoleOfShop/inShopCommoditiesManage')}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <StoreIcon style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="本店商品" {...listItemTextProps}/>
          </ListItem>
          <ListItem
            disabled={!shopSetted}
            button
            selected={pathname === '/consoleOfShop/salesInf'}
            onClick={event => this.handleListItemClick(event, '/consoleOfShop/salesInf')}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <BookmarkBorderIcon style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="促销"  {...listItemTextProps} />
          </ListItem>
          <ListItem
            disabled={!shopSetted}
            button
            onClick={() => this.setState({couponListExpand: !this.state.couponListExpand, feedbackListExpand:false})}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <ConfirmationNumberIcon style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="代金券"  {...listItemTextProps}/>
            {this.state.couponListExpand ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.couponListExpand} timeout="auto" unmountOnExit>
            <List component="div" style={{paddingLeft: '1rem'}}>
              <ListItem button 
                disabled={!shopSetted}
                onClick={event => this.handleListItemClick(event, '/consoleOfShop/coupon/coupons')}
                selected={pathname === '/consoleOfShop/coupon/coupons'}
                classes={{selected: classes.selectedItem, root: classes.itemRoot}}
              >
                <ListItemIcon>
                  <ZoomOutMapIcon style={{color: '#fff'}}/>
                </ListItemIcon>
                <ListItemText inset primary="代金券发放"  {...listItemTextProps}/>
              </ListItem>
              {global.realm==='shop'&&
                <ListItem button 
                  disabled={!shopSetted}
                  onClick={event => this.handleListItemClick(event, '/consoleOfShop/coupon/useCoupon')}
                  selected={pathname === '/consoleOfShop/coupon/useCoupon'}
                  classes={{selected: classes.selectedItem, root: classes.itemRoot}}
                >
                  <ListItemIcon>
                    <PaymentIcon style={{color: '#fff'}}/>
                  </ListItemIcon>
                  <ListItemText inset primary="顾客使用代金券"  {...listItemTextProps}/>
                </ListItem>
              }
              <ListItem button 
                disabled={!shopSetted}
                onClick={event => this.handleListItemClick(event, '/consoleOfShop/coupon/couponFinance')}
                selected={pathname === '/consoleOfShop/coupon/couponFinance'}
                classes={{selected: classes.selectedItem, root: classes.itemRoot}}
              >
                <ListItemIcon>
                  <EqualizerIcon style={{color: '#fff'}}/>
                </ListItemIcon>
                <ListItemText inset primary="代金券统计"  {...listItemTextProps}/>
              </ListItem>
            </List>
          </Collapse>
          {/*<ListItem
            disabled={!shopSetted}
            button
            onClick={() => this.setState({feedbackListExpand: !this.state.feedbackListExpand, couponListExpand:false})}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <Announcement style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="问题反馈"  {...listItemTextProps}/>
            {this.state.feedbackListExpand ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.feedbackListExpand} timeout="auto" unmountOnExit>
            <List component="div" style={{paddingLeft: '1rem'}}>
              <ListItem button 
                disabled={!shopSetted}
                onClick={event => this.handleListItemClick(event, '/consoleOfShop/feedback/createFeedback')}
                selected={pathname === '/consoleOfShop/feedback/createFeedback'}
                classes={{selected: classes.selectedItem, root: classes.itemRoot}}
              >
                <ListItemIcon>
                  <BorderColorIcon style={{color: '#fff'}}/>
                </ListItemIcon>
                <ListItemText inset primary="我要反馈问题"  {...listItemTextProps}/>
              </ListItem>
              <ListItem button 
                disabled={!shopSetted}
                onClick={event => this.handleListItemClick(event, '/feedback/feedbackHistory')}
                selected={pathname === '/feedback/feedbackHistory'}
                classes={{selected: classes.selectedItem, root: classes.itemRoot}}
              >
                <ListItemIcon>
                  <PaymentIcon style={{color: '#fff'}}/>
                </ListItemIcon>
                <ListItemText inset primary="反馈历史"  {...listItemTextProps}/>
              </ListItem>
            </List>
          </Collapse>*/}
          {/*<ListItem
            disabled={!shopSetted}
            button
            selected={pathname === '/consoleOfShop/autoSyncSet'}
            onClick={event => this.handleListItemClick(event, '/consoleOfShop/autoSyncSet')}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <CompareArrowsIcon style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="对接供销存软件"  {...listItemTextProps}/>
          </ListItem>*/}
          <ListItem
            disabled={!shopSetted}
            button
            selected={pathname === '/consoleOfShop/qrcode'}
            onClick={event => this.handleListItemClick(event, '/consoleOfShop/qrcode')}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <FaQrcode color="#fff" size={24}/>
            </ListItemIcon>
            <ListItemText primary="店铺二维码"  {...listItemTextProps}/>
          </ListItem>
          {global.realm==='shop'&&
            <ListItem
              button
              selected={pathname === '/consoleOfShop/feedback/createFeedback'}
              onClick={event => this.handleListItemClick(event, '/consoleOfShop/feedback/createFeedback')}
              classes={{selected: classes.selectedItem, root: classes.itemRoot}}
            >
              <ListItemIcon>
                <Announcement style={{color: '#fff'}}/>
              </ListItemIcon>
              <ListItemText primary="问题反馈"  {...listItemTextProps}/>
            </ListItem>
          }
          <ListItem
            button
            selected={pathname === '/consoleOfShop/setShop'}
            onClick={event => this.handleListItemClick(event, '/consoleOfShop/setShop')}
            classes={{selected: classes.selectedItem, root: classes.itemRoot}}
          >
            <ListItemIcon>
              <SettingsIcon style={{color: '#fff'}}/>
            </ListItemIcon>
            <ListItemText primary="店铺信息"  {...listItemTextProps}/>
          </ListItem>
        </List>
      </div>
    );
  }
}


const styles = theme => {
  const lightColor = theme.palette.primary.light;
  return ({
    drawerTitle: {
      height: '5rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor:'pointer',
    },
    itemRoot:{
      borderRadius: '5px',
      padding: '8px',
      margin: '1rem 2%',
      width: '96%',
    },
    selectedItem: {
      backgroundColor: lightColor+' !important',
    }
  })
};

export default withRouter(connect(
  function({
    userModel: {email},
    appModel: {loginState},
    shopModel
  }){
    return {
      email,
      loginState,
      shopId:shopModel.id,
      shopSetted:shopModel.name&&shopModel.brandId?true:false,
    }
  }
)(withStyles(styles)(ConsoleListOfShop)));