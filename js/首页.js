/**
 * Created by Administrator on 2016/12/12.
 */
$(function(){
    /*大半透明层*/
    $("#maskLayer").height($("body").height());
    $(".close_box_btn").click(function () {
        $("#big_wrap").fadeOut(600);
        $("#maskLayer").fadeOut(600);
    });

    /*下拉菜单*/
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
    slideFn(".hlep",".down");
    slideFn(".add",".down");
    slideFn(".enter_mes",".down");


    /*判断是否存在cookie*/
    var user=$.cookie('userName');
    if($.cookie('userName')!=null){
        $(".enter_mes").show();
        $(".enter_mes").prevAll().hide();
        $(".enter_mes").find("span").html($.cookie('userName'));
        $.ajax({
            type:"get",
            url:"http://10.35.164.185:8080/myWeb/getShoppingCart.jsp?stuId=9&userName="+user,
            async:true,
            success:function(data){
                var data=eval("('+data+')");
                var s=data.length-2;
                $(".red_radious").html(s);
                //console.log(data);
                for(var i=2;i<data.length;i++){
                    var $con=('<li>'
                    +'<a href="javascript:;" target="_blank" style="padding: 0; float: left;">'
                    +'<span class="cart-goods-img" style="background: url('+data[i].goodsImg+') no-repeat; background-size: cover;"></span>'
                    +'</a>'
                    +'<div class="cart-goods-desc">'
                    +'<p><a href="javascript:;" target="_blank" style="padding: 0; float: left;">'
                    +'<span class="cart-goods-title">'+data[i].goodsContent+'</span>'
                    +'</a>'
                    +'<span class="cart-goods-price">'+data[i].goodsPrice+'</span>'
                    +'</p>'
                    +'<p class="cart-goods-info">'
                    +'<span class="cart-goods-title">'
                    +'<span>颜色:'+data[i].goodsColor+'</span>&nbsp;&nbsp;'
                    +'<span>尺码:均码</span>&nbsp;&nbsp;'
                    +'</span>'
                    +'<em class="del-cart-goods"></em>'
                    +'</p>'
                    +'</div>'
                    +'</li>');
                    $(".cart-goods").append($con);
                }
            }
        })
    }else{
        $(".enter_mes").prevAll().show();
        $(".enter_mes").hide();
    }

    /*点击退出删除cookie*/
    $(".enter_mes .down>li:eq(1)").click(function () {
        $.removeCookie('userName');
        $.removeCookie('userNumber');
        $.removeCookie('userPass');
        $(".enter_mes").prevAll().show();
        $(".enter_mes").hide();
    })

    /*左侧淡入淡出菜单*/
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
    fadeFn(".biu-download",".mls-qrcode");

    /*右侧页面返回顶部按钮显示，隐藏，点击返回顶部*/
    $(window).scroll(function () {
        var _height=$(this).scrollTop();
        var _windowH=$(this).height();
        if(_height>_windowH){
            $(".biu-go2-top").fadeIn(600);
        }else {
            $(".biu-go2-top").fadeOut(600);
        }
    });
    $(".biu-go2-top").click(function () {
        $("body").animate({"scrollTop": 0},0);
    });

    /*滑动轮播图*/
    /*--封装函数--*/
    var i=0;
    var timer=null;
    var $width=$(".banner li").width();
    $(".num b").first().addClass("cur");
    var $li=$(".banner li").first().clone();
    $(".banner").append($li);
    var $len=$(".banner li").size();
    $(".num b").hover(
        function(){
            clearInterval(timer);
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".banner").stop().animate({"left":-($(this).index()*$width)},600);
        },
        function(){
            var _index=$(this).index();		//鼠标划出记录此时索引
            i=_index;
            timer=setInterval(function(){	//开启定时器
                i++;
                moveFn();
            },2000);
        }
    );
    /*运动函数，判断i值*/
    function moveFn(){
        if(i==$len){	//判断是否是最后的一张，是，则拉回第一张，i=1
            $(".banner").css({left:0});
            i=1;
        }
        if(i==-1){		//判断当前是否为第一张
            $(".banner").css({left:-($len-1)*$width});
            i=$len-2;
        }
        $(".banner").stop().animate({left:-i*$width},600);
        if(i==($len-1)){	//添加类cur
            $(".num b").eq(0).addClass("cur").siblings().removeClass("cur");
        }else{
            $(".num b").eq(i).addClass("cur").siblings().removeClass("cur");
        }
    }
    /*划上左右按钮，清除定时器*/
    $(".prev,.next").mouseover(function () {
        clearInterval(timer);
    });
    /*左边按钮，实现左滑*/
    $(".prev").click(function(){
        clearInterval(timer);
        i--;
        //console.log(i)
        moveFn();
    });

    /*右边按钮，实现右滑*/
    $(".next").click(function(){
        clearInterval(timer);
        i++;
        moveFn();
    });
    timer=setInterval(function(){		//自动轮播
        i++;
        moveFn();
    },2000);
    $("#banner").hover(function () {	//划上清除，划出开启
        clearInterval(timer);
    }, function () {
        timer=setInterval(function(){
            i++;
            moveFn();
        },2000);
    });

    /*左侧延时一级菜单*/
    $(".sel-attr .list").hover(
        function () {
            var $showCon=$(this).children(".nav-list");
            $(this).addClass("pinkborder");
            $showCon.show();
        },
        function () {
            var $showCon=$(this).children(".nav-list");
            $(this).removeClass("pinkborder");
            $showCon.hide();

        }
    );

    /*楼层效果*/
    $("#sel_ceng ul li").hover(
        function(){
            var $img=$(this).children(".img_fix");
            $img.show();
        },
        function(){
            var $img=$(this).children(".img_fix");
            $img.hide();
        }
    );
    //        鼠标点击左侧跳到对应楼层
    $("#sel_ceng ul li").click(function () {
        var _this=$(this).index();
        //console.log(_this);
        var _top=$(".h2-title").eq(_this).offset().top;
        $("body").animate({"scrollTop": _top},600);
    });
    //        浏览器窗口滚动
    $(window).scroll(function(){
        var _height=$(this).scrollTop();
        var _windowH=$(this).height();
        if(_height>_windowH){
            $("#sel_ceng ul li").children(".img_fix").hide();
            $("#sel_ceng").fadeIn(600);
        }else {
            $("#sel_ceng").fadeOut(600);
        }
    //            判断划过对应的楼层
        $(".top_wrap .h2-title").each(function(){
            var _num=$(this).index();
            //console.log(_num)
            var $top=$(this).offset().top-$(this).height();
            if(_height>$top){
               var $child=$("#sel_ceng ul li").eq((_num-3)/2).children(".img_fix")
                $child.show();
            }
        })
    });

    /*倒计时*/
    timerFn(intDiff);

    /*请求生成商品,简短的瀑布流*/
    var $page=0;
    getImg();
    function getImg(){
        $.ajax({
            type:"get",
            url:"js/goods.json",
            async:true,
            success:function(data){
                //console.log(data);
                $.each(data[$page].page, function(j,com) {
                    var $con=$('<div class="data-item beauty-poster waterfall-box">'+
                        '<a href="javascript:;" class="pic-more" style="background: url('+data[$page].page[j].img+');">'+
                        '<span class="flag">'+
                        '<img src="img/idid_ie4wkyjsgy2wknjsmmzdambqgqyde_72x78.png" alt="">'+
                        '</span>'+
                        '</a>'+
                        '<a href="javascript:;" class="title">'+data[$page].page[j].more+'</a>'+
                        '<div class="price">'+
                        '<span class="ori-price">'+data[$page].page[j].price+'</span>'+
                        '<del>'+data[$page].page[j].del+'</del>'+
                        '</div>'+
                        '<div class="buyBox clearfix">'+
                        '<a href="javascript:;" target="_blank" class="buyBtn">立即抢购</a>'+
                        '<div class="buyed">'+
                        '<p>仅剩'+data[$page].page[j].num+'件</p>'+
                        '<div class="jdt">'+
                        '<div class="inner" style="width:'+(data[$page].page[j].num/data[$page].page[j].cont)*96+'px;"></div>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</div>');
                    $(".waterfall-container").append($con);
                });
            }
        });
    }
    $(window).scroll(function () {
        var distance=$(window).height()+$(window).scrollTop();
        var $Height=$(".waterfall-container").height();
        var $Top=$(".waterfall-container").offset().top;
        if(($Height+$Top)<distance){
            if($page<4){
                $page++;
                getImg();
                $(".pull-up").fadeIn();
            }else{
                $(".pull-up").fadeOut();
            }
        } else {
            return false;
        }
    })

    /*点击跳转本地页面*/
    $("#top_bar .inner>ul>li:eq(2)").click(function () {
        window.location.href="登录.html";
    })
    $("#top_bar .inner>ul>li:eq(3)").click(function () {
        window.location.href="注册.html";
    })
    $(".add_car").click(function () {
        if($(".enter_mes").find("span").html()==""){
            if(confirm("您还未登录，是否跳转登录页？")){
                window.location.href="登录.html";
            }
        }else{
            window.location.href="购物车.html";
        }
    })
    $(".enter_mes .down>li:eq(0)").click(function (){
        window.location.href="个人设置.html";
    })


    /*点击存在localstorange*/
    $(".top-ad-box>li:eq(0)").click(function () {
        $.ajax({
            type:"get",
            url:"http://10.35.164.185:8080/myWeb/getGoodsList.jsp?stuId=9&userName="+$.cookie('userName'),
            async:true,
            success:function(data){
                var data=eval("("+data+")");
                //console.log(data);
                for(var i=12;i<data.length-2;i++){
                    localStorage.setItem("data-item"+i,JSON.stringify(data[i]));
                    //console.log(localStorage.getItem("data-item"+i,data[i]));
                }
                window.location.href="商品列表.html";
            }
        })
    })
});

/*倒计时函数*/
var $Date=new Date();
var $time=$Date.getDate();
var intDiff = $time+parseInt(1*60*60*60);//倒计时总秒数量
function timerFn(intDiff){
    window.setInterval(function(){
        var day=0,
            hour=0,
            minute=0,
            second=0;//时间默认值
        if(intDiff > 0){
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (day <= 9) day = '0' + day;
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        $("#day").html(day);
        $("#hours").html(hour);
        $("#minute").html(minute);
        $("#seconds").html(second);
        intDiff--;
    }, 1000);
}