const tabs = [
  {
    title: 'Home',
    path: '/',
    icon: require('/public/icons/home-outline.svg'),
    activeIcon: require('/public/icons/home.svg'),
  },
  {
    title: 'Explore',
    path: '/explore',
    icon: require('/public/icons/explore-outline.svg'),
    activeIcon: require('/public/icons/explore.svg'),
  },
  {
    title: 'Notifications',
    path: '/notifications',
    icon: require('/public/icons/notifications-outline.svg'),
    activeIcon: require('/public/icons/notifications.svg'),
  },
  {
    title: 'Messages',
    path: '/messages',
    icon: require('/public/icons/inbox-outline.svg'),
    activeIcon: require('/public/icons/inbox.svg'),
  },
  {
    title: 'Bookmarks',
    path: '/bookmarks',
    icon: require('/public/icons/bookmark-outline.svg'),
    activeIcon: require('/public/icons/bookmark.svg'),
  },
  {
    title: 'Lists',
    path: '/lists',
    icon: require('/public/icons/list-oultine.svg'),
    activeIcon: require('/public/icons/list.svg'),
  },
  {
    title: 'Profile',
    icon: require('/public/icons/profile-outline.svg'),
    activeIcon: require('/public/icons/profile.svg'),
  },
];

export default tabs;
