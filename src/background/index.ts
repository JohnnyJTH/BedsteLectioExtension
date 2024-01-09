import { runtime, tabs } from 'webextension-polyfill';

const { version } = runtime.getManifest();

runtime.onInstalled.addListener(({ reason }) => {
    switch (reason) {
        case 'install':
            tabs.create({ url: 'https://johnnyjth.com/bedstelectio/welcome' });
            break;
        case 'update':
            tabs.create({ url: `https://johnnyjth.com/bedstelectio/updated?v=${version}` });
            break;
    }
});
