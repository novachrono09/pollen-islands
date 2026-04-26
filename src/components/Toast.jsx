import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Toast = forwardRef((props, ref) => {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    show: (message) => {
      setMsg(message);
      setShow(true);
      setTimeout(() => setShow(false), 1800);
    }
  }));

  return (
    <div id="toast" className={`toast ${show ? 'show' : ''}`}>
      {msg}
    </div>
  );
});

export default Toast;