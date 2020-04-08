
/**
 * 导出原理：
 * 	通过 a 标签的 download 属性 实现下载功能
 *  通过 document.createElementNS 方法 ，实现创建一个具有指定的命名空间URI和限定名称的元素
 *  通过 blob 构造函数存储页面数据
 *  通过 URL.createObjectURL(blob) 生成一个blob链接，将连接赋值给 a 标签
 *  通过 a.download 实现设置下载文件的名称
 *  通过 createEvent、initMouseEvent、dispatchEvent 
 *  	一系列方法实现自定义事件,使其响应用户导出文档的操作
 */

function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    /**
    	event.initMouseEvent(type, canBubble, cancelable, view,
                     detail, screenX, screenY, clientX, clientY,
                     ctrlKey, altKey, shiftKey, metaKey,
                     button, relatedTarget);

		type
			设置事件的字符串type。
			可能的类型鼠标事件包括：click，mousedown，mouseup，mouseover，mousemove，mouseout。
		canBubble
			事件是否会冒泡。设置的值Event.bubbles。
		cancelable
			是否可以阻止事件的默认操作。设置的值Event.cancelable。
		view
			事件的AbstractView。您应该在window此处传递对象。设置的值UIEvent.view。
		detail
			事件的鼠标单击计数。设置的值UIEvent.detail。
		screenX
			事件的屏幕x坐标。设置的值MouseEvent.screenX。
		screenY
			事件的屏幕y坐标。设置的值MouseEvent.screenY。
		clientX
			事件的客户x坐标。设置的值MouseEvent.clientX。
		clientY
			事件的客户y坐标。设置的值MouseEvent.clientY。
		ctrlKey
			control活动期间是否按下了按键。设置的值MouseEvent.ctrlKey。
		altKey
			alt活动期间是否按下了按键。设置的值MouseEvent.altKey。
		shiftKey
			shift活动期间是否按下了按键。设置的值MouseEvent.shiftKey。
		metaKey
			meta活动期间是否按下了按键。设置的值MouseEvent.metaKey。
		button
			事件的鼠标button。
		relatedTarget
			事件的相关EventTarget。
			仅用于某些事件类型（例如mouseover和mouseout）。在其他情况下，请通过null。
     */
    ev.initMouseEvent(
        "click", true, false, window, 0, 0, 0, 0, 0
        , false, false, false, false, 0, null
        );
    obj.dispatchEvent(ev);

    /* 
		createEvent 系列的功能部分被废弃,MDN中推荐使用 CustomEvent方法
    	CustomEvent 自定义事件

    	该方法有在本功能中存在一些问题：
    		你点击按钮时，并不会响应导出/下载文件的功能 
			但事件会触发且绑定，如果你将生成的元素(a标签)输出在文档上面，点击该元素(a标签)是可以导出的！

	·-------------------------------------------------------------------------------------------------------·
	|--------------------------------------Custom Event 代码实现---------------------------------------------|
	·-------------------------------------------------------------------------------------------------------·

		var event = new CustomEvent("cat",{
			bubbles: true, 
			cancelable: false, 
			detail:"一些奇奇怪怪的数据"
		});
		
		obj.addEventListener("cat", function(e) { 
			alert('触发自定义事件-----'+e.detail+'------'+e.target)
		});
		
		obj.dispatchEvent(event); 
    */

}
 

function export_raw(name, data) {
	var urlObject = window.URL || window.webkitURL || window;

   /**
    	Blob 构造函数

			Blob（Binary Large Object）对象代表了一段二进制数据，提供了一系列操作接口。
			比如通过new Blob()创建的对象就是Blob对象。
			又比如,在XMLHttpRequest里,如果指定responseType为blob,那么得到的返回值也是一个blob对象。

		生成Blob对象

			生成Blob对象有两种方法：
				1、是使用Blob构造函数
				2、是对已有的Blob对象使用slice()方法切出一段。

		Blob构造函数

			var blob = new Blob(data, type);

			Blob构造函数接受两个参数：

				参数data是一组数据，所以必须是数组，即使只有一个字符串也必须用数组装起来.
				参数type是对这一Blob对象的配置属性，目前也只有一个type也就是相关的MIME需要设置 type的值：

					'text/csv,charset=UTF-8' 设置为csv格式，并设置编码为UTF-8
					'text/html' 设置成html格式
					注意：任何浏览器支持的类型都可以这么用

				var blob = new Blob(['我是Blob'],{type: 'text/html'});

					blob.size   //Blob大小（以字节为单位）
					blob.type   //Blob的MIME类型，如果是未知，则是“ ”（空字符串）
    */
   
	//[data]:参数就是要存储的数据,内容等。
	var export_blob = new Blob([data]);

	/**
		document.createElementNS : 创建一个具有指定的命名空间URI和限定名称的元素(标签)。
		有效的命名空间URI
	    	HTML - 参阅 http://www.w3.org/1999/xhtml
	    	SVG - 参阅 http://www.w3.org/2000/svg
	   		XBL - 参阅 http://www.mozilla.org/xbl
	   		XUL - 参阅 http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul

	   	注：document.createElementNS 一般用于Xml中，需要指定命名空间,
	   		实际在 DOM 中,可以直接使用 document.createElement 替代该方法！

	   	document.createElementNS与document.createElement类似，也用于创建标签节点，
	   		只是它需要一个额外的命名空间URI作为参数，只有使用名字空间的XML文档才会使用该方法，
	   		此方法用于创建 XML 元素，此命名空间用于标识该节点属于哪种XML类型。

	   	一个xml文档可能包含多个软件模块的元素和属性，在不同软件模块中使用相同名称的元素或属性，
	   		可能会导致识别和冲突问题，而xml命名空间可以解决该问题。
	*/		
	var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")

	/**
		使用URL.createObjectURL()函数可以创建一个Blob URL，
		参数blob是用来创建URL的File对象或者Blob对象，返回值格式是：blob://URL。

		注意：
			在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。
			当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法传入创建的URL为参数，用来释放它。
			浏览器会在文档退出的时候自动释放它们，但是为了获得最佳性能和内存使用状况，你应该在安全的时机主动释放掉它们。
	 */
	save_link.href = urlObject.createObjectURL(export_blob);
	save_link.download = name;
	fake_click(save_link);
}
