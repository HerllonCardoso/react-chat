import { useRef } from 'react';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import style from './Join.module.css';
import { Input, Button } from '@mui/material';

interface IJoinProps {
  setChatVisibility: (isVisible: boolean) => void;
  setSocket: (socket: Socket) => void;
}

export const Join = ({ setChatVisibility, setSocket }: IJoinProps) => {
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    const username = usernameRef.current?.value;
    if (!username?.trim()) return;
    const socket = await io.connect('http://localhost:3000');
    socket.emit('set_username', username);
    setSocket(socket);
    setChatVisibility(true);
  };

  return (
    <div className={style['join-container']}>
      <h1>React Messenger</h1>
      <Input
        type='text'
        placeholder='Enter your username..'
        inputRef={usernameRef}
      ></Input>
      <Button sx={{ mt: 2 }} onClick={() => handleSubmit()} variant='contained'>
        Join chat
      </Button>
    </div>
  );
};
