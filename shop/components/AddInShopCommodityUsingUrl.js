import React, { Component } from 'react';
import {connect} from 'react-redux';

import fetchJsonp from 'fetch-jsonp';
import ToAddCommodityPanel from './ToAddCommodityPanel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import WindowsPic from '../imgs/windowsPic.jpg';
import ApplePic from '../imgs/applePic.jpg';

const MinImgHeight = 300;

class AddInShopCommodityUsingUrl extends Component {
  state={
    showDownloadDialog: false
  }
  render() {
    const {extractUrl, commodityFromUrl, dispatch} = this.props;

    return (
      <div style={{margin: '0 auto'}}>
        <h3>网页提取：</h3>
        <p>使用电脑浏览器或手机浏览器进入电商网址，从网站找到您想要添加的商品，将商品的网址粘贴到下面的输入框中然后点击“提取”按钮。</p>
        <p>当前支持的电商网站包括：天猫、淘宝、京东、唯品会、天猫供销平台。</p>
        <TextField
          label="输入网址"
          value={extractUrl||''} 
          onChange={(e)=>{
            dispatch({type: 'addInShopCommodityModel/updateState', payload: {extractUrl: e.target.value}})
          }}
          // error={Boolean(this.props.searchTextError)}
          // helperText={this.props.searchTextError}
          fullWidth
          className={global.classes.textField}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleExtractBtnClick}
          fullWidth
          className={global.classes.submitBtn}
        >提取</Button>
        {commodityFromUrl && 
          <div>
            <p style={{color: 'green'}}>商品信息提取完成。</p>
            <div>
              <p style={{color: 'green'}}>请检查提取出来的信息是否正确(主要观察其中是否包含你需要的图片，多余的图片可以在添加到您的店铺之后再屏蔽，商品的相关信息也可以修改)。</p>
              <p style={{color: 'green'}}>如果正确则点击“添加到店铺”按钮。</p>
            </div>
          </div>
        }
        {commodityFromUrl &&
          <ToAddCommodityPanel commodity={commodityFromUrl}/>
        }

        <Dialog
          open={this.state.showDownloadDialog||false}
          classes={{paper: global.classes.dialogWidth}}
        >
          <DialogTitle>下载</DialogTitle>
          <DialogContent>
            <p>注意：在安装过程中若弹出安全提醒，请务必选择“允许”。</p>
            <div style={{display:'flex', justifyContent:'space-around'}}>
              <div 
                style={{display:'flex', flexDirection:'column', alignItems:'center', cursor: 'pointer'}}
                onClick={()=>{
                  downloadFile('https://yiyimap-apk.cdn.bcebos.com/yiyimap_shop-x86Setup.exe')
                  this.setState({showDownloadDialog:false})
                }}
              >
                <img src={WindowsPic} style={{width: 90, height:90}}/>
                <span>windows32位</span>
              </div>
              <div 
                style={{display:'flex', flexDirection:'column', alignItems:'center', cursor: 'pointer'}}
                onClick={()=>{
                  downloadFile('https://yiyimap-apk.cdn.bcebos.com/yiyimap_shop-x64Setup.exe')
                  this.setState({showDownloadDialog:false})
                }}
              >
                <img src={WindowsPic} style={{width: 90, height:90}}/>
                <span>windows64位</span>
              </div>
              <div 
                style={{display:'flex', flexDirection:'column', alignItems:'center', cursor: 'pointer'}}
                onClick={()=>{
                  downloadFile('https://yiyimap-apk.cdn.bcebos.com/yiyimap_shop-darwin-x64.zip')
                  this.setState({showDownloadDialog:false})
                }}
              >
                <img src={ApplePic} style={{width: 90, height:90}}/>
                <span>mac</span>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="primary"
              onClick={()=>{this.setState({showDownloadDialog:false})}}
            >
              取消
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleExtractBtnClick = () => {
    const {extractUrl, dispatch} = this.props;
    let url = extractUrl;
    if(!checkUrl(url)) return;
    url = changePcToMobileUrlAndRemoveUnusedParams(url);

    const filter = { where: {url} };
    global.myFetch({
      url: global.serverBaseUrl+'/Commodities',
      data:{
        filter: encodeURIComponent(JSON.stringify(filter))
      }
    })
      .then((jsonArr)=>{
        if(jsonArr instanceof Array && jsonArr[0]) {
          const commodityFromUrl = jsonArr[0];
          dispatch({type: 'addInShopCommodityModel/updateState', payload: {commodityFromUrl}})
          global.Toast.success('提取完成', 1000);
          return;
        }

        if(url.indexOf('//goods.gongxiao.tmall.com/product/product_detail')>-1){
          this.fetchDataFromGongXiao(url);
        }
        else if(url.indexOf('//detail.m.tmall.com/item.htm')>-1){
          this.fetchDataFromTmallMobile(url);
        }
        else if(url.indexOf('//h5.m.taobao.com/awp/core/detail.htm')>-1){
          this.fetchDataFromTaobaoMobile(url);
        }
        else if(url.indexOf('//item.m.jd.com/product/')>-1){
          this.fetchDataFromJdMobile(url);
        }
        else if(url.indexOf('//m.vip.com/product-')>-1){
          this.fetchDataFromVipMobile(url);
        }

      })
      .catch((err)=>{
        console.error(err);
      })
  }

  handleAddBtnClick = () => {
    this.props.dispatch({
      type:'inShopCommoditiesModel/addCommodity',
      toAddCommodity: this.props.commodityFromUrl
    });
  }

  fetchDataFromGongXiao =(url)=>{
    corFetch(url)
      .then((response)=>{return response.arrayBuffer()})
      .then((text)=>{
        let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
        try {
          const commodity = getCommodityFromGongxiaoHtmlStr(htmlStr);
          this.updateCommodity(commodity, url);
        } catch(err) {
          this.handleExtractErr(err) 
        }
      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })
  }


  fetchDataFromTmallMobile =(url)=>{
    corFetch(url)
      .then((response)=>{return response.arrayBuffer()})
      .then((text)=>{
        let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
        let index1, index2;
        index1 = htmlStr.indexOf('<script>var _DATA_Detail = ', index2);
        if(index1<0) {
          if(htmlStr.indexOf('很抱歉，系统繁忙')>-1) alert('请安装chrome插件！');
          throw 'error ejd'
        }
        index1 += 27;
        index2 = htmlStr.indexOf(';</script>', index1);
        if(index2<0) throw 'error cur';
        const json = JSON.parse(htmlStr.slice(index1, index2));
        const commodity = {
          name : json.item.title,
          smallImgs: json.item.images
        };

        commodity.details = [];
        const detailsTmp = json.props.groupProps[0]['基本信息'];
        let key;
        for(let item of detailsTmp) {
          key = Object.keys(item)[0];
          commodity.details.push({name: key.trim(), value: item[key].trim()});
        }
        commodity.details.colors = json.skuBase.props[1].values;

        const tmp = json.detailDesc.newWapDescJson;
        if(tmp){
          commodity.bigImgs = [];
          for(let item of tmp){
            if(item.moduleName==='自定义'||item.moduleName==='商品图片') {
              for(let item2 of item.data) {
                commodity.bigImgs.push(item2.img);
              }
            }
          }
        }
        if(commodity.bigImgs&&commodity.bigImgs.length>0) {
          this.updateCommodity(commodity, url);
          console.log('从html中获取了bigImgs');
        }
        else {
          const match = htmlStr.match(/"httpsDescUrl":"(.+?)"/);
          if(match&&match[1]) {
            corFetch('https:'+match[1])
              .then((response)=>{return response.arrayBuffer()})
              .then((text)=>{
                let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
                let arr = getImgHtmlArr(htmlStr);

                let arr2 = arr.filter(function(item){
                  return (item.indexOf('align="middle"')>-1 || item.indexOf('align="absmiddle"')>-1)
                });
                if(arr2.length===0) {
                  arr2 = arr;
                }

                commodity.bigImgs = getImgUrlArr(arr2);
                this.updateCommodity(commodity, url);
                console.log('从httpsDescUrl中获取了bigImgs');
              })
          }
        }

      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })
  }

  fetchDataFromTaobaoMobile =(url)=>{
    const commodity = {};
    const id = url.match(/\?id=(\d+)/)[1];
    let colorImgsTmp;
    fetchJsonp(`https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdetail/6.0/?data=${encodeURIComponent(JSON.stringify({itemNumId:id}))}`)
      .then((response)=>{return response.json()})
      .then((json)=>{
        const data = json.data;
        commodity.name = data.item.title;
        commodity.smallImgs = data.item.images;
        const colorImgs = data.skuBase.props[1].values;
        for(let item of colorImgs){
          if(item.image) commodity.smallImgs.push(item.image);
        }
        const tmp = data.props.groupProps[0]['基本信息'];
        if(tmp&&!commodity.details) {
          commodity.details = tmp.map(function(item){
            let name = Object.keys(item)[0];
            return {name, value:item[name]};
          });
          console.log('getdetail/6.0/中获取了details')
        }
        if(commodity.details) {
          commodity.details.colors = data.skuBase.props[1].values;
          commodity.details.colorImgs = colorImgs;
        } else {
          colorImgsTmp = colorImgs;
        }
        this.updateCommodity(commodity, url);
      })
      .catch((err)=>{
        this.handleExtractErr(err);
      })

    fetchJsonp(`https://h5api.m.taobao.com/h5/mtop.taobao.detail.getdesc/6.0/?data=${encodeURIComponent(JSON.stringify({id, type:'0'}))}`)
      .then((response)=>{return response.json()})
      .then((json)=>{
        const data = json.data;

        commodity.bigImgs = getImgUrlArr(getImgHtmlArr(data.wdescContent.pages.join('')));
        if(!commodity.details && data.itemProperties) {
          console.log('从getdesc/6.0/中获取了details')
          commodity.details = data.itemProperties;
          commodity.details.colorImgs = colorImgsTmp;
        }
        this.updateCommodity(commodity, url);
      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })
  }

  fetchDataFromJdMobile =(url)=>{
    const commodity = {};
    const id = url.match(/(\d+).html/)[1];

    corFetch(url)
      .then((response)=>{return response.text()})
      .then((text)=>{
        let index1, index2;
        let description;
        index1 = text.indexOf('window._itemInfo = (');
        if(index1>-1) { //该种情况下，商品存在多个颜色
          console.log('商品包含多个颜色');
          index1 += 20;
          index2 = text.indexOf(');', index1);
          if(index2<0) throw 'error';
          const jsonText = text.slice(index1, index2);
          const json = eval('('+jsonText+')'); //字符串中包含‘\x’,使用JSON.parse会出错

          if(json.item&&json.item.pName) commodity.name = json.item.pName;
          if(json.item&&json.item.brandName) commodity.brandName = json.item.brandName;

          if(json.clothesColor && json.clothesColor.length>0){
            let smallImgsTmp = [];
            let cnt = 0;
            for(let item of json.clothesColor) {
              fetchJsonp(`https://item.m.jd.com/item/mview2?sku=${item.sku}`)
                .then((response)=>{return response.json()})
                .then((json3)=>{
                  smallImgsTmp = smallImgsTmp.concat(
                    json3.item.image.map(function(img){
                      return '//m.360buyimg.com/mobilecms/s1265x1265_'+img;
                    })
                  );
                  cnt++;
                  if(cnt===json.clothesColor.length) {
                    //去重
                    const tmp ={};
                    for(let item of smallImgsTmp){
                      tmp[item] = 1;
                    }
                    smallImgsTmp = smallImgsTmp.filter(function(item2){
                      if(tmp[item2]) {
                        delete tmp[item2];
                        return true;
                      }
                      return false;
                    });
                    commodity.smallImgs = smallImgsTmp;
                    this.updateCommodity(commodity, url);
                    console.log('从item/mview2?sku=中获取了smallImgs');
                  }
                })
                .catch((err)=>{
                  throw(err);
                })
            }
          }
          if(json.item) description = json.item.description;
        }
        if(!commodity.name || !commodity.brandName || !commodity.smallImgs || !description) {
          index1 = text.indexOf('window._itemOnly =  (');
          if(index1>-1) {
            index1 += 21;
            index2 = text.indexOf(');', index1);
            if(index2<0) throw 'error kur';
            const json = JSON.parse(text.slice(index1, index2));
            if(!commodity.name) commodity.name = json.item.skuName;
            if(!commodity.brandName) commodity.brandName = json.item.brandName;
            if(!commodity.smallImgs) commodity.smallImgs = json.item.image.map(function(img){
              return '//m.360buyimg.com/mobilecms/s1265x1265_'+img;
            });

            if(!description) description = json.item.description;
          } else {
            console.log('不包含window._itemOnly =  (信息');
          }
        }

        fetchJsonp(`https://wqsitem.jd.com/detail/${id}_${description}_normal.html`, {jsonpCallbackFunction: `cb${id}`})
          .then((response)=>{return response.json()})
          .then((json)=>{
            const str = json.content;
            let index1;
            let index2 = 0;
            let tmp;
            commodity.bigImgs = [];
            while(true){
              index1 = str.indexOf('<img ', index2);
              if(index1<0) break;
              index2 = str.indexOf('>', index1)+1;
              tmp = str.slice(index1, index2);
              commodity.bigImgs.push(tmp.match(/src="(.+?)"/)[1]);
            }
            this.updateCommodity(commodity, url);
          })
          .catch((err)=>{
            this.handleExtractErr(err);
          })

      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })

    const pcUrl = `https://item.jd.com/${id}.html`;
    corFetch(pcUrl)
      .then((response)=>{return response.arrayBuffer()})
      .then((text)=>{
        let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
        const reg =new RegExp('<li title=\'.+?\'>(.+?)[：,:](.+?)</li>', 'g');
        let result;
        commodity.details = [];
        window.keke = htmlStr;
        while((result = reg.exec(htmlStr)) != null){
          commodity.details.push({name: result[1].trim(), value: result[2].trim()})
        }
        commodity.details = commodity.details.filter(function(item){
          if(item.name === '店铺') return false;
          return true;
        })
        this.updateCommodity(commodity, url);
      })
    
  }


  fetchDataFromVipMobile =(url)=>{
    const commodity = {};
    corFetch(url)
      .then((response)=>{return response.text()})
      .then((text)=>{
        commodity.name = text.match(/<title>(.+)<\/title>/)[1];
        commodity.smallImgs = [];
        let reg = new RegExp('<img .+? data-original="(.+?)" .+? class="small-img" mars_sead="product_big_pic">', 'g');
        let result;
        while((result=reg.exec(text))!=null){
          commodity.smallImgs.push(result[1]);
        }

        commodity.bigImgs = [];
        reg = new RegExp('<img src=".+?" data-img-src="(.+?)">', 'g');
        while((result=reg.exec(text))!=null){
          commodity.bigImgs.push(result[1]);
        }
        this.updateCommodity(commodity, url);
      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })

    const pcUrl = `https://detail.vip.com/detail-0-${url.match(/-(\d+).html/)[1]}.html`
    corFetch(pcUrl)
      .then((response)=>{return response.text()})
      .then((text)=>{
        const reg = new RegExp('<th class="dc-table-tit">(.+?)：</th>\\s*?<td>(.+?)</td>', 'g');
        let result;
        commodity.details = [];
        while((result=reg.exec(text))!=null){
          commodity.details.push({name: result[1].trim(), value: result[2].trim()});
        }
        this.updateCommodity(commodity, url);
      })
      .catch((err)=>{
        this.handleExtractErr(err)
      })
  }

  updateCommodity=(commodity, url)=>{
    const {dispatch} = this.props;
    if(commodity.name&&commodity.details&&commodity.smallImgs&&commodity.bigImgs) {
      commodity.url = url;
      commodity.productCode = getProductCode(commodity);
      commodity.brandName = getBrandName(commodity);
      commodity.brandId = getBrandId(commodity.brandName, this.props.brands, url);
      commodity.details = commodity.details.filter(function(item){
        if(item.name.indexOf('颜色')>-1 && item.value.length>30) {
          return false;
        }
        return true;
      })
    }

    if(commodity.name&&commodity.details&&commodity.smallImgs&&commodity.bigImgs) {
      commodity.smallImgs = global.dereplication(commodity.smallImgs);
      commodity.bigImgs = global.dereplication(commodity.bigImgs);
      // console.log('1111111',commodity.smallImgs)
      if(!commodity.productCode||!commodity.brandName||!commodity.brandId) {
        console.log('-------数据不完整------\n', '商品名：'+commodity.name+' 货号:'+commodity.productCode+' 品牌名:'+commodity.brandName+'  品牌id:'+commodity.brandId);
      }
      global.Toast.success('提取完成', 1000);
      console.log('-------提取完成------', commodity)
    }
    dispatch({type: 'addInShopCommodityModel/updateState', payload: {commodityFromUrl:{...commodity}}})
  }

  handleExtractErr=(err)=>{
    console.error(err);
    if(!this.state.showDownloadDialog) {//该判断是为了避免重复弹出下载询问框
      if(!global.isElectron) {
        global.MyDialog.confirm({
          message: '提取失败!请检查您输入的链接是否正确。如果您确定您输入的链接是正确的，请下载桌面版“衣衣地图店铺端”再次尝试。',
          actions:[
            {
              text: '下载“衣衣地图店铺端”',
              cb:()=>{
                this.setState({showDownloadDialog: true})
              }
            },
            {text: '取消', autoFocus:  true, color: 'primary'},
          ]
        });
      } else {
        global.MyDialog.error('提取失败!请检查您输入的链接是否正确。如果您确定您输入的链接是正确的，请通过“问题反馈”告诉我们。');
      }
    }
  }
}

export default connect(
  ({brandModel: {brandsArray: brands}, addInShopCommodityModel: {extractUrl, commodityFromUrl}})=>{return {
    brands,extractUrl, commodityFromUrl
  }}
)(AddInShopCommodityUsingUrl);

export function getCommodityFromGongxiaoHtmlStr(htmlStr){
//-------------获取商品名称、建议零售价、货号--------------
  let pos1, pos2, product = {};
  if(!htmlStr||htmlStr.length<1) {     //服务器有些时候返回200，但没有内容
    throw('服务器有些时候返回200，但没有内容');
  }
  pos1 = htmlStr.indexOf('detail-title')+27;
  if(pos1<27) {
    throw('detail-title错误', htmlStr);
  }
  pos2 = htmlStr.indexOf('\r\n', pos1);
  product.name = htmlStr.substring(pos1,pos2);
  product.recommendPrice = [];
  pos1 = htmlStr.indexOf('建议零售价', pos2)+13;
  pos2 = htmlStr.indexOf('元',pos1)-1;
  product.recommendPrice.push(Number(htmlStr.substring(pos1,pos2)));//IE不支持Number.parseFloat
  pos1 = pos2+5;
  pos2 = htmlStr.indexOf('元',pos1)-1;
  product.recommendPrice.push(Number(htmlStr.substring(pos1,pos2)));
  pos1 = htmlStr.indexOf('商家编码', pos2)+19;
  pos2 = htmlStr.indexOf('\n',pos1)-1;
  product.productCode = htmlStr.substring(pos1,pos2);
  //--------------获取小图片的url-------------------
  pos1 = htmlStr.indexOf('J_TriggerPic',pos1);
  product.smallImgs = [];
  if(pos1<0) {throw('J_TriggerPic没有找到！');}
  else {
    while(pos1>0){
      pos1 = htmlStr.indexOf('//',pos1);
      pos2 = htmlStr.indexOf('"',pos1);
      let smallImg = 'http:'+htmlStr.substring(pos1,pos2).replace('_310x310.jpg', '');
      if(smallImg.endsWith('.jpg')||smallImg.endsWith('.png')) product.smallImgs.push(smallImg);
      pos1 = htmlStr.indexOf('J_TriggerPic',pos1);
    }
  }
  //---------------获取商品属性信息------------------
  pos1 = htmlStr.indexOf('product-detail">',pos2)+21;
  let productDetailEnd = htmlStr.indexOf('</ul>',pos1)+5;
  let detailsInf = htmlStr.substring(pos1,productDetailEnd).replace(/\s+/g, ' ');
  if(pos1<21||detailsInf.indexOf('<ul')!=0) {throw('product-detail没有找到！');}//IE不支持startWith
  product.details = [];
  let key,value;
  pos2 = 0;
  while(true){
    pos1 = detailsInf.indexOf('label-like',pos2)+12;
    if(pos1<12) break;
    pos2 = detailsInf.indexOf('：',pos1);
    key = detailsInf.substring(pos1, pos2);
    pos1 = pos2+9;
    pos2 = detailsInf.indexOf('</p>',pos1)-1;
    value = detailsInf.substring(pos1, pos2).replace('&nbsp;','');
    product.details.push({name:[key], value});
  }
  pos1 = detailsInf.indexOf('<li>',pos2)+5;
  while(pos1>5){
    pos2 = detailsInf.indexOf('：',pos1);
    key = detailsInf.substring(pos1, pos2);
    pos1 = pos2+2;
    pos2 = detailsInf.indexOf('</li>',pos1)-1;
    value = detailsInf.substring(pos1, pos2);
    pos1 = detailsInf.indexOf('<li>',pos2)+5;
    product.details.push({name:[key], value});
  }
  //--------------获取商品颜色图片-------------------
  pos2 = htmlStr.indexOf('tb-color', productDetailEnd);
  if(pos2>0) {
    let tbodyEnd = htmlStr.indexOf('</tbody>', pos2);
    let colorImgUrl;
    while(true){
      pos1 = htmlStr.indexOf('src="',pos2)+5;
      if(pos1>tbodyEnd || pos1 === -1) break;
      pos2 = htmlStr.indexOf('"',pos1);
      colorImgUrl = 'http:'+htmlStr.substring(pos1,pos2);
      if(product.smallImgs.indexOf(colorImgUrl) === -1) {
        if(colorImgUrl.endsWith('.jpg')||colorImgUrl.endsWith('.png')) product.smallImgs.push(colorImgUrl);
      }
    }
  }
  //--------------获取商品大图片-------------------
  pos2 = htmlStr.indexOf('combo-desc', productDetailEnd);
  if(pos2<0) {
    throw('combo-desc没有找到');
  }
  let msgCartPos = htmlStr.indexOf('msg-cart', pos2);
  product.bigImgs = [];
  let bigImgUrl;
  while(true){
    pos1 = htmlStr.indexOf('http',pos2);
    if(pos1>msgCartPos) break;
    pos2 = htmlStr.indexOf('"',pos1);
    bigImgUrl = htmlStr.substring(pos1,pos2);
    if(bigImgUrl.indexOf('<')>0) continue;
    if(bigImgUrl.endsWith('.jpg')||bigImgUrl.endsWith('.png')) product.bigImgs.push(bigImgUrl);
  }
  // if(product.bigImgs.length==0){console.log('bigImgs不存在');}
  return product;
}



export function getProductCode(commodity){
  if(commodity.productCode) return commodity.productCode;
  else if(commodity.details) {
    for(let item of commodity.details) {
      if(item.name === '货号' || item.name === '款号'
        || item.name === '商品编码' || item.name === '商品编号'
        || item.name === '编码'|| item.name === '编号'|| item.name === '型号') {
        return item.value;
      }
    }
  }
}

export function getBrandName(commodity){
  if(commodity.brandName) {
    return commodity.brandName;
  }
  else if(commodity.details) {
    for(let item of commodity.details) {
      if(item.name === '品牌' || item.name === '品牌名称' || item.name === '商品品牌') {
        return item.value;
      }
    }
  }
}

export function getBrandId(brandName, brands, commodityUrl){
  if(!brandName) return;
  let chineseBrandName = brandName.trim();
  if((commodityUrl.indexOf('tmall')>-1 || commodityUrl.indexOf('taobao')>-1) && brandName.indexOf('/')>0) {
    chineseBrandName = brandName.split('/')[1].trim();
  } else if(commodityUrl.indexOf('jd.com')>-1 && brandName.indexOf('（')>-1) {
    chineseBrandName = brandName.slice(0, brandName.indexOf('（')).trim();
  } else {
    if(brandName.indexOf('/')>-1) {
      if(/^\w/.test(brandName)) chineseBrandName = brandName.split('/')[1].trim();
      else chineseBrandName = brandName.split('/')[0].trim();
    } else if(brandName.indexOf(' ')>-1) {
      if(/^\w/.test(brandName)) chineseBrandName = brandName.split(' ')[1].trim();
      else chineseBrandName = brandName.split(' ')[0].trim();
    }
  }
  for(let item of brands) {
    if(item.chineseName === chineseBrandName) {
      return item.id;
    }
  }
}

function checkUrl(url){
  if(url.indexOf('http')<0) {
    alert('网址应以http或https开头');
    return false;
  }
  if(
    url.indexOf('//goods.gongxiao.tmall.com/product/product_detail')<0 &&

    url.indexOf('//detail.m.tmall.com/item.htm')<0 &&
    url.indexOf('//h5.m.taobao.com/awp/core/detail.htm')<0 &&
    url.indexOf('//item.m.jd.com/product/')<0 &&
    url.indexOf('//m.vip.com/product-')<0 &&

    url.indexOf('//detail.tmall.com/item.htm')<0 &&
    url.indexOf('//item.taobao.com/item.htm')<0 &&
    url.indexOf('//item.jd.com')<0 &&
    url.indexOf('//detail.vip.com/detail')<0
  ) {
    if(url.indexOf('gongxiao.tmall')>-1){
      alert('天猫供销平台的网址应该包含以下字符串：goods.gongxiao.tmall.com/product/product_detail');
    }

    else if(url.indexOf('m.tmall.com')>-1){
      alert('手机天猫的网址应该包含以下字符串：detail.m.tmall.com/item.htm');
    } else if(url.indexOf('m.taobao.com')>-1){
      alert('手机淘宝的网址应该包含以下字符串：h5.m.taobao.com/awp/core/detail.htm');
    } else if(url.indexOf('m.jd.com')>-1){
      alert('手机京东的网址应该包含以下字符串：item.m.jd.com/product/');
    } else if(url.indexOf('m.vip.com')>-1){
      alert('手机唯品会的网址应该包含以下字符串：m.vip.com/product-');
    }

    else if(url.indexOf('tmall.com')>-1){
      alert('天猫的网址应该包含以下字符串：detail.tmall.com/item.htm');
    } else if(url.indexOf('taobao.com')>-1){
      alert('淘宝的网址应该包含以下字符串：item.taobao.com/item.htm');
    } else if(url.indexOf('jd.com')>-1){
      alert('京东的网址应该包含以下字符串：item.jd.com');
    } else if(url.indexOf('vip.com')>-1){
      alert('唯品会的网址应该包含以下字符串：detail.vip.com/detail');
    }

    else{
      alert('目前暂不支持从该网站提取商品信息');
    }
    return false;
  }
  return true;
}

export function changePcToMobileUrlAndRemoveUnusedParams(url) {
  if(url.indexOf('//goods.gongxiao.tmall.com/product/product_detail')>-1) {
    return url.replace(/spm=.+?&/, '');
  }
  else if(url.indexOf('//detail.tmall.com/item.htm')>-1||url.indexOf('//detail.m.tmall.com/item.htm')>-1) {
    const id = url.match(/[?|&]id=(\d+)/)[1];
    return `https://detail.m.tmall.com/item.htm?id=${id}`
  }
  else if(url.indexOf('//item.taobao.com/item.htm')>-1||url.indexOf('h5.m.taobao.com/awp/core/detail.htm')>-1) {
    const id = url.match(/[?|&]id=(\d+)/)[1];
    return `https://h5.m.taobao.com/awp/core/detail.htm?id=${id}`
  }
  else if(url.indexOf('//item.jd.com/')>-1||url.indexOf('//item.m.jd.com/product/')>-1) {
    const id = url.match(/(\d+).html/)[1];
    return `https://item.m.jd.com/product/${id}.html`
  }
  else if(url.indexOf('//detail.vip.com/detail-')>-1||url.indexOf('//m.vip.com/product-')>-1) {
    const id = url.match(/-(\d+).html/)[1];
    return `https://m.vip.com/product-0-${id}.html`;
  }
}

function getImgHtmlArr(str){
  let htmlArr = str.match(/<img.+?<\/img>/g);
  if(htmlArr) {
    console.log('bigImgs包含在<img...</img>的结构中')
  } else {
    htmlArr = str.match(/<img.+?>/g);
    console.log('bigImgs包含在<img ...>或<img .../>的结构中')
  }
  const rtn = htmlArr.filter(function(item){
    if(item.indexOf('</img>')<0 && item.indexOf('src=')<0) return false;
    let match = item.match(/height="(\d+)"/);
    if(match&&match[1]<MinImgHeight) return false;
    match = item.match(/size=\d+x(\d+)/);
    if(match&&match[1]<MinImgHeight) return false;
    return true;
  })
  console.log('------getImgHtmlArr-----')
  for(let item of rtn) {
    console.log(item)
  }
  return rtn;
}

function getImgUrlArr(htmlArr){
  const rtn = htmlArr
    .map(function(item){
      if(item.indexOf('</img>')>0) {
        return item.match(/>(.+?)<\/img>/)[1];
      }
      return item.match(/src="(.+?)"/)[1];
    })
    .filter(function(item){
      if(item.indexOf('.gif')>-1) return false;
      return true;
    })
  console.log('------getImgUrlArr-----')
  for(let item of rtn) {
    console.log(item)
  }
  return rtn;
}

export function corFetch(url){
  if(global.isElectron) return fetch(url);
  else return fetch(`${global.serverHost}/corAgent?url=${encodeURIComponent(url)}`);
}


function downloadFile(url) {   
  try{ 
    var elemIF = document.createElement('iframe');   
    elemIF.src = url;   
    elemIF.style.display = 'none';   
    document.body.appendChild(elemIF);   
  }catch(e){ 
    console.error('downloadFile error');
  }
}