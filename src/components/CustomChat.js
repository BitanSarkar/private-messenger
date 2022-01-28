import useWindowDimensions from '../utility/WindowDim';
import useLongPress from '../utility/useLongPress';
import './CustomChat.css'
import { saveAs } from 'file-saver'

const CustomChat = ({name, message, chatName, time, imageUrl, audioUrl, type}) => {

    const [height , width] = useWindowDimensions();
    const onLongPress = () => {
        saveAs(imageUrl, 'imageFromPrivate'+new Date().toISOString()+'.jpg')
    };

    const onClick = () => {
    }

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 1000,
    };
    const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

    if(name!==chatName)
        return (
        <div className="others">
        <div className="name-container">{name.substring(0,name.length - 20)+" - "}
            <span style={{fontSize:"0.7em", marginLeft: "10px", wordBreak: "break-all"}}>{name.substring(name.length - 20, name.length)}</span>
        </div>
        <div className="message-container">{message}</div>
        {message==="" && type.split('/')[0]==='image'?<div className="image-container">
            <img {...longPressEvent} src={'data:'+imageUrl} alt="Images" width={0.45*width}/>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='audio'?<div className="audio-container">
            <audio controls={true} style={{width: 0.45*width, height: 0.05*height}} src={'data:'+audioUrl}/>
        </div>:<></>}
        <div className="time-container">{time}</div>
        </div>)
    else
        return (<div className="me">
        <div className="name-container">{name.substring(0,name.length - 20)+" - "}
            <span style={{fontSize:"0.7em", marginLeft: "10px", wordBreak: "break-all"}}>{name.substring(name.length - 20, name.length)}</span></div>
        <div className="message-container">{message}</div>
        {message==="" && type.split('/')[0]==='image'?<div className="image-container">
            <img {...longPressEvent} src={'data:'+imageUrl} alt="Images" width={0.45*width}/>
        </div>:<></>}
        {message==="" && type.split('/')[0]==='audio'?<div className="audio-container">
            <audio controls={true} style={{width: 0.45*width, height: 0.05*height}} src={'data:'+audioUrl}/>
        </div>:<></>}
        <div className="time-container">{time}</div>
        </div>)
}

export default CustomChat;