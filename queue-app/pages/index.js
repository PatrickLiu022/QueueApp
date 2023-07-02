import { Inter } from 'next/font/google'
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [listItems, setListItems] = useState([]);
  const [button, setButton] = useState(false)
  const searchParams = useSearchParams()
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const params = searchParams.get('id')
    if (params === 'i') {
      setButton(true)
    }

    const newSocket = new WebSocket('ws://localhost:8080');

    newSocket.onopen = () => {
      console.log('WebSocket connection established.');
    };

    newSocket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === 'listUpdate') {
        setListItems(data);
      }
    };

    setSocket(newSocket);

    return () => {
      // Close WebSocket connection on component unmount
      newSocket.close();
    };
  }, [])

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      setListItems([...listItems, inputValue]);
      setInputValue('');
    }
  };
  return (
    <div
      style={{
        backgroundColor: ' #FFF',
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '50px'
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter an item"
          style={{
            fontSize: '20px',
            padding: '5px'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100px',
            height: '30px',
            fontSize: '20px',
            padding: '5px'
          }}
        >
          Add
        </button>
      </form>
      <button
        onClick={() => {
          const test = listItems
          setListItems(listItems.slice(1))
        }}
      >
        Remove
      </button>
      <ul style={{ padding: '50px', fontSize: '20px' }}>
        {listItems.map((item, index) => (
          <div key={index}
            style={{
              display: 'flex',
              flexDirection: 'row'
            }}
          >
            <li>{item}</li>
          </div>
        ))}
      </ul>
    </div >
  )
}
