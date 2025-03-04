import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { Send as SendIcon, MoreVert as MoreVertIcon, Search as SearchIcon } from '@mui/icons-material';

// Mock data for chats
const chats = [
  { id: 1, name: 'Alice', lastMessage: 'Hey, how are you?', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 2, name: 'Bob', lastMessage: 'Can we meet tomorrow?', avatar: '/placeholder.svg?height=40&width=40' },
  { id: 3, name: 'Charlie', lastMessage: 'Sure, no problem!', avatar: '/placeholder.svg?height=40&width=40' },
];

// Mock data for messages
const initialMessages = [
  { id: 1, sender: 'Alice', content: 'Hey, how are you?', timestamp: '10:00 AM' },
  { id: 2, sender: 'You', content: 'I\'m good, thanks! How about you?', timestamp: '10:05 AM' },
  { id: 3, sender: 'Alice', content: 'Doing great! Any plans for the weekend?', timestamp: '10:10 AM' },
];

export default function WhatsApp() {
  const [selectedChat, setSelectedChat] = useState(chats[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'You',
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box width={250} sx={{}}>
      {/*<Drawer variant="permanent" sx={{ width: 220, flexShrink: 0, '& .MuiDrawer-paper': { width: 320, boxSizing: 'border-box' },}}>*/}
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Chats
          </Typography>
        </Toolbar>
        <TextField
          placeholder="Search or start new chat"
          variant="outlined"
          size="small"
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.id}
              selected={selectedChat.id === chat.id}
              onClick={() => setSelectedChat(chat)}
            >
              <ListItemAvatar>
                <Avatar src={chat.avatar} alt={chat.name} />
              </ListItemAvatar>
              <ListItemText primary={chat.name} secondary={chat.lastMessage} />
            </ListItem>
          ))}
        </List>
        </Box>
      {/*</Drawer>*/}
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Avatar src={selectedChat.avatar} alt={selectedChat.name} sx={{ marginRight: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {selectedChat.name}
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="menu">
              <MoreVertIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, backgroundColor: '#e5ded8' }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  backgroundColor: message.sender === 'You' ? '#dcf8c6' : '#fff',
                  borderRadius: 2,
                  p: 1,
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                  {message.timestamp}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, backgroundColor: '#f0f0f0' }}>
          <TextField
            fullWidth
            placeholder="Type a message"
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="end" color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}