import React from 'react';
import {connect} from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Avatar from '@material-ui/core/Avatar';
import userIcon from './imgs/user.jpg';
import meIcon from './imgs/me.jpg';
import Grid from '@material-ui/core/Grid';
// import TableRow from '@material-ui/core/TableRow';
// import CssBaseline from '@material-ui/core/CssBaseline';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
// import BigPicture from '../components/BigPicture';
import Icon from '@material-ui/core/Icon';
// import DragPicsUpload from './DragPicsUpload';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from './fileUploaderGallery'
import './fileUploaderGallery/gallery.css'


class ConversationDialog extends React.Component{
  uploadedImgs = {};

  constructor(props){
    super(props);
    this.state={
      replyText:'',
      uploader:undefined,
      chosenPic:'',
      // show:false,
      // myPicArr:[],
      showUploadPic:false,
    };
  }
  UNSAFE_componentWillMount(){
    this.setState({uploader: new FineUploaderTraditional(this.uploadConfig)})
  }

  handleClose=()=>{
    const {dispatch,id}=this.props;
    dispatch({type:'conversationModel/updateState',payload:{open:false}});
    global.myFetch({
      url:global.serverBaseUrl+`/Myusers/me/feedbacks/${id}?`,
      method: 'PUT', headers: {'Content-Type': 'application/json'},
      data: {'feedbackerViewDate':new Date()},
    });
  }

  handleBigPicClose=()=>{
    this.setState({show:false})
  }

  //发送消息
  handleSend=()=>{
    this.props.conversation.push({
      text:this.state.replyText,
      imgs:Object.keys(this.uploadedImgs).map(function(uuid){return `https://feedback-img.gz.bcebos.com/${uuid}` }),
      sender:global.realm,
      chatDate:new Date(),
    });
    // console.log('state',this.state.replyText);//打印更新前的state。
    this.props.dispatch({type:'conversationModel/updateStateWithServer',payload:{conversation:this.props.conversation,adminId:this.props.adminId,id:this.props.id,}});
    this.uploadedImgs = {};
    this.setState({replyText:'',showUploadPic:false, uploader:new FineUploaderTraditional(this.uploadConfig)})
  }

  render(){
    const {classes,conversation,open,createDate,width,id}=this.props;
    const {showUploadPic} =this.state;
    const date=createDate;
    const myHeight=window.innerHeight;
    // const eventSource=new EventSource(`https://adminapi.yiyimap.com/api/MyUsers/change-stream?_format=event-stream&options={"where":{"id":${id}}}&access_token=${global.yiyimapToken}`);
    // eventSource.onmesssage=function(event){
    //   console.log('ddddd',event.date);
    // }
    return(
      <React.Fragment>
        <Dialog 
          open={open||false}
          onClose={this.handleClose}
          fullScreen
          // classes={{paper:global.classes.dialogWidth}}
        >
          <DialogTitle align='center' style={{backgroundColor:'rgba(0,0,0,0.3)'}}>
            {conversation?conversation[0].sender:''}
            <IconButton size='small' style={{float:'right'}} onClick={this.handleClose} > 
              <CloseIcon />
            </IconButton> 
          </DialogTitle>
          <DialogContent>
            <div style={{minHeight:0.4*myHeight}}>
              {(conversation||[]).map((say,index)=>{

                //判断是否显示时间
                if(!say.chatDate){say.chatDate=date}
                let showTime=false;
                if(conversation.indexOf(say)>0){
                  if(new Date(conversation[conversation.indexOf(say)].chatDate)-new Date(conversation[conversation.indexOf(say)-1].chatDate)>5*60*1000){
                    showTime=true;
                  }
                }else{
                  showTime=true;
                }
                //global.realm的发言
                if(say.sender!=='admin'){ //
                  return(
                    <React.Fragment key={index}>
                      {showTime&&
                        <center>
                          {`${new Date(say.chatDate).getFullYear()}年${new Date(say.chatDate).getMonth()+1}月${new Date(say.chatDate).getDate()}日 
                            ${new Date(say.chatDate).getHours()}:${new Date(say.chatDate).getMinutes()<10?'0'+new Date(say.chatDate).getMinutes():new Date(say.chatDate).getMinutes()}`}
                        </center>
                      }

                      <Grid key={index+'AText'} container style={{marginTop:20,marginBottom:20}} justify='flex-end'> 
                        <div className={classes.aChat}>
                          {say.text&&<p style={{margin:'0.3rem'}}>{say.text}</p>}
                          {say.imgs.map((img,imgIndex)=>
                            <img  key={imgIndex} src={img } className={classes.miniPic} 
                              onClick={(e)=>{
                                this.setState({chosenPic:e.target.src},()=>{global.dispatch({type:'appModel/updateState',payload:{hugeImgUrl: this.state.chosenPic}}) });
                              }}
                            />)}
                        </div>
                        <Avatar src={meIcon} style={{margin:5}}/>
                      </Grid>
                    </React.Fragment>
                  )
                }else{ //其他人发言
                  return (
                    <React.Fragment key={index}>
                      {showTime&&<center>{`${new Date(say.chatDate).getFullYear()}年${new Date(say.chatDate).getMonth()+1}月${new Date(say.chatDate).getDate()}日 ${new Date(say.chatDate).getHours()}:${new Date(say.chatDate).getMinutes()<10?'0'+new Date(say.chatDate).getMinutes():new Date(say.chatDate).getMinutes()}`}</center>}
                      <Grid key={index+'FText'} container style={{marginTop:20,marginBottom:20,}}>
                        <Avatar  src={userIcon} style={{margin:5}}/>
                        <div  className={classes.fChat}  >
                          {say.text&&<p style={{margin:'0.3rem'}}>{say.text}</p>}
                          {say.imgs.map((img,imgIndex)=>
                            <img key={imgIndex} src={img} className={classes.miniPic}
                              onClick={(e)=>{
                                this.setState({chosenPic:e.target.src},()=>{global.dispatch({type:'appModel/updateState',payload:{hugeImgUrl: this.state.chosenPic}});} );
                              }}/>)}
                        </div>
                      </Grid>
                    </React.Fragment>
                  ) 
                }
              })}
            </div> 
        
            <div style={{borderTop:'2px solid black', padding:'1rem 0.5rem',marginTop:'15%'}}>
              <TextField       
                value={this.state.replyText}
                onChange={(e)=>{const val=e.target.value;this.setState({replyText:val});}}
                id='replyText'
                fullWidth
                variant="outlined"
                multiline
                rows="4"
                onKeyUp={e=>{if(e.keyCode===13){this.handleSend(); } }}
              />
              {!showUploadPic&&<Button onClick={()=>{this.setState({showUploadPic:true})}}><Icon>image</Icon></Button>}
              {showUploadPic&&<Gallery 
                dropzone-disabled={width==='xs'? true:false }
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
                uploader={this.state.uploader} 
                fileInput-accept='image/*'
              />
              }
            </div>
          </DialogContent>

          <DialogActions
            //<BigPicture show={this.state.show} myPic={this.state.chosenPic} close={this.handleBigPicClose}/> 我写的大图，放dialog后
          >
            <Button onClick={this.handleSend} variant='contained' color='primary'>
              发送
            </Button>
          </DialogActions>
        </Dialog>
        
      </React.Fragment>
    )
  }
  
