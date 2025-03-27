var md = require('markdown-it')({
  html: true,
  xhtmlOut: false,
  langPrefix: 'language-',
  breaks: true,
  linkify: true,
  typographer: true,
})
  .disable([ 'smartquotes' ])
  .use(require('@renbaoshuo/markdown-it-katex'), {
      skipDelimitersCheck: true
  })
  .use(require('markdown-it-abbr'))
  .use(require('markdown-it-emoji'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-ins'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-multimd-table'), {
      multiline: true,
      rowspan: true,
      headerless: true,
      multibody: true,
      aotolabel: true
  })
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-task-list-plus')
);
md.renderer.rules.footnote_ref = function(tokens, idx, options, env, slf) {
let id = tokens[idx].meta.label;  // 获取脚注名
let caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);

let refcnt = '';
if (tokens[idx].meta.refcnt) {
  refcnt = ` data-footnote-refcnt="${tokens[idx].meta.refcnt}"`;
}

return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}"${refcnt}>${caption}</a></sup>`;
};

md.renderer.rules.footnote_anchor = function(tokens, idx, options, env, slf) {
  let id = tokens[idx].meta.label;  // 获取脚注名

  /* ↩ with escape code to prevent display as Apple Emoji on iOS */
  return ` <a href="#fnref-${id}" id="fn-${id}" class="footnote-backref">\u21a9\uFE0E</a>`;
};

hexo.extend.filter.register('before_post_render', function (data) {
  const strRegExp = /(?<indent>^[ \t]*)!!!\s*(?<type>note|question|success|info|todo|warning|attention|caution|failure|missing|danger|bug|error|example|quote|tip|abstract|memo|sheet|test)(?<title>.*\n)(?<content>(?:^\k<indent> {4}.*\n|^\n)+)/;
  let admonitionRegExp = new RegExp(strRegExp, 'gmi');

  if (admonitionRegExp.test(data.content)) {
    data.content = data.content.replace(admonitionRegExp, (match, ...args) => {
      const groups = args.pop();
      
      const requiredIndent = groups.indent.length + 4;
      const contentIndentRegex = new RegExp(`^ {${requiredIndent}}`, 'gm');
      const content = groups.content.replace(contentIndentRegex, '');
      
      const title = groups.title.trim();
      let titleHtml = '';
      
      if (title !== '""' && title !== '') {
        const displayTitle = title === '""' ? groups.type : title.replace(/^[" ]+|[" ]+$/g, '');
        const renderedTitle = md.render(displayTitle).trim();
        titleHtml = `<p class="admonition-title">${renderedTitle.replace(/^<p>|<\/p>$/g, '')}</p>`;
      }
      
      return `<div class="admonition ${groups.type.toLowerCase()}">${titleHtml}${md.render(content)}</div>\n\n`;
    });
  }

  return data;
});

hexo.extend.filter.register('after_render:html', require('./lib/addstyle').addStyle);
