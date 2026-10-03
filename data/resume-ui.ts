export const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'skills',
  'projects',
  'education',
  'contact',
] as const

export type ResumeSectionId = (typeof SECTION_IDS)[number]

/* Sections that appear in the navigation (everything except the hero). */
export const NAV_SECTION_IDS = [
  'about',
  'experience',
  'skills',
  'projects',
  'education',
  'contact',
] as const

export type NavSectionId = (typeof NAV_SECTION_IDS)[number]

export interface ResumeUiCopy {
  languageLabel: string
  hero: {
    scroll: string
    terminal: {
      role: string
      stack: string
      focus: string
      focusValue: string
      base: string
    }
  }
  a11y: {
    skipToContent: string
    openMenu: string
    closeMenu: string
    toggleTheme: string
    primaryNav: string
  }
  nav: Record<NavSectionId, string>
  actions: {
    downloadCV: string
    contactMe: string
    github: string
    linkedin: string
    email: string
    backToTop: string
    viewProject: string
    sourceCode: string
    showMore: string
    showLess: string
    viewCredential: string
    available: string
  }
  sections: {
    aboutKicker: string
    aboutTitle: string
    skillsKicker: string
    skillsTitle: string
    skillsAll: string
    experienceKicker: string
    experienceTitle: string
    projectsKicker: string
    projectsTitle: string
    projectsPersonalTitle: string
    projectsPersonalLead: string
    projectsProfessionalTitle: string
    projectsProfessionalLead: string
    educationKicker: string
    educationTitle: string
    certificationsTitle: string
    languagesTitle: string
    contactKicker: string
    contactTitlePre: string
    contactTitleAccent: string
    contactTitlePost: string
    contactLead: string
  }
  meta: {
    present: string
    highlighted: string
    role: string
    durationUnits: {
      year: string
      years: string
      month: string
      months: string
    }
  }
  footer: {
    builtWith: string
    rights: string
  }
}

