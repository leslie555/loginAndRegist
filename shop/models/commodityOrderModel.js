import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';

export default modelExtend(commonModel, {
  namespace: 'commodityOrderModel',
  state: null,
  reducers: {
  },
  effects: {
    *changeRegionOrder(action, {select, put}) {
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      let tmp = commodityOrder.splice(action.oldIndex, 1)[0];
      commodityOrder.splice(action.newIndex, 0, tmp);
      yield put({type: 'replace', payload: [...commodityOrder]});
      // yield put({type: 'appModel/updateState', payload: {
      //   shopModified:true,
      //   shopModifiedPart:{commodityOrder}
      // }});
      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});
    },
    *changeCommodityOrder(action, {select, put}){
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      // console.log(action.fromRegionName,action.toRegionName)
      //商品在一个region中移动时
      if(action.fromRegionName==action.toRegionName){
        let regionIndex;
        for(let k in commodityOrder){
          let regionName = commodityOrder[k].regionName;
          if(regionName == action.fromRegionName){
            regionIndex = k;
            break;
          }
        }
        // console.log(action.oldIndex, action.newIndex, JSON.stringify(commodityOrder[regionIndex].commodities));
        let tmp = commodityOrder[regionIndex].commodities.splice(action.oldIndex, 1)[0];
        commodityOrder[regionIndex].commodities.splice(action.newIndex, 0, tmp);
        commodityOrder[regionIndex] = {...commodityOrder[regionIndex]}
        // console.log(JSON.stringify(commodityOrder[regionIndex].commodities));
      }
      //商品由一个region移动到另一个region时
      else {
        let fromRegionIndex;
        let toRegionIndex;
        for(let k in commodityOrder){
          let regionName = commodityOrder[k].regionName;
          if(regionName == action.fromRegionName){
            fromRegionIndex = k;
          }
          else if(regionName == action.toRegionName){
            toRegionIndex = k;
          }
        }
        let tmp = commodityOrder[fromRegionIndex].commodities.splice(action.oldIndex, 1)[0];
        commodityOrder[toRegionIndex].commodities.splice(action.newIndex, 0, tmp);
        //只有经过以下浅复制操作，Region组件才会重新渲染，否则Region组件的props.region前后为同一指针
        commodityOrder[fromRegionIndex] = {...commodityOrder[fromRegionIndex]}
        commodityOrder[toRegionIndex] = {...commodityOrder[toRegionIndex]}
      }
      yield put({type: 'replace', payload: [...commodityOrder]});

      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});
    },
    *newRegion({payload: {regionName}}, {select, put}) {
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      if(!commodityOrder||!(commodityOrder instanceof Array)) commodityOrder = [];
      let len = commodityOrder.length;
      // if(commodityOrder[len-1].regionName == '未分类商品')
      commodityOrder.splice(len,0,{regionName, commodities:[]});
      // else commodityOrder.push({regionName:action.data,commodities:[]});

      yield put({type: 'replace', payload: [...commodityOrder]});

      yield put({
        type: 'shopModel/modifyShopInServer', 
        payload: {shopModifiedPart: {commodityOrder}, cb:global.Toast.success.bind(undefined, '添加新分类成功！')}
      });
    },
    *deleteRegion(action, {select, put}) {
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      for(let k in commodityOrder){
        if(commodityOrder[k].regionName == action.regionName){
          commodityOrder.splice(k,1);
          break;
        }
      }
      yield put({type: 'replace', payload: [...commodityOrder]});
      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});
    },
    *changeRegionName({payload: {oldRegionName, newRegionName}}, {select, put}) {
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      for(let index in commodityOrder) {
        const item = commodityOrder[index];
        if(item.regionName === oldRegionName) {
          commodityOrder[index] = {...item, regionName: newRegionName};
          break;
        }
      }
      yield put({type: 'replace', payload: [...commodityOrder]});
      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});

    },
    *changeRegionExtrInf({payload: {/*oldRegionExtrInf, */newRegionExtrInf, regionName}}, {select, put}) {
      let {commodityOrderModel: commodityOrder} = yield select(state => state);
      for(let index in commodityOrder) {
        const item = commodityOrder[index];
        if(item.regionName === regionName) {
          commodityOrder[index] = {...item, regionExtrInf: newRegionExtrInf};
          break;
        }
      }
      yield put({type: 'replace', payload: [...commodityOrder]});
      yield put({type: 'shopModel/modifyShopInServer', payload: {shopModifiedPart: {commodityOrder}}});

    }
  },
});
