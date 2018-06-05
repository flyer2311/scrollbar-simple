# scrollbar-simple
a new scrollbar for block-elements
一共有2个js，一个是普通，一个是面向对象。
封装函数scrollbar(arg1,arg2){}
第一个参数是用来展示的页面dom
第二个参数是存放具体内容的dom
类似轮播的单主页面和多张粘合的轮播页面

arg1的对象dom需要添加css class .scrollbar-obj_show
arg2的对象dom需要添加css class.scrollbar-obj_content
arg1与arg2的关系是arg1包含arg2，arg1是arg2的父元素

opear暂时不支持该插件功能(calc不支持)