  uploadConfig={
    options: {
      validation:{
        itemLimit: 5,//最多上传5张图片
      },
      deleteFile: {
        enabled: true,
        endpoint: 'https://feedback-img.gz.bcebos.com'
      },
      request: {
        inputName: 'file',//bos要求文件内容的参数名为file
        uuidName: 'key',//bos要求文件名的参数名为key
        paramsInBody: true,//参数都放在http请求的body中
        requireSuccessJson: false,//bos不会返回json数据，只有header
        endpoint: 'https://feedback-img.gz.bcebos.com',
        // customHeaders:{}
      },
      retry: {
        enableAuto: true//上传失败后自动重传
      },
      scaling: {//上传缩小后的图片，不传原图
        sendOriginal: false,
        sizes: [
          {name: '', maxSize: 2000}//图片宽高不超过maxSize
        ]
      },
      callbacks:{
        onComplete:(id,name,responseJSON, /*xhr*/)=>{
          if(responseJSON.success===true) {
            const uuid = this.state.uploader.methods.getUuid(id);
            this.uploadedImgs[uuid] = 1;
          }
        },
        onDeleteComplete:(id,xhr,isError)=>{
          if(!isError) {
            const uuid = this.state.uploader.methods.getUuid(id);
            delete this.uploadedImgs[uuid];
          }
        }
      }
    }
  }
}

const mapStateToProps=({conversationModel})=>{
  const {title,conversation,phone,open,createDate,id,adminId,picArr}=conversationModel;
  return ({title,conversation,phone,open,createDate,id,adminId,picArr})
}

const styles=()=>{
  // const blue=theme.palette.primary.main;
  return {
    p:{
      margin:'0.4rem'
    },
    reply:{
      minWidth:'3rem',
    },
    aChat:{
      padding:'0.4rem',
      backgroundColor:blue[500],
      maxWidth:'80%',
      minWidth:'3rem',
    },
    fChat:{
      padding:'0.4rem',
      backgroundColor:grey[300],
      maxWidth:'80%',
      minWidth:'3rem',
    },
    smallButton:{
      padding:'3px',
    },
    miniPic:{
      minWidth:'6rem',
      maxHeight:'6rem',
      cursor:'pointer',
      margin:'0.3rem'
    }
  }
};
export default connect(mapStateToProps)(withStyles(styles)(withWidth()(ConversationDialog)));


