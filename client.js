window.__ModuleLoader__.load({
  id: 'dsh-plugin-biandao',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState } = React;

    const NS = 'biandao';

    const ZH = {
      tab: '编导',
      title: '编导',
      intro: '短视频编导技能包：选题、标题、开头、爆款口播、深度稿、IP 故事、涨粉、变现、避坑，再加马师傅改句子——说清你要什么，它只派一个对口模块把活干透。',
      step1t: '一、先过选题',
      step1d: '先定方向：没选题走选题引擎出短名单；方向有了、只缺对外标题，走标题实验室。',
      step2t: '二、唯一负责人干活',
      step2d: '一次只选一个模块当 owner，最多再带一个增强，按模块写明的步骤走，不跳步。',
      step3t: '三、AI 味终检',
      step3d: '成稿交付前过一遍去 AI 味终检；口播稿再做一遍真人润色，才出声读。',
      groupMain: '主簇 · 八大集群',
      groupNarrow: '窄模块 · 只补一个窄缺口',
      groupMa: '马师傅模块 · 改句子与卖货',
      copyQ: '复制提问',
      copied: '已复制',
      footer: '这个面板只是模块地图和提问入口：点「复制提问」把示例粘贴到对话里发出去，真正的活由技能在对话里干。'
    };
    const EN = {
      tab: 'Biandao',
      title: 'Biandao',
      intro: 'A short-video directing skill pack: topics, titles, openings, viral talking-head scripts, deep-dive drafts, IP stories, growth, monetization and pitfall checks, plus sentence-level polishing — say what you need and exactly one specialist module owns the job.',
      step1t: '1 · Topics first',
      step1d: 'Set the direction first: no topic yet → Topic Engine; topic set but no public title → Title Lab.',
      step2t: '2 · One owner module',
      step2d: 'Exactly one module owns the delivery, with at most one enhancer, and its written steps are never skipped.',
      step3t: '3 · AI-tone check',
      step3d: 'Every draft passes the anti-AI-tone final check before delivery; spoken scripts get a human-touch polish on top.',
      groupMain: 'Core clusters',
      groupNarrow: 'Narrow modules',
      groupMa: 'Ma Shifu modules',
      copyQ: 'Copy prompt',
      copied: 'Copied',
      footer: 'This panel is only a module map and an entry point: copy a prompt, paste it into the conversation, and the skill does the real work there.'
    };

    let currentT = (k) => (ZH[k] || k);
    function useT() { return currentT; }

    const INK = '#16181d', MUTED = '#6b7280', LINE = '#e6e8ee', SOFT = '#f6f7fa', BRAND = '#2563eb';

    const S = {
      wrap: { padding: '22px 26px 30px', maxWidth: '1080px', margin: '0 auto' },
      h1: { fontSize: '17px', fontWeight: 700, color: INK, marginBottom: '4px' },
      sub: { fontSize: '13px', color: MUTED, marginBottom: '16px', lineHeight: 1.7 },
      steps: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' },
      step: { flex: '1 1 240px', border: `1px solid ${LINE}`, borderRadius: '12px', padding: '12px 14px', background: SOFT, boxSizing: 'border-box' },
      stepT: { fontSize: '14px', fontWeight: 600, color: INK, marginBottom: '4px' },
      stepD: { fontSize: '12px', color: MUTED, lineHeight: 1.7 },
      h2: { fontSize: '15px', fontWeight: 700, color: INK, margin: '20px 0 10px' },
      grid: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
      card: { flex: '1 1 300px', border: `1px solid ${LINE}`, borderRadius: '12px', padding: '14px 16px', background: '#fff', boxSizing: 'border-box' },
      cardName: { fontSize: '14px', fontWeight: 600, color: INK, marginBottom: '4px' },
      cardDesc: { fontSize: '12px', color: MUTED, lineHeight: 1.7, marginBottom: '10px' },
      exBox: { fontSize: '13px', color: INK, lineHeight: 1.7, background: SOFT, borderRadius: '9px', padding: '9px 11px' },
      ghost: { padding: '8px 14px', borderRadius: '9px', border: `1px solid ${LINE}`, background: '#fff', color: INK, fontSize: '13px', cursor: 'pointer' },
      footer: { marginTop: '22px', fontSize: '12px', color: MUTED, lineHeight: 1.7, borderTop: `1px solid ${LINE}`, paddingTop: '12px' }
    };

    function copyToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      return Promise.resolve();
    }

    function CopyBtn({ text }) {
      const t = useT();
      const [done, setDone] = useState(false);
      return h('button', {
        style: { ...S.ghost, padding: '5px 11px', fontSize: '12px', color: done ? '#0b7a45' : INK },
        onClick: async () => { await copyToClipboard(text); setDone(true); setTimeout(() => setDone(false), 1200); }
      }, done ? '✓ ' + t('copied') : '⧉ ' + t('copyQ'));
    }

    // 模块数据提炼自技能本体 SKILL.md 的路由表与 INDEX.md：一句「管什么」+ 一句示例提问。
    const GROUPS = [
      {
        titleKey: 'groupMain',
        modules: [
          { name: '选题引擎', desc: '不知道拍什么时用：盘点选题源、匹配需求、预判流量，出 3–5 个候选短名单。', ex: '帮我想几个爆款选题，我做职场口播，选题枯了没灵感' },
          { name: '起号引擎', desc: '从零开账号：定位诊断、人设设计、赛道选择、平台匹配和冷启动。', ex: '素人想做短视频，怎么定位、选什么赛道开始？' },
          { name: '爆款内容工厂', desc: '已有视频或脚本时用：内容诊断、开头优化、共鸣注入、结构重构、标题包装。', ex: '这条视频数据很差，帮我看看怎么改能爆' },
          { name: 'IP故事引擎', desc: '做个人 / 创始人 IP：身份诊断、立场确立、故事线设计、内容矩阵。', ex: '帮我设计个人 IP，我的故事该怎么讲才能让人记住？' },
          { name: '涨粉增长引擎', desc: '不涨粉、播放卡住时用：现状诊断、瓶颈定位、增长策略、执行计划和数据复盘。', ex: '播放量卡在几百上不去，为什么一直不涨粉？' },
          { name: '商业化罗盘', desc: '想赚钱时用：变现空间诊断、模式匹配、广告位设计、定价策略和商业化节奏。', ex: '我这个账号怎么变现？接广告报价怎么定？' },
          { name: '编导能力训练', desc: '想系统学做短视频：能力诊断、训练路径、刻意练习、AI 边界和能力检验。', ex: '零基础想学做短视频，怎么入门，要不要报课？' },
          { name: '避坑指南', desc: '做不起来、没水花时用：阶段诊断，认知坑、内容坑、运营坑逐个纠偏。', ex: '我都按教程做了为什么还是不火，是不是踩了什么坑？' }
        ]
      },
      {
        titleKey: 'groupNarrow',
        modules: [
          { name: '标题实验室', desc: '方向已经定了，只产出对外标题，不把答案写进标题里。', ex: '选题定了，帮我起几个对外标题，别把答案写进标题' },
          { name: '开头选择器', desc: '素材已经有了，帮你从材料里选最适合的那一种开头。', ex: '素材就这些，哪种开头最适合？' },
          { name: '真实反差', desc: '已经决定做反差时用：生成或验收反差表达，不编极端数字。', ex: '这条我想做反差，帮我把反差点立起来' },
          { name: '深度实验室', desc: '题目已定、要讲深：机制、证据、反例、二阶影响和行动，底稿默认不外露。', ex: '这个题目帮我讲深一点，要有机制和证据，别停在表面' },
          { name: '冲突利害', desc: '给故事补目标—阻力—利害—选择，让故事有张力，是 IP 故事的常用增强。', ex: '我的故事太平了，帮我把冲突和利害拉出来' },
          { name: '承诺—交付审计', desc: '只审计一件事：前端标题和承诺，后端内容到底能不能接住。', ex: '我标题里承诺的东西，正文真能兑现吗？帮我审一遍' }
        ]
      },
      {
        titleKey: 'groupMa',
        modules: [
          { name: '改句子', desc: '稿子已经有了，只改句子：太空、说教、像广告、太书面都在这儿修，不动结构和事实。', ex: '这段太像 AI 写的了，结构别动，只帮我改句子，像真人说' },
          { name: '痛点转化罗盘', desc: '卖货备选：卖点五问、痛点—爽点转化，写产品文案、详情页和直播话术。', ex: '这个产品卖点怎么讲？帮我走一遍痛点转化' },
          { name: '痒点营销引擎', desc: '卖货 / 获客备选：用痒点、预拥有感和身份表达，让顾客看完还惦记。', ex: '怎么让顾客看完这条就一直惦记我这个产品？' }
        ]
      }
    ];

    function ModuleCard({ m }) {
      return h('div', { style: S.card },
        h('div', { style: S.cardName }, m.name),
        h('div', { style: S.cardDesc }, m.desc),
        h('div', { style: S.exBox }, m.ex),
        h('div', { style: { marginTop: '10px' } }, h(CopyBtn, { text: m.ex }))
      );
    }

    function Panel() {
      const t = useT();
      return h('div', { style: S.wrap },
        h('div', { style: S.h1 }, t('title')),
        h('div', { style: S.sub }, t('intro')),
        h('div', { style: S.steps },
          [1, 2, 3].map((i) => h('div', { key: i, style: S.step },
            h('div', { style: S.stepT }, t('step' + i + 't')),
            h('div', { style: S.stepD }, t('step' + i + 'd'))
          ))
        ),
        GROUPS.map((g) => h('div', { key: g.titleKey },
          h('div', { style: S.h2 }, t(g.titleKey)),
          h('div', { style: S.grid },
            g.modules.map((m) => h(ModuleCard, { key: m.name, m }))
          )
        )),
        h('div', { style: S.footer }, t('footer'))
      );
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'biandao: dictionaries');
        const bind = ctx.locale.bind ? ctx.locale.bind(NS) : null;
        if (bind) currentT = (k) => bind(k);
        try {
          ctx.slots.inject('conversation.view', () => ctx.slots.register({
            name: 'conversation.view',
            id: 'biandao',
            order: 50,
            locale: NS,
            label: () => (currentT('tab') || '编导')
          }, Panel));
        } catch (error) {
          console.warn('[biandao] conversation.view registration failed:', error);
        }
      }
    };
  }
});
