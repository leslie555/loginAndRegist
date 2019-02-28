import React from 'react';
import Sortable from 'sortablejs';
import Region from './Region'
import {connect} from 'react-redux'
import withWidth from '@material-ui/core/withWidth';

class TwoLevelSortable extends React.Component{
  sortableContainersDecorator = (instance) => {
    const {width, shopAuth} = this.props;
    // check if backing instance not null
    if (instance&&width!=='xs') {
      let options = {
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
    let commodityOrder = this.props.commodityOrder;
    let regionOrder = [];
    for(let k in commodityOrder){
      regionOrder.push(commodityOrder[k].regionName);
    }
    return (
      <div>
        <div ref={this.sortableContainersDecorator} style={{'paddingBottom':90, overflowX: 'hidden'}}>
          {
            regionOrder.map(
              (regionName)=><Region regionName={regionName} key={regionName} handleAddInShopCommodityDialogOpen={this.handleAddInShopCommodityDialogOpen}/>
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


export default connect(mapStateToProps)(withWidth()(TwoLevelSortable));

