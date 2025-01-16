import { useState, useEffect } from 'react';

const VERSION = '1.5.9';
const VERSION_KEY = 'last_version_seen';

export function useVersionPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lastVersionSeen = localStorage.getItem(VERSION_KEY);
    if (lastVersionSeen !== VERSION) {
      setShowPopup(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(VERSION_KEY, VERSION);
    setShowPopup(false);
  };

  return { showPopup, handleClose };
}