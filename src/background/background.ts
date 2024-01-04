const startingHour = 10;

function generateTimes(count) {
  const now = new Date();

  now.setHours(startingHour + count, 24, 0, 0);
  return now.getTime();
}

function tomorrowAtMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

function main() {
  chrome.alarms.create('reset', {
    when: tomorrowAtMidnight(),
    periodInMinutes: 24 * 60,
  });

  chrome.storage.sync.get(['hours', 'completed', 'reset'], (res) => {
    for (let i = 0; i < res.hours; i++) {
      chrome.alarms.create(`popup_${i}`, {
        when: generateTimes(i),
        periodInMinutes: 24 * 60,
      });
    }
  });
}

function handleReset() {
  chrome.storage.sync.get(['hours', 'completed', 'reset'], (res) => {
    if (Object.keys(res).length === 0) {
      return;
    }

    if (!res.reset) {
      chrome.storage.sync.set(
        {
          hours: res.hours,
          completed: Array(res.hours).fill({ done: false, open: false }),
          reset: true,
        },
        () => {}
      );
    }
  });
}

function handlePopup(index) {
  chrome.storage.sync.get(['hours', 'completed', 'reset'], (res) => {
    if (Object.keys(res).length === 0) {
      return;
    }

    if (index < 0 || index > res.completed.length - 1) return;

    if (!res.completed[index].open) {
      chrome.windows.create(
        {
          url: 'options.html',
          type: 'popup',
          width: 500,
          height: 500,
          top: index * 10,
        },
        () => {
          chrome.storage.sync.set(
            {
              hours: res.hours,
              completed: res.completed.map((item, idx) =>
                index === idx ? { ...item, open: true } : { ...item }
              ),
              reset: res.reset,
            },
            () => {}
          );
        }
      );
    }
  });
}

function removeWindow(windowId) {
  chrome.windows.remove(windowId);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'reset') {
    handleReset();
  } else if (alarm.name.includes('popup')) {
    const index = +alarm.name.split('_')[1];
    handlePopup(index);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action === 'callMain') {
    main();
  }
  if (request.action === 'removeWindow') {
    removeWindow(sender.tab.windowId);
  }
});
