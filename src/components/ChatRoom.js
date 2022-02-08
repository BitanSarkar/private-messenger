import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { baseUrl } from "../constants";
import SockJsClient from 'react-stomp';
import './ChatRoom.css'
import send from '../assets/send.png';
import attach from '../assets/attach.png';
import Popup from "reactjs-popup";
import CustomChat from "./CustomChat";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";


const ChatRoom = () => {
    const location = useLocation();
    const history = useHistory();

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
      };
    var roomid = "";
    var owner = false;
    try {
        roomid = location.state[0]
        owner = location.state[1]
    }
    catch (err) {
        history.push("/");
    }
    const roomId = roomid;
    const [messageToBeSent, setMessageToBeSent] = useState("");
    const [sessionExpired, setSessionExpired] = useState(false);
    const [attachment, setAttachment] = useState(false);
    const [allMessages,setAllMessages] = useState([]);
    const [upload,setUpload] = useState(0);

    const sendMessage = () => {
        if(messageToBeSent !== ""){
            const payload = {
                "name" : localStorage.getItem('name'),
                "message" : messageToBeSent
            }
            fetch(`${baseUrl}/chat/${roomId}/add-message`, {
                method: "POST",
                headers : {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive',
                    'Time-Zone': new Date().toString().split(' ')[5]
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                if(response.ok){
                    setMessageToBeSent("");
                }
                if(response.status===404){
                    setSessionExpired(true);
                }
            })
        }
    }
    
    useEffect(()=>{
        if(localStorage.getItem("name")===undefined || localStorage.getItem("name")===null || localStorage.getItem("name")===""){
            history.push("/");
        }
        fetch(baseUrl + "/chat/" + roomId + "/all-message")
        .then(response => {
            if(response.status===404){
                setSessionExpired(true);
            }
            if(response.ok)
                return response.json();
            else
                throw new Error("Room not found");
        })
        .then( data => {
            setAllMessages(data.messages)
        })
        .catch(e=>console.log(e))
    },[history, roomId])

    const deleteRoom = () => {
        fetch(baseUrl + "/chat-room/remove-room/" + roomId, {
            method: "DELETE",
            headers : {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        })
        .then(response => {
            if(response.ok){
                history.push("/");
            }
            if(response.status===404){
                history.push("/");
            }
        })
    }

    const messageHandler = (msg) => {
        if(msg.roomId===roomId){
            if(msg.message.name !== localStorage.getItem("name")){
                if(msg.message.message==="")
                    NotificationManager.info(`You got photo from from ${msg.message.name.substring(0,msg.message.name.length - 20)}`)
                else
                    NotificationManager.info(`You got message from ${msg.message.name.substring(0,msg.message.name.length - 20)}`)
            }
            setAllMessages([...allMessages, msg.message])
        }
    }

    return  (<div className="chat-design">
                <SockJsClient
                    url={baseUrl+"/ws-message"}
                    topics={['/topic/message']}
                    onConnect={()=>{}}
                    onDisconnect={()=>{}}
                    onMessage={msg => messageHandler(msg)}
                    debug={false}
                />
                <NotificationContainer/>
                <div className="aaaa">
                    <div className="row">
                        <Box position="relative" display={upload===0?"none":"inline-flex"}>
                            uploading ...
                            <CircularProgress variant="determinate" 
                            value={upload} />
                                <Box
                                    bottom={0}
                                    right={0}
                                    top={0}
                                    justifyContent="center"
                                    left={0}
                                    display="flex"
                                    alignItems="center"
                                    position="absolute"
                                    >
                                    {`${upload}%`}
                                </Box>
                        </Box>
                        <div className="col-8">Room ID : {roomId}</div>
                        <div className="col-4">{owner?<button className="btn btn-primary delete-room" onClick={deleteRoom}> Delete Room</button>:<></>}</div>
                    </div>


                    <div className="messages-container" id="message-container"> 
                        {allMessages.map( m => 
                            <CustomChat key={Math.floor(Math.random()*10000000)} name={m.name} message={m.message} chatName={localStorage.getItem("name")} time={m.timeStamp} fileUrl={m.fileUrl} fileName={m.fileName} type={m.type} roomId={roomId}/>
                        )}
                        <AlwaysScrollToBottom />
                    </div>


                    <Popup className="pop-up-chat" open={sessionExpired} closeOnDocumentClick={false} position="center">
                        Your Session Has been expired, <a href="/">click here</a> to goto Home Page
                    </Popup>
                    
                    <Popup className="pop-up" open={attachment} closeOnDocumentClick={false} position="center">
                        <input
                            type="file"
                            onChange={(e) => {
                                setAttachment(false)
                                const fileData = new FormData();
                                const extA = e.target.files[0].name.split('.');
                                fileData.append("name", localStorage.getItem("name"));
                                fileData.append("file", e.target.files[0]);
                                fileData.append("type", e.target.files[0].type);
                                fileData.append("ext", extA[extA.length-1]);
                                axios.request({
                                    url: baseUrl + "/chat/"+roomId+"/file-upload",
                                    method: "POST",
                                    headers: {
                                        'Time-Zone': new Date().toString().split(' ')[5]
                                    },
                                    data: fileData,
                                    onUploadProgress: (uploadedData) => {
                                        setUpload(Math.round((uploadedData.loaded*100)/uploadedData.total));
                                    }
                                })
                                .then(response => {
                                    setUpload(0);
                                    if(response.status === 200){
                                        NotificationManager.success('File added successfully', '');
                                    }
                                    else
                                        throw new Error("File upload failed")
                                })
                                .catch(e=>{
                                    NotificationManager.warning('Some error happed', '', 1000)
                                })
                            }}
                        />
                    </Popup>
                    <div className="input-group mb-3 send-text">
                        <input type="text" className="form-control send" placeholder="Write your message..." onChange={(e)=>setMessageToBeSent(e.target.value)} value={messageToBeSent}/>
                        <img src={attach} alt="attach" onClick={()=>setAttachment(true)} className="attach-send"/>
                        <img src={send} alt="send" onClick={sendMessage} className="button-send"/>
                    </div>
                </div>
            </div>);
}
export default ChatRoom;