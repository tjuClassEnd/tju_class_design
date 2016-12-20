var holiday_apply = new Vue({
    el: "#holiday_apply",
    data: {
    	apiUrl: 'http://104.160.33.183:5000/api/v1.0/worker/holidays/',
        item: {'holiday_type': 1},
        options: []
    },
    ready: function(){
    	this.get_holiday_type();
    },
    methods:{
        check_apply: function() {
            if(!this.item.holiday_time_begin || !this.item.holiday_time_end || ! this.item.holiday_reason){
                noty({"text":"Please fill all information","layout":"top","type":"error"});
                return;
            }
            else if(this.item.holiday_time_end < this.item.holiday_time_begin){
                noty({"text":"End time must be later than begin time!","layout":"top","type":"error"});
                return;
            }
            this.apply();
        },
    	apply: function(){
            // alert(this.item.holiday_time_begin)
            this.item.holiday_type = this.item.holiday_type.toString();
            this.$http.post(this.apiUrl, this.item).then((response) => {
                    // 响应成功回调
                    noty({"text":"Apply successfully!","layout":"top","type":"information"});
                    setTimeout(()=>{
                        window.location.href = "self_off_management.html";}, 1000);
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        get_holiday_type: function() {
            this.$http.get('http://104.160.33.183:5000/api/v1.0/holiday_type_infos/').then((response) => {
                    this.options = response.data.holiday_type_infos;
                    
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        }
    },
    watch: {
        item:{
            handler: function (val, oldVal) { 
                if(val.holiday_type == 2){       
                    $(".form_datetime").datetimepicker('remove');        
                    $(".form_datetime").datetimepicker({minView: "month",  
                            format: 'yyyy-mm-dd'});
                }
                else{
                    $(".form_datetime").datetimepicker('remove');        
                    $(".form_datetime").datetimepicker({ format: 'yyyy-mm-dd hh:ii:ss'});
                }
             },
            deep: true
        }
    }
});

