var over_info = new Vue({
    el: "#over_info",
    data: {
        show: false,
    	  apiUrl: 'http://104.160.33.183:5000/api/v1.0/examine/',
        gridColumns: [{
            name: '编号'
        }, {
            name: '工号'
        }, {
            name: '开始时间'
        }, {
            name: '结束时间'
        }, {
            name: '加班类型'
        }, {
            name: '加班原因'
        }, {
            name: '申请状态'
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
      
    	this.get_workadds();
      this.get_workadd_type();
    },
    methods:{
        get_workadds: function() {
            this.$http.get(this.apiUrl + "workadds/", { params: {'page': this.currentPage, 
              'per_page': this.per_page}}).then((response) => {
                    $('#pagination-demo').twbsPagination('destroy');
                    var totalPages = Math.ceil(response.data.workadds.length/this.per_page);
                    $('#pagination-demo').twbsPagination($.extend({}, defaultOpts, {
                        startPage: Math.min(this.currentPage, totalPages),
                        totalPages: totalPages,
                        onPageClick: function (event, page) {
                          over_info.currentPage = page;
                        }
                    }));
                  
                  this.gridData = response.data.workadds.slice((this.currentPage-1) * this.per_page,
                                                                    this.currentPage * this.per_page);
                    
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                    if(response.data.message == "Insufficient permissions"){
                        setTimeout(()=>{
                          window.location.href = "self_over_management.html";}, 1000);
                    }
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
        },
        load_workadd: function(workadd_id) {
            this.item = this.share_load(workadd_id);
            $('#workadd_modal').modal('show');
        },
        //同意
        manage_workadd: function(workadd_id) {
            this.item = this.share_load(workadd_id);
            var put_data = Object.assign({}, this.item, {'workadd_ok': '1'});
            var target_url = this.apiUrl + "workadds/" + this.item.workadd_id + "/";

            this.$http.put(target_url, put_data)
              .then((response) => {
                    noty({"text": 'Operation Successfully!', "layout":"top","type":"information"});
                    this.get_workadds();
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        //驳回
        reject_workadd: function(workadd_id) {
            this.item = this.share_load(workadd_id);
            var put_data = Object.assign({}, this.item, {'workadd_ok': '-1'});
            var target_url =  this.apiUrl + "workadds/" + this.item.workadd_id + "/";

            this.$http.put(target_url, put_data)
              .then((response) => {
                noty({"text": 'Reject Successfully!', "layout":"top","type":"information"});
                this.get_workadds();
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        share_load: function(workadd_id) {
            var vm = this;
            var res;
            vm.gridData.forEach(function(item) {
                if (item.workadd_id == workadd_id) {
                    res = deepCopy(item);
                    return;
                }
            });
            return res;
        }
    },
    watch: {
      per_page: function(val) {
        this.get_workadds();
      },
      currentPage: function(val) {
        this.get_workadds();
      }
    }
});


var t =  [
    {
      "holiday_app_end": false, 
      "holiday_app_over": false, 
      "holiday_apply_ok": 0, 
      "holiday_apply_state": 0, 
      "holiday_apply_time": "2016-12-17 00:00:00", 
      "holiday_end_time": null, 
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
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
      "workadd_id": 1, 
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
      "workadd_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    }
  ]