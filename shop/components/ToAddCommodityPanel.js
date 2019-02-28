import React from 'react';
import {connect} from 'react-redux'
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import CommodityInfPanel from './CommodityInfPanel'
import Button from '@material-ui/core/Button';
class ToAddCommodityPanel extends React.Component {
  // componentDidMount(){
  //   // 搜索到结果后通过重设dialogRenderAgain来强制对话框调整高度
  //   this.props.dispatch({
  //     type:'addInShopCommodityModel/updateState',
  //     payload:{dialogRenderAgain: {}},
  //   });
  // }
  // componentWillUnmount(){
  //   // 搜索到结果后通过重设dialogRenderAgain来强制对话框调整高度
  //   this.props.dispatch({
  //     type:'addInShopCommodityModel/updateState',
  //     payload:{dialogRenderAgain: {}},
  //   });
  // }
  render() {
    const {commodity, inShopCommodities} = this.props;
    let ifContainedInShop = false;
    for(let k in inShopCommodities){
      if(inShopCommodities[k].commodity.id == commodity.id
         ||commodity.brandId&&inShopCommodities[k].brandId===commodity.brandId&&
          commodity.productCode&& inShopCommodities[k].productCode===commodity.productCode
      // ||inShopCommodities[k].commodity.url === commodity.url
      ){
        ifContainedInShop = true;
        break;
      }
    }
    return (
      <div key={commodity.productCode}>
        <CommodityInfPanel commodity={commodity}/>
        <div style={{clear:'both'}}>
          {commodity&&commodity.smallImgs&&commodity.smallImgs.length>0&&  //smallimgs是必需的
            <Button
              variant="contained"
              style={{display:'block',width:'160px',margin:'0 auto', marginTop: '1rem'}}
              color="primary"
              icon={ifContainedInShop?undefined:<AddCircleOutline/>}
              disabled={ifContainedInShop}
              onClick={()=>{
                //下面是显示环形进度条，隐藏操作将在SynchronizeData后在queryWithAdditions()中调用
                // showCircularProgress(this.props.dispatch);
  
                this.props.dispatch({
                  type:'inShopCommoditiesModel/addCommodity',
                  toAddCommodity: commodity
                });
              }}
            >{ifContainedInShop?'已添加':'添加到店铺'}</Button>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  ({inShopCommoditiesModel: inShopCommodities})=>{return {
    inShopCommodities,
  }}
)(ToAddCommodityPanel);
