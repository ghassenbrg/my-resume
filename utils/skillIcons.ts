import type { IconifyIcon } from '@iconify/types'
import java from '@iconify-icons/devicon/java'
import spring from '@iconify-icons/devicon/spring'
import hibernate from '@iconify-icons/devicon/hibernate'
import angular from '@iconify-icons/devicon/angular'
import vuejs from '@iconify-icons/devicon/vuejs'
import nuxtjs from '@iconify-icons/devicon/nuxtjs'
import typescript from '@iconify-icons/devicon/typescript'
import javascript from '@iconify-icons/devicon/javascript'
import nodejs from '@iconify-icons/devicon/nodejs'
import html5 from '@iconify-icons/devicon/html5'
import css3 from '@iconify-icons/devicon/css3'
import rxjs from '@iconify-icons/devicon/rxjs'
import postgresql from '@iconify-icons/devicon/postgresql'
import mysql from '@iconify-icons/devicon/mysql'
import oracle from '@iconify-icons/devicon/oracle'
import mongodb from '@iconify-icons/devicon/mongodb'
import apachekafka from '@iconify-icons/devicon/apachekafka'
import googlecloud from '@iconify-icons/devicon/googlecloud'
import githubactions from '@iconify-icons/devicon/githubactions'
import docker from '@iconify-icons/devicon/docker'
import jenkins from '@iconify-icons/devicon/jenkins'
import gitlab from '@iconify-icons/devicon/gitlab'
import nginx from '@iconify-icons/devicon/nginx'
import tomcat from '@iconify-icons/devicon/tomcat'
import linux from '@iconify-icons/devicon/linux'
import junit from '@iconify-icons/devicon/junit'
import sonarqube from '@iconify-icons/devicon/sonarqube'
import jira from '@iconify-icons/devicon/jira'
import git from '@iconify-icons/devicon/git'
import confluence from '@iconify-icons/devicon/confluence'
import openapi from '@iconify-icons/devicon/openapi'
// Brand logos not in the devicon set (still offline objects → SSR-rendered).
import kubernetes from '@iconify-icons/logos/kubernetes'
import aws from '@iconify-icons/logos/aws'

/**
 * Maps a skill's `icon` key (from cv-data-*.json) to a brand icon.
 * - All icons are offline objects (devicon + logos packages), so they render
 *   inline SVG during SSR — no network/API dependency, no client pop-in.
 * - Unmapped keys (helidon, jpa, primeng, keycloak, …) return null → text chip.
 */
const SKILL_ICONS: Record<string, IconifyIcon> = {
  java,
  javaee: java,
  spring,
  springcloud: spring,
  hibernate,
  angular,
  vuejs,
  nuxtjs,
  typescript,
  javascript,
  node: nodejs,
  html: html5,
  css: css3,
  rxjs,
  postgres: postgresql,
  mysql,
  oracle,
  mongodb,
  kafka: apachekafka,
  gcp: googlecloud,
  gke: googlecloud,
  githubactions,
  docker,
  jenkins,
  gitlab,
  nginx,
  tomcat,
  linux,
  junit,
  sonarqube,
  jira,
  git,
  confluence,
  openapi,
  api: openapi,
  // Not in the devicon set — sourced from the offline "logos" package.
  kubernetes,
  aws,
  // keycloak has no brand logo in either offline set, so it degrades to a
  // text-only chip (same as the other unmapped niche skills).
}

export const skillIcon = (key?: string): IconifyIcon | null => {
  if (!key) {
    return null
  }

  return SKILL_ICONS[key] ?? null
}
