var worker_info = new Vue({
    el: "#worker_info",
    data: {
    	apiUrl: '',
        user: [],
        male: {
            true: "男",
            false: "女"
        },
        degree: [],
        department: []
    },
    ready: function(){
    	this.get_info();
        this.get_degree_info();
        this.get_deparment_info();
    },
    methods:{
		get_info: function() {
			Vue.http.get('http://104.160.33.183:5000/api/v1.0/user/').then((response) => {
					// 响应成功回调
					//alert(response.data.token)
					this.user = response.data;
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
		},
        get_degree_info: function() {
            this.$http.get('http://104.160.33.183:5000/api/v1.0/degree_infos/').then((response) => {
                    this.degree = response.data.degree_infos;
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        get_deparment_info: function() {
            this.$http.get('http://104.160.33.183:5000/api/v1.0/department_infos/').then((response) => {
                    this.department = response.data.department_infos;
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        }
    }
});

