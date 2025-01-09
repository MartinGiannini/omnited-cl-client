import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@mui/icons-material/NotificationsNone';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import { markAsRead, markAllAsRead, removeNotification } from '../../../../store/notificationSlice';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',

  transform: 'none'
};

// ==============================|| HEADER CONTENT - NOTIFICATION ||============================== //

export default function Notification() {
  const theme = useTheme();
  const notification = useSelector(state => state.storeNotification);

  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const unreadNotification = notification.filter(notification => !notification.isRead);
  const [open, setOpen] = useState(false);
  const iconBackColorOpen = 'grey.100';

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead({ id }));
  };

  const handleRemoveNotification = (id) => {
    console.log("Voy a eliminar el id: ",id)
    dispatch(removeNotification({ id }));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const getRelativeTime = (timestamp) => {
    const notificationTime = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - notificationTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    }
    return notificationTime.toLocaleString(); // Si es más de una hora, mostrar la fecha/hora completa
  };

  const getTimeOnly = (timestamp) => {
    const notificationTime = new Date(timestamp);
    return notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Mostrar solo hora y minutos
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton color="secondary" variant="light" sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }} aria-label="open profile" ref={anchorRef} aria-controls={open ? 'profile-grow' : undefined} aria-haspopup="true" onClick={handleToggle} >
        <Badge badgeContent={unreadNotification.length} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>

      <Popper placement={matchesXs ? 'bottom' : 'bottom-end'} open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }} >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard title="Notificaciones" elevation={0} border={false} content={false} secondary={
                  <>
                    {unreadNotification.length > 0 && (
                      <Tooltip title="Mark as all read">
                        <IconButton color="success" size="small" onClick={() => handleMarkAllAsRead()}>
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                }
                >
                  <List component="nav" sx={{ p: 0, '& .MuiListItemButton-root': { py: 0.5, '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' }, '& .MuiAvatar-root': avatarSX, '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' } } }}>

                    {notification.map(notification => (
                      <React.Fragment key={notification.id}>
                      <ListItemButton key={notification.id} selected={notification.isRead}onClick={() => handleMarkAsRead(notification.id)}>
                        <ListItemAvatar>
                          <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                            <MessageOutlined />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={<Typography variant="h6" sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>{notification.message}</Typography>} secondary={getRelativeTime(notification.timestamp)} />
                        <ListItemSecondaryAction>
                          <Typography variant="caption" noWrap>{getTimeOnly(notification.timestamp)}</Typography>
                        </ListItemSecondaryAction>
                        
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveNotification(notification.id)}>
                          <DeleteOutlined />
                        </IconButton>
                      </ListItemButton>
                      <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
