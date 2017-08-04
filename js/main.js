/**
 * Created by Administrator on 2016/12/18.
 */
;(function($){

    var Carousel=function(poster){
        var self=this;
        //保存单个对象
        this.poster=poster;
        this.posterItemMain=poster.find('ul.list');
        this.nextbtn=poster.find('div.next-btn');
        this.prevbtn=poster.find('div.prv-btn');
        this.posterItems=poster.find('li.item');
        if(this.posterItems.size()%2==0){
            this.posterItemMain.append(this.posterItems.eq(0).clone());
            this.posterItems =                      this.posterItemMain.children();
        };
        this.posterFirstItem=this.posterItems.first();
        this.posterLastItem=this.posterItems.last();
        this.rotateFlag   = true;
        //默认配置参数
        this.setting = {
            "width":1000,
            "height":270,
            "posterWidth":640,
            "posterHeight":270,
            "scale":0.9,
            "speed":500,
            "autoPlay":false,
            "delay":500,
        };
        $.extend(this.setting, this.getSetting());
        //设置参数
        this.setSettingValue();
        this.setPosterpos();
        //左旋
        this.nextbtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag=false;
                self.carouseRotate("left");
            };
        });
        //右旋
        this.prevbtn.click(function(){
            if(self.rotateFlag){
                self.rotateFlag=false;
                self.carouseRotate("right");
            }
        });
        //是否开启自动播放
        if(this.setting.autoPlay){
            this.autoPlay();
            this.poster.hover(function(){
                window.clearInterval(self.timer);
            },function(){
                self.autoPlay();
            });

        };

    };
    Carousel.prototype={
        autoPlay:function(){
            var self=this;
            this.timer=window.setInterval(function(){
                self.nextbtn.click();
            },this.setting.delay);

        },

        //旋转
        carouseRotate:function(dir){
            var _this_=this;
            var zIndexArr=[];
            //左旋转
            if(dir==="left"){
                this.posterItems.each(function(){
                    var self=$(this),
                        prev=self.prev().get(0)?self.prev():_this_.posterLastItem,
                        width=prev.width(),
                        height=prev.height(),
                        zIndex=prev.css("zIndex"),
                        opacity=prev.css("opacity"),
                        top=prev.css("top"),
                        left=prev.css("left");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width:width,
                        height:height,
                        opacity:opacity,
                        left:left,
                        top:top
                    },_this_.setting.speed,function(){
                        _this_.rotateFlag=true;
                    });

                });
                //
                this.posterItems.each(function(i){
                    $(this).css("zIndex",zIndexArr[i]);
                });
            }else if(dir==="right"){
                this.posterItems.each(function(){
                    var self=$(this),
                        next=self.next().get(0)?self.next():_this_.posterFirstItem,
                        width=next.width(),
                        height=next.height(),
                        zIndex=next.css('zIndex'),
                        opacity=next.css('opacity'),
                        left=next.css('left'),
                        top=next.css("top");
                    zIndexArr.push(zIndex);
                    self.animate({
                        width:width,
                        height:height,
                        opacity:opacity,
                        left:left,
                        top:top,
                    },_this_.setting.speed,function(){
                        _this_.rotateFlag=true;
                    });
                });
                this.posterItems.each(function(i){
                    $(this).css("zIndex",zIndexArr[i]);
                });
            };
        },
        setPosterpos:function(){
            var self=this;
            var sliceItems=this.posterItems.slice(1),
                slicesize =sliceItems.size()/2;
            rhsliceItem=sliceItems.slice(0,slicesize);
            level      =Math.floor(this.posterItems.size()/2);
            lfsliceItem=sliceItems.slice(slicesize);
            //设置右边
            var rw=this.setting.posterWidth*self.setting.scale;
            var rh=this.setting.posterHeight*self.setting.scale;
            var gap=((this.setting.width-this.setting.posterWidth)/2)/level;
            rhsliceItem.each(function(i){
                level--;
                var j=i;
                $(this).css({
                    zIndex:level,
                    width:rw,
                    height:rh,
                    opacity:1/(++j),
                    left:rhlicew-rw,
                    top:self.setVertical(rh)
                });
            });
            //设置左边
            var lw=this.setting.posterWidth*self.setting.scale;
            var lh=this.setting.posterHeight*self.setting.scale;
            var loop=Math.floor(this.posterItems.size()/2);
            lfsliceItem.each(function(i){
                $(this).css({
                    zIndex:i,
                    width:lw,
                    height:lh,
                    opacity:1/loop,
                    left:0,
                    top:self.setting.height-lh
                });
                loop--;
            });
        },

        //设置参数
        setSettingValue:function(){
            this.poster.css({
                width:this.setting.width,
                height:this.setting.height
            });
            this.posterItemMain.css({
                width:this.setting.width,
                height:this.setting.height
            });
            var w=(this.setting.width-this.setting.posterWidth)/2;
            var zIndexval=Math.ceil(this.posterItems.size()/2);
            this.nextbtn.css({
                width:w,
                height:this.setting.height,
                zIndex:zIndexval

            });
            this.prevbtn.css({
                width:w,
                height:this.setting.height,
                zIndex:zIndexval
            });
            this.posterFirstItem.css({
                width:this.setting.posterWidth,
                height:this.setting.posterHeight,
                left:w,
                top:0,
                zIndex:zIndexval

            });
        },
        //获取人工指定的setting值
        getSetting:function(){
            var setting=this.poster.attr('data-setting');
            if(setting&&setting!=''){
                return $.parseJSON(setting);
            }else{
                return {};
            }
        }

    };
    Carousel.init=function(posters){
        var _this_=this;
        posters.each(function(){
            new _this_($(this));
        });
    };
    window["Carousel"]=Carousel;
})(jQuery);
