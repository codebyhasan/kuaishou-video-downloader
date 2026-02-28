// background.js - Kuaishou Video Downloader
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: 'https://www.kuaishou.com/new-reco' });
});
