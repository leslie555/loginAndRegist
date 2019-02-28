import React from 'react';
import {connect} from 'react-redux'
import { Buffer } from 'buffer';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from './fileUploaderGallery'
import {Auth} from '@baiducloud/sdk'

let uploader;
class DragFileUploader extends React.Component{
  render(){
    const {bosSts, producerId, dispatch} = this.props;
    if(!bosSts || new global.ServerDate().getTime() > new Date(bosSts.expiration).getTime() - 1000 * 60*5) {
      global.myFetch({
        url: `${global.serverBaseUrl}/Producers/${producerId}/getBosSTS`,
        method: 'get'
      }).then((newBosSts)=>{
        uploader = this.createUploader(newBosSts);
        dispatch({type:'appModel/updateState', payload:{bosSts: newBosSts}})
      }).catch(function(err){
        console.error(err);
      })
      return null;
    }
    return (
      <Gallery 
        status-text={{
          canceled: '已取消',
          deleted: '已删除',
          deleting: '删除中...',
          paused: '已暂停',
          queued: '排队中...',
          retrying_upload: '重传...',
          submitting: '提交中...',
          uploading: '上传中...',
          upload_failed: '上传失败',
          upload_successful: '上传成功'
        }}
        uploader={uploader} 
        fileInput-accept='image/*'
      />
    );
  }


  createUploader = (bosSts)=>{

    const bosAk = 'tQGOhrpS0TcNXsEraEj13rUP';
    const bosSk = 'MM5Foe2deFGeVpBFTfGiGSGKpCVjegNP';

    const auth = new Auth(bosAk, bosSk);
    const policy = new Buffer(JSON.stringify({
      expiration: '2019-02-16T12:00:00Z',
      conditions: [
        {bucket: 'producer-img' },
        {key: '*'},
        ['content-length-range', 0, 4096000]
      ]
    })).toString('base64');
    const signature = auth.hash(policy, bosSk);

    return new FineUploaderTraditional({
      options: {
        validation:{
          itemLimit: 1,//最多上传5张图片
        },
        deleteFile: {
          enabled: true,
          endpoint: 'https://producer-img.gz.bcebos.com'
        },
        request: {
          inputName: 'file',//bos要求文件内容的参数名为file
          filenameParam: 'key',//bos要求文件名的参数名为key
          paramsInBody: true,//参数都放在http请求的body中
          requireSuccessJson: false,//bos不会返回json数据，只有header
          endpoint: 'https://producer-img.gz.bcebos.com',
          customHeaders:{
            accessKey: bosAk,
            policy,
            signature,
          }
        },
        retry: {
          enableAuto: true//上传失败后自动重传
        },
        // scaling: {
        //   sendOriginal: true,
        // },
        callbacks:{
          onComplete:function(id,name,responseJSON, /*xhr*/){
            if(responseJSON.success===true) {
              // const uuid = uploader.methods.getUuid(id);
            }
          },
          onDeleteComplete:function(id,xhr,isError){
            if(!isError) {
              // const uuid = uploader.methods.getUuid(id);
            }
          }
        }
      }
    })
  }
}
export default connect(
  function({appModel:{bosSts}, producerModel:{id: producerId}}){
    return {bosSts, producerId}
  }
)(DragFileUploader);

