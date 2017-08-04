/**
 * Created by Administrator on 2016/12/19.
 */
$(function () {
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

    /*移上分享图标显示*/
    fadeFn(".share",".share-w");

    /*图片滚动*/
    $(".small_img .list li").mouseover(function () {
        $(this).addClass("c").siblings().removeClass("c");
        $(".big_img_inner").children("img").attr("src","img/v"+($(this).index()+1)+"_big.jpg");
    })
    var onOff=true;
    $(".right-btn").click(function () {
        onOff=!onOff;
        if(!onOff){
            $(".small_img .list ul").animate({"left":"-350px"},1000);
            $(this).hide();
            $(this).prev().show();
        }
    })
    $(".left-btn").click(function () {
        onOff=!onOff;
        if(onOff){
            $(".small_img .list ul").animate({"left":"0"},1000);
            $(this).hide();
            $(this).next().show();
        }
    })


    /*选项卡*/
    $(".detail_right_sel .sel_l").click(function () {
        $(this).addClass("select").siblings().removeClass("select");
        $(".tab_box .detail_tab").eq($(this).index()).fadeIn(600).siblings().fadeOut(600);
    });

    /*楼层*/
    $(window).scroll(function () {
        var _height=$(this).scrollTop();
        var $top1=$(".shop_m>div:eq(0)").offset().top;
        var $top2=$(".shop_m>div:eq(1)").offset().top;
        var $top3=$(".shop_m>div:eq(2)").offset().top;
        var $top4=$(".shop_m>div:eq(3)").offset().top;
        //console.log($top1,$top2,$top3,$top4)
        if(_height>$top1&&_height<$top2){
            //alert(1)
            $(".extranav_list li").eq(0).addClass("selected").siblings().removeClass("selected");
        }
        if(_height>$top2&&_height<$top3){
            //alert(2)
            $(".extranav_list li").eq(1).addClass("selected").siblings().removeClass("selected");
        }
        if(_height>$top3&&_height<$top4){
            //alert(3)
            $(".extranav_list li").eq(2).addClass("selected").siblings().removeClass("selected");
        }
        if(_height>$top4){
            //alert(4)
            $(".extranav_list li").eq(3).addClass("selected").siblings().removeClass("selected");
        }
    })


    /*倒计时*/
    timerFn(intDiff);


    /*商品数量，号码选择*/
    $(".goods-sku .size-list li").click(function () {
        $(this).addClass("c").siblings().removeClass("c");
    });
    $(".goods-sku .style-list li").click(function () {
        $(this).addClass("c").siblings().removeClass("c");
    })
    /*数量减少*/
    var numA=parseInt($(".goods-stock span").html());
    var inputNum=parseInt($(".num-input").val());
    console.log(typeof (inputNum));
    var goodsNum=parseInt($(".goods-stock span").html());
    $(".num-reduce").click(function () {
        if(inputNum>0){
            inputNum--;
            goodsNum++;
            $(".num-input").val(inputNum);
            $(".goods-stock span").html(goodsNum);
        }else{
            inputNum=0;
            $(".num-input").val("0");
            $(".goods-stock span").html(numA);
        }
    });
    /*数量增加*/
    $(".num-add").click(function () {
        if(inputNum<numA){
            inputNum++;
            goodsNum--;
            $(".num-input").val(inputNum);
            $(".goods-stock span").html(goodsNum);
        }else{
            $(".goods-stock-tip").show();
            $(".num-input").val(numA);
            $(".goods-stock span").html(0);
        }
    });
    $(".num-input").change(function () {
        if($(this).val()>numA){
            $(".goods-stock-tip").show();
            $(this).val("0");
        }
    });

    /*折叠菜单*/
    var flag;
    $(".shop_left_list_box dt").click(function(){
        var next=$(this).next();
        var s=$(this).find("s");
        if(s.hasClass("up")){
            s.removeClass("up");
            s.addClass("down");
        }else if(s.hasClass("down")){
            s.removeClass("down");
            s.addClass("up");
        }
        $(this).next().slideToggle(300);
    });


    /*底部悬浮*/
    var fix=$("#detail_content .inner").offset().top;
    $(window).scroll(function () {
        var _scrollTop=$(this).scrollTop();
        if(_scrollTop>fix){
            $(".detail_right_sel ").css({"position":"fixed","left":"296px","top":"0"});
            $(".right_side ").css({"position":"fixed","right":"74px","top":"0"});
            $(".sel_l").last().css({"width":"268px"});
            $(".shop_left_title ").css({"position":"fixed","width":"218px","left":"77px","top":"0"});
        }else{
            $(".detail_right_sel ").css({"position":"static"});
            $(".right_side ").css({"position":"static"});
            $(".sel_l").last().css({"width":"140px"});
            $(".shop_left_title ").css({"position":"static","width":"198px"});
        }
    })

    /*划上显示二维码*/
    $(".sel_l:eq(3)").hover(
        function () {
            $(this).find(".qrcode-pic").show();
            $(".qrcode_arrow").css({"transform":"rotateX(180deg)"});
        },
        function () {
            $(this).find(".qrcode-pic").hide();
            $(".qrcode_arrow").css({"transform":"rotateX(0deg)"});
        }
    )

    /*登录判断*/
//    var user= $.cookie("userName");
//    if(user!=null){
//        $(".enter_mes").prevAll().hide();
//        $(".name_enter").html(user);
//        $(".enter_mes").show();
//    }else {
//        alert("请登录!");
//        window.location.href="登录.html";
//        $(".enter_mes").prevAll().show();
//        $(".enter_mes").hide();
//    }

    /*点击跳转过来，获取商品详情*/
    var size = location.search.split("=")[1];
    //console.log(size);
    //localStorage.getItem("data-item"+size);
    var content=JSON.parse(localStorage.getItem("data-item"+size));
    $(".title_img>h1").html(content.goodsContent);
    $("#J_OriginPrice").html(content.goodsWeight);
    $("#J_NowPrice").html(content.goodsPrice);
    $(".J_GoodsStock>span").html(content.goodsCount);
    $(".J_SaleNum").html(content.goodsByBuyCount);
    $(".big_img_inner>img").attr("src",content.goodsImg);


    /*点击添加购物车*/

    var num=$(".num-input").val();
    var id=content.goodsId;
    console.log(user,num,id)
    $("#J_BuyCart").click(function () {
         if(user==null){
             if(confirm("是否立即登录？")){
                 window.location.href="登录.html";
             }
         }else{
             $.ajax({
                 type:"get",
                 url:"http://10.35.164.185:8080/myWeb/addShoppingCart.jsp?stuId=9&userName="+user+"&goodsId="+id+"&goodsCount="+num,
                 async:true,
                 success:function(data){
                    //console.log(data);
                     if(data){
                         window.location.href="购物车.html";
                     }else{
                         alert("加入购物车失败!");
                     }
                 }
             })
         }
    })

});
/*倒计时函数*/
var $Date=new Date();
var $time=$Date.getDate();
var intDiff = $time+parseInt(5*60*60*60);//倒计时总秒数量
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
        $(".d").html(day);
        $(".h").html(hour);
        $(".m").html(minute);
        $(".s").html(second);
        intDiff--;
    }, 1000);
}