/**
 * Created by Administrator on 2016/12/15.
 */
$(function () {
    /*手风琴区域*/
    $(".top_tamp_con_pic").mouseover(function () {
        var $h2=$(this).children("h2");
        $(this).stop().animate({"width":224,"opacity":"1"},600).siblings().stop().animate({"width":139,"opacity":"0.75"},600);
        $h2.hide();
    });
    $(".top_tamp_con").mouseout(function(){
        $(".top_tamp_con_pic").stop().animate({"width":149,"opacity":"1"},600);
        $(".top_tamp_con_pic h2").show();
    });

    /*下拉菜单-1*/
    $(".count").hover(
        function(){
            $(this).children(".shop_info").stop(true,true).slideDown(600);
            $(".link_icon").css({"transform":"rotate(180deg)"});
            $(".left_con").css({"background":"#f6f6f6"});
        },
        function () {
            $(this).children(".shop_info").stop(true,true).slideUp(600);
            $(".link_icon").css({"transform":"rotate(0deg)"});
            $(".left_con").css({"background":"#fff"});
        }
    );
    var timeOut=null;
    $(".link_icon").hover(
        function(){
            clearTimeout(timeOut);
            $(".shop_info").stop(true,true).slideDown(600);
            $(this).css({"transform":"rotate(180deg)"});
            $(".left_con").css({"background":"#f6f6f6"});
        },
        function () {
            timeOut=setTimeout(function () {
                $(".shop_info").stop(true,true).slideUp(600);
                $(this).css({"transform":"rotate(0deg)"});
                $(".left_con").css({"background":"#fff"});
            },2000)
        }
    );
    /*下拉菜单-2*/
    /*--封装函数>obj对象，down下拉菜单--*/
    function slideFn(obj,down){
        $(obj).hover(
            function(){
                $(this).children(down).stop(true,true).slideDown(600);
            },
            function () {
                $(this).children(down).stop(true,true).slideUp(600);
            }
        )
    }
    /*--传参函数--*/
    slideFn(".my_cart",".cart_con_empty");
    slideFn(".my_hlep",".hlep_con");
    /*下拉菜单-3*/
    slideFn(".all",".all_list");
    /*--封装函数>obj对象，left左侧菜单--*/
    function fadeFn(obj,left){
        $(obj).hover(
            function(){
                $(this).children(left).stop(true,true).fadeIn(600);
            },
            function () {
                $(this).children(left).stop(true,true).fadeOut(600);
            }
        )
    }
    /*--传参函数--*/
    fadeFn(".list_1",".list_2");

    /*淡入淡出轮播图*/
    /*定义变量*/
    var $banner=$("#top_banner");
    var $nav=$(".banner_nav li");
    var $pic=$(".banner a");
    var $prev=$(".prev");
    var $next=$(".next");
    var $btn=$(".click_btn");
    var num=0;
    var timer=null;
    /*下标*/
    $nav.hover(
        function () {
            clearInterval(timer);
            $pic.eq($(this).index()).fadeTo(2000,1).siblings().fadeTo(2000,0);
            $(this).addClass("orange").siblings().removeClass("orange");
        },
        function () {
            var _this=$(this).index();
            num=_this;
            setInterval(function () {
                bannerFn();
                num++;
            },3000);
        }
    );
    /*自动轮播*/
    timer=setInterval(function () {
        num++;
        bannerFn();
        //console.log(num);
    },3000);
    /*轮播函数*/
    function bannerFn(){
        if(num>1){
            num=0;
        }
        if(num<0){
            num=1;
        }
        $pic.eq(num).fadeTo(2000,1).siblings().fadeTo(2000,0);
        $nav.eq(num).addClass("orange").siblings().removeClass("orange");

    }
    /*点击按钮*/
    $prev.click(function () {
        clearInterval(timer);
        num--;
        bannerFn();
    });
    $next.click(function () {
        clearInterval(timer);
        num++;
        bannerFn();
    });
    /*鼠标划上清楚定时器*/

/*选项卡*/
    $(".sel_tab span").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".tab_con .tab_con_n").eq($(this).index()).fadeIn(600).siblings().fadeOut(600);
    })

    /*登录信息*/
    var user= $.cookie("userName");
    if(user==null){
        alert("请登录!");
        window.location.href="登录.html";
        $(".enter_mes").prevAll().show();
        $(".enter_mes").hide();
    }else {
        $(".enter_mes").prevAll().hide();
        $(".name_enter").html(user);
        $(".enter_mes").show();
    }
});