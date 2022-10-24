const registerAutoSyncSW = () => {
  const register = async () => {
    if (!navigator.serviceWorker) return;
    return navigator.serviceWorker.register("/autoSync.sw.js");
  };

  register().catch(console.log);
};

export default registerAutoSyncSW;
