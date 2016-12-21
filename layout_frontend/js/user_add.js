var worker_add = new Vue({
    el: "#worker_add",
    data: {
    	apiUrl: 'http://104.160.33.183:5000/admin/workers/',
        worker: {
            'worker_id': '',
            'worker_name': '',
            'worker_email': '',
            'worker_address': '',
            'password': '',
            'password2': ''
        },
        options: []
    },
    ready: function(){
    },
    methods:{
        check_apply: function() {
            for(key in this.worker){
                if(this.worker.key == ''){
                    noty({"text":"Please fill all information","layout":"top","type":"error"});
                    return;
                }
            }
            if(this.worker.password != this.worker.password2){
                noty({"text":"Password should be the same!","layout":"top","type":"error"});
                return;
            }
            this.apply();
        },
    	apply: function(){
            this.$http.post(this.apiUrl, this.worker).then((response) => {
                    // 响应成功回调
                    noty({"text":"Add new worker successfully!","layout":"top","type":"information"});
                    setTimeout(()=>{
                        window.location.href = "admin_userinfo.html";}, 1000);
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        }  
    }
});

