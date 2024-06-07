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
  let strRegExp = '(?<=^\n)(^!!! *)(note|question|success|info|todo|warning|attention|caution|failure|missing|danger|bug|error|example|quote|tip|abstract|memo|sheet|test)(.*\n)((^ {4}.*\n|^\n)+)';
  let admonitionRegExp = new RegExp(strRegExp, 'gmi');

  let strData;
  if (admonitionRegExp.test(data.content)) {
    strData = data.content.replace(admonitionRegExp, function (matchStr, p1, p2, p3, p4) {
      p4 = p4.replace(/(^ {4})/gm, '');

      if (p3.replace(/\s+/g, '') === '""') {
        return '<div class="admonition ' + p2.toLowerCase() + '">' + md.render(p4) + '</div>\n\n';
      } else {
        p3 = p3.trim() === '' ? p2 : p3.replace(/(^ |")|("| $)/g, '');
        return '<div class="admonition ' + p2.toLowerCase() + '"><p class="admonition-title">' + p3 + '</p>' + md.render(p4) + '</div>\n\n';
      }
    });
    data.content = strData;
  }

  return data;
});

hexo.extend.filter.register('after_render:html', require('./lib/addstyle').addStyle);
