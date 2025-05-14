hexo.extend.filter.register('before_post_render', function (data) {
  const strRegExp = /(?<indent>^[ \t]*)!!!\s*(?<type>note|question|success|info|todo|warning|attention|caution|failure|missing|danger|bug|error|example|quote|tip|abstract|memo|sheet|test)(?<title> .*)\n(?<content>(?:^\k<indent> {4}.*\n|^\n)+)/;
  let admonitionRegExp = new RegExp(strRegExp, 'gmi');

  if (admonitionRegExp.test(data.content)) {
    data.content = data.content.replace(admonitionRegExp, (match, ...args) => {
      const groups = args.pop();
      
      const requiredIndent = groups.indent.length + 4;
      const contentIndentRegex = new RegExp(`^ {${requiredIndent}}`, 'gm');
      let content = groups.content.replace(contentIndentRegex, '').trim();

      const titleText = groups.title.trim();
      let titleHtml = '';
      
      if (titleText !== '""' && titleText !== '') {
        let displayTitleText = titleText === '""' ? groups.type : titleText.replace(/^[" ]+|[" ]+$/g, '');
        
        let renderedTitleContent = '';
        if (hexo && hexo.render && typeof hexo.render.renderSync === 'function') {
            renderedTitleContent = hexo.render.renderSync({ text: displayTitleText, engine: 'markdown' }).trim();
            if (renderedTitleContent.startsWith('<p>') && renderedTitleContent.endsWith('</p>')) {
                renderedTitleContent = renderedTitleContent.substring(3, renderedTitleContent.length - 4).trim();
            }
        } else {
            hexo.log.warn('Admonition: hexo.render.renderSync not available for title rendering. Title Markdown might not be processed.');
            renderedTitleContent = displayTitleText; 
        }
        
        titleHtml = `<p class="admonition-title">${renderedTitleContent}</p>`;
      }
      
      return `<div class="admonition ${groups.type.toLowerCase()}">${titleHtml}\n\n${content}\n\n</div>\n\n`;
    });
  }
  return data;
});

hexo.extend.filter.register('after_render:html', require('./lib/addstyle').addStyle);
