var over_info = new Vue({
    el: "#over_info",
    data: {
        show: false,
    	  apiUrl: 'http://104.160.33.183:5000/api/v1.0/worker/workadds/',
        gridColumns: [{
            name: '编号'
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
            this.$http.get(this.apiUrl, { params: {'page': this.currentPage, 
              'per_page': this.per_page}}).then((response) => {
                  $('#pagination-demo').twbsPagination('destroy');
                  if(response.data.total_page_num > 0) {
                      var totalPages = response.data.total_page_num;
                      $('#pagination-demo').twbsPagination($.extend({}, defaultOpts, {
                          startPage: Math.max(Math.min(this.currentPage, totalPages), 1),
                          totalPages: Math.max(totalPages, 1),
                          onPageClick: function (event, page) {
                            over_info.currentPage = page;
                          }
                      }));
                  }
                  else{
                    this.currentPage = 1;
                    return;
                  }

                  this.gridData = response.data.workadds;
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
        },
        load_workadd: function(workadd_id) {
            this.item = this.share_load(workadd_id);
            $('#workadd_modal').modal('show');
        },
        //撤回
        end_workadd: function(workadd_id) {
            this.item = this.share_load(workadd_id);
            var put_data = Object.assign({}, this.item, {'workadd_over': '-1'});
            this.$http.put(this.apiUrl + this.item.workadd_id + "/", put_data)
              .then((response) => {
                noty({"text": response.data.message, "layout":"top","type":"information"});
                this.get_workadds();
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        save_workadd: function() {
            this.item.workadd_type = this.workadd_type.toString();
            var vm = this;
            this.$http.put(this.apiUrl + this.item.workadd_id + "/", this.item)
                            .then((response) => {
                                noty({"text": 'Modify Successfully', "layout":"top","type":"information"});
                                this.get_workadds();
                                //setTimeout(function() { $("#dt").DataTable(); }, 1000);
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