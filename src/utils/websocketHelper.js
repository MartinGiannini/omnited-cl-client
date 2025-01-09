let sendMessageFn = null;

export const setSendMessageFn = (fn) => {
  sendMessageFn = fn;
};

export const getSendMessageFn = () => sendMessageFn;