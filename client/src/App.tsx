import { useState } from 'react';
import { Join } from './components/Join';
import { Chat } from './components/Chat';
import { Socket } from 'socket.io-client';

import './App.css';

function App() {
  const [chatVisibility, setChatVisibility] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  return (
    <div className='App'>
      {chatVisibility ? (
        <Chat socket={socket as Socket} />
      ) : (
        <Join setChatVisibility={setChatVisibility} setSocket={setSocket} />
      )}
    </div>
  );
}

export default App;
