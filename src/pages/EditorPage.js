import React, { useState, useRef, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import './css/EditorPage.css';
import { initSocket } from '../socket';
import {
    useLocation,
    useNavigate,
    Navigate,
    useParams,
} from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [toggleMenu, setToggleMenu] = useState(true);
    const toggleNav = () => {
        setToggleMenu(!toggleMenu);
    }

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            // Listening for joined event
            socketRef.current.on(
                ACTIONS.JOINED,
                ({ clients, username, socketId }) => {
                    if (username !== location.state?.username) {
                        toast.success(`${username} joined the room.`);
                        console.log(`${username} joined`);
                    }
                    setClients(clients);
                    socketRef.current.emit(ACTIONS.SYNC_CODE, {
                        code: codeRef.current,
                        socketId,
                    });
                }
            );

            // Listening for disconnected
            socketRef.current.on(
                ACTIONS.DISCONNECTED,
                ({ socketId, username }) => {
                    toast.success(`${username} left the room.`);
                    setClients((prev) => {
                        return prev.filter(
                            (client) => client.socketId !== socketId
                        );
                    });
                }
            );
        };
        init();
        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        };
    }, []);

    async function copyRoomId() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID has been copied to your clipboard');
        } catch (err) {
            toast.error('Could not copy the Room ID');
            console.error(err);
        }
    }

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }


    return (
        <div className="mainWrap flex flex-row h-screen overflow-y-hidden">
            <div className="aside lg:left-0 fixed right-0">
                <div className='lg:hidden text-black grid lg:right-0 text-1xl' onClick={toggleNav}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </div>
                <div className={toggleMenu ? "hidden" : "flex"} id="modalContainer">
                    <div className="asideInner flex flex-col mt-10">
                        <div className="logo">
                            <img
                                className="logoImage"
                                src="/code-sync.png"
                                alt="logo"
                            />
                        </div>
                        <span className='text-xl mt-4'>Connected</span>
                        <div className="clientsList grid lg:grid-cols-2 grid-cols-1 gap-1 mt-4">
                            {clients.map((client) => (
                                <Client
                                    key={client.socketId}
                                    username={client.username}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-row justify-evenly items-center lg:mt-32'>
                        <div className='flex flex-col items-center justify-center lg:mr-4'>
                            <span className='text-sm mt-1'>ROOM ID</span>
                            <button className="btn copyBtn w-10 h-8 bg-green-800 rounded-md text-sm text-white" onClick={copyRoomId}>
                                Copy
                            </button>
                        </div>

                        <button className="btn leaveBtn w-10 h-8 bg-red-700 rounded-md text-sm text-white mt-6" onClick={leaveRoom}>
                            EXIT
                        </button>
                    </div>

                </div>
            </div>
            <div   className={toggleMenu ? "flex" : "hidden"} id="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
            <ToastContainer />
        </div>
    );
};

export default EditorPage;
