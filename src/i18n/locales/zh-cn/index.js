module.exports = {
  _label: '中文',

  // intro
  'intro': require('./intro.md').default,
  'intro-modal-title': '为什么要有这么严格的 issue 规定',
  'intro-modal': require('./intro-modal.md').default,

  // bug report
  'repo-title': '相关库',
  'repo-subtitle': '请确保将 issue 发往相关的仓库。',
  'type-title': '这是一个',
  'title-title': 'Issue 标题',

  'version-title': '版本',
  'version-subtitle': '请检查问题是否存在于 Vue 的最新版本中。',

  'repro-title': '重现链接',
  'repro-subtitle': require('./repro-subtitle.md').default,
  'repro-modal-title': '关于重现',
  'repro-modal': require('./repro-modal.md').default,

  'steps-title': '重现步骤',
  'steps-subtitle': require('./steps-subtitle.md').default,

  'expected-title': '期望的结果是什么？',
  'actual-title': '实际的结果是什么？',
  'dependency-version-title': ' 版本 (可选)',
  'extra-title': '补充说明（可选）',
  'extra-subtitle': '比如：遇到这个 bug 的业务场景、上下文。',

  // feature request
  'rationale-title': '这个功能解决了什么问题？',
  'rationale-subtitle': require('./rationale-subtitle.md').default,

  'proposal-title': '你期望的 API 是怎样的？',
  'proposal-subtitle': require('./proposal-subtitle.md').default,

  // preview
  'preview': '预览',
  'preview-title': '预览',
  'create': '创建 Issue',

  // misc
  'bug-report': '错误报告',
  'feature-request': '功能要求',
  'similar-issues': '类似的 issue',
  'show-more': '展开',
  'show-less': '收起',
  'drop-warn': '由于 GitHub API 的限制，这里不支持图片拖拽上传功能。但是你可以先创建 issue，然后在 GitHub 的界面中上传需要的图片。'
}
