import{_ as e,c as l,aQ as t,o as i}from"./chunks/framework.BF6TlLIM.js";const b=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"guide/history.md","filePath":"guide/history.md"}'),c={name:"guide/history.md"};function d(a,o,r,s,p,n){return i(),l("div",null,o[0]||(o[0]=[t('<h2 id="更新日志" tabindex="-1">更新日志 <a class="header-anchor" href="#更新日志" aria-label="Permalink to &quot;更新日志&quot;">​</a></h2><blockquote><p>2025-01-16 版本号：<code>0.0.12</code></p></blockquote><ol><li><code>addButton</code>,<code>editButton</code>,<code>deleteButton</code>三个按钮默认添加<code>e.stopPropagation()</code>阻止冒泡</li><li>完善更多的typescript类型</li></ol><blockquote><p>2025-01-15 版本号：<code>0.0.10</code></p></blockquote><ol><li>IForm的渲染单元isCol默认打开，默认span=12，确保和旧版本逻辑一致</li><li>select-more如果加载的时候被屏蔽了，会造成监听抛错，虽然不影响业务，但是依然防御一下。</li></ol><blockquote><p>2025-01-14 版本号：<code>0.0.8</code></p></blockquote><ol><li>ITable添加<code>showColumnFilter</code>参数并默认设置为false</li><li>补全文档中</li><li>IForm表单的col参数换到渲染核心</li></ol><blockquote><p>2025-01-11 版本号：<code>0.0.6</code></p></blockquote><ol><li>修复在ssr模式编译下报错的问题</li><li>补全文档中</li><li>修复表格没有prop的时候，被过滤器隐藏的bug</li></ol><blockquote><p>2025-01-10 版本号：<code>0.0.4</code></p></blockquote><ol><li>补全文档中</li><li>调整部署打包等基础工具</li></ol>',11)]))}const m=e(c,[["render",d]]);export{b as __pageData,m as default};
