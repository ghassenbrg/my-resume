import { motion } from "framer-motion";
import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BsDatabaseFill } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import {
  FaAngular,
  FaAws,
  FaBuilding,
  FaCloud,
  FaDocker,
  FaGitAlt,
  FaJava,
  FaNode,
  FaReact,
  FaServer,
  FaTools
} from "react-icons/fa";
import { FaJenkins } from "react-icons/fa6";
import { FiLink, FiMonitor } from "react-icons/fi";
import { GiSprint } from "react-icons/gi";
import { GrTest } from "react-icons/gr";
import { HiOutlineChartBar, HiOutlineDocumentText } from "react-icons/hi";
import { IoCodeWorking } from "react-icons/io5";
import { LuCupSoda } from "react-icons/lu";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { RiLoopRightFill } from "react-icons/ri";
import {
  SiApachetomcat,
  SiConfluence,
  SiCss3,
  SiHibernate,
  SiHtml5,
  SiJavascript,
  SiJira,
  SiJunit5,
  SiKeycloak,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNginx,
  SiOracle,
  SiPostgresql,
  SiPrimeng,
  SiSonarqube,
  SiSpring,
  SiTestinglibrary,
  SiTypescript,
} from "react-icons/si";
import { TbSettingsAutomation } from "react-icons/tb";

// 🧠 Icon Map
const skillIcons = {
  java: FaJava,
  spring: SiSpring,
  angular: FaAngular,
  react: FaReact,
  node: FaNode,
  typescript: SiTypescript,
  javascript: SiJavascript,
  docker: FaDocker,
  aws: FaAws,
  git: FaGitAlt,
  mongodb: SiMongodb,
  postgres: SiPostgresql,
  mysql: SiMysql,
  html: SiHtml5,
  css: SiCss3,
  junit: SiJunit5,
  jira: SiJira,
  confluence: SiConfluence,
  linux: SiLinux,
  tomcat: SiApachetomcat,
  sonarqube: SiSonarqube,
  nginx: SiNginx,
  testing: SiTestinglibrary,
  hibernate: SiHibernate,
  primeng: SiPrimeng,
  jenkins: FaJenkins,
  test: GrTest,
  coding: IoCodeWorking,
  keycloak: SiKeycloak,
  wildfly: FaServer,
  mockito: LuCupSoda,
  api: FiLink,
  openapi: HiOutlineDocumentText,
  rxjs: TbSettingsAutomation,
  ngrx: RiLoopRightFill,
  jpa: BsDatabaseFill,
  springcloud: FaCloud,
  activemq: MdOutlineForwardToInbox,
  async: AiOutlineClockCircle,
  threads: CgWorkAlt,
  jprofiler: FiMonitor,
  poi: HiOutlineChartBar,
  scrum: GiSprint,
  javaee: FaBuilding,
  gitlab: FaGitAlt,
  oracle: SiOracle
  // ➕ add more mappings if needed
};

const Skills = ({ darkMode, cvData }) => {
  const allCategories = Object.entries(cvData.skills || {});
  const highlightSkills = allCategories.flatMap(([_, skills]) =>
    skills.filter((s) => s.highlight)
  );

  return (
    <section
      id="skills"
      className={`py-20 transition-colors duration-500 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Title */}
        <motion.h2
          className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <FaTools className="text-indigo-600  w-6 h-6" />
          My <span className="text-indigo-600">Skills</span>
        </motion.h2>

        {/* 🔹 Highlighted Skills */}
        {highlightSkills.length > 0 && (
          <motion.div
            className="mb-12 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {highlightSkills.map((skill, i) => {
              const Icon = skillIcons[skill.icon];
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-700 text-indigo-700 dark:text-indigo-100 font-semibold text-sm px-4 py-2 rounded-full shadow-sm"
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {skill.name}
                </span>
              );
            })}
          </motion.div>
        )}

        {/* 🔸 Categorized Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allCategories.map(([category, skills], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className={`p-6 rounded-xl shadow-md transition ${
                darkMode ? "bg-slate-800" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold mb-4 text-indigo-600">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`text-sm px-3 py-1 rounded-full font-medium inline-flex items-center gap-2 ${
                      darkMode
                        ? "bg-slate-700 text-slate-100"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {skillIcons[skill.icon] &&
                      React.createElement(skillIcons[skill.icon], {
                        className: "w-4 h-4",
                      })}
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
