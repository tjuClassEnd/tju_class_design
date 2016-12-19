var share_info = new Vue({
    el: "#share_info",
    data: {
        apiUrl: 'http://104.160.33.183:5000/api/v1.0/user/',
		user: ''
    },
    ready: function() {
    	this.user = sessionStorage.user;
    },
    methods:{
		logout: function(){
			Vue.http.headers.common['Authorization'] = '';
			sessionStorage.removeItem('token');
			sessionStorage.removeItem('user');
			noty({"text":"You have successfully logout","layout":"top","type":"information"});
			setTimeout(()=>{
							window.location.href = "login.html";}, 1000);
		}
    }
});