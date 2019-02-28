// import {hashHistory} from 'react-router';

//asyn actioncreator
// function queryWithAdditions() {
//   return (dispatch) => {
//     // showCircularProgress(dispatch);
//     global.myFetch(global.serverBaseUrl+'/MyUsers/me?filter={\"include\":{\"shop\":[{\"inShopCommodities\":\"commodity\"},\"brand\"]}}'/*+'&access_token='+accessToken*/
//     ,{credentials: 'include'})
//     .then((response)=>{
//       return response.json();
//     }).then((json)=>{
//       console.log(json);
//       if(!json.shop || !json.shop.name) {
//         hashHistory.push('/console/setShop');
//       } else {
//         let inShopCommodities = json.shop.inShopCommodities;
//         //获取获取店铺内所有commodity的id构成的数组
//         let commodityIds = getCommodityIds(inShopCommodities);
//         let commodityOrder = json.shop.commodityOrder;
//         //清理掉commodityOrder中不在commodityIds数组中的commodity id
//         commodityOrder = clearUpCommodityOrder(commodityOrder, commodityIds);
//         //获取commodityOrder中所有commodity id构成的数组
//         let orderedCommodityIds = getOrderedCommodityIds(commodityOrder);
//         //获取在commodityIds中但不在commodityOrder中的commodity id构成的数组
//         let unOrderedCommodityIds
//           = getUnOrderedCommodityIds(commodityIds, orderedCommodityIds);
//         let commodityOrderLen = commodityOrder.length;//commodityOrderLen实际上是region的个数
//         //commodityOrder中的最后一个region必须是‘未分类商品’，并将没有排序的商品加入其中
//         if(commodityOrderLen>0 && commodityOrder[commodityOrderLen-1].regionName=='未分类商品') {
//           let commodities = commodityOrder[commodityOrderLen-1].commodities;
//           commodityOrder[commodityOrderLen-1].commodities
//             = commodities.concat(unOrderedCommodityIds);
//           // console.log('9999999999999999999999999',JSON.stringify(commodityOrder));
//         }
//         else commodityOrder.push({regionName:'未分类商品',commodities:unOrderedCommodityIds});
//         // console.log('333333333333333333333333',unOrderedCommodityIds,commodityOrder);
//         json.shop.commodityOrder = commodityOrder;//commodityOrder原来可能并不存在，所以必须有这一行代码
//         // 对inShopCommodities进行预处理，inShopCommodity中的name、
//         // priceInShop等可能为undefined,需要生成这些数据，方便后续处理
//         for(let k of json.shop.inShopCommodities){
//           preprocessInShopCommodity(k, json.shop.salesInf, json.shop.salesEndDate);
//         }
//       }
//       dispatch({type:'RefreshData',dataPart:'shopInf',data:json});
//       // hideCircularProgress(dispatch);
//     }).catch(function(ex) {
//       console.error('queryWithAdditions :', ex);
//       // hideCircularProgress(dispatch);
//       global.Toast.info('店铺信息下载失败！');
//     })
//   };
// }
//asyn actioncreator
// function downLoadBrandsInf() {
//   return dispatch => {
//     global.myFetch(global.serverBaseUrl+'/Brands')
//       .then((response)=>{
//         return response.json();
//       }).then((json)=>{
//         dispatch({type:'ChangeStoreData',dataPart:'brandsInf',data:json});
//       }).catch(function(ex) {
//         console.error('downLoadBrandInf :', ex);
//         global.Toast.info( '品牌信息下载失败！');
//       })
//   };
// }


//上传新的商品顺序并下载新的数据刷新redux state
// function uploadNewCommodityOrderAndRefresh(newCommodityOrder, dispatch){
//   global.myFetch(global.serverBaseUrl+'/MyUsers/me/shop', {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       'commodityOrder':newCommodityOrder
//     }),
//     credentials: 'include'  //加入这个属性，浏览器才会带上cookie发送请求
//   }).then((response)=>{
//     return response.json();
//   }).then((json)=>{
//     dispatch(queryWithAdditions());
//   }).catch(function(ex) {
//     console.error(ex);
//   });
// }

// const getCommodityIds = function(inShopCommodities){
//   let commodityIds = [];
//   for(let i in inShopCommodities){
//     commodityIds.push(inShopCommodities[i].commodity.id.toString());//id可能是数字，统一转换为字符串，以便后续处理
//   }
//   return commodityIds;
// };
// const clearUpCommodityOrder = function(commodityOrder,commodityIds){
//   if(!(commodityOrder instanceof Array)) commodityOrder=[];
//   for(let i in commodityOrder){
//     if(!(commodityOrder[i].commodities instanceof Array))
//       commodityOrder[i].commodities = [];
//     let commodities = commodityOrder[i].commodities;
//     for(let j in commodities){
//       let tmp = typeof commodities[j];//tmp实际上时commodity id
//       if((tmp!='number' && tmp!='string')//需要排除tmp为null或undefined的情况
//         || commodityIds.indexOf(commodities[j].toString())<0) {
//         commodities.splice(j,1);
//       }
//     }
//   }
//   return commodityOrder;
// }
// const getOrderedCommodityIds = function(commodityOrder){
//   let commodityIds = [];
//   for(let i in commodityOrder){
//     let commodities = commodityOrder[i].commodities;
//     for(let j in commodities){
//       commodityIds.push(commodities[j]);
//     }
//   }
//   return commodityIds;
// };
// const getUnOrderedCommodityIds = function(commodityIds, orderedCommodityIds){
//   let unOrderedCommodityIds = [];
//   outer:for(let i in commodityIds){
//     for(let j in orderedCommodityIds){
//       if(commodityIds[i] == orderedCommodityIds[j]) continue outer;
//     }
//     unOrderedCommodityIds.push(commodityIds[i]);
//   }
//   return unOrderedCommodityIds;
// };

