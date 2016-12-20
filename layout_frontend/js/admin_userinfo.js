var admin_user = new Vue({
    el: "#admin_user",
    data: {
        show: false,
    	  apiUrl: 'http://104.160.33.183:5000/admin/workers/',
        gridColumns: [{
            name: '工号'
        }, {
            name: '姓名'
        }, {
            name: '性别'
        }, {
            name: '部门'
        }, {
            name: '职务'
        }, {
            name: '邮箱'
        }, {
            name: '地址'
        }, {
            name: '操作'
        }],
        gridData: [],
        item: {},
        options: [],
        currentPage: 1,
        per_page: 10,
        male: {
            true: "男",
            false: "女"
        },
        degree: [],
        department: [],
        degree_department_id: 1,
        degree_degree_id: 1,
        degree_manage: 0
    },
    ready: function(){
    	  this.get_workers();
        this.get_degree_info();
        this.get_deparment_info();
    },
    methods:{
        get_workers: function() {
            this.$http.get(this.apiUrl, { params: {'page': this.currentPage, 
              'per_page': this.per_page}}).then((response) => {
                  $('#pagination-demo').twbsPagination('destroy');
                  if(response.data.total_page_num > 0) {
                      var totalPages = response.data.total_page_num;
                      $('#pagination-demo').twbsPagination($.extend({}, defaultOpts, {
                          startPage: Math.min(this.currentPage, totalPages),
                          totalPages: totalPages,
                          onPageClick: function (event, page) {
                            admin_user.currentPage = page;
                          }
                      }));
                  }
                  else{
                    this.currentPage = 1;
                    return;
                  }

                  this.gridData = response.data.workers;
                    
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        load_worker: function(worker_id) {
            this.item = this.share_load(worker_id);
            $('#worker_modal').modal('show');
        },
        load_worker_pass: function(worker_id) {
            this.item = this.share_load(worker_id);
            $('#password_modal').modal('show');
        },
        save_worker: function() {
            if(this.item.worker_password){
                if(!this.item.worker_password || !this.item.worker_password2){
                    noty({"text":"Please fill all information","layout":"top","type":"error"});
                    return;
                }
                else if(this.item.worker_password != this.item.worker_password2){
                    noty({"text":"Please input same new password!","layout":"top","type":"error"});
                    return;
                }
            }
            this.$http.put(this.apiUrl + this.item.worker_id + '/', this.item)
                            .then((response) => {
                                noty({"text":"Modify information successfully","layout":"top","type":"information"}); 
                            }, (response) => {
                    console.log(response);
                    noty({"text":response.data.message, "layout":"center","type":"error"}); 
                // 响应错误回调
            });
            this.get_workers();
        },
        share_load: function(worker_id) {
            var vm = this;
            var res;
            vm.gridData.forEach(function(item) {
                if (item.worker_id == worker_id) {
                    res = deepCopy(item);
                    return;
                }
            });
            return res;
        },
        get_degree_info: function() {
            this.$http.get('http://104.160.33.183:5000/admin/degree_infos/').then((response) => {
                    this.degree = response.data.degree_infos;
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        get_deparment_info: function() {
            this.$http.get('http://104.160.33.183:5000/admin/department_infos/').then((response) => {
                    this.department = response.data.department_infos;
              }, (response) => {
                    console.log(response);
                    noty({"text": response.data.message, "layout":"top","type":"error"});
                // 响应错误回调
            });
        },
        manage_degree: function(worker_id) {
            this.item = this.share_load(worker_id);
            this.degree_department_id = -1;
            this.degree_department_id = 1;
            this.degree_degree_id = this.get_degree(1);
            $('#degree_modal').modal('show');
        },
        save_degree: function() {
            console.log(this.degree_department_id);
            console.log(this.degree_degree_id);
            if(this.get_degree(this.degree_department_id) == 0){
                var target_url = this.apiUrl + this.item.worker_id + '/degree/';
                var put_data = {'degree_department_id': this.degree_department_id.toString(), 
                                  'degree_degree_id': this.degree_degree_id.toString()};
                this.$http.post(target_url, put_data).then((response) => {
                    // 响应成功回调
                    noty({"text":"Operation successfully!","layout":"top","type":"information"});
                    this.get_workers();
                    return;
                  }, (response) => {
                        console.log(response);
                        noty({"text": response.data.message, "layout":"top","type":"error"});
                    // 响应错误回调
                });
            }
            else{
                if(this.degree_degree_id == 0){
                    var target_url = this.apiUrl + this.item.worker_id + '/degree/' + this.degree_department_id;
                    var put_data = {"degree_department_id" : this.degree_department_id.toString()};
                    console.log(put_data)
                    console.log(JSON.stringify(put_data))
                    this.$http.delete(target_url).then((response) => {
                        // 响应成功回调
                        noty({"text":"Operation successfully!","layout":"top","type":"information"});
                        this.get_workers();
                        return;
                      }, (response) => {
                            console.log(response);
                            noty({"text": response.data.message, "layout":"top","type":"error"});
                        // 响应错误回调
                    });
                }
                else {
                    var target_url = this.apiUrl + this.item.worker_id + '/department/' + this.degree_department_id + '/';
                    var put_data = {'worker_degree_degree': this.degree_degree_id.toString()};
                    this.$http.put(target_url, put_data).then((response) => {
                        // 响应成功回调
                        noty({"text":"Operation successfully!","layout":"top","type":"information"});
                        this.get_workers();
                        return;
                      }, (response) => {
                            console.log(response);
                            noty({"text": response.data.message, "layout":"top","type":"error"});
                        // 响应错误回调
                    });
                }
            }
        },
        get_degree: function(val) {
            for(v in this.item.worker_degree){
              if((this.item.worker_degree)[v].degree_department_id == val) {
                  return (admin_user.item.worker_degree)[v].degree_degree_id;
              }
          }
          return 0;
        }
    },
    watch: {
      per_page: function(val) {
          this.get_workers();
      },
      currentPage: function(val) {
          this.get_workers();
      },
      degree_department_id: function(d_val) {
          $("#degree_select").val(this.get_degree(d_val));
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
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
      "worker_id": 1, 
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
      "worker_id": 2, 
      "holiday_reason": "test2", 
      "holiday_time_begin": "2016-12-18 00:20:14", 
      "holiday_time_end": "2016-12-23 05:25:14", 
      "holiday_type": 2, 
      "holiday_worker_id": "3013218001"
    }
  ]