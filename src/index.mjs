import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillDirectory = resolve(packageRoot, 'skills', 'zuiqiang-shifu-v3')
const skillPath = resolve(skillDirectory, 'SKILL.md')
const skillSource = readFileSync(skillPath, 'utf8')
const frontmatter = skillSource.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

if (frontmatter === null) throw new Error('dsh-plugin-biandao: SKILL.md must contain YAML frontmatter')

const scalar = (key) => {
  const match = frontmatter[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (match === null || match[1].trim().length === 0) {
    throw new Error(`dsh-plugin-biandao: SKILL.md is missing ${key}`)
  }
  const value = match[1].trim()
  // 本技能的 description 在 frontmatter 里是带双引号的 YAML 标量，注册前去掉外层引号
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value
}

const skill = Object.freeze({
  name: scalar('name'),
  description: scalar('description'),
  source: 'bundled',
  provider: 'zuiqiang-shifu-v3',
  resourceBase: Object.freeze({ kind: 'directory', path: skillDirectory }),
  path: skillPath,
  content: frontmatter[2].trim(),
})

export const name = 'dsh-plugin-biandao'
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.register(skill)
}
