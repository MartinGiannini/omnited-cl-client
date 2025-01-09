// assets
import { WhatsApp, SignalWifi0Bar, Phone, ChatBubble } from '@mui/icons-material';

// icons
const icons = {
  WhatsApp,
  SignalWifi0Bar,
  Phone,
  ChatBubble
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const operacion = {
  id: 'operacion',
  title: 'Operación',
  type: 'group',
  children: [
    {
      id: 'WhatsApp',
      title: 'WhatsApp',
      type: 'item',
      url: '/whatsapp',
      icon: icons.WhatsApp
    },
    {
      id: 'Signal',
      title: 'Signal',
      type: 'item',
      url: '/Signal',
      icon: icons.SignalWifi0Bar
    },
    {
      id: 'Telefonia',
      title: 'Telefonia',
      type: 'item',
      url: '/Phone',
      icon: icons.Phone
    },
    {
      id: 'Chat',
      title: 'Chat',
      type: 'item',
      url: '/Chat',
      icon: icons.ChatBubble
    },
    /*
    EJEMPLO PARA OPCION DEL MENU a LINK EXTERNO
    {
      id: 'documentation',
      title: 'Documentation',
      type: 'item',
      url: 'https://codedthemes.gitbook.io/mantis/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true
    }
    */
  ]
};

export default operacion;
