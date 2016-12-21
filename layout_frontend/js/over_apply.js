var over_apply = new Vue({
    el: "#over_apply",
    data: {
    	apiUrl: 'http://104.160.33.183:5000/api/v1.0/worker/workadds/',
        item: {'workadd_type': '1'},
        options: []
    },
    ready: function(){
    	this.get_workadd_type();
    },
    methods:{
        check_apply: function() {
            if(!this.item.workadd_start || !this.item.workadd_end || ! this.item.workadd_reason){
                noty({"text":"Please fill all information","layout":"top","type":"error"});
                return;
            }
            else if(this.item.workadd_end < this.item.workadd_start){
                noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
                return;
            }
            this.apply();
        },
    	apply: function(){
            // alert(this.item.holiday_time_begin)
            this.item.workadd_type = this.item.workadd_type.toString();
            this.$http.post(this.apiUrl, this.item).then((response) => {
                    // 响应成功回调
                    noty({"text":"Apply successfully!","layout":"top","type":"information"});
                    setTimeout(()=>{
                        window.location.href = "self_over_management.html";}, 1000);
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        get_workadd_type: function() {
            this.$http.get('http://104.160.33.183:5000/api/v1.0/workadd_type_infos/').then((response) => {
                    this.options = response.data.workadd_type_info;     
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        }
    }
});

