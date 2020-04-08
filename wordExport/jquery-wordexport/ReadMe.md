# jquery-wordexport （JQ实现文件导出）

*该插件来源于网络流传最广的 word导出插件*

-- --

* 该插件以来JQuery,使用该包请先引入与JQuery

* 本插件并非原创，也并未做修改

* 本插件用于将网页中某些内容导出为 .docx 文档

### 参数解析：

```javascript
fileName --文件名 //不需要后缀名;
```

### 实例调用:

*调用前需要 JQuery,FileSaver,jquery.wordexport 三个JS文件依次引入*

```javascript
// 这里省略了点击事件
// #word 是你要导出内容的ID,'word文档是文件名称'
$('#word').wordExport('word文档');
```

  

  