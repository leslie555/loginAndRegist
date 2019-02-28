import React from 'react';
import {connect} from 'react-redux'
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import appDescCoupon from '../loginAndRegist/imgs/appDescCoupon.png';
import appDescFavorite from '../loginAndRegist/imgs/appDescFavorite.png';
import appDescSales from '../loginAndRegist/imgs/appDescSales.png';
import appDescSearch from '../loginAndRegist/imgs/appDescSearch.png';


class AppDescPanel extends React.Component{
  render(){
    const {width, classes} = this.props;
    return (
      <div>
        <div style={{backgroundColor:'#eee'}}>
          {/*<div style={{display:'flex', justifyContent:'center'}}>
            <Typography variant="h4">产品介绍</Typography>
          </div>*/}
          <Grid container className={classNames(classes.descGrid,classes.wingBlank, classes.limitWidth)}>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <img src={appDescSearch} style={{width: isWidthUp('sm', width)? '80%':'120%'}}/>
            </Grid>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <div className={classes.descTextDiv}>
                <Typography variant='h5'>搜索周边或指定地点附近的店铺和店内服装</Typography>
                <div className={classes.descTextLine}/>
                <Typography variant='subtitle1'>通过衣衣地图APP可以查看周边或指定地点附近的店铺，也可以通过关键字直接搜索某一类商品。搜索结果通过地图展示，一目了然。可以查看到商品的图片、价格、库存和详细信息。</Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{backgroundColor:'#fff'}}>
          <Grid container className={classNames(classes.descGrid,classes.wingBlank, classes.limitWidth)} direction="row-reverse">
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <img src={appDescSales} style={{width: isWidthUp('sm', width)? '80%':'120%'}}/>
            </Grid>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <div className={classes.descTextDiv}>
                <Typography variant='h5'>及时掌握店铺打折、促销活动</Typography>
                <div className={classes.descTextLine}/>
                <Typography variant='subtitle1'>在APP首页可以查看周边正在进行促销活动的店铺，当某店铺准备进行打折、促销时，会店铺首页提前告知顾客。如果您关注了该店铺，您还可以实时地收到店铺推送给您的促销活动信息。</Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{backgroundColor:'#eee'}}>
          <Grid container className={classNames(classes.descGrid,classes.wingBlank, classes.limitWidth)}>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <img src={appDescCoupon} style={{width: isWidthUp('sm', width)? '80%':'120%'}}/>
            </Grid>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <div className={classes.descTextDiv}>
                <Typography variant='h5'>领取APP专享代金券</Typography>
                <div className={classes.descTextLine}/>
                <Typography variant='subtitle1'>各店铺会在自己的店铺首页发放代金券，代金券是可以和店铺的促销活动叠加使用的。</Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <div style={{backgroundColor:'#fff'}}>
          <Grid container className={classNames(classes.descGrid,classes.wingBlank, classes.limitWidth)} direction="row-reverse">
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <img src={appDescFavorite} style={{width: isWidthUp('sm', width)? '80%':'120%'}}/>
            </Grid>
            <Grid item sm={6} xs={12} className={classes.descHalfGrid}>
              <div className={classes.descTextDiv}>
                <Typography variant='h5'>收藏感兴趣的商品</Typography>
                <div className={classes.descTextLine}/>
                <Typography variant='subtitle1'>点击商品图片右上角的五角星即可收藏该商品。在APP的“收藏”一栏，您所有收藏的商品都在那里，可以以列表和地图两种形式展示。</Typography>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}
const styles = ()=>{
  return ({
    wingBlank: {
      paddingLeft: '0.5rem',
      paddingRight: '0.5rem'
    },
    limitWidth:{
      maxWidth: '70rem',margin: '0 auto'
    },
    descGrid:{
      padding: '2rem'
    },
    descHalfGrid:{
      display:'flex', 
      justifyContent:'center', 
      alignItems:'center'
    },
    descTextDiv:{
      display:'flex', 
      flexDirection:'column'
    },
    descTextLine:{
      width: '7rem', 
      borderBottom:'1px solid #aaa', 
      marginTop:'1rem', 
      marginBottom:'1rem'
    },
  });
}
export default connect()(withWidth()(withStyles(styles)(AppDescPanel)));
