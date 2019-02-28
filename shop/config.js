import starSky from './imgs/starSky.jpg';
global.consoleListBackImg = starSky;

global.hostCnt = 2; // 主机的数量

global.realm = 'shop';

global.videos = [
  {name: '注册', url:'https://yiyimap-apk.cdn.bcebos.com/regist.mp4', time:'10分钟', uploadDate:new Date()},
  {name: '添加商品', url:'https://yiyimap-apk.cdn.bcebos.com/addCommodity.mp4', time:'13分钟', uploadDate:new Date()},
  {name: '批量修改价格', url:'https://yiyimap-apk.cdn.bcebos.com/priceTool.mp4', time:'1分钟', uploadDate:new Date()},
  {name: '发布促销信息', url:'https://yiyimap-apk.cdn.bcebos.com/sales.mp4', time:'4分钟', uploadDate:new Date()},
  {name: '发放代金券', url:'https://yiyimap-apk.cdn.bcebos.com/coupon.mp4', time:'7分钟', uploadDate:new Date()},
  {name: '对接库存软件', url:'https://yiyimap-apk.cdn.bcebos.com/thirdParty.mp4', time:'3分钟', uploadDate:new Date()},
];

global.pathPageNameMap = {
  '/consoleOfShop/inShopCommoditiesManage': '本店商品',
  '/consoleOfShop/salesInf': '促销',
  '/consoleOfShop/coupon/coupons': '代金券发放',
  '/consoleOfShop/coupon/useCoupon': '顾客使用代金券',
  '/consoleOfShop/coupon/couponFinance': '代金券统计',
  '/consoleOfShop/setShop': '修改店铺信息',
  '/consoleOfShop/autoSyncSet': '对接供销存软件',
  '/consoleOfShop/feedback/createFeedback': '问题反馈',
  '/consoleOfShop/qrcode': '店铺二维码',
};