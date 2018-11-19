
define(function(){
	


var QFTools = {
	/*
	 	返回dom对象或者dom集合
	 * @params selector string 选择器
	 * @params [parent] DOMObject 父级对象
	 * @return DOMObject || DOMCollection
	 * 
	 * */
	
	$: function(selector,parent){
		parent = parent || document;
		/*if(selector.charAt(0) === "#"){
			return parent.getElementById(selector.splice(1));
		}*/
		
		switch(selector.charAt(0)){
			case "#":
				return parent.getElementById(selector.slice(1));
			case ".":
				return parent.getElementsByClassName(selector.slice(1));
			default:
				return parent.getElementsByTagName(selector);
		}
	},
	/*
	 	获取内部或者外部样式
	 * @params obj DOMObject 获取样式的元素对象
	 * @params attr string  属性名称
	 * @return string 属性值
	 * 
	 * */
	getStyle: function(obj, attr){
		/*if(obj.currentStyle){ // ie
			return obj.currentStyle[attr];
		}
		return getComputedStyle(obj, false)[attr];*/
		
		
		//return obj.currentStyle ? obj.currentStyle[attr] :  getComputedStyle(obj, false)[attr];
		
		try{
			return getComputedStyle(obj, false)[attr];
		}catch(e){
			return obj.currentStyle[attr];
		}
	},
	
	/*
	 	使元素绝对居中
	 * @params obj DOMObject 要居中的元素对象
	 * */
	
	showCenter: function(obj){
		var _this = this; //留住this
		obj.style.display = "block";
		obj.style.position = "absolute";
		//计算left和top
		function calc(){
			console.log(this);
			var left = (_this.getBody().width - obj.offsetWidth)/2;
			var top = (_this.getBody().height - obj.offsetHeight)/2;
			obj.style.left = left + "px";
			obj.style.top = top + "px";
		}
		calc();
		window.onresize = calc;
		
	},
	/*
	 	得到浏览器的宽高
	 * @return object {width,height}
	 * */
	getBody: function(){
		return {
			width: document.documentElement.clientWidth || document.body.clientWidth,
			height: document.documentElement.clientHeight || document.body.clientHeight
		}
	},
	/*
	 	事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * 
	 * */
	on: function(obj, event, fn){
		if(obj.attachEvent){
			obj.attachEvent("on"+event,fn);
		}else{
			obj.addEventListener(event,fn,false);
		}
	},
	
	/*
	 	移出事件监听
	 * @params obj DOMObject 事件监听对象
	 * @params event string 事件句柄
	 * @params fn  Function 事件处理函数
	 * */
	off: function(obj, event, fn){
		if(obj.detachEvent){
			obj.detachEvent("on"+event, fn);
		}else{
			obj.removeEventListener(event, fn);
		}
	},
	/*
	 	实现cookie的创建，删除，获取
	 * @params key string cookie名称 (如果只传这一个参数，执行获取操作)
	 * @params [value] string cookie值
	 * @params [expires] string 定义过期时间和path
	 * */
	cookie: function(key, value, expires){
		if(value !== undefined){
			//传了value，执行创建,修改或者删除(取决于expires里面包含的过期时间)
			//加密
			value = encodeURIComponent(value);
			if(expires !== undefined){
				document.cookie = key+"="+value+";"+expires;
			}else{
				document.cookie = key+"="+value;
			}
			
		}else{
			//获取
			//取出所有
			var str = document.cookie;
			var obj = {};
			var arr = str.split("; ");
			for(var i in arr){
				var item = arr[i].split("=");
				obj[item[0]] = item[1];
			}
			//有就直接返回，obj如果没有key，return undefined(加密之前)
			//return obj[key];
			
			if(obj[key]){
				return decodeURIComponent(obj[key]);
			}else{
				return undefined;
			}
		}
	},

	/* 获取一个元素到浏览器边缘的距离

	*  @param obj 要获取距离的元素
	* @return {left, top}
	*/
	getPosition: function(obj){
		var position = {
			left: 0,
			top: 0
		}
		//只要存在父级，那么就继续找
		while(obj.offsetParent){
			//进行累加
			position.top += obj.offsetTop;
			position.left += obj.offsetLeft;
			//层级往上增加一个，继续找父级的offsetParent
			obj = obj.offsetParent;
		}

		return position;
	},
	
	/*发送get方式的ajax请求
	 * @param url string 请求地址
	 * @param param 请求携带的参数
	 * @param fn Function 请求成功之后的回调函数
	 */
	
	ajaxGet: function(url,param,fn){
		if(param){
			//判断url后面是否传参
			url += "?";
			for(var key in param){
				url +=key+"="+param[key]+"&";
			}
			url=url.slice(0,-1);
		}
		var ajax=new XMLHttpRequest();
		ajax.open("GET",url);
		ajax.send(null);
		
		ajax.onreadystatechange=function(){
			//监听状态是否改变
			if(ajax.readyState===4 && ajax.status===200){
				var res=JSON.parse(ajax.responseText);
				fn(res);
			}
		}
	},
	/*发送POST方式的ajax请求
	 * @param url string 请求地址
	 * @param param 请求携带的参数
	 * @param fn Function 请求成功之后的回调函数
	 */
	ajaxPost: function(url,param,fn){
		var ajax=new XMLHttpRequest();
		ajax.open("POST",url);
		var str="";
		if(param){
			url+="?";
			for(var key in param){
				url+=key+"="+param[key]+"&";
			}
			url=url.slice(0,-1);
		}else{
			str=null;
		}
		
		ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		ajax.send(str);
		ajax.onreadystatechange=function(){
			if(ajax.readyState===4 && ajax.status===200){
				fn(ajax.responseText);
			}
		}
	},
	
	/* 完美ajax
	 * @param method string   请求方式
	 * @param url    string   请求地址
	 * @param param  object   请求参数
	 * @param fn     Function 请求成功的回调
	 * @param isJson Boolean  返回是否是json格式的数据，默认为true
	*/
	ajax: function(method,url,param,fn,isJson=true){
		if(param){//判断地址后是否跟了参数，如果是,就将它拼接为字符串
			var str="";
			for(var key in param){
				str+=key+"="+param[key]+"&";
			}
			str=str.slice(0,-1);
		}
		var ajax=new XMLHttpRequest();
		if(method.toUpperCase()==="GET"){
			ajax.open("GET",param?url+"?"+str : url);
			ajax.send(null);
		}else if(method.toUpperCase()==="POST"){
			ajax.open("GET",url);
			ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			//设置参数字符串
			ajax.send(param?str:null);
		}
		
		ajax.onreadystatechange=function(){
			if(ajax.readyState===4 && ajax.status===200){
				var res=isJson?JSON.parse(ajax.responseText):ajax.responseText;
				fn(res);
			}
		}
	},
	
}

return QFTools;

})
