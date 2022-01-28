import './HomeView.css'
import shhh from '../assets/sshh.gif';
import { useEffect, useState } from 'react';
import Emoji from './Emoji';

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useHistory } from 'react-router';
import { baseUrl } from '../constants';
import useWindowDimensions from '../utility/WindowDim';

const HomeView = () => {
    const history = useHistory();
    const [showWarning, setShowWarning] = useState(false);
    const [showWarning2, setShowWarning2] = useState(false);
    const [showWarning3, setShowWarning3] = useState(false);
    const [name, setName] = useState("");
    const [namePop, setNamePop] = useState(false);
    const [foundRoom, setFoundRoom] = useState(true);
    const [roomId, setRoomId] = useState("");
    const [siteUp, setSiteUp] = useState("");
    const [owner, setOwner] = useState(false);

    useEffect(()=>{
        localStorage.removeItem("name");
        fetch(baseUrl+"/actuator/health")
        .then((response) => {
            if(response.ok)
                return response.json()
            else
                throw new Error("Site error");
        })
        .then(data => {
            if(data.status==="UP")
                setSiteUp("true");
            else
                setSiteUp("false");
        })
        .catch(e => setSiteUp("false"))
    })

    const joinHandler = () => {
        setNamePop(false);
        if(siteUp){
            if(roomId.length===6){
                fetch(baseUrl+"/chat-room/room/"+roomId, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        'Connection': 'keep-alive'
                    }
                })
                .then(response => {
                    if(response.status!==404)
                        setNamePop(true)
                    else
                        throw new Error("room not found");
                })
                .catch(e => {
                    console.log(e)
                    setFoundRoom(false)
                })
            }
            else {
                setShowWarning(true);
            }
        }
    }
    const createHandler = () => {
        setFoundRoom(true);
        if(siteUp){
            setNamePop(false);
            fetch(baseUrl+"/chat-room/generate-room", {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if(response.ok)
                    return response.json();
                else
                    throw new Error("Failed to create a room");
            })
            .then( data => {
                setOwner(true);
                setRoomId(data.id);
            })
            setNamePop(true)
        }
    }

    const roomIdEntered = (e) => {
        setNamePop(false);
        setFoundRoom(true);
        setShowWarning(false);
        if(e.target.value.length<=6)
            setRoomId(e.target.value)
        else
            setRoomId(roomId.substring(0,6))
    }

    const nameSubmit = () => {
        if(name.length<3){
            setShowWarning2(true);
        }
        else if(name.includes('created')) {
            setShowWarning3(true);
        }
        else{
            localStorage.setItem("name", name + " created at "+new Date().getHours().toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              })+":"+new Date().getMinutes().toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              })+":"+new Date().getSeconds().toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false
              }));
            setFoundRoom(true);
            setNamePop(false);
            history.push({
                pathname: '/chat-room', 
                state: [roomId,owner]
            });
        }
    }
    
    const [,width] = useWindowDimensions();
    return  (<div className="home-body">
                <h1>Private Messenger</h1>
                <h3>This is a <span className="private">private</span> <span className="safe">safe</span> place</h3>
                <img src={shhh} alt="sshhh..." width={2*width/3+"px"}/>
                <h3>to have a chat</h3>
                <div className="to-join" style={{alignItems:'center'}}>
                    {showWarning?<div className="warn">roomId should be of 6 characters</div>:<></>}
                    {siteUp==="false"?<div className="warn">Site is not up, try again after few mins</div>:<></>}
                    {!foundRoom?<div className="warn">Room not found</div>:<></>}
                    <div className="row" style={{width: width, alignItems:'center'}}>
                        <div className="col-9">
                            <div className="input-group" style={{paddingLeft:30, marginTop:"auto"}}>
                                <span className="input-group-text label-text" id="basic-addon1">Enter<br/>Room ID</span>
                                <input type="text" className="form-control" placeholder="Room ID" aria-label="Username" aria-describedby="basic-addon1" value={roomId} onChange={roomIdEntered} autoComplete="off"/>
                            </div>
                        </div>
                        <div className="col-3">
                            <button className="btn btn-outline-primary btn-lg btn-block" onClick={joinHandler}>Join</button>
                        </div>
                    </div>
                    <p className="no-room-id">Don't have a roomID ? <Emoji symbol='0x1F631'/><br/>Generate one and share with your friends to have a private chat <Emoji symbol='0x1F601'/></p>
                    <button className="btn btn-outline-primary btn-lg btn-block generate" onClick={createHandler}>Generate RoomID</button>
                    <Popup className="pop-up" open={namePop} closeOnDocumentClick={false} position="center">
                        <div className="inside-pop-up">
                            {showWarning2?<div className="warn">Name should have atleast 2 characters</div>:<></>}
                            {showWarning3?<div className="warn">Name can't have created</div>:<></>}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label popup-title">Enter your name</label>
                                <input type="text" className="form-control popup-name" id="name" onChange={e=>{
                                    setShowWarning2(false)
                                    setShowWarning3(false)
                                    setName(e.target.value)
                                    }} required={true} value={name} autoComplete="off" placeholder="Enter Your Name"/>
                            </div>
                            <button onClick={nameSubmit} className="btn btn-primary popup-submit">Submit</button>
                        </div>
                    </Popup>
                </div>
            </div>)
}

export default HomeView;