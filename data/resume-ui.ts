export const SECTION_IDS = [
  'hero',
  'about',
  'experience',
  'skills',
  'projects',
  'education',
  'languages',
  'contact',
] as const

export type ResumeSectionId = (typeof SECTION_IDS)[number]

export interface ResumeUiCopy {
  languageLabel: string
  navigation: {
    siteChrome: string
    goToHero: string
    openSectionNavigation: string
    closeSectionNavigation: string
    sectionNavigation: string
    sectionsTitle: string
    current: string
    open: string
    sections: Record<ResumeSectionId, string>
  }
  hero: {
    eyebrow: string
    contactSummary: string
    primaryLinks: string
    actions: {
      github: string
      linkedin: string
      email: string
      cv: string
    }
    scrollToAbout: string
  }
  about: {
    eyebrow: string
    title: string
    professionalSummary: string
    keyDifferentiators: string
    stats: {
      years: string
      companies: string
      certification: string
    }
    cards: {
      certified: string
      fullStack: string
      fullStackTitle: string
      multilingual: string
      multilingualTitle: string
      cleanArchitecture: string
      architectureTitle: string
      highlightedTech: string
      certificationUnavailable: string
      openCredential: string
    }
  }
  experience: {
    eyebrow: string
    title: string
    current: string
    jobLabel: string
  }
  skills: {
    eyebrow: string
    title: string
    summary: string
    stats: {
      years: string
      coreSkills: string
      categories: string
    }
    core: string
  }
  projects: {
    eyebrow: string
    title: string
    projectLabel: string
    view: string
    technologyStack: string
    projectPosition: string
  }
  education: {
    eyebrow: string
    title: string
    certificationUnavailable: string
    verifyCredential: string
  }
  languages: {
    eyebrow: string
    title: string
    radialChart: string
    radialChartTitle: string
    countLabel: string
    barsLabel: string
    context: string
  }
  contact: {
    eyebrow: string
    title: string
    terminal: string
    nameLabel: string
    emailLabel: string
    messageLabel: string
    submitIdle: string
    submitSending: string
    fixFields: string
    missingConfig: string
    sent: string
    failed: string
    validation: {
      nameRequired: string
      emailRequired: string
      emailInvalid: string
      messageRequired: string
    }
  }
}

