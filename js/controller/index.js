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
     * 监听开场视频
     */
    if(isMobile){
        $('.start-mask').remove();
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
            },7000);
        };
        xhr.onerror = function () {
            console.log("video request was wrong");
        };
        video.addEventListener('click',function (e) {
            video.pause();
            $('.start-mask').fadeOut();
        });
    }

    /**
     * 导航模块
     */
    var $navList=$('.nav-list li');
    window.navGo=function (e,id,type) {
        $navList.find('a').removeClass('active');
        $navList.find('[target='+id+']').addClass('active');
        utils.goAnchor(e,id);
        if(type=='menu'&&isMobile){
            toggleNavBlock();
        }
    }

    /**
     *移动端时菜单的显示控制
     */
    var $navBlock=$('.nav-list');
    function toggleNavBlock() {
        if(!isMobile){
            return;
        }
        if($navBlock.hasClass('active')){
            $navBlock.slideUp();
            $navBlock.removeClass('active');
        }else{
            $navBlock.slideDown();
            $navBlock.addClass('active');
        }
    }
    $('.menu-icon').click(function (e) {
        toggleNavBlock();
    });

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

    var swiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        slidesPerView: 1,
        spaceBetween: 0,
        mousewheel: true,
       /* pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },*/
        on: {
            slideChangeTransitionStart: function(){
                setCurPage(this.activeIndex);
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

    /*    swiper.slideTo(3);*/


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
    $tab.click(function (e) {
        var $this=$(e.currentTarget);
        $tab.removeClass('active');
        $this.addClass('active');
        $tabContent.removeClass('active');
        $('.'+$this.attr('target')).addClass('active');
    });

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
})