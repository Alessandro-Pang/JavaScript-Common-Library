# JS-wordexport   (JS实现导出文件)

*该插件仅用于学习，项目使用还请移驾 jquery-wordexport* 

-- --

* 该插件用于前端将网页导出 docx、html 等文件
* file-save-annotation.js 提供了导出原理、注释
* file-save-simple.js 提供了精简版的代码块，只需要调用一个函数即可实现代码
* file-save-annotation.js 通过自定义方法实现自动响应点击方法，是目前网上流传最广的方法
* file-savesimple.js 直接使用 element.click() 实现了自动点击的方法

### 参数解析：

```javascript
参数一 : fileName --文件名 及后缀格式;
参数二 : content --导出的内容;
```

### 实例调用:

*一般应该通过点击事件调用，这里省略了事件，但是你应该加上！*

```javascript
// 获取你要导出的内容
var content = document.getElementById('dv').outerHTML;

// export_raw('文件名.格式',导出的内容)
export_raw('test.docx', content);
```

*注意：该插件没有测试兼容情况，如果项目上需要使用，还需要使用 jquery-wordexport插件*

