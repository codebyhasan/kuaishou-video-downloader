// background.js - Kuaishou Video Downloader
browser.action.onClicked.addListener(() => {
  browser.tabs.create({ url: 'https://www.kuaishou.com/new-reco' });
});
