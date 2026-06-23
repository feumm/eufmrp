/*
 * packs.js — Pack data
 */

const SITE_URL = '';
const DISCORD_INVITE_CODE = 'vUFtkJWYPa';

const CDN = 'https://cdn.jsdelivr.net/gh/feumm/feumrp@main/';

const CREATORS = [
  {
    id: 'feum',
    name: 'feum',
    avatar: CDN + 'images/avatars/uua.png',
    aliases: ['feum', 'uua'],
    isPremium: true
  },
  {
    id: 'aeecii',
    name: 'aeecii',
    avatar: CDN + 'images/avatars/aeecii.png',
    aliases: ['aeecii'],
    isPremium: false
  },
  {
    id: 'zlata',
    name: 'zlata',
    avatar: CDN + 'images/avatars/zlata.png',
    aliases: ['zlata'],
    isPremium: false
  }
];

const PACKS = [
  {
    id: 'new-greatest',
    slug: 'new-greatest',
    title: 'Definition of Goat',
    author: 'uua',
    authorAvatar: CDN + 'images/avatars/uua.png',
    description: '',
    resolution: '',
    tags: ['pvp', ''],
    cover: CDN + 'images/covers/newgreatest.jpg',
    screenshots: [
      CDN + 'images/covers/newgreatest.jpg',
    ],
    youtubeEmbed: 'https://www.youtube.com/embed/SV8k8vHmU2M',
    packFolder: [
      { name: 'eufmcold',    downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/eufmcold.mcpack' },
      { name: 'feumault',      downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/feumault.mcpack' },
      { name: 'feumint',    downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/feumint.mcpack' },
    ],

    hiddenFromBrowse: true,  // hides from the browse grid; still shows on home featured & direct URL
    featured: true,
    dateAdded: '2026-05-25',
  },
  {
    id: 'aeecii-1k',
    slug: 'aeecii-1k',
    title: 'Aeecii 1K',
    author: 'Aeecii',
    authorAvatar: CDN + 'images/avatars/aeecii.png',
    description: '',
    resolution: '1K',
    tags: ['', ''],
    cover: CDN + 'images/covers/aeecii-1k.png',
    screenshots: [
      CDN + 'images/covers/aeecii-1k.png',
    ],
    youtubeEmbed: 'https://www.youtube.com/embed/a4Tt7ds7mMs',
    downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/aeecii_1k.mcpack',
    featured: true,
    dateAdded: '2026-05-20',
  },
  {
    id: 'zlata-4k',
    slug: 'zlata-4k',
    title: 'Zlata 4K',
    author: 'Zlata',
    authorAvatar: CDN + 'images/avatars/zlata.png',
    description: '',
    resolution: '4K',
    tags: ['', ''],
    cover: CDN + 'images/covers/zlata4k.png',
    screenshots: [
      CDN + 'images/covers/zlata4k.png',
    ],
    youtubeEmbed: 'https://www.youtube.com/embed/pm5599FcNk4',
    downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/Sapphire_Days_4k.mcpack',
    featured: true,
    dateAdded: '2026-05-20',
  },
  {
    id: 'zlata-5k',
    slug: 'zlata-5k',
    title: 'Zlata 5K',
    author: 'Zlata',
    authorAvatar: CDN + 'images/avatars/zlata.png',
    description: '',
    resolution: '5K',
    tags: ['', ''],
    cover: CDN + 'images/covers/zlata5k.png',
    screenshots: [
      CDN + 'images/covers/zlata5k.png',
    ],
    youtubeEmbed: 'https://www.youtube.com/embed/zUkjEsC4UHg',
    downloadFile: 'https://github.com/feumm/feumrp/raw/main/packs/zlata_5k.mcpack',
    featured: true,
    dateAdded: '2026-05-20',
  },
  {
    id: 'century',
    slug: 'century',
    title: 'Century',
    author: 'feum',
    authorAvatar: CDN + 'images/avatars/uua.png',
    description: '',
    resolution: '',
    tags: ['', ''],
    cover: CDN + 'images/covers/century.png',
    screenshots: [
      CDN + 'images/covers/century.png',
    ],
    youtubeEmbed: 'https://www.youtube.com/embed/h3iN58X-knU',

    // Pack folder — shown as a popup instead of a single download button.
    // Each entry uses either:
    //   downloadFile: '...'  → direct file download (CDN link or GitHub raw)
    //   downloadUrl:  '...'  → opens external site in a new tab (Mediafire, Gumroad, etc.)
    packFolder: [
      { name: 'HAXOR',    downloadUrl: 'https://www.mediafire.com/file/wtl5pycvipd2f7a/HAXOR.mcpack/file' },
      { name: 'Some Random Default',      downloadUrl: 'https://www.mediafire.com/file/s5w8geikowrhwqb/some_random_default.mcpack/file' },
      { name: 'Simply Cubed',    downloadUrl: 'https://www.mediafire.com/file/n6htxzw91huxmi8/Simply_Cubed.mcpack/file' },
      { name: 'Meowuh',    downloadUrl: 'https://www.mediafire.com/file/5ob3k3vv3hjtdsr/meowuh_zyzui_edit.mcpack/file' },
      { name: 'Xero BlackPink',    downloadUrl: 'https://www.mediafire.com/file/1tqfdi4jj14mkou/xero_blackpink.mcpack/file' },
    ],

    hiddenFromBrowse: true,  // hides from the browse grid; still shows on home featured & direct URL
    featured: true,
    dateAdded: '2026-06-22',
  },
];
