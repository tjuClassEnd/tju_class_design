var info_modify = new Vue({
    el: "#info_modify",
    data: {
    	apiUrl: 'http://104.160.33.183:5000/api/v1.0/user/',
        worker: {},
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
    	modify_worker: function() {
            if(!this.worker.worker_email || !this.worker.worker_address){
                noty({"text":"Please fill all infomation","layout":"top","type":"error"});
                return;
            }
            this.update_worker();
            setTimeout(()=>{
                window.location.href = "personal_info_just_layout.html";}, 1000);
        },
        get_info: function(){
            Vue.http.get(this.apiUrl).then((response) => {
                    this.worker = response.data;
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
        },
        update_worker: function() {
            this.$http.put(this.apiUrl, this.worker)
                            .then((response) => {
                                noty({"text":"Modify information successfully","layout":"top","type":"information"}); 
                            }, (response) => {
                    console.log(response);
                    noty({"text":"Error in modifying information","layout":"center","type":"error"}); 
                // 响应错误回调
            });
        }
    }
});