const resumeUiByLanguage: Record<string, ResumeUiCopy> = {
  en: {
    languageLabel: 'Language',
    navigation: {
      siteChrome: 'Site chrome',
      goToHero: 'Go to hero section',
      openSectionNavigation: 'Open section navigation',
      closeSectionNavigation: 'Close section navigation',
      sectionNavigation: 'Section navigation',
      sectionsTitle: 'Sections',
      current: 'Current',
      open: 'Open',
      sections: {
        hero: 'Hero',
        about: 'About',
        experience: 'Experience',
        skills: 'Skills',
        projects: 'Projects',
        education: 'Education',
        languages: 'Languages',
        contact: 'Contact',
      },
    },
    hero: {
      eyebrow: 'Editorial Engineering',
      contactSummary: 'Contact summary',
      primaryLinks: 'Primary links',
      actions: {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        email: 'Email',
        cv: 'CV',
      },
      scrollToAbout: 'Scroll to about section',
    },
    about: {
      eyebrow: 'Profile',
      title: 'Measured engineering, written clearly.',
      professionalSummary: 'Professional summary',
      keyDifferentiators: 'Key differentiators',
      stats: {
        years: 'Years',
        companies: 'Companies',
        certification: 'Certification',
      },
      cards: {
        certified: 'Certified',
        fullStack: 'Full-Stack',
        fullStackTitle: 'Backend depth with frontend fluency.',
        multilingual: 'Multilingual',
        multilingualTitle: 'Clear collaboration across languages.',
        cleanArchitecture: 'Clean Architecture',
        architectureTitle: 'Code quality as delivery discipline.',
        highlightedTech: 'Highlighted full-stack technologies',
        certificationUnavailable: 'Certification badge unavailable',
        openCredential: 'Open credential',
      },
    },
    experience: {
      eyebrow: 'Experience',
      title: 'Professional Experience',
      current: 'Current',
      jobLabel: 'Job',
    },
    skills: {
      eyebrow: 'Constellation',
      title: 'Technical Skills',
      summary: 'Skills summary',
      stats: {
        years: 'Years',
        coreSkills: 'Core Skills',
        categories: 'Categories',
      },
      core: 'Core',
    },
    projects: {
      eyebrow: 'Projects',
      title: 'Featured Projects',
      projectLabel: 'Project',
      view: 'View',
      technologyStack: 'Technology stack',
      projectPosition: 'Project position',
    },
    education: {
      eyebrow: 'Credentials',
      title: 'Education & Certifications',
      certificationUnavailable: 'Certification badge unavailable',
      verifyCredential: 'Verify credential',
    },
    languages: {
      eyebrow: 'Languages',
      title: 'Multilingual Communication',
      radialChart: 'Language proficiency radial chart',
      radialChartTitle: 'Language proficiency chart',
      countLabel: 'Languages',
      barsLabel: 'Language proficiency bars',
      context: 'Collaboration across Arabic, English, French, and Japanese contexts keeps technical decisions clear across teams and regions.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Terminal Contact',
      terminal: 'Terminal',
      nameLabel: 'name:',
      emailLabel: 'email:',
      messageLabel: 'message:',
      submitIdle: 'submit_',
      submitSending: 'sending_',
      fixFields: 'Fix the highlighted fields and run submit again.',
      missingConfig: 'EmailJS configuration is missing.',
      sent: '✓ Message sent successfully. Expect a reply within 24h.',
      failed: 'Message failed to send. Email directly or try again later.',
      validation: {
        nameRequired: 'Name is required.',
        emailRequired: 'Email is required.',
        emailInvalid: 'Enter a valid email address.',
        messageRequired: 'Message is required.',
      },
    },
  },
  fr: {
    languageLabel: 'Langue',
    navigation: {
      siteChrome: 'Navigation du site',
      goToHero: 'Aller à la section d’accueil',
      openSectionNavigation: 'Ouvrir la navigation des sections',
      closeSectionNavigation: 'Fermer la navigation des sections',
      sectionNavigation: 'Navigation des sections',
      sectionsTitle: 'Sections',
      current: 'Actuelle',
      open: 'Ouvrir',
      sections: {
        hero: 'Accueil',
        about: 'Profil',
        experience: 'Expérience',
        skills: 'Compétences',
        projects: 'Projets',
        education: 'Formation',
        languages: 'Langues',
        contact: 'Contact',
      },
    },
    hero: {
      eyebrow: 'Ingénierie éditoriale',
      contactSummary: 'Résumé de contact',
      primaryLinks: 'Liens principaux',
      actions: {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        email: 'E-mail',
        cv: 'CV',
      },
      scrollToAbout: 'Aller à la section profil',
    },
    about: {
      eyebrow: 'Profil',
      title: 'Une ingénierie mesurée, exprimée avec clarté.',
      professionalSummary: 'Résumé professionnel',
      keyDifferentiators: 'Différenciateurs clés',
      stats: {
        years: 'Années',
        companies: 'Entreprises',
        certification: 'Certification',
      },
      cards: {
        certified: 'Certifié',
        fullStack: 'Full-Stack',
        fullStackTitle: 'Une profondeur backend avec une vraie aisance frontend.',
        multilingual: 'Multilingue',
        multilingualTitle: 'Une collaboration claire à travers les langues.',
        cleanArchitecture: 'Architecture propre',
        architectureTitle: 'La qualité du code comme discipline de livraison.',
        highlightedTech: 'Technologies full-stack mises en avant',
        certificationUnavailable: 'Badge de certification indisponible',
        openCredential: 'Ouvrir le justificatif',
      },
    },
    experience: {
      eyebrow: 'Expérience',
      title: 'Expérience professionnelle',
      current: 'Actuel',
      jobLabel: 'Poste',
    },
    skills: {
      eyebrow: 'Constellation',
      title: 'Compétences techniques',
      summary: 'Résumé des compétences',
      stats: {
        years: 'Années',
        coreSkills: 'Compétences clés',
        categories: 'Catégories',
      },
      core: 'Clé',
    },
    projects: {
      eyebrow: 'Projets',
      title: 'Projets phares',
      projectLabel: 'Projet',
      view: 'Voir',
      technologyStack: 'Stack technique',
      projectPosition: 'Position du projet',
    },
    education: {
      eyebrow: 'Parcours',
      title: 'Formation & Certifications',
      certificationUnavailable: 'Badge de certification indisponible',
      verifyCredential: 'Vérifier la certification',
    },
    languages: {
      eyebrow: 'Langues',
      title: 'Communication multilingue',
      radialChart: 'Graphique radial du niveau de langue',
      radialChartTitle: 'Graphique du niveau de langue',
      countLabel: 'Langues',
      barsLabel: 'Barres de niveau de langue',
      context: 'La collaboration en arabe, anglais, français et japonais permet de garder les décisions techniques claires entre équipes et régions.',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Contact terminal',
      terminal: 'Terminal',
      nameLabel: 'nom :',
      emailLabel: 'e-mail :',
      messageLabel: 'message :',
      submitIdle: 'envoyer_',
      submitSending: 'envoi_',
      fixFields: 'Corrigez les champs mis en évidence puis relancez l’envoi.',
      missingConfig: 'La configuration EmailJS est manquante.',
      sent: '✓ Message envoyé avec succès. Réponse attendue sous 24h.',
      failed: 'Échec de l’envoi. Envoyez un e-mail direct ou réessayez plus tard.',
      validation: {
        nameRequired: 'Le nom est requis.',
        emailRequired: 'L’e-mail est requis.',
        emailInvalid: 'Saisissez une adresse e-mail valide.',
        messageRequired: 'Le message est requis.',
      },
    },
  },
  jp: {
    languageLabel: '言語',
    navigation: {
      siteChrome: 'サイトナビゲーション',
      goToHero: 'ヒーローセクションへ移動',
      openSectionNavigation: 'セクションナビゲーションを開く',
      closeSectionNavigation: 'セクションナビゲーションを閉じる',
      sectionNavigation: 'セクションナビゲーション',
      sectionsTitle: 'セクション',
      current: '現在',
      open: '開く',
      sections: {
        hero: '概要',
        about: 'プロフィール',
        experience: '経験',
        skills: 'スキル',
        projects: 'プロジェクト',
        education: '学歴',
        languages: '言語',
        contact: '連絡先',
      },
    },
    hero: {
      eyebrow: 'エディトリアル・エンジニアリング',
      contactSummary: '連絡先概要',
      primaryLinks: '主要リンク',
      actions: {
        github: 'GitHub',
        linkedin: 'LinkedIn',
        email: 'メール',
        cv: '履歴書',
      },
      scrollToAbout: 'プロフィールセクションへ移動',
    },
    about: {
      eyebrow: 'プロフィール',
      title: '的確なエンジニアリングを、明快な言葉で。',
      professionalSummary: '職務要約',
      keyDifferentiators: '主な強み',
      stats: {
        years: '年数',
        companies: '企業',
        certification: '認定',
      },
      cards: {
        certified: '認定',
        fullStack: 'フルスタック',
        fullStackTitle: 'バックエンドの深さとフロントエンドの実践力。',
        multilingual: '多言語対応',
        multilingualTitle: '言語をまたいでも明確に連携。',
        cleanArchitecture: 'クリーンアーキテクチャ',
        architectureTitle: 'コード品質をデリバリーの規律に。',
        highlightedTech: '注目のフルスタック技術',
        certificationUnavailable: '認定バッジを表示できません',
        openCredential: '認定情報を開く',
      },
    },
    experience: {
      eyebrow: '経験',
      title: '職務経歴',
      current: '現職',
      jobLabel: '職歴',
    },
    skills: {
      eyebrow: 'コンステレーション',
      title: '技術スキル',
      summary: 'スキル概要',
      stats: {
        years: '年数',
        coreSkills: '主要スキル',
        categories: 'カテゴリ',
      },
      core: '主要',
    },
    projects: {
      eyebrow: 'プロジェクト',
      title: '注目プロジェクト',
      projectLabel: 'プロジェクト',
      view: '表示',
      technologyStack: '技術スタック',
      projectPosition: 'プロジェクト位置',
    },
    education: {
      eyebrow: '資格・学歴',
      title: '学歴・認定',
      certificationUnavailable: '認定バッジを表示できません',
      verifyCredential: '認定を確認',
    },
    languages: {
      eyebrow: '言語',
      title: '多言語コミュニケーション',
      radialChart: '語学力の円形チャート',
      radialChartTitle: '語学力チャート',
      countLabel: '言語',
      barsLabel: '語学力バー',
      context: 'アラビア語、英語、フランス語、日本語の文脈をまたいだ協働によって、チームや地域を越えて技術判断を明確に保ちます。',
    },
    contact: {
      eyebrow: '連絡先',
      title: 'ターミナル連絡先',
      terminal: 'Terminal',
      nameLabel: '名前:',
      emailLabel: 'メール:',
      messageLabel: 'メッセージ:',
      submitIdle: '送信_',
      submitSending: '送信中_',
      fixFields: '強調表示された項目を修正してから再送してください。',
      missingConfig: 'EmailJS の設定が不足しています。',
      sent: '✓ メッセージを送信しました。24時間以内の返信を想定してください。',
      failed: '送信に失敗しました。直接メールするか、後でもう一度お試しください。',
      validation: {
        nameRequired: '名前は必須です。',
        emailRequired: 'メールアドレスは必須です。',
        emailInvalid: '有効なメールアドレスを入力してください。',
        messageRequired: 'メッセージは必須です。',
      },
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
  jp: { flag: '🇯🇵', shortLabel: 'JP' },
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
