/**
 * Created by Administrator on 2016/12/16.
 */
$(function () {
    //		全选的点击
    $(document).on("click",".check-all",function(){
        if($(this).prop("checked")){
            $(".check-all,.check-one").prop("checked",true);
            var resNum = 0;
            var moneyTotal = 0;
            $(".count-input").each(function(){
                resNum+=parseInt($(this).val());
            });
            $(".subtotal").each(function(){
                moneyTotal+=parseFloat($(this).html());
            });
            $("#selectedTotal").html(resNum);
            $("#priceTotal").html(moneyTotal.toFixed(2));
        }else{
            $(".check-all,.check-one").prop("checked",false);
            $("#priceTotal").html("0.00");
            $("#selectedTotal").html("0");
        }
    });

    //		数量加减
    $(document).on("click",".add",function(){
        var del=$(this).parents("tr").attr("del");
        var nowNum = parseInt($(this).prev().val());
        if(nowNum<99){
            $(this).prev().val(nowNum+1);
            var nowPrice = parseFloat($(this).parent().prev().html());
            var nowTotalNum = parseInt($("#selectedTotal").html());
            var nowTotalMoney = parseFloat($("#priceTotal").html());
            $.ajax({
                type:"get",
                url:"http://10.35.164.185:8080/myWeb/updateGoodsCount.jsp?stuId=9&userName="+user+"&goodsId="+del+"&goodsCount="+nowNum,
                async:true,
                success:function(data){
                    console.log(data);
                }
            })
            $(this).parent().next().html(((nowNum+1)*nowPrice).toFixed(2));
            if($(this).parent().parent().find(".check-one").prop("checked")){
                $("#selectedTotal").html(nowTotalNum+1);
                $("#priceTotal").html((nowTotalMoney+nowPrice).toFixed(2));
            }
        }
    });

    $(document).on("click",".reduce",function(){
        var del=$(this).parents("tr").attr("del");
        var nowNum = parseInt($(this).next().val());
        if(nowNum>1){
            $.ajax({
                type:"get",
                url:"http://10.35.164.185:8080/myWeb/updateGoodsCount.jsp?stuId=9&userName="+user+"&goodsId="+del+"&goodsCount="+nowNum,
                async:true,
                success:function(data){
                    console.log(data);
                }
            })
            $(this).next().val(nowNum-1);
            var nowPrice = parseFloat($(this).parent().prev().html());
            var nowTotalNum = parseInt($("#selectedTotal").html());
            var nowTotalMoney = parseFloat($("#priceTotal").html());
            $(this).parent().next().html(((nowNum-1)*nowPrice).toFixed(2));
            if($(this).parent().parent().find(".check-one").prop("checked")){
                $("#selectedTotal").html(nowTotalNum-1);
                $("#priceTotal").html((nowTotalMoney-nowPrice).toFixed(2));
            }
        }

    });

    //		单个商品checkbox的点击
    $(document).on("click",".check-one",function(){
        var flag = 1;
        $(".check-one").each(function(){
            if(!$(this).prop("checked")){
                flag = 0;
            }
        });
        if(flag==1){
            $(".check-all").prop("checked",true);
        }else{
            $(".check-all").prop("checked",false);
        }
        var nowNum = parseInt($(this).parent().parent().find(".count-input").val());
        var nowPrice = parseFloat($(this).parent().parent().find(".subtotal").html());
        var nowTotalNum = parseInt($("#selectedTotal").html());
        var nowTotalMoney = parseFloat($("#priceTotal").html());
        if($(this).prop("checked")){
            $("#selectedTotal").html(nowTotalNum+nowNum);
            $("#priceTotal").html((nowTotalMoney+nowPrice).toFixed(2));
        }else{
            $("#selectedTotal").html(nowTotalNum-nowNum);
            $("#priceTotal").html((nowTotalMoney-nowPrice).toFixed(2));
        }
    });

    //		删除商品
    var user= $.cookie("userName");
    $(document).on("click",".delete",function(){
        var _this=$(this).parents("tr");
        var del=$(this).parents("tr").attr("del");
        var a = confirm("是否确定删除商品？");
        var nowNum = parseInt($(this).parent().parent().find(".count-input").val());
        var nowPrice = parseFloat($(this).parent().parent().find(".subtotal").html());
        var nowTotalNum = parseInt($("#selectedTotal").html());
        var nowTotalMoney = parseFloat($("#priceTotal").html());
        if(a){
            $.ajax({
                type:"get",
                url:"http://10.35.164.185:8080/myWeb/deleteGoods.jsp?stuId=9&userName="+user+"&goodsId="+del,
                async:true,
                success:function(data){
                    if(data){
                        _this.remove();
                        alert("删除成功!")
                    }
                }
            })
            if($(this).parent().parent().find(".check-one").prop("checked")){
                $("#selectedTotal").html(nowTotalNum-nowNum);
                $("#priceTotal").html((nowTotalMoney-nowPrice).toFixed(2));
            }
        }
    });
    //删除全部商品
    $(".remove_all").click(function () {
        if(!$(".check-all").prop("checked")){
            alert("商品没有全部选中！");
        }else{
            var a = confirm("是否确定全部商品？");
            if(a){
                $(".catbox").remove();
                $("#shop_con").show();
            }
        }
    });
    //判断是否为空购物车
    /*判断页面是否存在这一个节点*/
    $.fn.exist = function(){
            if($(this).length>=1){
                return true;
            }
            return false;
    };
    /*判断购物车是否有东西*/
    $.ajax({
        type:"get",
        url:"http://10.35.164.185:8080/myWeb/getShoppingCart.jsp?stuId=9&userName="+user,
        async:true,
        success:function(data){
            //console.log(data);
            var data=eval("('+data+')");
            if(data.length>0){
                $("#shop_con").show();
                $("#shop_box").hide();
            }else{
                $("#shop_con").hide();
                $("#shop_box").show();
            }
        }
    })



    //下拉菜单,点击关闭
    /*--封装函数>obj对象，down下拉菜单--*/
    function closeFn(obj,down,close){
        $(obj).hover(
            function(){
                $(this).children(down).stop(true,true).slideDown(600);
            },
            function () {
                $(this).children(down).stop(true,true).slideUp(600);
            }
        );
        $(close).click(function () {
            $(down).hide();
        })
    }
    /*--传参函数--*/
    closeFn(".cart_hidetip",".cart_hidden",".close");

    /*判断是否登录*/
    $(".login").click(function () {
        if(user==null){
            alert("请登录!");
            window.location.href="登录.html";
        }
    })
    if(user==null){
        alert("请登录!");
        window.location.href="登录.html";
        $(".enter_mes").prevAll().show();
        $(".enter_mes").hide();
    }else{
        $(".enter_mes").prevAll().hide();
        $(".name_enter").html(user);
        $(".enter_mes").show();
        $.ajax({
            type:"get",
            url:"http://10.35.164.185:8080/myWeb/getShoppingCart.jsp?stuId=9&userName="+user,
            async:true,
            success:function(data){
                var data=eval("("+data+")");
                if(data.length>0){
                    for(var i=0;i<data.length;i++){
                        var $con=('<tr del="'+data[i].goodsId+'">'
                        +'<td class="checkbox"><input class="check-one check" type="checkbox"/></td>'
                        +'<td class="goods"><img src="'+data[i].goodsImg+'" alt=""/><span>'+data[i].goodsContent+'</span></td>'
                        +'<td class="message">颜色：<span class="color">'+data[i].goodsColor+'</span></td>'
                        +'<td class="price">'+data[i].goodsPrice+'</td>'
                        +'<td class="count"><span class="reduce">-</span>'
                        +'<input class="count-input" type="text" value="'+data[i].goodsCount+'"/>'
                        +'<span class="add">+</span></td>'
                        +'<td class="subtotal">'+(Number((data[i].goodsPrice)*(data[i].goodsCount))).toFixed(2)+'</td>'
                        +'<td class="operation"><span class="delete">删除</span></td>'
                        +'</tr>');
                        $("#cartTable>tbody").append($con);
                    }
                }
                //console.log(data);
            }
        })
    }
});