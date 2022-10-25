const registerAutoSyncSW = () => {
  const register = async () => {
    if (!navigator.serviceWorker) return;
    return navigator.serviceWorker
      .register("/autoSync.sw.js")
      .then((registration) => {
        console.log("sw is registered!");
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker)
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed") {
                alert("Actualizacion instalada.");
                window.location.reload();
              }
            };
        };
      });
  };

  register().catch(console.log);
};

export default registerAutoSyncSW;
