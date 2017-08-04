/**
 * Created by Administrator on 2016/12/18.
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

    /*三级菜单*/
    /*下拉菜单-3*/
    slideFn(".all",".attr-box");
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

    /*选项卡*/
    $(".tab_sel_list>ul>li:first-child").addClass("select");
    $(".tab_con_sel>.tab_list_all:first-child").show();
    $(".tab_sel_list>ul>li").click(function () {
        $(this).addClass("select").siblings().removeClass("select");
        $(".tab_con_sel>.tab_list_all").eq($(this).index()).fadeIn(600).siblings().fadeOut(600);
    })

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
                var data=eval("("+data+")");
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

});
