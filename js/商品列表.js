/**
 * Created by Administrator on 2016/12/21.
 */
$(function () {

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

    /*倒计时*/
    timerFn(intDiff);

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


    /*生成商品列表*/
    for(var i=12;i<22;i++){
        //console.log(localStorage.getItem("data-item"+i));
        var data=JSON.parse(localStorage.getItem("data-item"+i));
        var $con=$('<div class="data-item beauty-poster waterfall-box" data-sel="'+i+'">'+
            '<a href="商品详情.html?data-sel='+i+'" class="pic-more" style="background: url('+data.goodsImg+'); background-size:cover; ">'+
            '<span class="flag">'+
            '<img src="img/idid_ie4wkyjsgy2wknjsmmzdambqgqyde_72x78.png" alt="">'+
            '</span>'+
            '</a>'+
            '<a href="javascript:;" class="title">'+data.goodsName+'</a>'+
            '<div class="price">'+
            '<span class="ori-price">'+data.goodsPrice+'</span>'+
            '<del>'+data.goodsWeight+'</del>'+
            '</div>'+
            '<div class="buyBox clearfix">'+
            '<a href="javascript:;" target="_blank" class="buyBtn">立即抢购</a>'+
            '<div class="buyed">'+
            '<p>仅剩'+data.goodsByBuyCount+'件</p>'+
            '<div class="jdt">'+
            '<div class="inner" style="width:'+(data.goodsByBuyCount/data.goodsCount)*96+'px;"></div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>');
        $(".waterfall-container").append($con);
    }

})

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