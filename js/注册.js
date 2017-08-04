/**
 * Created by Administrator on 2016/12/14.
 */
$(function () {
    $(".phone").blur(function(){
        checkPhone();
    })
    function checkPhone(){
        var $phone=$(".phone").val();
        //console.log($phone)
        if($phone==""){
            $(".error-tips").html("请输入内容!").show();
        }
        if(!(/^1[34578]\d{9}$/.test($phone))){
            $(".error-tips").html("输入有误!").show();
        }
        if((/^1[34578]\d{9}$/.test($phone))){
            $.ajax({
                type:"get",
                url:"http://10.35.164.185:8080/myWeb/checkUser.jsp?stuId=9&userName="+$phone,
                async:true,
                success:function(data){
                    /*console.log(data);*/
                    if(data==1){
                        $(".error-tips").html("用户存在！").show();
                    }else if(data==0){
                        $(".error-tips").html("可以注册!").show();
                    }
                }
            });
        }
    }

    $(".code").click(function () {
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


    /*密码验证*/
    $("#pas1").keyup(function(){
        $(".psw_str").show();
        var oPsw=$(this).val();
        var bool=0;
        if(oPsw.length<6||oPsw.length>16){
            bool=0;
        }else{
            if(oPsw.match(/\d/)){
                bool++;
            }
            if(oPsw.match(/[a-zA-Z]/)){
                bool++;
            }
            if(oPsw.match(/((?=[\x21-\x7e]+)[^A-Za-z0-9])/)){
                bool++;
            }
        }
        switch(bool){
            case 0:
                $(".base").stop().animate({"width":"0%"},600);
                $(".middle").stop().animate({"width":"0%"},600);
                $(".high").stop().animate({"width":"0%"},600);
                break;
            case 1:
                $(".base").stop().animate({"width":"100%"},600);
                $(".middle").stop().animate({"width":"0%"},600);
                $(".high").stop().animate({"width":"0%"},600);
                break;
            case 2:
                $(".base").stop().animate({"width":"100%"},600);
                $(".middle").stop().animate({"width":"100%"},600);
                $(".high").stop().animate({"width":"0%"},600);
                break;
            case 3:
                $(".base").stop().animate({"width":"100%"},600);
                $(".middle").stop().animate({"width":"100%"},600);
                $(".high").stop().animate({"width":"100%"},600);
                break;
            default:
                break;
        }
    })

    $("#pas2").keyup(function () {
        var $pas1 = $("#pas1").val();
        if ($(this).val() != $pas1) {
            $(".error-tips").html("两次输入密码不一致!").show();
        } else {
            $(".error-tips").html("密码输入成功!").show();
        }
    });

    /*图片验证码*/
    $(".submit").click(function(){
        var $name=$(".phone").val();
        var $pass=$("#pas1").val();
        var $email=$("#pas2").val();
        if((n1%4==num1)&&(n2%4==num2)&&(n3%4==num3)&&(n4%4==num4)){
            if($("#rember").prop("checked")==true){
                $.ajax({
                    type:"post",
                    url:"http://10.35.164.185:8080/myWeb/reg.jsp?stuId=9&userName="+$name+"&userPass="+$pass+"&userEmail="+ $email,
                    async:true,
                    success:function(data){
                        console.log(data)
                        if(data){
                            alert("注册成功，请点击已有账号登录!");
                            location.href="登录.html";
                        }else{
                            alert("请您认真检查注册信息！");
                        }
                    }
                });
            }else{
                $(".error-tips").html("请勾选同意选项!").show();
            }
        }else{
            $(".error-tips").html("请检查验证码!").show();
        }
    });

    /**/
    $(".register").click(function(){
        window.location.href="登录.html";
    })

})