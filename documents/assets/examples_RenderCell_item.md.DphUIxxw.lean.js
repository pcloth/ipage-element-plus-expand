import{_ as d,o as e,c as a,aX as o}from"./chunks/framework.Cshtqp6B.js";const m=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"examples/RenderCell/item.md","filePath":"examples/RenderCell/item.md"}'),r={name:"examples/RenderCell/item.md"};function n(s,t,l,c,i,p){return e(),a("div",null,t[0]||(t[0]=[o(`<h2 id="rendercell-属性" tabindex="-1">RenderCell 属性 <a class="header-anchor" href="#rendercell-属性" aria-label="Permalink to &quot;RenderCell 属性&quot;">​</a></h2><table tabindex="0"><thead><tr><th>属性</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>value</td><td>[String, Number, Array, Object, Boolean,Date]</td><td>v-model数据</td><td><code>undefined</code></td></tr><tr><td>item</td><td>object</td><td>渲染组件内容数据，下方有详细说明</td><td><code>undefined</code></td></tr><tr><td>defaultSlot</td><td>string</td><td><code>item</code>对象中如果没有<code>slot</code>值，将使用defaultSlot</td><td><code>undefined</code></td></tr><tr><td>defaultProp</td><td>object</td><td><code>item</code>对象中如果没有<code>props</code>defaultProp</td><td><code>undefined</code></td></tr><tr><td>allItems</td><td>array</td><td>兄弟RenderCell数据集，传递给荷载数据<code>loadData</code></td><td><code>undefined</code></td></tr><tr><td>formData</td><td>object</td><td>父级表单model数据，传递给荷载数据<code>loadData</code></td><td><code>undefined</code></td></tr><tr><td>qData</td><td>Object</td><td>父级附加数据，传递给荷载数据<code>loadData</code></td><td><code>undefined</code></td></tr></tbody></table><h2 id="item-属性" tabindex="-1">item 属性 <a class="header-anchor" href="#item-属性" aria-label="Permalink to &quot;item 属性&quot;">​</a></h2><table tabindex="0"><thead><tr><th>属性</th><th>类型</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td>sort</td><td>number</td><td>排序，当需要排序的地方，可以用它来插入到默认单元的前面</td><td><code>undefined</code></td></tr><tr><td>id</td><td>string</td><td>表单组件v-model的对象key，循环渲染时候的key</td><td>如果不传入，将随机生成一个uuid</td></tr><tr><td>label</td><td>string</td><td>当isFormItem=true时候，表单标签</td><td><code>undefined</code></td></tr><tr><td>tip</td><td>string</td><td>input的placeholder，span、button、link、checkbox的默认插槽</td><td><code>undefined</code></td></tr><tr><td>slot</td><td>string</td><td>需要渲染的element-ui组件类型，默认去掉el字符，比如el-input，写为<code>input</code></td><td><code>undefined</code></td></tr><tr><td>options</td><td>[array,function,async function]</td><td>select、radio-group、checkbox-group子组件的options</td><td>[]</td></tr><tr><td>directives</td><td>array</td><td>自定义指令数据</td><td>[]</td></tr><tr><td>debounce</td><td>boolen,number</td><td>v-model是否需要额外的防抖</td><td><code>undefined</code></td></tr><tr><td>render</td><td>jsx function</td><td>当slot=&#39;render&#39;的时候生效，直接渲染dom</td><td>无</td></tr><tr><td>slots</td><td>object</td><td>用于组件的插槽</td><td>{}</td></tr><tr><td>props</td><td>object</td><td>传递给原生组件的props，如果其中有function类型，会自动添加loadData数据</td><td>{}</td></tr><tr><td>on</td><td>object</td><td>传递给原生组件的on,用于接收组件的emit事件，会自动添加loadData数据</td><td>{}</td></tr><tr><td>show</td><td>boolen|function</td><td>是否显示本组件，类似v-show</td><td>true</td></tr><tr><td>isFormItem</td><td>boolen</td><td>是否在父级添加el-form-item组件</td><td>true</td></tr><tr><td>formItemProps</td><td>object</td><td>如果isFormItem=true的时候，父级el-form-item组件的props参数</td><td>{}</td></tr><tr><td>isCol</td><td>boolean</td><td>是否添加一个el-col组件在外层</td><td>false</td></tr><tr><td>colProps</td><td>object</td><td>如果添加了el-col，给它的配置</td><td></td></tr><tr><td>otherValueRange</td><td>Array&lt;string&gt;</td><td>比如date-pcker组件，如果指定了时间范围，将会获得一个array的value，你可以在这里配置它们映射的其他value，比如[&#39;start&#39;,&#39;end&#39;]，将会把[&#39;2021-01-01&#39;,&#39;2021-01-02&#39;]映射成{start:&#39;2021-01-01&#39;,end:&#39;2021-01-02&#39;}</td><td></td></tr><tr><td>valueWatch</td><td>Function</td><td>当值发生变化时，触发这个方法</td><td></td></tr><tr><td>optionDom</td><td>Function</td><td>自定义options节点的渲染函数</td><td></td></tr><tr><td>mask</td><td>string|Array&lt;string&gt;|Object</td><td>限定输入范围，详情可以查看<code>mask属性</code></td><td></td></tr><tr><td>...rest</td><td>any</td><td>其他属性，将传递给实际的组件</td><td>{}</td></tr></tbody></table><h2 id="mask-属性" tabindex="-1">mask 属性 <a class="header-anchor" href="#mask-属性" aria-label="Permalink to &quot;mask 属性&quot;">​</a></h2><h4 id="方法一-传入字符串或者数组字符串-表示如下默认值" tabindex="-1">方法一：传入字符串或者数组字符串，表示如下默认值： <a class="header-anchor" href="#方法一-传入字符串或者数组字符串-表示如下默认值" aria-label="Permalink to &quot;方法一：传入字符串或者数组字符串，表示如下默认值：&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    mask:&quot;##-###&quot;</span></span></code></pre></div><p>表示接收2位数的数字加横线+3位的数字</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><pre><code>其中默认的规则有：
    C: { pattern: /[\\u4e00-\\u9fa5]/ },
    &quot;#&quot;: { pattern: /\\d/ },
    X: { pattern: /[0-9a-zA-Z]/ },
    S: { pattern: /[a-zA-Z]/ },
    A: { pattern: /[a-zA-Z]/, transform: v =&gt; v.toLocaleUpperCase() },
    a: { pattern: /[a-zA-Z]/, transform: v =&gt; v.toLocaleLowerCase() },
    &quot;!&quot;: { escape: true }
