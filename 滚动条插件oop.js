/**
 *
 * @authors flyer2311
 * @date    2018-06-05 23:05:00
 * @version v1.1
 */

function Scrollbar(obj_show,obj_content) {
    this.box1=document.getElementById(obj_show);
    this.box2=document.getElementById(obj_content);
    // 获取box1,2的高度
    this.box1_height=parseFloat(getstyle(this.box1,'height'));
    this.box2_height=parseFloat(getstyle(this.box2,'height'));
    if(this.box1_height<this.box2_height){
        this.box1.style.overflow = 'hidden';
    }
    //获取box1的相关维度
    this.box1_width=parseFloat(getstyle(this.box1,'width'));
    this.box1_paddingtop=parseFloat(getstyle(this.box1,'padding-top'));
    this.box1_paddingright=parseFloat(getstyle(this.box1,'padding-right'));
    this.box1_height=parseFloat(getstyle(this.box1,'height'));
    //内部滚动条和页面共用值
     this.octop=0;
     this.scrolltop=0;
     this.box2_top=0;
    //scrollbar
    this.scrollbar=document.createElement('div');
    this.scrollbar.className='scrollbar-scrollbar';
    this.scrollbar.style.right=this.box1_paddingright+'px';
    this.scrollbar.style.top=this.box1_paddingtop+'px';
    this.scrollbar.style.width=this.box1_width/20+'px';
    //scroll
    this.scroll=document.createElement('div');
    this.scroll.className='scrollbar-scroll';
    this.scroll.style.height=Math.pow(this.box1_height,2)/this.box2_height+'px';
    this.scrollbar.appendChild(this.scroll);
    //把scrollbar加载到div中
    this.box1.appendChild(this.scrollbar);

    //优化性能
    this.scroll_h=Math.pow(this.box1_height,2)/this.box2_height;
    //注册事件
    addEvent(this.scrollbar,'mouseenter',this.mouseenter.bind(this),false);
    addEvent(this.scrollbar,'mouseleave',this.mouseleave.bind(this),false);
    addEvent(this.scrollbar,'click',this.click.bind(this),false);
    addEvent(this.scroll,'mousedown',this.mousedown.bind(this),false);
    addEvent(this.box1,'mousewheel',this.mousewheel.bind(this),false);
}
Scrollbar.prototype={
    mouseenter:function(){
        this.scrollbar.style.backgroundColor='#bfbfbf';
    },
    mouseleave:function(){
        this.scrollbar.style.backgroundColor='#f2f2f2';
    },
    click:function(e){
        this.ev=window.event||e;
        this.ev.target=this.ev.target||this.ev.srcElement;
        if(this.ev.target.className=='scrollbar-scroll'){
            return;
        }else{
            this.clicky=this.ev.clientY-this.scroll_h/2-this.box1.getBoundingClientRect().y;
            this.clicky=this.limitscroll(this.clicky);
            this.scroll.style.top=this.clicky+'px';
            this.scrolltop=this.clicky;
            this.box2.style.top=this.clicky/this.scroll_h*-this.box2_height+'px';
            this.octop=this.clicky/this.scroll_h*-this.box2_height;
            this.ev.stopPropagation?this.ev.stopPropagation():this.ev.cancelBubble=true;//阻止冒泡
        }
    },
    //限制单击scroll时，scroll超出scrollbar
    limitscroll:function(num) {
        num=num<0?0:num;
        num=num>this.box1_height-this.scroll_h?this.box1_height-this.scroll_h:num;
        return num;
    },
    mousedown:function(e) {
        this.ev=e||window.event;
        this.downy=this.ev.clientY-this.scroll.offsetTop;
        addEvent(document,'mousemove',this.mousemove.bind(this),false);
        addEvent(document,'mouseup',this.mouseup.bind(this),false);
    },
    mousemove:function(e) {
        this.ev=e||window.event;
        this.distance=this.ev.clientY-this.downy;
        this.scrollbar.style.backgroundColor='#bfbfbf';
        this.distance=this.limitscroll(this.distance);
        this.scroll.style.top=this.distance+'px';
        this.scrolltop=this.distance;
        this.box2.style.top=this.scrolltop/this.box1_height*-this.box2_height+'px';
        this.octop=this.scrolltop/this.box1_height*-this.box2_height;
        return false;//阻止默认事件
    },
    mouseup:function() {
        this.scrollbar.style.backgroundColor='#f2f2f2';
        removeEvent(document,'mousemove',this.mousemove.bind(this),false);
        removeEvent(document,'mouseup',this.mouseup.bind(this),false);
    },
    mousewheel:function(e) {
        this.ev=e||window.event;
        this.box2_top=this.octop+this.ev.wheel/12;
        this.box2_top=this.limitframe(this.box2_top);
        this.box2.style.top=this.box2_top+'px';
        this.octop=this.box2_top;
        //联动滚动条
        this.scroll.style.top=this.box2_top/-this.box2_height*this.box1_height+'px';
        this.scrolltop=this.box2_top/-this.box2_height*this.box1_height;
    },
    //限制内容页面超出滚动范围
    limitframe:function(num) {
        num=num>0?0:num;
        num=num<this.box1_height-this.box2_height?this.box1_height-this.box2_height:num;
        return num;
    }
}
//注册事件
function addEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    obj[type+fn.name+boolean]=handlefunc;//把handlefunc变为obj的属性
    if(obj.addEventListener){
        obj.addEventListener(type,obj[type+fn.name+boolean],boolean);//注册事件  chrome firefox
        if(type=='mousewheel'){
            obj.addEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean)// 注册事件 firefox
        }
    }else{
        obj.attachEvent('on'+type,obj[type+fn.name+boolean]);//注册事件 兼容ie
    }

    function handlefunc(e) {
        var ev=e||window.event;//参数e  兼容ie
        ev.target=ev.target||ev.srcElement//兼容委托事件
        ev.wheel=ev.wheelDelta?ev.wheelDelta:ev.detail*-40;//兼容滚轮参数
        fn.call(obj,ev);//兼容ie this指向和传参e
        ev.preventDefault?ev.preventDefault():ev.returnValue=false;//阻止默认事件 兼容
    }
}
//移除事件
function removeEvent(obj,type,fn,boolean) {
    boolean=boolean||false;
    if(obj.removeEventListener){
        obj.removeEventListener(type,obj[type+fn.name+boolean],boolean);
        if(type=='mousewheel'){
            obj.removeEventListener('DOMMouseScroll',obj[type+fn.name+boolean],boolean);
        }
    }else{
        obj.detachEvent('on'+type,obj[type+fn.name+boolean]);
    }
}
//获取dom的css
function getstyle(obj,attr) {
    return !window.getComputedStyle?obj.currentStyle[attr]:window.getComputedStyle(obj)[attr];
}
