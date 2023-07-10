import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import './css/Home.css';
const Home = () => {
    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };
    return (
        <div className="homePageWrapper unselectable flex items-center justify-center" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}>
            <div className='LoginPage'>
                <div className="formWrapper ">
                    <div className="HeaderTitle ">
                        <span className=''>CODE SHARE</span>
                    </div>
                    <div className='flex lg:flex-row flex-col justify-between items-center mt-5 mb-3'>
                        <span className="mainLabel text-sm text-black mr-5">Paste invitation </span>
                        <span className='lg:text-3xl text-2xl text-black'>ROOM ID</span>
                    </div>
                    
                    <div className="inputGroup flex flex-col items-center justify-center">

                        <TextField
                            required
                            id="outlined-required"
                            label="RoomId"
                            defaultValue="ID"
                            onChange={(e) => setRoomId(e.target.value)}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <TextField
                            required
                            id="outlined-required"
                            label="Username"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            onKeyUp={handleInputEnter}
                        />
                        <button className="btn joinBtn bg-blue-800 px-2 py-1 h-10 w-24 rounded-md lg:my-5 my-2 text-white" onClick={joinRoom} >
                            Join
                        </button>
                        <div className="createInfo flex lg:flex-row  flex-col justify-center items-center ">
                            <span className='text-sm mr-3' >If U don't have RoomID </span>
                            <button onClick={createNewRoom} href="" className="createNewBtn bg-black text-white px-2 py-1 h-10 w-24 rounded-md text-sm">
                            Create 
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <span className='absolute bottom-0 text-white mb-2'>SENA</span>
        </div>
    );
};

export default Home;
