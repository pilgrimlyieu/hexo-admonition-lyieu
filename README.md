# 前言

本插件最初 fork 自 [rqh656418510/hexo-admonition-better](https://github.com/rqh656418510/hexo-admonition-better)，但现已完全重写。适配 [Hexo NexT 主题](https://theme-next.js.org/)，修复了很多问题，同时支持更多特性：
- 修复了空标题时显示的间隔问题
- 支持在 Admonition 标题部分使用 Markdown 语法
- 允许 Admonition 整体进行缩进
  - 但仍要保证 Admonition 正文相较于首行 `!!!` 还有至少 4 个空格
  - 这允许了在列表语法中间插入 Admonition
- 广泛支持了 markdown-it 插件，在正文能用什么 markdown-it 插件拓展的 Markdown 语法，在 Admonition 中就能用。
  - 相较于 2.x.x 版本剥离了 `markdown-it` 依赖，不再需要同时维护 Admonition 与正文两个 markdown-it 渲染器，在 3.x.x 版本中 Admonition 会使用正文的 markdown-it 渲染器，因此正文用的插件 Admonition 也都能用。
  - 也就是说下面 2.4.2 版本说明中提及的增强 Markdown 语法不再有效，这取决于你如何配置你的正文 markdown-it 渲染器，这不再是本插件的重点。
- 解决了 2.x.x 版本的 Admonition 内脚注锚点与外部锚点冲突的问题
  - **相较 2.4.2 的破坏性更改**：Admonition 内的脚注会像外部的脚注一样，显示在在文章底部，而非之前的在 Admonition 内底部。2.4.2 是最后一个支持将脚注显示在 Admonition 内部的版本，**但是存在部分已知严重的问题！**
- 加入了 question, success, danger, bug, example, quote, tip, abstract, memo, sheet, test 等类型的 admonition（移除了 fail），总共 9 个类别如下：
  - note, question, success
  - info, todo
  - warning, attention, caution
  - danger, failure, missing, bug, error
  - example
  - quote
  - tip, abstract
  - memo, sheet
  - test
- 加入了白天与黑夜模式的支持（适配 Hexo NexT Gemini）

开发计划（但不保证，有兴趣、有时间、有意愿就做）：
- [ ] 更新 README，更清晰地展现特性
- [ ] 英文 README
- [ ] 发布到 NPM
- [ ] 支持 [GitHub Alert](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts)/[Obsidian Callout 语法](https://help.obsidian.md/callouts)
- [ ] 可通过选项配置是否启动其他类型或者 MkDocs 类型的 Admonition
- [ ] 更漂亮的 Admonition，向 MkDocs 靠拢，将实心圆点替换为图标（可配置）
- [ ] 支持 `???` 与 `???+` 类型的 Admonition
- [ ] 自定义 Admonition（低意愿）
- [ ] 嵌套 Admonition 支持（低意愿）

下面是 2.4.2 版本的说明，已经过时，不再支持与维护：

<details><summary>2.4.2</summary>

本插件自用，fork 自 [rqh656418510/hexo-admonition-better](https://github.com/rqh656418510/hexo-admonition-better)，适配 [Hexo NexT 主题](https://theme-next.js.org/)，除继承其特性外，另外加入了额外功能、修复了一些错误：

- **修复了多层级有序/无序列表未正确渲染的问题**（[2.3.3](https://github.com/pilgrimlyieu/hexo-admonition-lyieu/commit/b317301f2fdf45350b2fe3ea6bdedf31911e8ef5)）
- **解决了 ADM 内脚注与主体 Markdown 或其它 ADM 冲突的问题，可能还需[额外配置](#脚注额外配置)**（[2.3.3](https://github.com/pilgrimlyieu/hexo-admonition-lyieu/commit/b317301f2fdf45350b2fe3ea6bdedf31911e8ef5)）
- **允许缩进（仍要保持 `!!!` 后的内容相较于 `!!!` 的基础缩进至少还有 4 个空格），但不支持嵌套**
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

</details>

## 安装

因为是自用插件，未发布到 NPM，故不能直接用 `npm i hexo-admonition-lyieu` 进行安装。

执行下面的命令进行安装

```bash
npm i github:pilgrimlyieu/hexo-admonition-lyieu
```

## 使用

<details><summary>下面是 2.x.x 版本可能需要为了避免脚注冲突而做的配置，3.x.x 版本已不再需要</summary>

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

</details>

以下内容部分来自 [rqh656418510/hexo-admonition-better](https://github.com/rqh656418510/hexo-admonition-better)，仅保留了部分仍适用于现行版本的内容，但实际效果仍以最终使用为准。

# hexo-admonition-better 插件安装使用指南

## 简介

Hexo 内容辅助插件，支持将类似 [reStructuredText](https://docutils.sourceforge.io/docs/ref/rst/directives.html) 的警告提示块添加到 Markdown 文档中。例如 note、warning、error 等提示块，效果如图：

![hexo-admonition-better 示例效果](https://raw.githubusercontent.com/rqh656418510/hexo-admonition-better/master/screenshot/demo.png)

开发这个插件的动机，是想让 [hexo](https://hexo.io) 与 [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/extensions/admonition/) 的提示信息兼容，让系列文章在基于 MkDocs 搭建的子站中有更好的阅读体验。

## 新增功能

- 执行 Hexo 的构建操作时，会自动将所需的 CSS 样式添加到 HTML 文件中，一般情况下不再需要手动添加 CSS 样式

## 使用指南

### 语法说明

hexo-admonition-better 遵循一种简单的语法：每个块都以 `!!!` 开头，然后是代表提示类型的关键字（`type`）及标题（`title`）。例如:

```text
!!! note hexo-admonition-better 插件使用示例
    这是基于 hexo-admonition-better 插件渲染的一条提示信息。类型为 note，并设置了自定义标题。

    提示内容开头留 4 个空格，可以有多行，最后用空行结束此标记。

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
