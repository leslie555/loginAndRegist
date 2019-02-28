import React, { Component } from 'react';
import {TextDecoder} from 'text-encoding';
import LoadingGif from './loading.gif';


export default class ExtractCommodity extends Component {
  state = {
    commodity: undefined,
    spinerShow: false,
    sandboxAllowScript: false,
    myFrameSrc: undefined,
    myFrame2Src: undefined,
    // hugeImgUrl: undefined,
    iframeHeight: 0,
    errTimeoutId: undefined,
    getBigImgsIntervalId: undefined,
  }
  render() {
    let {commodity, spinerShow, sandboxAllowScript, myFrameSrc, myFrame2Src, /*hugeImgUrl,*/ iframeHeight} = this.state;
    return (
      <div>
        {/*
        <div>
          {commodity &&
            <div>
              <h3>提取结果：</h3>
              <div>
                <p><span style={{fontWeight: 'bold'}}>商品名称：</span><span>{commodity.name}</span></p>
                {commodity.brandName&&<p><span style={{fontWeight: 'bold'}}>品牌：</span><span>{commodity.brandName}</span></p>}
                {commodity.productCode&&<p><span style={{fontWeight: 'bold'}}>货号：</span><span>{commodity.productCode}</span></p>}
                <p><span style={{fontWeight: 'bold'}}>商品细节：</span><span>{JSON.stringify(commodity.details)}</span></p>
                <p><span style={{fontWeight: 'bold'}}>小图：</span></p>
                {commodity.smallImgs.map((img)=>{
                  return(<img src={img} class="img" style={{width: '50px', height: '50px', marginRight: '10px', marginBottom: '10px', cursor: 'pointer',boxShadow: '0 0 5px #999'}} onClick={this.handleImgClick}/>);
                })}
                <p><span style={{fontWeight: 'bold'}}>大图：</span></p>
                {commodity.bigImgs&&commodity.bigImgs.map((img)=>{
                  return(<img src={img} class="img" style={{width: '100px', height: '100px', marginRight: '10px', marginBottom: '10px', cursor: 'pointer',boxShadow: '0 0 5px #999'}} onClick={this.handleImgClick}/>);
                })}
              </div>
              {hugeImgUrl&&
                <div style={{position: 'fixed',top: 0,bottom:0,left:0, right:0, display: 'flex', justifyContent: 'center',alignItems: 'center'}}>
                  <div style={{overflowY: 'scroll',boxShadow: '0 0 15px #000', maxHeight: '90%'}}>
                    <img src={hugeImgUrl}/>
                  </div>
                </div>
              }
            </div>
          }
        </div>*/}
        {spinerShow&&
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <img
              id="spiner"
              style={{marginRight: 'auto',marginLeft: 'auto'}}
              src={LoadingGif}
            />
          </div>
        }
        <iframe
          style={{width: '100%', height: iframeHeight, /*visibility: 'hidden',*/ borderWidth: 0}}
          id="myFrame"
          src={myFrameSrc}
          onLoad={this.handleMyFrameLoad}
          sandbox={'allow-same-origin allow-forms' + (sandboxAllowScript?' allow-scripts':'')}
        ></iframe>
        <iframe
          style={{width: '100%', height: iframeHeight, /*visibility: 'hidden',*/ borderWidth: 0}}
          id="myFrame2"
          src={myFrame2Src}
          onLoad={this.handleMyFrame2Load}
          sandbox="allow-same-origin allow-forms allow-scripts"
        ></iframe>
      </div>
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {url} = nextProps;
    if(url && url !== this.props.url) {
      if(url.indexOf('http')<0) {
        alert('网址应以http或https开头');
        return;
      }
      if(
        url.indexOf('//goods.gongxiao.tmall.com/product/product_detail')<0 &&
        url.indexOf('//detail.tmall.com/item.htm')<0 &&
        url.indexOf('//item.taobao.com/item.htm')<0 &&
        url.indexOf('//item.jd.com')<0 &&
        url.indexOf('//detail.vip.com/detail')<0 &&
        url.indexOf('//shop.mogujie.com/')<0 &&
        url.indexOf('//item.meilishuo.com/detail')<0 &&
        url.indexOf('//product.dangdang.com/')<0
      ) {
        if(url.indexOf('tmall.com')>-1){
          alert('天猫的网址应该包含以下字符串：detail.tmall.com/item.htm');
        } else if(url.indexOf('taobao.com')>-1){
          alert('淘宝的网址应该包含以下字符串：item.taobao.com/item.htm');
        } else if(url.indexOf('jd.com')>-1){
          alert('京东的网址应该包含以下字符串：item.jd.com');
        } else{
          alert('目前暂不支持从该网站提取商品信息，请联系13541182078');
        }
        return;
      }
      // 一段较长时间后如果依然没有提取成功，则报错误
      const errTimeoutId = setTimeout(()=>{
        alert('超时！可能是因为您的网速太慢。等待一段时间后如果还没有提取出结果，请刷新浏览器后重试。');
        this.setState({spinerShow: false});
      }, 35000);
      const { getBigImgsIntervalId } = this.state;
      if (getBigImgsIntervalId) clearInterval(getBigImgsIntervalId);
      this.setState({
        commodity: undefined,
        spinerShow: true,
        sandboxAllowScript: false,
        myFrameSrc: undefined,
        myFrame2Src: undefined,
        // hugeImgUrl: undefined,
        iframeHeight: '30000px',
        errTimeoutId,
        getBigImgsIntervalId: undefined,
      });
      if(url.indexOf('//goods.gongxiao.tmall.com/product/product_detail')>-1){
        const url2 = url.replace(/spm=.+?&/, '');
        global.myFetch({url: `${global.serverHost}/corAgent?url=${encodeURIComponent(url2)}`})
          .then((response)=>{return response.arrayBuffer()})
          .then((text)=>{
            let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
            const commodity = getCommodityFromGongxiaoHtmlStr(htmlStr, url2);
            if(!commodity) {
              alert('从天猫供销平台提取商品信息失败！');
              return;
            }
            this.finishExtract(commodity);
          })
        // text = await response.arrayBuffer();
        // let htmlStr = new TextDecoder('gbk').decode(new DataView(text));
      } else {
        if(url.indexOf('detail.vip.com/detail')>-1) {
          // 唯品会的js会检测当前host，如果发现host发生改变则会跳转主页，因此禁止执行js
          this.setState({ sandboxAllowScript: false });
        } else {
          this.setState({ sandboxAllowScript: true });
        }
        setTimeout(()=>{ // 延迟的目的是为了让前面的'myFrameSrc: undefined'生效，这样同一个url第二次点击提取，iframe才会再次load
          this.setState({ myFrameSrc: '/corAgent?url='+encodeURIComponent(url) });
        },0);
      }

    }
  }

  handleMyFrameLoad = (e)=>{
    let myFrame = e.target;
    const { url } = this.props;
    setTimeout(()=>{
      var imgs;
      try{
        var iframeDocument = myFrame.contentDocument;
        let commodity = {};
        commodity.url = url;
        //---------------从天猫抓取---------------------
        if(url.indexOf('detail.tmall.com/item.htm')>-1) {
          this.getFromTmall(commodity, iframeDocument);
          const bigImgContainer = iframeDocument.getElementById('description');
          //如果大图还没有加载完成就提取可能会出现遗漏，所以要多次提取，当两次提取的数量相同时，则认为全部提取成功了
          let bigImgs = getBigImgs(bigImgContainer);
          const intervalId = setInterval(()=>{
            let newBigImgs = getBigImgs(bigImgContainer);
            if(bigImgs.length === newBigImgs.length) {
              clearInterval(intervalId);
              this.setState({getBigImgsIntervalId: undefined});
              commodity.bigImgs = newBigImgs;
              this.finishExtract(commodity);
            } else {
              bigImgs = newBigImgs;
            }
          }, 5000);
          this.setState({getBigImgsIntervalId: intervalId});
        }
        //---------------从淘宝抓取---------------------
        else if(url.indexOf('item.taobao.com/item.htm')>-1) {
          this.getFromTaobao(commodity, iframeDocument);
          const bigImgContainer = iframeDocument.getElementById('description');
          let bigImgs = getBigImgs(bigImgContainer);
          const intervalId = setInterval(()=>{
            let newBigImgs = getBigImgs(bigImgContainer);
            if(bigImgs.length === newBigImgs.length) {
              clearInterval(intervalId);
              this.setState({getBigImgsIntervalId: undefined});
              commodity.bigImgs = newBigImgs;
              this.finishExtract(commodity);
            } else {
              bigImgs = newBigImgs;
            }
          }, 5000);
          this.setState({getBigImgsIntervalId: intervalId});
        }
        //---------------从京东抓取---------------------
        else if(url.indexOf('item.jd.com')>-1) {
          this.getFromJd(commodity, iframeDocument);
          const bigImgContainer = iframeDocument.getElementsByClassName('detail-content-wrap')[0];
          let bigImgs = getBigImgs(bigImgContainer);
          const intervalId = setInterval(()=>{
            let newBigImgs = getBigImgs(bigImgContainer);
            if(bigImgs.length === newBigImgs.length) {
              clearInterval(intervalId);
              this.setState({getBigImgsIntervalId: undefined});
              commodity.bigImgs = newBigImgs;
              this.finishExtract(commodity);
            } else {
              bigImgs = newBigImgs;
            }
          }, 5000);
          this.setState({getBigImgsIntervalId: intervalId});
        }

        //---------------从唯品会抓取---------------------
        // 唯品会iframe要禁止js执行，大图提取方式与前面不同
        else if(url.indexOf('detail.vip.com/detail')>-1) {
          this.getFromVip(commodity, iframeDocument);
          this.finishExtract(commodity);
        }


        //---------------从蘑菇街/美丽说抓取---------------------
        // 蘑菇街的大图和details只能从ajax数据中提取
        else if(url.indexOf('shop.mogujie.com/')>-1 || url.indexOf('item.meilishuo.com/detail')>-1) {
          this.getFromMogu(commodity, iframeDocument);
        }

        //---------------从当当网抓取---------------------
        // 当当的大图只能从ajax数据中提取
        else if(url.indexOf('product.dangdang.com/')>-1) {
          this.getFromDangdang(commodity, iframeDocument);
        }

      } catch(e){
        console.error('--------------------',e);
        alert('程序出错，请联系13541182078 '+e.toString());
      }
    }, 7000)
  }

  // componentDidMount(){
  //   document.onclick = ()=>{
  //     if(this.state.hugeImgUrl) {
  //       this.setState({ hugeImgUrl: undefined });
  //     }
  //   }
  // }

  getFromTmall=(commodity, iframeDocument)=>{
    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('J_UlThumb').getElementsByTagName('img')) {
      let imgUrl = thumb.src.replace('_60x60q90.jpg','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    try{
      var smallImgAs = iframeDocument.getElementsByClassName('tb-img')[0]
        .getElementsByTagName('a');
      for(var item of smallImgAs) {
        if(item.style.backgroundImage){ // 颜色选择可能是文字而不是图片
          var imgUrl = 'http:'+item.style.backgroundImage.slice(5, -2).replace('_40x40q90.jpg','');
          if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
        }
      }
    }catch(e){
      console.error('------------------',e);
    }

    commodity.name = iframeDocument.getElementsByClassName('tb-detail-hd')[0]
      .getElementsByTagName('h1')[0].innerHTML.trim();

    try{
      commodity.brandName = iframeDocument.getElementsByClassName('J_EbrandLogo')[0]
        .innerHTML.trim();
    }catch(e){
      alert(e.toString());
      console.error('--------------------', e)
    }

    var detailLis = iframeDocument.getElementById('J_AttrUL')
      .getElementsByTagName('li');
    commodity.details = {}
    for(var li of detailLis) {
      var attrPare = li.innerHTML.replace('&nbsp;', '').split(':');
      // 分隔符可能是中文冒号
      if(!attrPare[1]) attrPare = li.innerHTML.replace('&nbsp;', '').split('：');
      commodity.details[attrPare[0].trim()] = HTMLDecode(attrPare[1].trim());
    }
    commodity.productCode = commodity.details['货号'] || commodity.details['款号'];
    if(!commodity.brandName || commodity.details['品牌']) {
      commodity.brandName = commodity.details['品牌'];
    }
  }
  getFromTaobao=(commodity, iframeDocument)=>{
    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('J_UlThumb').getElementsByTagName('img')) {
      let imgUrl = thumb.src.replace('_50x50.jpg_.webp','').replace('_400x400.jpg_.webp','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    try{
      var smallImgAs = iframeDocument.getElementsByClassName('tb-img')[0]
        .getElementsByTagName('a');
      for(var item of smallImgAs) {
        if(item.style.backgroundImage) { // 颜色选择可能是文字而不是图片
          var imgUrl = 'http:'+item.style.backgroundImage.slice(5, -2).replace('_30x30.jpg','');
          if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
        }
      }
    }catch(e){
      console.error('------------------',e);
    }

    commodity.name = iframeDocument.getElementsByClassName('tb-main-title')[0]
      .innerHTML.trim();

    var detailLis = iframeDocument.getElementsByClassName('attributes-list')[0]
      .getElementsByTagName('li');
    commodity.details = {}
    for(var li of detailLis) {
      var attrPare = li.innerHTML.replace('&nbsp;', '').split(':');
      // 分隔符可能是中文冒号
      if(!attrPare[1]) attrPare = li.innerHTML.replace('&nbsp;', '').split('：');
      commodity.details[attrPare[0].trim()] = HTMLDecode(attrPare[1].trim());
    }
    commodity.productCode = commodity.details['货号'];
    if(commodity.details['品牌']) {
      commodity.brandName = commodity.details['品牌'];
    }
  }
  getFromJd=(commodity, iframeDocument)=>{
    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('spec-list').getElementsByTagName('img')) {
      let imgUrl = thumb.src.replace('/n5/','/imgzone/').replace('s50x64_','').replace('!cc_50x64.jpg','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    try{
      var smallImgAs = iframeDocument.getElementById('choose-attr-1')
        .getElementsByTagName('img');
      for(var item of smallImgAs) {
        let imgUrl = item.src.replace('/n9/','/imgzone/').replace('s60x76_','').replace('!cc_60x76.jpg','').replace('s40x40_','').replace('!cc_40x40.jpg','');
        if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
      }
    }catch(e){
      console.error('------------------',e);
    }

    commodity.name = iframeDocument.getElementsByClassName('sku-name')[0]
      .innerText.trim();

    try{
      commodity.brandName = iframeDocument.getElementById('parameter-brand')
        .getElementsByTagName('a')[0].innerHTML.trim();
    }catch(e){
      console.error('--------------', e)
      alert(e.toString());
    }

    var detailLis = iframeDocument.getElementsByClassName('parameter2')[0]
      .getElementsByTagName('li');
    commodity.details = {}
    for(var li of detailLis) {
      var attrPare = li.innerHTML.split('：');
      commodity.details[attrPare[0].trim()] = HTMLDecode(attrPare[1].trim());
    }
    commodity.details['店铺'] = undefined;
    commodity.productCode = commodity.details['货号'];
    if(!commodity.brandName || commodity.details['品牌']) {
      commodity.brandName = commodity.details['品牌'];
    }
  }
  getFromVip=(commodity, iframeDocument)=>{
    commodity.bigImgs = [];
    for(var dcImg of iframeDocument.getElementsByClassName('dc-img')[0].getElementsByTagName('img')) {
      let imgUrl = 'http:'+dcImg.getAttribute('data-original');
      if(!imgUrl.endsWith('.gif')) commodity.bigImgs.push(imgUrl);
    }

    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('J-sImg-wrap').getElementsByTagName('img')) {
      let imgUrl = 'http:'+thumb.getAttribute('data-original').replace('_95x120_90','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    var colorList = iframeDocument.getElementsByClassName('color-list')[0];
    if(colorList) {
      var smallImgAs = colorList.getElementsByTagName('img');
      for(var item of smallImgAs) {
        let imgUrl = 'http:'+item.getAttribute('data-original').replace('_54x69_100','');
        if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
      }
    }

    commodity.name = iframeDocument.getElementsByClassName('pib-title-detail')[0]
      .innerHTML.trim();


    try{
      commodity.brandName = iframeDocument.getElementsByClassName('pib-title-class')[0]
        .innerHTML.trim();
    }catch(e){
      console.error('------------------', e);
      alert(e.toString());
    }

    var detailThs = iframeDocument.getElementsByClassName('dc-info')[0]
      .getElementsByTagName('th');
    commodity.details = {}
    for(var th of detailThs) {
      var attrName = th.innerHTML.trim().slice(0, -1); // slice(0, -1)是为了去掉冒号
      if(attrName) { // t最后一个th可能没有内容，所以要加一个if判断
        commodity.details[attrName] = HTMLDecode(th.nextSibling.nextSibling.innerHTML.trim()).replace(/\n/g, ' ');
      }
    }
    commodity.productCode = commodity.details['商品编号'];
    if(!commodity.brandName || commodity.details['品牌名称']) {
      commodity.brandName = commodity.details['品牌名称'];
    }
  }
  getFromMogu=(commodity, iframeDocument)=>{
    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('J_SmallImgs').getElementsByTagName('img')) {
      let imgUrl = thumb.src.replace('_100x100.jpg','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    var smallImgAs = iframeDocument.getElementsByClassName('J_StyleList')[0]
      .getElementsByTagName('img');
    for(var item of smallImgAs) {
      var imgUrl = item.src.replace('_100x100.jpg','');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    commodity.name = iframeDocument.getElementsByClassName('goods-title')[0]
      .getElementsByTagName('span')[0].innerHTML.trim();

    var xmlhttp;
    if (window.XMLHttpRequest) xmlhttp=new XMLHttpRequest();// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp.onreadystatechange=()=>{
      if (xmlhttp.readyState==4 && xmlhttp.status==200) {
        var ajaxRes = JSON.parse(xmlhttp.responseText);
        commodity.bigImgs=[];
        try{
          if(ajaxRes.data.detailInfos.detailImage[0].list)
            commodity.bigImgs=commodity.bigImgs.concat(ajaxRes.data.detailInfos.detailImage[0].list);
        } catch(e){
          console.error('--------------------',e)
        }
        try{
          if(ajaxRes.data.detailInfos.detailImage[1].list)
            commodity.bigImgs=commodity.bigImgs.concat(ajaxRes.data.detailInfos.detailImage[1].list);
        } catch(e){
          console.error('--------------------',e)
        }
        var params = ajaxRes.data.itemParams.info.set;
        commodity.details = {};
        for(var param of params){
          commodity.details[param['key']] = param['value'];
        }
        this.finishExtract(commodity);
      }
    }
    const url = this.props.url;
    if(url.indexOf('shop.mogujie.com/')>-1){
      xmlhttp.open('GET','/corAgent?url='+encodeURIComponent('http://shop.mogujie.com/ajax/mgj.pc.detailinfo/v1?_ajax=1&itemId='+url.slice(url.lastIndexOf('/')+1,url.lastIndexOf('?'))),true);
    } else {
      xmlhttp.open('GET','/corAgent?url='+encodeURIComponent('http://item.meilishuo.com/ajax/mgj.pc.detailinfo/v1?_ajax=1&itemId='+url.slice(url.lastIndexOf('/')+1,url.lastIndexOf('?'))),true);
    }
    xmlhttp.send();
  }
  getFromDangdang=(commodity, iframeDocument)=>{
    commodity.smallImgs = [];
    for(var thumb of iframeDocument.getElementById('main-img-slider').getElementsByTagName('img')) {
      let imgUrl = thumb.src.replace('_x_','_u_');
      if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
    }
    try{
      for(var item of iframeDocument.getElementsByClassName('list_c')[0].getElementsByTagName('img')) {
        let imgUrl = item.src.replace('_b_','_u_');
        if(!imgUrl.endsWith('.gif')) commodity.smallImgs.push(imgUrl);
      }
    }catch(e){
      console.error('--------------------',e);
    }

    commodity.name = iframeDocument.getElementsByClassName('name_info')[0].getElementsByTagName('h1')[0]
      .innerText.trim();

    var detailLis = iframeDocument.getElementById('detail_describe').getElementsByTagName('li');
    commodity.details = {}
    for(var li of detailLis) {
      var attrPare = li.innerText.split('：');
      commodity.details[attrPare[0].trim()] = HTMLDecode(attrPare[1].trim());
    }
    commodity.productCode = commodity.details['型号'];
    commodity.brandName = commodity.details['品牌'];
    const url = this.props.url;
    this.setState({commodity, myFrame2Src: '/corAgent?url='+encodeURIComponent('http://product.dangdang.com/index.php?r=callback%2Fdetail&productId='+
      url.slice(url.lastIndexOf('/')+1,url.lastIndexOf('.html'))
      +'&templateType=cloth&describeMap=&shopId=16267&categoryPath=58.64.14.00.00.00')});
  }

  handleMyFrame2Load = (e)=>{
    let myFrame = e.target;
    setTimeout(()=>{
      var iframeDocument = myFrame.contentDocument;
      var imgElements = iframeDocument.getElementsByClassName('descrip')[0].getElementsByTagName('img');
      let bigImgs = [];
      for(var img of imgElements) {
        const imgUrl = img.getAttribute('data-original');
        if(!imgUrl.endsWith('.gif')) bigImgs.push(imgUrl);
      }
      const newCommodity = {...this.state.commodity, bigImgs};
      this.finishExtract(newCommodity);
    }, 7000)
  }

  finishExtract = (commodity)=>{
    const {errTimeoutId} = this.state;
    clearTimeout(errTimeoutId);
    getProductCode(commodity);
    getBrandName(commodity);
    this.setState({spinerShow: false, iframeHeight: 0, commodity});
    this.props.changeCommodity(commodity);
  }

  // handleImgClick = (e)=>{
  //   this.setState({hugeImgUrl: e.target.src});
  //   e.nativeEvent.stopImmediatePropagation();
  //   e.preventDefault();
  //   e.stopPropagation();
  // }
}

function getBigImgs(bigImgContainer) {
  let bigImgs = [];
  let imgs = bigImgContainer.getElementsByTagName('img');
  for(var img of imgs) {
    if(img.width>430&&img.height>350){
      let imgUrl = img.src;
      if(!imgUrl.endsWith('.gif')) bigImgs.push(imgUrl);
    }
  }
  return bigImgs;
}

export function getProductCode(commodity){
  if(!commodity.productCode && commodity.details) {
    commodity.productCode = commodity.details['货号'] || commodity.details['款号'] ||
      commodity.details['商品编码'] || commodity.details['型号'];
  }
}


export function getBrandName(commodity){
  if(!commodity.brandName && commodity.details) {
    commodity.brandName = commodity.details['品牌'] || commodity.details['品牌名称'] || commodity.details['商品品牌'];
  }
}

function HTMLEncode(text){
  text = text.replace(/&/g, '&amp;') ;
  text = text.replace(/"/g, '&quot;') ;
  text = text.replace(/</g, '&lt;') ;
  text = text.replace(/>/g, '&gt;') ;
  text = text.replace(/'/g, '&#146;') ;
  text = text.replace(/\ /g,'&nbsp;');
  text = text.replace(/\n/g,'<br>');
  text = text.replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
  return text;
}
function HTMLDecode(text){
  text = text.replace(/&amp;/g, '&') ;
  text = text.replace(/&quot;/g, '"') ;
  text = text.replace(/&lt;/g, '<') ;
  text = text.replace(/&gt;/g, '>') ;
  text = text.replace(/&#146;/g, '\'') ;
  text = text.replace(/&nbsp;/g,' ');
  text = text.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g,'\t');
  return text;
}


const getCommodityFromGongxiaoHtmlStr = (htmlStr, productUrl)=>{
//-------------获取商品名称、建议零售价、货号--------------
  let pos1, pos2, product = {};
  product.url = productUrl;
  // if(searchedBrandId) product.brandId = searchedBrandId;
  if(!htmlStr||htmlStr.length<1) {     //服务器有些时候返回200，但没有内容
    console.error('服务器有些时候返回200，但没有内容');
    return;
  }
  pos1 = htmlStr.indexOf('detail-title')+27;
  if(pos1<27) {
    console.error('detail-title错误', htmlStr);
    return;
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
  if(pos1<0) {console.log('J_TriggerPic没有找到！'+productUrl);}
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
  if(pos1<21||detailsInf.indexOf('<ul')!=0) {console.log('product-detail没有找到！'+productUrl);return;}//IE不支持startWith
  product.details = {};
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
    product.details[key] = value;
  }
  pos1 = detailsInf.indexOf('<li>',pos2)+5;
  while(pos1>5){
    pos2 = detailsInf.indexOf('：',pos1);
    key = detailsInf.substring(pos1, pos2);
    pos1 = pos2+2;
    pos2 = detailsInf.indexOf('</li>',pos1)-1;
    value = detailsInf.substring(pos1, pos2);
    pos1 = detailsInf.indexOf('<li>',pos2)+5;
    product.details[key] = value;
  }
  if (product.details['品牌']) product.brandName = product.details['品牌'].trim();
  // let detailsKeys = Object.keys(product.details);
  // for(let index in detailsKeys){
  //   if(detailsKeys[index].indexOf('颜色')>-1
  //     ||detailsKeys[index].indexOf('色')>-1){
  //     let tmp = product.details[detailsKeys[index]];
  //     product.colors = tmp.split(' ');
  //     break;
  //   }
  //   if(index == detailsKeys.length-1){
  //     console.log('商品没有颜色信息');
  //     return;
  //   }
  // }
  // for(let index in detailsKeys){
  //   if(detailsKeys[index].indexOf('尺')>-1
  //     ||detailsKeys[index].indexOf('码')>-1
  //     ||detailsKeys[index].indexOf('大小')>-1){
  //     let tmp = product.details[detailsKeys[index]];
  //     product.sizes = tmp.split(' ');
  //     break;
  //   }
  //   if(index == detailsKeys.length-1){
  //     console.log('商品没有尺码信息');
  //     return;
  //   }
  // }
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
  } else {
    console.log('tb-color没有找到'+productUrl);
  }
  //--------------获取商品大图片-------------------
  pos2 = htmlStr.indexOf('combo-desc', productDetailEnd);
  if(pos2<0) {
    console.log('combo-desc没有找到'+productUrl);
    return;
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
  if(product.bigImgs.length==0){console.log('bigImgs不存在'+productUrl);}
  console.log('从天猫供销平台搜索到结果', product);
  getProductCode(product);
  getBrandName(product);
  return product;
}