const resumeUiByLanguage: Record<string, ResumeUiCopy> = {
  en: {
    languageLabel: 'Language',
    hero: {
      scroll: 'Scroll',
      terminal: { role: 'role', stack: 'stack', focus: 'focus', focusValue: 'API modernization', base: 'base' },
    },
    a11y: {
      skipToContent: 'Skip to main content',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      toggleTheme: 'Toggle theme',
      primaryNav: 'Primary',
    },
    nav: {
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      contact: 'Contact',
    },
    actions: {
      downloadCV: 'Download CV',
      contactMe: 'Contact me',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'Email',
      backToTop: 'Back to top',
      viewProject: 'View project',
      sourceCode: 'Source code',
      showMore: 'Show all achievements',
      showLess: 'Show less',
      viewCredential: 'View credential',
      available: 'Open to opportunities',
    },
    sections: {
      aboutKicker: 'Who I am',
      aboutTitle: 'About',
      skillsKicker: 'What I work with',
      skillsTitle: 'Skills & Toolbox',
      skillsAll: 'All',
      experienceKicker: "Where I've worked",
      experienceTitle: 'Experience',
      projectsKicker: 'Selected work',
      projectsTitle: 'Projects',
      projectsPersonalTitle: 'Personal & open-source',
      projectsPersonalLead:
        'Products I design, build and ship on my own time — from idea to production.',
      projectsProfessionalTitle: 'Client & company projects',
      projectsProfessionalLead:
        'Delivered for banks and insurers as part of my professional roles.',
      educationKicker: 'Background',
      educationTitle: 'Education',
      certificationsTitle: 'Certifications',
      languagesTitle: 'Languages',
      contactKicker: 'Get in touch',
      contactTitlePre: "Let's build something ",
      contactTitleAccent: 'reliable',
      contactTitlePost: '.',
      contactLead:
        "Have a role, a project, or just want to talk systems? I'm always happy to connect.",
    },
    meta: {
      present: 'Present',
      highlighted: 'Core strengths',
      role: 'Role',
      durationUnits: { year: 'yr', years: 'yrs', month: 'mo', months: 'mos' },
    },
    footer: {
      builtWith: 'Built with Nuxt 3 & Vue 3.',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    languageLabel: 'Langue',
    hero: {
      scroll: 'Défiler',
      terminal: { role: 'poste', stack: 'technologies', focus: 'priorité', focusValue: 'Modernisation des API', base: 'lieu' },
    },
    a11y: {
      skipToContent: 'Aller au contenu principal',
      openMenu: 'Ouvrir le menu',
      closeMenu: 'Fermer le menu',
      toggleTheme: 'Changer de thème',
      primaryNav: 'Principale',
    },
    nav: {
      about: 'Profil',
      skills: 'Compétences',
      experience: 'Expérience',
      projects: 'Projets',
      education: 'Formation',
      contact: 'Contact',
    },
    actions: {
      downloadCV: 'Télécharger le CV',
      contactMe: 'Me contacter',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'E-mail',
      backToTop: 'Haut de page',
      viewProject: 'Voir le projet',
      sourceCode: 'Code source',
      showMore: 'Voir toutes les réalisations',
      showLess: 'Voir moins',
      viewCredential: 'Voir la certification',
      available: 'Je suis ouvert aux opportunités',
    },
    sections: {
      aboutKicker: 'Qui je suis',
      aboutTitle: 'À propos',
      skillsKicker: 'Mes outils',
      skillsTitle: 'Compétences & outils',
      skillsAll: 'Tout',
      experienceKicker: 'Mon parcours',
      experienceTitle: 'Expérience',
      projectsKicker: 'Travaux sélectionnés',
      projectsTitle: 'Projets',
      projectsPersonalTitle: 'Projets personnels & open source',
      projectsPersonalLead:
        'Je conçois, développe et mets en production ces produits sur mon temps libre — de l\'idée à la production.',
      projectsProfessionalTitle: 'Projets clients & entreprise',
      projectsProfessionalLead:
        'Je contribue à ces projets pour des banques et des assureurs dans le cadre de mes fonctions.',
      educationKicker: 'Parcours',
      educationTitle: 'Formation',
      certificationsTitle: 'Certifications',
      languagesTitle: 'Langues',
      contactKicker: 'Contact',
      contactTitlePre: 'Construisons quelque chose de ',
      contactTitleAccent: 'fiable',
      contactTitlePost: '.',
      contactLead:
        "Un poste, un projet, ou simplement envie d'échanger sur l'architecture ? Je suis toujours ravi d'échanger.",
    },
    meta: {
      present: 'À ce jour',
      highlighted: 'Atouts principaux',
      role: 'Poste',
      durationUnits: { year: 'an', years: 'ans', month: 'mois', months: 'mois' },
    },
    footer: {
      builtWith: 'Je développe ce site avec Nuxt 3 et Vue 3.',
      rights: 'Tous droits réservés.',
    },
  },
  jp: {
    languageLabel: '言語',
    hero: {
      scroll: 'スクロール',
      terminal: { role: '職種', stack: '技術', focus: '注力分野', focusValue: 'APIの刷新', base: '拠点' },
    },
    a11y: {
      skipToContent: '本文へスキップ',
      openMenu: 'メニューを開く',
      closeMenu: 'メニューを閉じる',
      toggleTheme: 'テーマを切り替え',
      primaryNav: 'メイン',
    },
    nav: {
      about: 'プロフィール',
      skills: 'スキル',
      experience: '経験',
      projects: 'プロジェクト',
      education: '学歴',
      contact: '連絡先',
    },
    actions: {
      downloadCV: '職務経歴書をダウンロード',
      contactMe: 'お問い合わせ',
      github: 'GitHub',
      linkedin: 'LinkedIn',
      email: 'メール',
      backToTop: 'トップへ戻る',
      viewProject: 'プロジェクトを見る',
      sourceCode: 'ソースコード',
      showMore: 'すべての実績を表示',
      showLess: '閉じる',
      viewCredential: '認定を確認',
      available: '新しい機会を歓迎',
    },
    sections: {
      aboutKicker: '私について',
      aboutTitle: '概要',
      skillsKicker: '使用技術',
      skillsTitle: 'スキル & ツールボックス',
      skillsAll: 'すべて',
      experienceKicker: '職歴',
      experienceTitle: '経験',
      projectsKicker: '代表的な実績',
      projectsTitle: 'プロジェクト',
      projectsPersonalTitle: '個人・オープンソース',
      projectsPersonalLead:
        '業務外の時間に、企画から本番リリースまで自ら設計・開発しているプロダクト。',
      projectsProfessionalTitle: '顧客・業務プロジェクト',
      projectsProfessionalLead:
        '銀行・保険会社向けに、業務の一環として担当したプロジェクト。',
      educationKicker: '経歴',
      educationTitle: '学歴',
      certificationsTitle: '認定資格',
      languagesTitle: '言語',
      contactKicker: 'お問い合わせ',
      contactTitlePre: '',
      contactTitleAccent: '信頼できるもの',
      contactTitlePost: 'を一緒に作りましょう。',
      contactLead:
        'ポジション、プロジェクト、あるいは技術の話でも —— お気軽にご連絡ください。',
    },
    meta: {
      present: '現在',
      highlighted: '主要な強み',
      role: '職務',
      durationUnits: { year: '年', years: '年', month: 'ヶ月', months: 'ヶ月' },
    },
    footer: {
      builtWith: 'Nuxt 3 と Vue 3 で構築。',
      rights: '無断転載を禁じます。',
    },
  },
}

export const languageNativeLabels: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  jp: '日本語',
}

export const languageVisuals: Record<string, { flag: string; shortLabel: string }> = {
  en: { flag: '🇬🇧', shortLabel: 'EN' },
  fr: { flag: '🇫🇷', shortLabel: 'FR' },
  jp: { flag: '🇯🇵', shortLabel: 'JA' },
}

export const normalizeUiLanguageCode = (languageCode?: string | null) => {
  const normalized = languageCode?.toLowerCase() ?? 'en'

  if (normalized === 'ja') {
    return 'jp'
  }

  return normalized
}

export const getResumeUiCopy = (languageCode?: string | null) => {
  const normalized = normalizeUiLanguageCode(languageCode)

  return resumeUiByLanguage[normalized] ?? resumeUiByLanguage.en
}
