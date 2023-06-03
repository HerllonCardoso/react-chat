import { Input } from '@mui/material';
import { useRef, useState, useEffect, KeyboardEvent } from 'react';
import SendIcon from '@mui/icons-material/Send';
import style from './Chat.module.css';
import { Socket } from 'socket.io-client';

interface IMessage {
  authorId: string;
  author: string;
  text: string;
}

export interface IChatProps {
  socket: Socket;
}

export const Chat = ({ socket }: IChatProps) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messageList, setMessageList] = useState<IMessage[]>([]);

  useEffect(() => {
    socket.on('receive_message', (data: IMessage) => {
      setMessageList((current) => [...current, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  const handleSubmit = () => {
    const message = messageRef.current?.value;
    if (!message?.trim()) return;

    socket.emit('message', message);
    clearInput();
    focusInput();
  };

  const focusInput = () => {
    messageRef.current?.focus();
  };

  const clearInput = () => {
    if (messageRef.current) {
      messageRef.current.value = '';
    }
  };

  const getEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div>
      <div className={style['chat-container']}>
        <div className={style['chat-body']}>
          {messageList.map((message, index) => (
            <div
              className={`${style['message-container']} ${
                message.authorId === socket.id && style['message-mine']
              }`}
              key={index}
            >
              <div className={style['message-author']}>
                <strong>{message.author}</strong>
              </div>
              <div className={style['message-text']}>{message.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className={style['chat-footer']}>
          <Input
            inputRef={messageRef}
            placeholder='Mensagem'
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              getEnterKey(e)
            }
            fullWidth
          />
          <SendIcon
            sx={{ m: 1, cursor: 'pointer' }}
            onClick={() => handleSubmit()}
            color='primary'
          />
        </div>
      </div>
    </div>
  );
};
