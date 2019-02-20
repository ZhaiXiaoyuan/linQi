/**
 * Created by Administrator on 2018/2/4 0004.
 */
$(function () {
    /**
     *
     */
    var isMobile=utils.deviceType();

    /**
     * 图片懒加载
     */
    $(".lazy").lazyload({effect: "fadeIn"});


    /**
     * 导航模块
     */
    window.menuToggle=function (e) {
        e&&e.stopPropagation();
        var $header=$('.header');
        if($header.hasClass('active')){
            $header.removeClass('active');
        }else{
            $header.addClass('active');
        }
    }


    /**
     * 监听滚动条
     */
    var $window=$(window);
    var $toTopBtn=$('.to-top-btn');
    var $header=$('.header');
    $(document).on('scroll', function () {
        var winTop = $window.scrollTop(); //当前滚动条的高度
        if(winTop>200){
           /* $header.addClass('scroll');*/
            $toTopBtn.removeClass('cm-hidden');
        }else{
           /* $header.removeClass('scroll');*/
            $toTopBtn.addClass('cm-hidden');
        }
    }.bind(this));

    /**
     * 轮播
     */
    var $pages=$('.page');
    var serviceSwiper=null;
    var curIndex=0;
    var swiper=null;
    function inintSwiper() {
        swiper = new Swiper('.page-container', {
            direction: 'vertical',
            slidesPerView: 1,
            spaceBetween: 0,
            mousewheel: true,
            on: {
                init: function(){
                    this.emit('slideChangeTransitionEnd');//在初始化时触发一次transitionEnd事件
                },
                slideChangeTransitionStart: function(){
                    setCurPage(this.activeIndex);
                    var $lastPage=$($pages.eq(curIndex));
                    initAnimate($lastPage.find('.animation-item'),'reset');
                },
                slideChangeTransitionEnd: function(){
                    curIndex=this.activeIndex;
                    var $curPage=$($pages.eq(this.activeIndex));
                    initAnimate($curPage.find('.animation-item'),'ani');
                    //
                    if(this.activeIndex==1&&!serviceSwiper){
                        serviceSwiper = new Swiper('.service-container', {
                            effect: 'cube',
                            grabCursor: true,
                            cubeEffect: {
                                shadow: false,
                                slideShadows: true,
                                shadowOffset: 20,
                                shadowScale: 0.94,
                            },
                            autoplay: {
                                delay: 5000,
                                stopOnLastSlide: false,
                                disableOnInteraction: true,
                            },
                            on: {
                                init: function(){
                                    $('.service-container').addClass('active');
                                    this.emit('transitionEnd');//在初始化时触发一次transitionEnd事件
                                },
                                transitionStart: function(){
                                    setCurContent(this.activeIndex);
                                },
                                transitionEnd: function(){

                                },
                            },
                        });
                    }
                },
            },

        });

        var startScroll, touchStart, touchCurrent;
        swiper.slides.on('touchstart', function (e) {
            startScroll = this.scrollTop;  //当前获取滚动条顶部的偏移
            touchStart = e.targetTouches[0].pageY; //手指触碰位置距离盒子顶部距离
        }, true);
        swiper.slides.on('touchmove', function (e) {
            touchCurrent = e.targetTouches[0].pageY;
            var touchesDiff = touchCurrent - touchStart;
            var slide = this;
            var onlyScrolling =
                ( slide.scrollHeight > slide.offsetHeight ) &&
                (
                    ( touchesDiff < 0 && startScroll === 0 ) ||
                    ( touchesDiff > 0 && startScroll === ( slide.scrollHeight - slide.offsetHeight ) ) ||
                    ( startScroll > 0 && startScroll < ( slide.scrollHeight - slide.offsetHeight ) )
                );
            if (onlyScrolling) {
                e.stopPropagation();
            }
        }, true);

        function initAnimate($eles,type) {
            if(type=='reset'){
                $.each($eles,function (i,ele) {
                    var $ele=$(ele);
                    $ele.removeClass($ele.attr('animation')+' animated');
                })
            }else{
                $.each($eles,function (i,ele) {
                    var $ele=$(ele);
                    $ele.addClass($ele.attr('animation')+' animated');
                })
            }
        }
    }

/*    setTimeout(function () {
        swiper.slideTo(1);
    },500)*/


    /**
     * 监听开场视频
     */
    if(isMobile){
        $('.start-mask').remove();
        inintSwiper();
    }else{
        var video = document.getElementById('video');
        var hasLoaded = false;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'static/video.mp4', true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = '6000';
        xhr.send();
        xhr.onload = function() {
            if (xhr.status !== 200) {
                return;
            }
            // 转换成文件格式
            var binaryData = new Uint8Array(xhr.response);
            // 生成一个本地的url
            var rUrl = window.URL.createObjectURL(new Blob([binaryData], {
                type: "video/mp4"
            }));
            // video赋值
            video.src = rUrl;
            // 加载成功标识
            hasLoaded = true;
            setTimeout(function () {
                $('.start-mask').fadeOut();
                inintSwiper();
            },7000);
        };
        xhr.onerror = function () {
            console.log("video request was wrong");
        };
        video.addEventListener('click',function (e) {
            video.pause();
            $('.start-mask').fadeOut();
            inintSwiper();
        });
    }

    /**
     *
     */
    window.goToPage=function (index) {
        swiper.slideTo(index);
      /*  setCurPage(index);*/
    };
    //导航栏样式控制
    var $navList=$('.nav-list li');
    function setCurPage(index) {
        $navList.removeClass('active');
        $navList.eq(index).addClass('active');
    }


    /**
     *服务内容切换
     */
    var $tab=$('.tab-list li');
    var $tabContent=$('.tab-content');
    var curContentIndex=0;
    $tab.click(function (e) {
        var $this=$(e.currentTarget);
        serviceSwiper.slideTo($this.index());
        setCurContent($this.index());
      /*  $tabContent.removeClass('active');
        $('.'+$this.attr('target')).addClass('active');*/
    });
    function  setCurContent(index) {
        if(isMobile){
            if(index>2&&index>curContentIndex){
                $('#h-scroll').scrollLeft(500);
            }else if(index<=2&&index<curContentIndex){
                $('#h-scroll').scrollLeft(0);
            }
            curContentIndex=index;
        }
        $tab.removeClass('active');
        $tab.eq(index).addClass('active');
    }

 /*   $(window).resize(function () {          //当浏览器大小变化时
       if(localStorage.getItem('reloaded')!='true'&&document.documentElement.scrollWidth<=500){
           localStorage.setItem('reloaded','true');
           window.location.reload();
       }else{
           localStorage.setItem('reloaded','false');
       }
    });
*/
    /**
     * 数据统计
     */
    var mta = document.createElement("script");
    mta.src = "//pingjs.qq.com/h5/stats.js?v2.0.4";
    mta.setAttribute("name", "MTAH5");
    mta.setAttribute("sid", "500658351");
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(mta, s);

    /**
     * 提交数据
     */
    //单选框控制
    var $checkbox=$('.cm-checkbox');
    $checkbox.click(function (e) {
        var $this=$(e.currentTarget);
        $checkbox.removeClass('selected');
        $this.addClass('selected');
    });
    window.submit=function () {
        var type=$('.cm-checkbox.selected').attr('value');
        var name=$('input[name=name]').val();
        var position=$('input[name=position]').val();
        var company=$('input[name=company]').val();
        var region=$('input[name=region]').val();
        var phone=$('input[name=phone]').val();
        var email=$('input[name=email]').val();
        var remark=$('textarea[name=remark]').val();

        if(!name){
            utils.operationFeedback({type:'warn',text:'请输入您的姓名'});
            return
        }
        if(!position){
            utils.operationFeedback({type:'warn',text:'请输入您的职位'});
            return
        }
        if(!company){
            utils.operationFeedback({type:'warn',text:'请输入您的公司'});
            return
        }
        if(!region){
            utils.operationFeedback({type:'warn',text:'请输入地区'});
            return
        }
        if(!phone){
            utils.operationFeedback({type:'warn',text:'请输入您的手机'});
            return
        }
        if(!email){
            utils.operationFeedback({type:'warn',text:'请输入您的邮箱'});
            return
        }
        if(!remark){
            utils.operationFeedback({type:'warn',text:'请输入描述'});
            return
        }
        var params={
            type:type,
            position:position,
            phone:phone,
            name:name,
            email:email,
            content:remark,
            company:company,
            address:region,
        }
        var fb=utils.operationFeedback({text:'提交中...'});
        httpApi.saveContact(params).then(function (data) {
            if(data.code==200){
                fb.setOptions({type:'complete',text:'提交成功'});
            }else{
                fb.setOptions({type:'warn',text:data.error});
            }
        })
    }

    /**
     * 临时测试
     */
    function websocketTest(id) {
        console.log('___________'+id+'____________');
        // 初始化一个 WebSocket 对象
        var ws = new WebSocket("ws://zyu-server.wicp.net:55788/123");

// 建立 web socket 连接成功触发事件
        ws.onopen = function (evt) {
            // 使用 send() 方法发送数据
            ws.send("发送数据");
            console.log("数据发送中**",id,'**:',evt);
        };

// 接收服务端数据时触发事件
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            console.log("数据已接收**",id,'**:'+received_msg);
        };

// 断开 web socket 连接成功触发事件
        ws.onclose = function (evt) {
            console.log("连接已关闭**",id,'**:',evt);
        };
    }
/*
    for(var i=0;i<3;i++){
        websocketTest(i)
    }*/
})