//使用y更新x，x的变化尽可能地小，这样React重新渲染的组件就尽可能地少。x,y可以
//是任意类型，其中不能包含函数，且__proto__为最简单的形式。应该使用函数的返回值
//而不是x,因为当x为数字、字符串、布尔类型时，函数采用的是值传递
function updateObject(x, y) {
    var p;
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return x;
    }
    if (x === y) {
        return x;
    }
    if (
        (x instanceof String && y instanceof String) ||
        (x instanceof Number && y instanceof Number)) {
        if (x.toString() === y.toString()) return x;
        else {
          x = y; return x;
        }
    }
    if (!(x instanceof Object && y instanceof Object)) {
        x = y; return x;
    }
    if (x.constructor !== y.constructor) {
        x = y; return x;
    }
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            x[p] = y[p];
            if(x instanceof Array) x = [...x];
            else x = {...x};
            continue;
        } else if (typeof y[p] !== typeof x[p]) {
            x[p] = y[p];
            if(x instanceof Array) x = [...x];
            else x = {...x};
            continue;
        }
    }
    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            delete x[p];
            if(x instanceof Array) x = [...x];
            else x = {...x};
            continue;
        } else if (typeof y[p] !== typeof x[p]) {
            x[p] = y[p];
            if(x instanceof Array) x = [...x];
            else x = {...x};
            continue;
        }
        switch (typeof(x[p])) {
            case 'object':
                x[p] = updateObject(x[p], y[p]);
                break;
            default:
                if (x[p] !== y[p]) {
                    x[p] = y[p];
                    continue;
                }
                break;
        }
    }
    return x;
}



// let obj1 ;
// let obj2 ;
// obj1 = 1;
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = 1;
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = [1,2];
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = [1,2];
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = '1';
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = '1';
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1},e:1};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:1,c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1,2,3],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1,2],d:[1]};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:[2]};
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1,{w:2}],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2}],d:{a:1}};
// obj2 = {a:1,b:'string',c:[1,2],d:{a:1}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));


// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2]}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1]],d:{a:1,b:[1,2],c:{a:1}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[2,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string2',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:{},d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:1},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:{k:1}},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2,{}],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],d:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2],[2,3]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],c:{a:1,b:2}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{ww:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {b:'string',a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[{w:2},1,[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));
// obj1 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{a:1,b:[1,2],c:{a:1,b:2}}};
// obj2 = {a:1,b:'string',c:[1,{w:2},[1,2]],d:{b:[1,2],a:1,c:{a:1,b:2}}};
// obj1 = updateObject(obj1, obj2);
// console.log(deepCompare(obj1, obj2));


// obj1={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {b:[1]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {a:null}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'4'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {c:{a:1,b:'4'}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'4'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {c:{a:1,b:'4'}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,2,{a:1}],e:{a:1,b:[1,2]}};
// ret = {d:[1,2,{a:1}]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {c:null}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[2]}};
// ret = {e:{a:1,b:[2]}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3',c:23},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {c:{a:1,b:'3',c:23}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1]}};
// ret = {e:{a:1,b:[1]}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:''}],e:{a:1,b:[1,2]}};
// ret = {d:[1,{a:''}]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},d:[1,{a:1},[]],e:{a:1,b:[1,2]}};
// ret = {d:[1,{a:1},[]]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],c:{a:1,b:'3'},e:{a:1,b:[1,2]}};
// ret = {d:null}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1],c:{a:1,b:'3'},d:[{a:1}],e:{a:1,b:[1,2]}};
// ret = {b:[1],d:[{a:1}]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,2],d:[1,{a:1}],e:{a:2,b:[1,2]}};
// ret = {c:null,e:{a:2,b:[1,2]}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,b:[1,4],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[3,2]}};
// ret = {b:[1,4],e:{a:1,b:[3,2]}}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
// obj2={a:1,k:[1,2],c:{a:1,b:'3'},d:[1,{a:1}],e:{a:1,b:[1,2]}};
// ret = {b:null,k:[1,2]}
// console.log(deepCompare(getObjectModifiedPart(obj1,obj2),ret));
const X34 = '0123456789abcdefghijkmnpqrstuvwxyz';

//10进制换成34进制
function convertTo34(val) {
  let result = '';
  while (val >= 34)
  {
    result = X34[val%34] + result;
    val = Math.floor(val/34);
  }
  if (val >= 0) result = X34[val] + result;
  return result;
}

//34进制转换成10进制
function convertTo10(str) {
  let result = 0;
  let len = str.length;
  for (let i = 0; i < len; i++)
  {
    result = result * 34 + X34.indexOf(str[i]);
  }
  return result;
}
//置乱
function disturb(val) {
  let str = '000000000'+val;
  return parseInt(str.slice(0,-10)+str.slice(-5)+str.slice(-10,-5));
}

global.updateObject = updateObject;
global.convertTo10 = convertTo10;
global.convertTo34 = convertTo34;
global.disturb = disturb;
