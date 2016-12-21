var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
var deepCopy = function(source) { var result={};for (var key in source) {result[key] = typeof source[key]==='object'? deepCopy(source[key]): source[key];} return result; }
var http_auth = { auth: function (e1, e2) {return Base64.encode(e1 + ':' + e2)}};
var get_info = function(){
			Vue.http.get('http://104.160.33.183:5000/api/v1.0/user/').then((response) => {
					// 响应成功回调
					//alert(response.data.token)
					return(response.data);
              }, (response) => {
                    console.log(response);
                    if(response.data.error == 'unauthorized'){
                    	noty({"text":"You have to login","layout":"center","type":"error"});              	
                    }
                	else{
                		noty({"text":"This is something wrong","layout":"top","type":"error"});
                	}
                	setTimeout(()=>{
							window.location.href = "login.html";}, 1000); 
            });
		};

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// Vue.http.options.emulateJSON = true;
if(sessionStorage.getItem('token') != null)
	Vue.http.headers.common['Authorization'] = sessionStorage.getItem("token");
	

Vue.component('simple-grid', {
    template: '#grid-template',
    props: ['dataList', 'columns', 'options', 'male', 'department', 'degree'],
    methods: {
        loadEntry1: function(key) {
            this.$dispatch('load-entry1', key)
        },
        loadEntry2: function(key) {
            this.$dispatch('load-entry2', key)
        },
        loadEntry3: function(key) {
            this.$dispatch('load-entry3', key)
        },
        getState: function(end, over, ok, state) {
          if(over){
             return end?"已结束":"已撤销";        
           }
           else{
              if(ok == 1)
                if(end)
                  return "待销假";
                else
                  return "已通过";
              else if(ok == 0)
                if(state == -1)
                  return "已驳回";
                else
                  return (state+1) + "级审批";
              else
                return "已驳回";
           }
        },
        getWorkaddState: function(state) {
        	if(state == 0)
        		return "待审核";
        	else if(state == 1)
        		return "已通过";
        	else if(state == -1)
        		return "已失效";
        },
        getLabel: function(end, over, ok, state) {
          if(over){
             return {}        
           }
           else{
              if(ok == 1)
                if(end)
                  return {'label-warning': true};
                else
                  return {'label-success': true};
              else if(ok == 0)
                if(state == -1)
                  return {'label-danger': true};
                else
                  return {'label-warning': true};
              else
                return {'label-danger': true};
           }
        },
        getWorkaddLabel: function(state) {
        	if(state == 1)
        		return {'label-success': true};
        	else if(state == 0)
        		return {'label-warning': true};
        	else
        		return {'label-danger': true}
        }
    }
});

var defaultOpts = {
      totalPages: 20
};

