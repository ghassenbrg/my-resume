<script lang="ts">
import { defineComponent, h } from 'vue'

/* Skill-category glyphs (simple geometric line icons).
 * Ported from the design's catGlyph(). Looked up by the category name as it
 * appears in each cv-data-{lang}.json, so adding or reordering categories never
 * shifts icons. Unknown names render a neutral circle. */

type GlyphChild = [tag: string, attrs: Record<string, string | number>]

const GLYPHS: Record<string, GlyphChild[]> = {
  // Backend & Full-Stack Development
  backend: [['path', { d: 'M8 6 3 12l5 6M16 6l5 6-5 6M13 4l-2 16' }]],
  // Database & Data Processing
  database: [
    ['ellipse', { cx: 12, cy: 6, rx: 7, ry: 3 }],
    ['path', { d: 'M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3' }],
  ],
  // API Development
  api: [
    ['path', { d: 'M4 12h4M16 12h4' }],
    ['circle', { cx: 12, cy: 12, r: 4 }],
  ],
  // Microservices & Event-Driven Systems
  microservices: [
    ['circle', { cx: 6, cy: 6, r: 2.4 }],
    ['circle', { cx: 18, cy: 6, r: 2.4 }],
    ['circle', { cx: 12, cy: 18, r: 2.4 }],
    ['path', { d: 'M7.6 7.6 10.6 16M16.4 7.6 13.4 16M8 6h8' }],
  ],
  // DevOps & Infrastructure
  devops: [
    ['circle', { cx: 12, cy: 12, r: 3 }],
    ['path', { d: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6 7.7 7.7M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1' }],
  ],
  // Testing & Code Quality
  testing: [['path', { d: 'm4 13 5 5L20 6' }]],
  // Security
  security: [
    ['path', { d: 'M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z' }],
    ['path', { d: 'm9 12 2 2 4-4' }],
  ],
  // High-Performance Computing
  performance: [['path', { d: 'M13 3 4 14h7l-1 7 9-11h-7z' }]],
  // Agile & Collaboration
  agile: [
    ['path', { d: 'M3 12a9 9 0 0 1 15-6.7M21 12a9 9 0 0 1-15 6.7' }],
    ['path', { d: 'M17 4v4h-4M7 20v-4h4' }],
  ],
  // Mobile, Desktop & Browser
  mobile: [
    ['rect', { x: 7, y: 3, width: 10, height: 18, rx: 2 }],
    ['path', { d: 'M11 17.5h2' }],
  ],
  // AI & Agent Tooling
  ai: [['path', { d: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z' }]],
}

/* Category name (en / fr / ja) → glyph key. */
const GLYPH_KEY_BY_NAME: Record<string, string> = {
  'Java Application Engineering': 'backend',
  'Ingénierie applicative Java': 'backend',
  'Javaアプリケーション開発': 'backend',
  'Cloud Delivery & CI/CD': 'devops',
  'Déploiement cloud & CI/CD': 'devops',
  'クラウド・CI/CD': 'devops',
  'Performance & Observability': 'performance',
  'Performance & observabilité': 'performance',
  '性能・可観測性': 'performance',
  'Data & Messaging': 'database',
  'Données & messagerie': 'database',
  'データ・メッセージング': 'database',
  'Frontend, Mobile & Browser': 'mobile',
  'Front-end, mobile & navigateur': 'mobile',
  'フロントエンド・モバイル・ブラウザ': 'mobile',
  'Quality & Security': 'security',
  'IA & outils d’agents': 'ai',
  'Qualité & sécurité': 'security',
  '品質・セキュリティ': 'security',
  "品質・セキュリティ・ツール": 'testing',
  "API・メッセージング": 'api',
  "モバイル・ブラウザ": 'mobile',
  "Qualité, sécurité & outils": 'testing',
  "API & Messagerie": 'api',
  "Mobile & Navigateur": 'mobile',
  "Quality, Security & Tools": 'testing',
  "APIs & Messaging": 'api',
  "Mobile & Browser": 'mobile',
  'Backend & Full-Stack Development': 'backend',
  'Développement Backend & Full-Stack': 'backend',
  'バックエンド・フルスタック開発': 'backend',
  'Mobile, Desktop & Browser': 'mobile',
  'Mobile, Desktop & Navigateur': 'mobile',
  'モバイル・デスクトップ・ブラウザ': 'mobile',
  'AI & Agent Tooling': 'ai',
  "IA & Outils d'agents": 'ai',
  'AI・エージェントツール': 'ai',
  'Database & Data Processing': 'database',
  'Base de données & Traitement des données': 'database',
  'データベース・データ処理': 'database',
  'API Development': 'api',
  "Développement d'API": 'api',
  'API開発': 'api',
  'Microservices & Event-Driven Systems': 'microservices',
  'Microservices & Systèmes événementiels': 'microservices',
  'マイクロサービス・イベント駆動システム': 'microservices',
  'DevOps & Infrastructure': 'devops',
  'DevOps・インフラ': 'devops',
  'Testing & Code Quality': 'testing',
  'Tests & Qualité du code': 'testing',
  'テスト・コード品質': 'testing',
  'Security': 'security',
  'Sécurité': 'security',
  'セキュリティ': 'security',
  'High-Performance Computing': 'performance',
  'Calcul haute performance': 'performance',
  '高性能コンピューティング': 'performance',
  'Agile & Collaboration': 'agile',
  'アジャイル・コラボレーション': 'agile',
}

const FALLBACK: GlyphChild[] = [['circle', { cx: 12, cy: 12, r: 6 }]]

export default defineComponent({
  name: 'SkillGlyph',
  props: {
    category: { type: String, default: '' },
    size: { type: Number, default: 18 },
  },
  render() {
    const children = GLYPHS[GLYPH_KEY_BY_NAME[this.category] ?? ''] ?? FALLBACK

    return h(
      'svg',
      {
        width: this.size,
        height: this.size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.6,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'aria-hidden': 'true',
      },
      children.map(([tag, attrs]) => h(tag, attrs)),
    )
  },
})
</script>
