import useWindowDimensions from '../utility/WindowDim';
import './CustomChat.css'
import { baseUrl } from '../constants';

const CustomChat = ({name, message, chatName, time, fileUrl, fileName, type, roomId}) => {

    const [ , width] = useWindowDimensions();

    if(name!==chatName)
        return (
        <div   className="others" >
        <div className="name-container">{name.substring(0,name.length - 20)+" - "}
            <span style={{fontSize:"0.7em", marginLeft: "10px", wordBreak: "break-all"}}>{name.substring(name.length - 20, name.length)}</span>
        </div>
        <div className="message-container">{message}</div>
        {message==="" && type.split('/')[0]==='image'?<div className="image-container">
            <img   src={fileUrl} alt="Images" width={0.45*width}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='audio'?<div className="audio-container">
            <audio     controls={true} style={{width: 0.45*width, height: 0.2*0.45*width}} src={fileUrl}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='video'?<div className="video-container">
            <video   controls={true} style={{width: 0.45*width, height: 0.318195*width}} src={fileUrl}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type!==null && type.split('/')[0]!=='video' && type.split('/')[0]!=='audio' && type.split('/')[0]!=='image'?<div className="audio-container">
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'  >{`${fileName.substring(0,3)}...${fileName.split('.')[1]}`}</a>
        </div>:<></>}
        <div className="time-container">{time}</div>
        </div>)
    else
        return (<div     className="me" >
        <div className="name-container">{name.substring(0,name.length - 20)+" - "}
            <span style={{fontSize:"0.7em", marginLeft: "10px", wordBreak: "break-all"}}>{name.substring(name.length - 20, name.length)}</span></div>
        <div className="message-container">{message}</div>
        {message==="" && type.split('/')[0]==='image'?<div className="image-container">
            <img   src={fileUrl} alt="Images" width={0.45*width}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='audio'?<div className="audio-container">
            <audio     controls={true} style={{width: 0.45*width, height: 0.2*0.45*width}} src={fileUrl}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='video'?<div className="video-container">
            <video   controls={true} style={{width: 0.45*width, height: 0.318195*width}} src={fileUrl}/>
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'   style={{fontSize:"0.65em"}}>download</a>
        </div>:<></>}
        {message==="" && type!==null && type.split('/')[0]!=='video' && type.split('/')[0]!=='audio' && type.split('/')[0]!=='image'?<div className="audio-container">
            <a href={`${baseUrl}/chat/${roomId}/download/${fileName}`} target='_blank'  >{`${fileName.substring(0,3)}...${fileName.split('.')[1]}`}</a>
        </div>:<></>}
        <div className="time-container">{time}</div>
        </div>)
}

export default CustomChat;