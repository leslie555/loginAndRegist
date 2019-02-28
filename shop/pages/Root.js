import React from 'react';
import MyAppBar from '../..//MyAppBar'
import MemberShipTable from '../..//MemberShipTable';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux'
import { routerRedux } from 'dva/router';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import homePic from '../imgs/homePic.png';
import handPhoneBackground from '../imgs/handPhoneBackground.png';
import handPhone from '../imgs/handPhone.png';
import phone from '../imgs/phone.png';
import AppDescPanel from '../..//AppDescPanel';


class Root extends React.Component{
  render(){
    const {width, classes, dispatch} = this.props;
    return (
      <div>
        <MyAppBar
          mainTitle="衣衣地图"
          subTitle="店铺端"
          showConsoleEntryBtn
          showLoginRegistBtn
          actions={[
            {text: '操作指导视频', cb:function(){
              dispatch(routerRedux.push('/video'))
            }}
          ]}
        />
        <div
          className={classes.topImgDiv}
          style={{
            backgroundImage: `url(${homePic})`,
            height: isWidthUp('lg', width)?'20rem':(isWidthUp('sm', width)?'16rem':'14rem'),
            paddingBottom: isWidthUp('lg', width)?'5rem':(isWidthUp('sm', width)?'3rem':'1rem')
          }}
        >
          <div style={{color: '#fff'}}>
            <span style={{fontSize: 36}}>衣衣地图</span><span style={{fontSize: 26}}>店铺端</span>
          </div>
          <Typography
            variant={width==='xs'?'subtitle1':'h5'}
            className={classNames(classes.limitWidth, global.classes.wingBlank)}
            style={{textAlign: 'center', color: '#fff'}}
          >
            入驻平台，让顾客随时随地查看您店铺中的商品、及时了解促销活动
          </Typography>
          <div style={{display:'flex', justifyContent:'space-between', width:'14rem'}}>
            <Button style={{textDecoration: 'underline', color:'#fff'}}
              onClick={()=>{dispatch(routerRedux.push('/regist'))}}
            >
              立即入驻
            </Button>
            <Button style={{textDecoration: 'underline', color:'#fff'}}
              onClick={()=>{dispatch(routerRedux.push('/video'))}}
            >
              操作指导视频
            </Button>
          </div>
          <Button variant="contained" color="primary" style={{paddingLeft: '4rem',paddingRight: '4rem'}}
            onClick={()=>{
              if(global.OS==='android') {
                // window.location.href=global.apkUrl;
                window.open(global.apkUrl, '_blank');
              } else if(global.OS==='ios'){
                // window.location.href=global.appUrlInAppStore;
                window.open(global.appUrlInAppStore, '_blank');
              } else {
                window.location.href='//www.yiyimap.com/#/downloadAPK';
              }
            }}
          >
            APP下载
          </Button>
        </div>
        <div
          className={classNames(classes.appDescDiv, global.classes.wingBlank, classes.limitWidth)}
        >
          <p style={{fontSize: 20, margin:'0 0'}}>
            衣衣地图APP简介
          </p>
          <p style={{fontSize: 17, lineHeight: '28px', margin:'6px 0', alignSelf:'flex-start'}}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“衣衣地图”是基于地图搜索的实体服装店导购APP。顾客通过“衣衣地图”APP可以查看周边或指定地点附近有哪些服装店，这些服装店在进行怎样的促销活动。可以看到店铺中有哪些商品，以及商品的价格、数量、和图片。店铺可以通过APP向顾客发布优惠促销信息，可以发放代金券吸引顾客到店购物。店铺还可以建立自己的粉丝体系，和自己的顾客保持联系和互动。
          </p>
        </div>

        <AppDescPanel/>
        
        <div
          className={classNames(classes.appDescDiv, global.classes.wingBlank, classes.limitWidth)}
        >
          <p style={{fontSize: 20, margin:'0 0'}}>
            店家可以通过“衣衣地图”做什么？
          </p>
          <p style={{fontSize: 17, lineHeight: '28px', margin:'6px 0', alignSelf:'flex-start'}}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;店铺不但可以通过“衣衣地图”平台发布店铺和商品信息，还可以发布促销信息、发放优惠券，可以向关注了本店铺的顾客实时推送各种促销信息、新品信息。
          </p><p style={{fontSize: 20, margin:'6px 0'}}>
            “衣衣地图”如何收费？
          </p>
          <p style={{fontSize: 17, lineHeight: '28px',margin:'6px 0', alignSelf:'flex-start'}}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“衣衣地图”的基本功能都以<span style={{color: 'red'}}>完全免费</span>的形式提供给所有店铺，店铺不需要支付任何费用就可以在衣衣地图APP上发布店铺信息、商品信息和促销信息。只有当店铺需要在APP上发布广告、向顾客推送消息或进行其它形式的推广活动时，才需要支付相应的费用。为鼓励店铺尽早入驻平台，我们将执行以下会员体系。会员在平台上进行推广活动时产生的任何费用都将享受相应的折扣。
          </p>
          <MemberShipTable/>
        </div>
        {/*<div
          className={classes.handPhoneDiv}
          style={{
            backgroundImage: `url(${isWidthUp('sm', width)?handPhoneBackground:undefined})`,
          }}
        >
          <img
            src={isWidthUp('sm', width)?handPhone:phone}
            style={{
              maxWidth: '100%',
              height: isWidthUp('lg', width)?'40rem':(isWidthUp('sm', width)?'40rem':'30rem'),
            }}
          />
        </div>*/}
        <Grid container className={classes.limitWidth}>
          <Grid item xs={12} sm={6} className={classes.enterBtn}>
            <Button variant="contained" color="primary"
              href="//www.yiyimap.com" target="_blank"  rel="noopener noreferrer"
            >&nbsp;&nbsp;&nbsp;官网首页&nbsp;&nbsp;&nbsp;</Button>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.enterBtn}>
            <Button variant="contained" color="primary"
              href="//producer.yiyimap.com" target="_blank"  rel="noopener noreferrer"
            >&nbsp;&nbsp;&nbsp;品牌商入口&nbsp;&nbsp;&nbsp;</Button>
          </Grid>
        </Grid>
        <div className={classes.bottomDiv}>
          <Typography style={{color: '#ffffff'}}>版权所有 © 2018 成都耘垦科技有限公司</Typography>
        </div>
      </div>
    )
  }
}
const styles = (theme)=>{
  return ({
    limitWidth:{
      maxWidth: '60rem',margin: '0 auto'
    },
    bottomDiv: {
      height: '2rem',
      backgroundColor: theme.palette.primary.main,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '3rem'
    },
    topImgDiv:{
      height: '20rem',
      backgroundSize:'100% 100%',
      display: 'flex',
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '1rem',
    },
    appDescDiv: {
      display: 'flex',
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2rem',
    },
    enterBtn: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '4rem'
    },
    handPhoneDiv: {
      display: 'flex',
      justifyContent: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundPositionY: 'bottom',
      backgroundSize: '100% 50%',
      marginTop: '5rem'
    }
  });
}
export default connect()(withWidth()(withStyles(styles)(Root)));
