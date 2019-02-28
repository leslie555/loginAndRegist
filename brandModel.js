import modelExtend from 'dva-model-extend';
import { commonModel } from '../loginAndRegist/commonModel';


export default modelExtend(commonModel, {
  namespace: 'brandModel',
  state: null,
  reducers: {},
  effects: {
    *query(action, { call, put }) {
      let json;
      try {
        json = yield global.myFetch(
          { url:`${global.serverBaseUrl}/brands`, method: 'get' }
        );
      } catch (e) {
        console.error(e);
        alert(e.message)
        return;
      }
      const brandsArray = json;
      const brandsMap = {};
      brandsArray.forEach((item) => {
        brandsMap[item.id] = item;
      });
      const sectionedBrandsObject = {};
      for (const item of brandsArray) {
        if (!item.englishName) {
          if (!sectionedBrandsObject.ZZ) sectionedBrandsObject.ZZ = [];
          sectionedBrandsObject.ZZ.push(item);
        } else {
          const session = item.englishName[0].toLocaleUpperCase();
          if (!sectionedBrandsObject[session]) sectionedBrandsObject[session] = [];
          sectionedBrandsObject[session].push(item);
        }
      }
      const sectionedBrandsArrayUnSorted = [];
      for (const key in sectionedBrandsObject) {
        sectionedBrandsArrayUnSorted.push({ key, data: sectionedBrandsObject[key] });
      }
      const sectionedBrandsArray = sectionedBrandsArrayUnSorted.sort((a, b) => {
        if (a.key.charCodeAt(0) > b.key.charCodeAt(0)) return 1;
        return -1;
      });

      // 分组头的数据源
      const sectionNameArr = [];
      for (let i = 0; i < sectionedBrandsArray.length; i += 1) {
        // 给右侧的滚动条进行使用的
        sectionNameArr[i] = sectionedBrandsArray[i].key;
      }
      yield put({
        type: 'updateState',
        payload: {
          brandsArray,
          brandsMap,
          sectionedBrandsArray,
          sectionNameArr,
        },
      });
    },
  },
});
