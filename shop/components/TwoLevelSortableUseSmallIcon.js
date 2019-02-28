import React from 'react';
import Sortable from 'sortablejs';
import RegionUseSmallIcon from './RegionUseSmallIcon'
import {connect} from 'react-redux'
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

class TwoLevelSortableUseSmallIcon extends React.Component{
  sortableContainersDecorator = (instance) => {
    const {width, shopAuth} = this.props;
    // check if backing instance not null
    if (instance) {
      let options = {
        // delay: width==='xs'? 100:undefined,
        // touchStartThreshold: 5,
        handle: '.region-move-handle', // Restricts sort start click/touch to the specified element
        onEnd:(evt)=>{
          let oldIndex = evt.oldIndex;
          let newIndex = evt.newIndex;
          if(oldIndex === newIndex) return;//如果拖动并没有改变元素顺序，则不进行后续操作
          this.props.dispatch({type:'commodityOrderModel/changeRegionOrder', oldIndex:oldIndex, newIndex:newIndex});
        },
        onMove:function (evt, originalEvent) {
          if(global.realm==='shop'&&!shopAuth.sortInShopCommodity) {
            global.Toast.error('您不具备该操作的权限，请联系上级管理员开通此权限!');
            return false;
          }
          // if(evt.dragged.children[0].children[0].innerHTML === '未分类商品' ||
          //   evt.related.children[0].children[0].innerHTML === '未分类商品')//未分类商品region只能排在最后
          //   return false;
        },
      };
      Sortable.create(instance, options);
    }
  };
  render(){
    console.log('twolevel rendered');
    const  {commodityOrder, classes} = this.props;
    let regionOrder = [];
    for(let k in commodityOrder){
      regionOrder.push(commodityOrder[k].regionName);
    }
    return (
      <div className={classes.disableSelect}>
        <div className={classes.disableSelect} ref={this.sortableContainersDecorator} style={{'paddingBottom':90, overflowX: 'hidden'}}>
          {
            regionOrder.map(
              (regionName)=><RegionUseSmallIcon regionName={regionName} key={regionName} handleAddInShopCommodityDialogOpen={this.handleAddInShopCommodityDialogOpen}/>
            )
          }
        </div>
      </div>
    );
  }
}
const mapStateToProps=({commodityOrderModel: commodityOrder, shopModel})=>{
  return {commodityOrder, shopAuth:shopModel.shopAuth||{}};
}

const styles=()=>{
  return ({
    disableSelect:{
      touchCallout:'none',
      userSelect:'none',
    }
  })
}
export default connect(mapStateToProps)(withWidth()(withStyles(styles)(TwoLevelSortableUseSmallIcon)));
