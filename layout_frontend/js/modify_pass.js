var modify_pass = new Vue({
    el: "#modify_pass",
    data: {
    	apiUrl: 'http://104.160.33.183:5000/api/v1.0/user/',
        worker: {}
    },
    ready: function(){
    },
    methods:{
    	check_pass: function() {
            if(!this.worker.old_pass || !this.worker.new_pass1 || ! this.worker.new_pass2){
                noty({"text":"Please fill all information","layout":"top","type":"error"});
                return;
            }
            else if(this.worker.new_pass1 != this.worker.new_pass2){
                noty({"text":"Please input same new password!","layout":"top","type":"error"});
                return;
            }
            else if(this.worker.old_pass == this.worker.new_pass1){
                noty({"text":"New password can't be same with old!","layout":"top","type":"error"});
                return;
            }
            this.modify_pass({'worker_password': this.worker.new_pass1});
            setTimeout(()=>{
                window.location.href = "personal_info_just_layout.html";}, 1000);
        },
        modify_pass: function(e) {
            this.$http.put(this.apiUrl, e)
                            .then((response) => {
                                noty({"text":"Modify password successfully","layout":"top","type":"information"});
                                share_info.logout();
                            }, (response) => {
                    console.log(response);
                    noty({"text":"Error in modifying password","layout":"center","type":"error"}); 
                // 响应错误回调
            });
        }
    }
});

