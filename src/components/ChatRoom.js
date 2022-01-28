import { useEffect, useState } from "react";
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

const ChatRoom = () => {
    const location = useLocation();
    const history = useHistory();
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
            var element = document.getElementById("message-container");
            element.scrollTop=element.scrollHeight;
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
                        <div className="col-8">Room ID : {roomId}</div>
                        <div className="col-4">{owner?<button className="btn btn-primary delete-room" onClick={deleteRoom}> Delete Room</button>:<></>}</div>
                    </div>

                    <div className="messages-container" id="message-container"> 
                        {allMessages.map( m => 
                            <CustomChat key={Math.floor(Math.random()*10000000)} name={m.name} message={m.message} chatName={localStorage.getItem("name")} time={m.timeStamp} imageUrl={m.imageUrl} audioUrl={m.audioUrl} type={m.type}/>
                        )}
                    </div>



                    <Popup className="pop-up-chat" open={sessionExpired} closeOnDocumentClick={false} position="center">
                        Your Session Has been expired, <a href="/">click here</a> to goto Home Page
                    </Popup>
                    <Popup className="pop-up" open={attachment} closeOnDocumentClick={false} position="center">
                        <input
                            type="file"
                            onChange={(e) => {
                                setAttachment(false)
                                if(e.target.files[0].type.split('/')[0]==='image'){
                                    const imageData = new FormData();
                                    imageData.append("name", localStorage.getItem("name"));
                                    imageData.append("image", e.target.files[0]);
                                    imageData.append("type", e.target.files[0].type);
                                    fetch(baseUrl + "/chat/"+roomId+"/photos", {
                                        headers: {
                                            'Time-Zone': new Date().toString().split(' ')[5]
                                        },
                                        method: "POST",
                                        body: imageData
                                    })
                                    .then(response => {
                                        if(response.ok){
                                            NotificationManager.success('Image added successfully', '');
                                        }
                                        else
                                            throw new Error("Image upload failed")
                                    })
                                    .catch(e=>{
                                        NotificationManager.warning('Some error happed', '', 1000)
                                    })
                                }
                                else if(e.target.files[0].type.split('/')[0]==='audio') {
                                    const imageData = new FormData();
                                    imageData.append("name", localStorage.getItem("name"));
                                    imageData.append("audio", e.target.files[0]);
                                    imageData.append("type", e.target.files[0].type);
                                    fetch(baseUrl + "/chat/"+roomId+"/audio", {
                                        headers: {
                                            'Time-Zone': new Date().toString().split(' ')[5]
                                        },
                                        method: "POST",
                                        body: imageData
                                    })
                                    .then(response => {
                                        if(response.ok){
                                            NotificationManager.success('Audio added successfully', '');
                                        }
                                        else
                                            throw new Error("Audio upload failed")
                                    })
                                    .catch(e=>{
                                        NotificationManager.warning('Some error happed', '', 1000)
                                    })
                                }
                                else {
                                    NotificationManager.warning('Unsupported media type', 'You can upload images only', 3000)
                                }
                            }}
                        />
                    </Popup>
                    <div className="input-group mb-3 send-text">
                        <input type="text" className="form-control send" placeholder="Write your message" onChange={(e)=>setMessageToBeSent(e.target.value)} value={messageToBeSent}/>
                        <img src={attach} alt="attach" onClick={()=>setAttachment(true)} className="attach-send"/>
                        <img src={send} alt="send" onClick={sendMessage} className="button-send"/>
                    </div>
                </div>
            </div>);
}
export default ChatRoom;