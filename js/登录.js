/**
 * Created by Administrator on 2016/12/14.
 */
$(function () {

    /*判断用户是否注册过*/
    $(".phone").blur(function () {
        var $name=$(this).val();
        $.ajax({
            type:"get",
            url:"http://10.35.164.185:8080/myWeb/checkUser.jsp?stuId=9&userName="+$name,
            async:true,
            success:function(data){
                if(data==0){
                    $(".error-tips").html("用户名不存在!").show();
                }else if(data==1){
                    $(".error-tips").html("用户正确").show();
                    $(".password").focus();
                }
            }
        });
    })
    /*显示隐藏的验证码*/
    $(".password").click(function () {
        $(".img-code").show();
    })

    /*图片翻转验证码*/
    var n1=0;
    var n2=0;
    var n3=0;
    var n4=0;
    var num1=$(".img_1").attr("num");
    var num2=$(".img_2").attr("num");
    var num3=$(".img_3").attr("num");
    var num4=$(".img_4").attr("num");
    $(".one").click(function () {
        n1++;
        var dg=n1*90+'deg';
        $(this).css({"transform":"rotate("+dg+")"});
    });
    $(".two").click(function () {
        n2++;
        var dg=n2*90+'deg';
        $(this).css({"transform":"rotate("+dg+")"});
    });
    $(".three").click(function () {
        n3++;
        var dg=n3*90+'deg';
        $(this).css({"transform":"rotate("+dg+")"});
    });
    $(".four").click(function () {
        n4++;
        var dg=n4*90+'deg';
        $(this).css({"transform":"rotate("+dg+")"});
    });

    /*点击登录判断是否保存cookie*/
    $(".submit").click(function(){
        var $name=$(".phone").val();
        var $pass=$(".password").val();
        if((n1%4==num1)&&(n2%4==num2)&&(n3%4==num3)&&(n4%4==num4)){
            $.ajax({
                type:"post",
                url:"http://10.35.164.185:8080/myWeb/login.jsp?stuId=9&userName="+$name+"&userPass="+$pass,
                async:true,
                success:function(data){
                    if(data){
                        $(".tips-Pwd").html("登陆成功,跳转首页!");
                        if($("#rember").prop("checked")){
                            $.cookie('userName',$name,{expires:7});
                            $.cookie('userPass',$pass,{expires:7});
                        }else{
                            $.cookie('userName',$name,{expires:-7});
                            $.cookie('userPass',$pass,{expires:-7});
                        }
                        window.location.href="首页.html";
                    }else{
                        $(".tips-Pwd").html("登录失败,请检查登录信息!").show();
                    }
                }
            });
        }else {
            $(".error-tips").html("请检查验证码!").show();
        }
    });

    /*判断是否已经登录*/
    /*==================================当cookie里的用户名和你输的一样是自动弹出===================*/
     $('.phone').blur(function(){
         var $name=$(this).val();
        if($name==$.cookie('userName')){
            if(confirm("您已登录,是否跳转首页或者退出登录？")){
                window.location.href="首页.html"
            }else{
                $.removeCookie('userName');
                $.removeCookie('userNumber');
                $.removeCookie('userPass');
            }
        }else{
            $(".password").focus();
        }
     });

    $(".register").click(function(){
        window.location.href="注册.html";
    })
})