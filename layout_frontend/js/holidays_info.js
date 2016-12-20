var holidays_info = new Vue({
    el: "#holidays_info",
    data: {
        show: false,
    	  apiUrl: 'http://104.160.33.183:5000/api/v1.0/worker/holidays/',
        gridColumns: [{
            name: '编号'
        }, {
            name: '开始时间'
        }, {
            name: '结束时间'
        }, {
            name: '请假类型'
        }, {
            name: '请假原因'
        }, {
            name: '请假状态'
        }, {
            name: '申请时间'
        }, {
            name: '操作'
        }],
        gridData: [],
        item: {},
        options: [],
        currentPage: 1,
        per_page: 10
    },
    ready: function(){
      
    	this.get_holidays();
      this.get_holiday_type();
    },
    methods:{
        get_holidays: function() {
            this.$http.get(this.apiUrl, { params: {'page': this.currentPage, 
              'per_page': this.per_page}}).then((response) => {
                  $('#pagination-demo').twbsPagination('destroy');
                  if(response.data.total_page_num > 0) {
                      var totalPages = response.data.total_page_num;
                      $('#pagination-demo').twbsPagination($.extend({}, defaultOpts, {
                          startPage: Math.min(this.currentPage, totalPages),
                          totalPages: totalPages,
                          onPageClick: function (event, page) {
                            holidays_info.currentPage = page;
                          }
                      }));
                  }
                  else{
                    this.currentPage = 1;
                    return;
                  }

                  this.gridData = response.data.holidays;
                    
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
        },
        load_holiday: function(holiday_id) {
            this.item = this.share_load(holiday_id);
            $('#holiday_modal').modal('show');
        },
        //销假
        over_holiday: function(holiday_id) {
            this.item = this.share_load(holiday_id);
            var put_data = Object.assign({}, this.item, {'holiday_end': 1});
            this.$http.put(this.apiUrl + this.item.holiday_id + "/", put_data)
              .then((response) => {
                noty({"text": 'Apply Successfully!', "layout":"top","type":"information"});
                this.get_holidays();
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        //撤回
        end_holiday: function(holiday_id) {
            this.item = this.share_load(holiday_id);
            var put_data = Object.assign({}, this.item, {'holiday_over': 1});
            this.$http.put(this.apiUrl + this.item.holiday_id + "/", put_data)
              .then((response) => {
                noty({"text": 'End Successfully!', "layout":"top","type":"information"});
                this.get_holidays();
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        save_holiday: function() {
            // alert(this.apiUrl + this.item.holiday_id)
            // alert(this.item.holiday_reason)
            var vm = this;
            this.item.holiday_type = this.item.holiday_type.toString();
            this.$http.put(this.apiUrl + this.item.holiday_id + "/", this.item)
                            .then((response) => {
                                noty({"text": 'Modify Successfully', "layout":"top","type":"information"});
                                this.get_holidays();
                                //setTimeout(function() { $("#dt").DataTable(); }, 1000);
                            }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        share_load: function(holiday_id) {
            var vm = this;
            var res;
            vm.gridData.forEach(function(item) {
                if (item.holiday_id == holiday_id) {
                    res = deepCopy(item);
                    return;
                }
            });
            return res;
        }
    },
    watch: {
      per_page: function(val) {
        this.get_holidays();
      },
      currentPage: function(val) {
        this.get_holidays();
      },
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


 

// var DT = $('#demo').DataTable();
// $("#dt tbody").on("click","tr",function(){
//      alert( 'HERE' );
// })
var t =  [
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TESTtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttTESTtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttTESTtttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttTESTttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    },{
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 1, 
      "holiday_reason": "TEST", 
      "holiday_time_begin": "2016-12-17 10:50:49", 
      "holiday_time_end": "2016-12-18 22:30:49", 
      "holiday_type": 1, 
      "holiday_worker_id": "3013218001"
    }, 
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "holiday_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    }
  ]