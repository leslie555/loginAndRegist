import modelExtend from 'dva-model-extend';
import { commonModel } from '../../commonModel';

export default modelExtend(commonModel, {
  namespace: 'editInShopCommodityModel',
  state: {
    open: undefined,
    modifiedFlag: undefined,
    inShopCommodityNew: undefined,
    inShopCommodityId: undefined,
    hugeImgUrl: undefined,
    showDefaultInf: undefined,
    showColorImgSelectDialog: undefined,
    colorImgSelectDialogTargetColor: undefined,
    colorsStr: undefined,
    sizesStr: undefined,
    detailsEditable: undefined,
  },
  reducers: {},
  effects: {
    *ConfirmModifyInShopCommodity(action, {select, put}) {
      const {editInShopCommodityModel, inShopCommoditiesModel} = yield select(state => state);
      const inShopCommodities = [...inShopCommoditiesModel];
      let inShopCommodityNew = editInShopCommodityModel.inShopCommodityNew;
      let inShopCommodityId = inShopCommodityNew.id;
      let inShopCommodityModifiedPart;
      for(let k in inShopCommodities){
        if(inShopCommodities[k].id == inShopCommodityId){
          inShopCommodityModifiedPart = global.getObjectModifiedPart(
            inShopCommodities[k],
            inShopCommodityNew,
            ['brand','inShopCommodities']
          );
          inShopCommodities[k] = inShopCommodityNew;
          break;
        }
      }
      yield put({type: 'inShopCommoditiesModel/replace', payload: inShopCommodities});
      if(Object.keys(inShopCommodityModifiedPart).length>0){
        yield put({
          type: 'inShopCommoditiesModel/modifyInShopCommodityInServer',
          payload: {
            modifiedInShopCommodityId: inShopCommodityId,
            inShopCommodityModifiedPart,
          },
        });
      }
      global.dispatch({type:'editInShopCommodityModel/replace', payload: {}});
    },
  },
});
