# 前言

> **是自用插件**，基本是按本人的需求进行添加特性、修复错误。因此下面可能会有多余的功能，如有需要可以自行修改增删。

本插件自用，fork 自 [rqh656418510/hexo-admonition-better](https://github.com/rqh656418510/hexo-admonition-better)，适配 [Hexo NexT 主题](https://theme-next.js.org/)，除继承其特性外，另外加入了额外功能、修复了一些错误：

- **修复了多层级有序/无序列表未正确渲染的问题**（[2.3.3](https://github.com/pilgrimlyieu/hexo-admonition-lyieu/commit/b317301f2fdf45350b2fe3ea6bdedf31911e8ef5)）
- **解决了 ADM 内脚注与主体 Markdown 或其它 ADM 冲突的问题，可能还需[额外配置](#脚注额外配置)**（[2.3.3](https://github.com/pilgrimlyieu/hexo-admonition-lyieu/commit/b317301f2fdf45350b2fe3ea6bdedf31911e8ef5)）
- 加入了 question, success, danger, bug, example, quote, tip, abstract, memo, sheet, test 等类型的 admonition（移除了 fail）
- 加入了白天与黑夜模式的支持（适配 Hexo NexT Gemini）
- 增强了 admonition 内 markdown 语法：根据本人需求加入了包括但不限于以下插件
  - [@renbaoshuo/markdown-it-katex](https://github.com/renbaoshuo/markdown-it-katex)
  - [markdown-it-abbr](https://github.com/markdown-it/markdown-it-abbr)
  - [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji)
  - [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)
  - [markdown-it-ins](https://github.com/markdown-it/markdown-it-ins)
  - [markdown-it-mark](https://github.com/markdown-it/markdown-it-mark)
  - [markdown-it-merge-cells](https://github.com/Menci/markdown-it-merge-cells)
  - [markdown-it-multimd-table](https://github.com/redbug312/markdown-it-multimd-table)
  - [markdown-it-sub](https://github.com/markdown-it/markdown-it-sub)
  - [markdown-it-sup](https://github.com/markdown-it/markdown-it-sup)
  - [markdown-it-task-list-plus](https://github.com/edgardong/markdown-it-task-list-plus)

## 安装

因为是自用插件，未发布到 NPM，故不能直接用 `npm i hexo-admonition-lyieu` 进行安装。

执行下面的命令进行安装

```bash
npm i github:pilgrimlyieu/hexo-admonition-lyieu
```

## 使用

### 脚注额外配置

为了避免冲突，将脚注的锚点改为了脚注名称，即 `[^footnote]` 锚点会变成 `#fn-footnote`，因此脚注名称需要认真取。此外，这里只修改了 ADM 内部，可能会使外部引用处锚点无法到脚注处，解决方法是在 Hexo 根目录的 `scripts` 文件夹建一个 `footnote.js` 文件，并输入下列内容：

```js
hexo.extend.filter.register('markdown-it:renderer', function(md) {
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
});
```

这样将外部的脚注锚点名规则与 ADM 弄一致，就不会冲突了。

以下内容来自 [rqh656418510/hexo-admonition-better](https://github.com/rqh656418510/hexo-admonition-better)，对本插件不一定可用。

# hexo-admonition-better 插件安装使用指南

## 简介

Hexo 内容辅助插件，支持将类似 [reStructuredText](https://docutils.sourceforge.io/docs/ref/rst/directives.html) 的警告提示块添加到 Markdown 文档中。例如 note、warning、error 等提示块，效果如图：

![hexo-admonition-better 示例效果](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/demo.png)

开发这个插件的动机，是想让 [hexo](https://hexo.io) 与 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/extensions/admonition/) 的提示信息兼容，让系列文章在基于 MkDocs 搭建的子站中有更好的阅读体验。

## 新增功能

- 执行 Hexo 的构建操作时，会自动将所需的 CSS 样式添加到 HTML 文件中，一般情况下不再需要手动添加 CSS 样式

## 安装说明

### 安装插件

```bash
npm install hexo-admonition-better --save
```

## 使用指南

### 语法说明

hexo-admonition-better 遵循一种简单的语法：每个块都以 `!!!` 开头，然后是代表提示类型的关键字（`type`）及标题（`title`）。例如:

```text
!!! note hexo-admonition-better 插件使用示例
    这是基于 hexo-admonition-better 插件渲染的一条提示信息。类型为 note，并设置了自定义标题。

    提示内容开头留 4 个空格，可以有多行，最后用空行结束此标记。

```

在 Hexo 渲染前，将被转换成如下内容：

```html
<div class="admonition note ">
  <p class="admonition-title">hexo-admonition-better 插件使用示例</p>
  <p>这是基于 hexo-admonition-better 插件渲染的一条提示信息。类型为 note，并设置了自定义标题。</p>
  <p>提示内容开头留 4 个空格，可以有多行，最后用空行结束此标记。</p>
</div>
```

最终呈现效果如下：

![hexo-admonition-better 插件 note 提示示例](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/note.png)

### 支持的类型

提示类型 `type` 将用作 CSS 类名称，暂支持如下类型：

- `note`
- `info, todo`
- `warning, attention, caution`
- `error, failure, missing, fail`

### 设置/隐藏标题

标题 `title` 是可选的，当未设置时，将以 `type` 作为默认值:

```text
!!! warning
    这是一条采用默认标题的警告信息。
```

效果如下：

![默认标题警告提示块](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/warning.png)

如果不想显示标题，可以将 `title` 设置为 `""`：

```text
!!! warning ""
    这是一条不带标题的警告信息。
```

效果如下：

![无标题警告提示块](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/warning-no-title.png)

### 嵌套 markdown 标记

在 `hexo-admonition-better` 内部，还可以嵌套标准 Markdown 标签，例如：

```text
!!! node "嵌套链接及引用块"
    欢迎访问我的博客链接：[悟尘纪](https://www.example.cn)

    >这里嵌套一行引用信息。
```

效果如下:

![嵌套效果](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/nesting.png)

### 样式自定义

若希望自定义样式，可以将如下样式放入 Hexo 主题的自定义样式文件中（如：`custom.css`），并按自己喜好修改：

```css
.admonition {
  margin: 1.5625em 0;
  padding: .6rem;
  overflow: hidden;
  font-size: .64rem;
  page-break-inside: avoid;
  border-left: .3rem solid #42b983;
  border-radius: .3rem;
  box-shadow: 0 0.1rem 0.4rem rgba(0,0,0,.05), 0 0 0.05rem rgba(0,0,0,.1);
  background-color: #fafafa;
}

p.admonition-title {
  position: relative;
  margin: -.6rem -.6rem .8em -.6rem !important;
  padding: .4rem .6rem .4rem 2.5rem;
  font-weight: 700;
  background-color:rgba(66, 185, 131, .1);
}

.admonition-title::before {
  position: absolute;
  top: .9rem;
  left: 1rem;
  width: 12px;
  height: 12px;
  background-color: #42b983;
  border-radius: 50%;
  content: ' ';
}

.info>.admonition-title, .todo>.admonition-title {
  background-color: rgba(0,184,212,.1);
}

.warning>.admonition-title, .attention>.admonition-title, .caution>.admonition-title {
  background-color: rgba(255,145,0,.1);
}

.failure>.admonition-title, .missing>.admonition-title, .fail>.admonition-title, .error>.admonition-title {
  background-color: rgba(255,82,82,.1);
}

.admonition.info, .admonition.todo {
  border-color: #00b8d4;
}

.admonition.warning, .admonition.attention, .admonition.caution {
  border-color: #ff9100;
}

.admonition.failure, .admonition.missing, .admonition.fail, .admonition.error {
  border-color: #ff5252;
}

.info>.admonition-title::before, .todo>.admonition-title::before {
  background-color: #00b8d4;
  border-radius: 50%;
}

.warning>.admonition-title::before, .attention>.admonition-title::before, .caution>.admonition-title::before {
  background-color: #ff9100;
  border-radius: 50%;
}

.failure>.admonition-title::before,.missing>.admonition-title::before,.fail>.admonition-title::before,.error>.admonition-title::before{
  background-color: #ff5252;;
  border-radius: 50%;
}

.admonition>:last-child {
  margin-bottom: 0 !important;
}
```

## 适配 Hexo 主题

### NexT 主题

若 Hexo 使用的是 NexT 主题，则需要在 NexT 主题的 `_config.yml` 配置文件里，将 `note` 的 `style` 参数设置为 `disabled`，否则会影响上述插件 `note` 类型的样式显示，完整的配置信息如下：

``` yml
# Note tag (bootstrap callout)
note:
  # Note tag style values:
  #  - simple    bootstrap callout old alert style. Default.
  #  - modern    bootstrap callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: disabled
  icons: false
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0
```

## License

MIT

## 参考

- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/extensions/admonition/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
