import React from 'react';
import Sortable from 'sortablejs';
import {connect} from 'react-redux'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import classNames from 'classnames';
// import MyImage from '../../MyImage';

class RegionUseSmallIcon extends React.Component{
  sortableGroupDecorator = (instance) => {
    global.preventContextMenu(instance) //避免长按弹出右键菜单
    const {width} = this.props;
    if (instance) {
      let options = {
        // delay: width==='xs'? 100:undefined,
        // touchStartThreshold: 5,
        // draggable: ".image", // Specifies which items inside the element should be sortable
        group: 'shared',
        //商品由一个region移动到另一个region时触发该函数
        onAdd: (evt)=>{
          // console.log('1111111111111111111')
          evt.from.appendChild(evt.item);//还原sortablejs插件所做的view的改变
          this.props.dispatch({
            type:'commodityOrderModel/changeCommodityOrder',
            fromRegionName:evt.from.getAttribute('data-regin-name'),
            toRegionName:evt.to.getAttribute('data-regin-name'),
            oldIndex:evt.oldIndex,
            newIndex:evt.newIndex
          });
        },
        //商品在一个region内部移动时触发该函数
        onUpdate:  (evt) => {
          let regionName = evt.from.getAttribute('data-regin-name');
          // console.log('333333333333333333',{
          //   fromRegionName:regionName,
          //   toRegionName:regionName,
          //   oldIndex:evt.oldIndex,
          //   newIndex:evt.newIndex
          // })
          this.props.dispatch({
            type:'commodityOrderModel/changeCommodityOrder',
            fromRegionName:regionName,
            toRegionName:regionName,
            oldIndex:evt.oldIndex,
            newIndex:evt.newIndex
          });
        },
      };
      Sortable.create(instance, options);
    }
  };
  render(){
    // console.log('region rendered ',this.props.region.regionName);
    const { inShopCommodities, region, classes, dispatch} = this.props;
    const {regionName} = region;
    if(!region) return null;

    return (
      <Paper style={{marginTop: '0.3rem'}} className="region-move-handle">
        <div
          ref={global.preventContextMenu.bind(undefined)}
          className={classes.disableSelect}
          style={{display:'flex', justifyContent: 'space-between', cursor: 'move'}}>
          <Typography variant="h6" className={classes.disableSelect}>{regionName}</Typography>
        </div>
        <div  className={classes.disableSelect} style={{minHeight:'2rem', clear: 'both'}} ref={this.sortableGroupDecorator} data-regin-name={regionName}>
          {region.commodities&&region.commodities.map(
            (commodityId)=>{
              let inShopCommodity;
              //commodityId可能后于inShopCommodities更新，在删除商品的情况下，inShopCommodity可能为undefined
              for(let k in inShopCommodities){
                if(inShopCommodities[k].commodity.id == commodityId){
                  inShopCommodity = inShopCommodities[k];
                  break;
                }
              }
              let url = (global.getIconColors(inShopCommodity)[0]||inShopCommodity.commodity.colors[0]).iconImg;
              if(!url) return null;
              return (
                <div
                  ref={global.preventContextMenu.bind(undefined)}
                  className={classNames(classes.img, classes.disableSelect)}
                  key={commodityId}
                >
                  <img
                    ref={global.preventContextMenu.bind(undefined)}
                    src={
                      global.getUrlOnBos({
                        fileName:url,
                        producerId: inShopCommodity.producerId, 
                        commodityId:inShopCommodity.commodityId,
                      })+'@w_120'
                    }
                    style={{width:'3rem', height:'3rem'}}
                  />
                </div>
              );
            }
          )}
        </div>
      </Paper>
    )
  }
}
const mapStateToProps=({inShopCommoditiesModel: inShopCommodities, commodityOrderModel: commodityOrder}, ownProps)=>{
  for(let k in commodityOrder){
    if(commodityOrder[k].regionName == ownProps.regionName)
      return {region:commodityOrder[k], commodityOrder, inShopCommodities};
  }
  return {commodityOrder, inShopCommodities}
}
const styles=()=>{
  return ({
    img: {
      width: '3rem', height: '3rem', boxShadow: '0 0 5px #999', display:'inline-block',
      marginRight: '3px', marginBottom:'3px', cursor:'move', 
      backgroundSize:'100% 100%'
    },
    disableSelect:{
      touchCallout:'none',
      userSelect:'none',
    }
  })
}
export default connect(mapStateToProps)(withWidth()(withStyles(styles)(RegionUseSmallIcon)));
