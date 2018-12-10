/**
 *
 */
$(function () {

    /*初始化Bmob*/
    Bmob.initialize("d1b5d31e2923daaeb2a020df7bf33547", "98c0cd88f7a59d97d3d65d104be9619c");
    //
    var contactUs=Bmob.Object.extend("contact_us");


    /*创建用户记录*/
    var saveContact=function (params) {
        //
        var instance=new contactUs();
        $.each(params,function (key,value) {
            instance.set(key,value);
        });

        //
        var defer=$.Deferred();
        instance.save(null,{
            success:function (resp) {
                defer.resolve({
                    code:200,
                    data:$.extend({},params,{id:resp.id})
                });
            },
            error:function (resp,error) {
                defer.reject({
                    code:500,
                    error:error
                })
            }
        });
        return defer.promise();
    }



    window.httpApi={
        saveContact:saveContact,
    }
})