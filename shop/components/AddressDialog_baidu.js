import React from 'react';
import {connect} from 'react-redux'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
class AddressDialog extends React.Component{
  state={};
  render(){
    console.log('AddressDialog rendered');
    const { result } = this.state;
    return(
      <Dialog
        actions={result&&result.point.lng&&result.addressComponents.detailedAddress?this.actions:undefined}
        open={this.props.open}
        autoDetectWindowHeight={false}
        contentStyle={{width: this.props.screenWidth===1?'100%':'75%', transform: undefined}}//关闭动画，否则触摸点位置会存在偏移
        onRequestClose={this.handleCancel}
      >
        <div style={{display:'inline-block'}}>{result?(result.addressComponents.city+result.addressComponents.district):''}</div>
        <input placeholder="详细地址如：XX街XX商场X楼XX号" size={20} value={result&&result.addressComponents.detailedAddress?result.addressComponents.detailedAddress:''}  onChange={this.handleChange('detailedAddress')}/>
        <div style={{marginTop: '4px'}}>{result?('经纬度：'+result.point.lng+', '+result.point.lat):''}</div>
        <div id="map_container" style={{maxHeight: '320px'}}/>
      </Dialog>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.open&&!this.state.result) {//只有在对话框被打开时才执行地图相关的代码
      setTimeout(()=>{
        // <%--根据BMap.LocalCity()获取浏览者所在的城市信息，以此修改center和city的值--%>
        const map = new window.BMap.Map("map_container");
        map.enableScrollWheelZoom();//<%--滚动鼠标轮可以缩放地图--%>
        map.addControl(new window.BMap.NavigationControl());
        let marker;

        if(this.props.position) {//在地图上标注店铺的位置
          const position = this.props.position;
          const pos = new window.BMap.Point(position.lng, position.lat);
          map.centerAndZoom(pos, 15);
          marker = new window.BMap.Marker(pos, {
            // enableMassClear: false//<%--当为true时，点击地图，气球图标不会显示--%>
          });
          marker.enableDragging();//<%--允许拖动气球图标--%>
          marker.addEventListener("dragend", function(e) {
            geoc.getLocation(e.point, function(rs){
              This.setState({result: rs, modified: true})
            });
          });
          map.addOverlay(marker);//<%--在地图中增加气球图标--%>
          this.setState({result:{addressComponents:this.props.address, point:this.props.position}});
        } else {
          const myCity = new window.BMap.LocalCity();
          myCity.get(function (result){
            const cityName = result.name;
            if(/市$/.test(cityName)){
              map.centerAndZoom(cityName);
            }
          });
        }
        const This = this;
        const geoc = new window.BMap.Geocoder();
        const handleMapClick = (e) => {
          const pt = e.point;
          if(!marker) {
            marker = new window.BMap.Marker(pt, {
              // enableMassClear: false//<%--当为true时，点击地图，气球图标不会显示--%>
            });
            marker.enableDragging();//<%--允许拖动气球图标--%>
            marker.addEventListener("dragend", function(e) {
              geoc.getLocation(e.point, function(rs){
                This.setState({result: rs, modified: true})
              });
            });
            map.addOverlay(marker);//<%--在地图中增加气球图标--%>
          } else {
            marker.setPosition(pt);
          }
          geoc.getLocation(pt, function(rs){
            // console.log('1111111111111', rs);
            This.setState({result: rs, modified: true})//modified用以标志地址信息被修改
          });
        };
        map.addEventListener("click", handleMapClick);
        map.addEventListener("touchstart", handleMapClick);

      }, 0);
    }
  }


  handleCancel = () => {
    // this.state.result = undefined;
    this.setState({result: undefined});
    this.props.dispatch({type:'editAddressModel/updateState',
      payload:{open:false}})
  };
  handleSubmit = () => {
    if(this.state.modified) {
      let address = this.state.result.addressComponents;
      address.business = this.state.result.business;
      let position = this.state.result.point;
      let modifiedShopData = this.props.modifiedShopData;
      this.props.dispatch({type:'editShopModel/updateState',payload:{addressErr:undefined, modifiedShopData:{...modifiedShopData,address,position}}});
      this.setState({modified:false});
    }
    this.handleCancel();
  }
  actions = [
    <Button  onClick={this.handleCancel} key={1}>取消</Button>,
    <Button  color="primary" onClick={this.handleSubmit} key={2}>确定</Button>
  ];
  handleChange=(propertyName)=>(evt)=>{
    let result = this.state.result;
    result.addressComponents[propertyName] = evt.target.value;
    this.setState({...result, modified:true});
  }
}

const mapStateToProps=({appModel, editAddressModel, editShopModel})=>{
  let open = editAddressModel.open?true:false;
  let address = editAddressModel.address;
  let position = editAddressModel.position;
  let modifiedShopData = editShopModel.modifiedShopData;
  const screenWidth = appModel.screenWidth
  return {open, address, position, modifiedShopData, screenWidth};
}

const mapDispatchToProps = (dispatch)=>{
  return {dispatch};
}
export default connect(mapStateToProps, mapDispatchToProps)(AddressDialog);
