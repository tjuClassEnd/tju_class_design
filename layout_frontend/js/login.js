var demo = new Vue({
	el: '#app',
	data: {
		apiUrl: 'http://104.160.33.183:5000/api/v1.0/token/',
		item: {},
		tip_show: false,
		tip_class: '',
		tip_message1:'',
		tip_message2:''
	},
	ready: function() {
		// this.getCustomers()
	},
	methods: {
		login: function() {
            if(!this.item.username || !this.item.password){
            	this.tip_class = 'alert-danger',
            	this.tip_message1 = 'Error!',
            	this.tip_message2 = 'Please input complete information.',
            	this.tip_show = true;
            	return
            }
            if(this.item.username == 'admin') {
                this.admin_login();
                return;
            }
            this.$http.get(this.apiUrl, {
                headers: { 'Authorization': 'Basic ' + http_auth.auth(this.item.username, this.item.password)
            }}).then((response) => {
                    // 响应成功回调
                    //alert(response.data.token)
                    Vue.http.headers.common['Authorization'] = 'Basic ' + http_auth.auth(response.data.token, '');
                    sessionStorage.setItem("token", Vue.http.headers.common['Authorization']);
                    this.tip_class = 'alert-success',
            		this.tip_message1 = 'Success!',
            		this.tip_message2 = 'You successfully login.',
            		this.tip_show = true;

                    sessionStorage.user = this.item.username;

                    setTimeout(()=>{
                          window.location.href = "personal_info_just_layout.html";}, 1000);
              }, (response) => {
                    console.log(response);
                    this.tip_class = 'alert-danger',
            		this.tip_message1 = 'Error!',
            		this.tip_message2 = 'Wrong username or password.',
            		this.tip_show = true;
                    // 响应错误回调
            });
		},
        admin_login: function() {
            this.$http.get('http://104.160.33.183:5000/admin/token', {
                headers: { 'Authorization': 'Basic ' + http_auth.auth(this.item.username, this.item.password)
            }}).then((response) => {
                    // 响应成功回调
                    //alert(response.data.token)
                    Vue.http.headers.common['Authorization'] = 'Basic ' + http_auth.auth(response.data.token, '');
                    sessionStorage.setItem("token", Vue.http.headers.common['Authorization']);
                    this.tip_class = 'alert-success',
                    this.tip_message1 = 'Success!',
                    this.tip_message2 = 'You successfully login.',
                    this.tip_show = true;

                    sessionStorage.user = this.item.username;


                    setTimeout(()=>{
                          window.location.href = "admin_userinfo.html";}, 1000);
              }, (response) => {
                    console.log(response);
                    this.tip_class = 'alert-danger',
                    this.tip_message1 = 'Error!',
                    this.tip_message2 = 'Wrong username or password.',
                    this.tip_show = true;
                    // 响应错误回调
            });
        }
	}
});