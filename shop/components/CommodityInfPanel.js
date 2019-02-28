import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';

class CommodityInfPanel extends React.Component {  
  render(){
    let { commodity, classes, width } = this.props;
    commodity = global.normalizeCommodity(commodity);
    return(
      <div>
        <div >
          <p><span style={{fontWeight: 'bold'}}>commdityId：</span><span>{commodity.id}</span></p>
          <p><span style={{fontWeight: 'bold'}}>商品名称：</span><span>{commodity.name}</span></p>
          <p><span style={{fontWeight: 'bold'}}>品牌：</span><span>{commodity.brandName}</span></p>
          <p><span style={{fontWeight: 'bold'}}>货号：</span><span>{commodity.productCode}</span></p>
          <p><span style={{fontWeight: 'bold'}}>厂家推荐价：</span><span>{commodity.signPrice}</span></p>
          <span style={{fontWeight: 'bold'}}>商品细节：</span>
          <ul style={{paddingLeft:'0'}}>
            {
              commodity.details&&commodity.details.map(function(item, index){
                return (
                  <li key={index}
                    style={{
                      display: 'inline-block',
                      width: '250px',
                      verticalAlign: 'top',
                      marginRight: '10px',
                      listStyle: 'none',
                      userSelect: 'text',
                    }}
                  >{item.name}：{item.value}</li>
                );
              })
            }
          </ul>
          
          <p><span style={{fontWeight: 'bold'}}>图标：</span></p>
          <div  style={{margin:width==='xs'?'0 -20px':0}}>
            <Grid container spacing={8}>
              {commodity.colors.map((colorObj, index)=>{
                const urlOnBos = global.getUrlOnBos({
                  fileName:colorObj.iconImg,
                  producerId: commodity.producerId, 
                  commodityId:commodity.id,
                });
                return(
                  <Grid key={index} item xs={width==='xs'?4:undefined}
                    style={{width: width!=='xs'?'112px':undefined, marginRight: width!=='xs'?'0.5rem':undefined}}
                  >
                    <div style={{display:'inline-block'}}>
                      <img
                        src={urlOnBos+'@w_112'}
                        className={classes.theImg}
                        onClick={this.handleImgClick.bind(undefined, urlOnBos)}
                      />
                      <p style={{margin:0, textAlign:'center'}}>{colorObj.color}</p>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>

          <p><span style={{fontWeight: 'bold'}}>颜色示意图：</span></p>
          <div  style={{margin:width==='xs'?'0 -20px':0}}>
            <Grid container spacing={8}>
              {commodity.colors.map((colorObj, index)=>{
                const urlOnBos = global.getUrlOnBos({
                  fileName:colorObj.colorImg,
                  producerId: commodity.producerId, 
                  commodityId:commodity.id,
                });
                return(
                  <Grid key={index} item xs={width==='xs'?4:undefined}
                    style={{width: width!=='xs'?'112px':undefined, marginRight: width!=='xs'?'0.5rem':undefined}}
                  >
                    <div style={{display:'inline-block'}}>
                      <img
                        src={urlOnBos+'@w_112'}
                        className={classes.theImg}
                        onClick={this.handleImgClick.bind(undefined, urlOnBos)}
                      />
                      <p style={{margin:0, textAlign:'center'}}>{colorObj.color}</p>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>
          
          <p><span style={{fontWeight: 'bold'}}>轮播图：</span></p>
          <div  style={{margin:width==='xs'?'0 -20px':0}}>
            <Grid container spacing={8}>
              {commodity.smallImgs.map((img, index)=>{
                const urlOnBos = global.getUrlOnBos({
                  fileName:img,
                  producerId: commodity.producerId, 
                  commodityId:commodity.id,
                });
                return(
                  <Grid key={index} item xs={width==='xs'?4:undefined}
                    style={{width: width!=='xs'?'112px':undefined, marginRight: width!=='xs'?'0.5rem':undefined}}
                  >
                    <img
                      src={urlOnBos+'@w_112'}
                      className={classes.theImg}
                      onClick={this.handleImgClick.bind(undefined, urlOnBos)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
          <p><span style={{fontWeight: 'bold'}}>详情图：</span></p>
          <div  style={{margin:width==='xs'?'0 -20px':0}}>
            <Grid container spacing={8}>
              {(commodity.bigImgs||[]).map((img, index)=>{
                const urlOnBos = global.getUrlOnBos({
                  fileName:img,
                  producerId: commodity.producerId, 
                  commodityId:commodity.id,
                });
                return(
                  <Grid key={index} item xs={width==='xs'?4:undefined} 
                    style={{width: width!=='xs'?'112px':undefined, marginRight: width!=='xs'?'0.5rem':undefined}}
                  >
                    <img
                      src={urlOnBos+'@w_112'}
                      className={classes.theImg}
                      onClick={this.handleImgClick.bind(undefined, urlOnBos)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
          
        </div>
      </div>
    );
  }

  handleImgClick = (url, evt)=>{
    global.dispatch({type:'appModel/updateState',payload:{hugeImgUrl: url}});
    evt.nativeEvent.stopImmediatePropagation();
    evt.preventDefault();
    evt.stopPropagation();
  }
}

const styles=(theme)=>({
  detailLi:{
    display: 'inline-block',
    width: '250px',
    verticalAlign: 'top',
    marginRight: '10px',
    listStyle: 'none'
  },

  img: {
    width: '100%', 
    maxHeight: '15rem',
    cursor: 'pointer',
    boxShadow: '0 0 5px #999',
    [theme.breakpoints.up('sm')]: {
      width:'8rem',
    },
  },
});

export default withStyles(styles)(withWidth()(CommodityInfPanel));