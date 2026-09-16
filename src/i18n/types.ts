export interface Dict {
  meta: { title: string; description: string };
  nav: { projects: string; story: string; skills: string; cv: string; contact: string };
  ui: {
    themeToggle: string;
    themeTitle: string;
    styleToggle: string;
    insertCoin: string;
    exitGame: string;
    achievement: string;
    footer: string;
    footerPixel: string;
    present: string;
    languageLabel: string;
    menuOpen: string;
    menuClose: string;
    mainMenu: string;
    commandOpen: string;
    commandPlaceholder: string;
    commandEmpty: string;
    commandSections: string;
    commandActions: string;
    commandTheme: string;
    commandSkin: string;
    commandLanguage: string;
    commandCopyEmail: string;
    commandCopied: string;
    profile: string;
    replayIntro: string;
    commandSnap: string;
    commandHint: string;
    switchTo: string;
  };
  hero: { lead: string; slogan: string; sub: string; ctaProjects: string; ctaContact: string };
  profile: {
    label: string;
    photoAlt: string;
    role: string;
    bio: string;
    facts: {
      role: string;
      roleValue: string;
      company: string;
      location: string;
      locationValue: string;
      stack: string;
      background: string;
      backgroundValue: string;
      status: string;
      statusValue: string;
    };
  };
  projects: {
    label: string;
    headingModern: string;
    headingPixel: string;
    featured: string;
    screenshotPlaceholder: string;
    items: { title: string; description: string }[];
  };
  story: {
    label: string;
    heading: string;
    intro: string;
    photoAlt: string;
    kindCode: string;
    kindCourt: string;
    roles: {
      itOfficer: string;
      player: string;
      consultant: string;
      intern: string;
      proPlayer: string;
    };
  };
  notFound: {
    title: string;
    description: string;
    heading: string;
    gameOver: string;
    message: string;
    home: string;
    gameInvite: string;
    score: string;
    best: string;
    start: string;
    paused: string;
    again: string;
  };
  cv: {
    title: string;
    description: string;
    heading: string;
    link: string;
    print: string;
    backToSite: string;
    experience: string;
    skills: string;
    languages: string;
    languagesValue: string;
    contact: string;
    location: string;
    locationValue: string;
    present: string;
  };
  skills: { label: string; headingModern: string; headingPixel: string; items: string[] };
  contact: {
    label: string;
    headingModern: string;
    headingPixel: string;
    intro: string;
    mail: string;
  };
}