</code></pre></div><h4 id="方法二-传入对象-表示自定义规则-比如" tabindex="-1">方法二：传入对象，表示自定义规则，比如： <a class="header-anchor" href="#方法二-传入对象-表示自定义规则-比如" aria-label="Permalink to &quot;方法二：传入对象，表示自定义规则，比如：&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>        mask:{</span></span>
<span class="line"><span>            mask:&quot;ff&quot;,</span></span>
<span class="line"><span>            tokens:{</span></span>
<span class="line"><span>                f:{</span></span>
<span class="line"><span>                    pattern: /[a-zA-Z]/, </span></span>
<span class="line"><span>                    transform: v =&gt; v.toLocaleUpperCase() </span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>它将只接收2个英文，并转换成大写</p></div><h2 id="loaddata-荷载数据" tabindex="-1">loadData 荷载数据 <a class="header-anchor" href="#loaddata-荷载数据" aria-label="Permalink to &quot;loadData 荷载数据&quot;">​</a></h2><p>传递给组件方法的有如下数据：<code>item</code>、<code>data</code>、<code>qData</code>、<code>allItems</code>、<code>$rcell</code></p><ol><li><code>item</code>为自生接收到的props.item</li><li><code>data</code>为props.formData</li><li><code>qData</code>为props.qData</li><li><code>allItems</code>为props.allItems</li><li><code>$rcell</code>为组件的this</li></ol>`,15)]))}const h=d(r,[["render",n]]);export{m as __pageData,h as default};
