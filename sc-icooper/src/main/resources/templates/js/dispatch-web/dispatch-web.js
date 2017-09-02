/**
 * Created by Yiyuery on 2017/8/31.
 */
require(["capsule", "dispatch-api", "avalon", "layer"], function (capUtils) {

    layer.config({
        path: window.top.main.contextPath + '/js/lib/layer/' //layer.js所在的目录，可以是绝对目录，也可以是相对目录
    });

    function init() {
        initDispatcher();
        initEventListener();
        initVideoOcxPlugin();
    }

    var globalHolder = {
        current: {
            /**
             * 当前呼入手柄号
             */
            tel: "",
            /**
             * 待打开视频ID
             */
            devId:''
        }
    }

    /**
     * 初始化dom事件监听
     */
    function initEventListener() {
        $('#hang-up-call').click(function () {
            if (globalHolder.current.tel == "") {
                layer.msg("无电话可以挂断！");
                return;
            }
            window.DispatchAPI.operations.hungUp(globalHolder.current.tel);
        });

        $().click(function(){
            $('#video-ocx').ScVideo({
                method : 'playVideo',
                args:[globalHolder.current.devId]
            });
        })
    }

    /**
     * 界面模拟日志输出
     * @param msg
     */
    function log(msg) {
        var lHtml = '<div class="log-line">' + capUtils.timeUtil.getTimeStamp() + msg + '</div>';
        $('.dispatch-opts-log').append(lHtml);
    }

    /**
     * 初始化dispatcher插件
     */
    function initDispatcher() {
        /**
         * require dispatch-web.js 需要加载时间
         */
        setTimeout(function () {
            /**
             * dispatch 初始化控件
             */
            window.DispatchAPI.init({
                CALL_IN: true,
                CHANGE_CFG: true
            }, function (evt) {
                console.log(evt);
                dispatchNotify({
                    type: evt.type,
                    msg: evt.msg
                })
            });

        }, 2000);
    }

    /**
     * dispatch 通知转发
     * @param key
     */
    function dispatchNotify(para) {
        console.log(para);
        switch (para.type) {
            case "callInChanged" :
                APITest.PHONE.callInTest(para.msg);
                break;
            default:
                break;
        }
    }

    var APITest = {
        /**
         * 通话相关
         */
        PHONE: {
            /**
             * 呼入相关
             * @param msg
             */
            callInTest: function (msg) {
                if (msg.type == "add") {
                    log("有新电话 A 呼入：" + msg.data.tel);
                    globalHolder.current.tel = msg.data.tel;
                }
                if (msg.type == "del") {
                    /**
                     * 挂断分两种：
                     * 一种拨入用户主动挂断
                     * 一种平台操作dispatch-web接口实现用户被动挂断
                     */
                    log("当前A呼入SYS电话：已挂断：" + msg.data.tel);
                    globalHolder.current.tel = "";
                }
            }
        }
    }

    /**
     * 视频控件初始化
     */
    function initVideoOcxPlugin(){
        $('#video-ocx').ScVideo({
            autoPlay: false,
            user:  'xcy',
            password:'1',
            server:'192.168.106.91',
            port: '25100',
            devId: devId
        });
    }

    $(document).ready(function () {
        init();
    });


});

