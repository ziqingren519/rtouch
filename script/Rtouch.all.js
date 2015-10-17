var Rtouch = function(obj,o){
  if (typeof document.createEvent !== 'function') return false;  //剔除低端浏览器
  // var box = this.e,
  var moveis = false, //是否移动
  moveDirection, //移动方向
  o = o || {},
  _this = this,
  TRESHOLD = o.SWIPE_TRESHOLD || 20,   //超过20的时候才算滑动
  PREDEF = o.PREDEF || [1,0],   //X轴移动是否取消默认，Y轴移动是否取消默认  （默认取消X轴的默认）
  currX, currY, cX, cY,
  msPointerEnabled = !!navigator.pointerEnabled || navigator.msPointerEnabled,  //判断是否为ie10和ie11的手势
  isTouch = 'ontouchstart' in window || msPointerEnabled, //判断是否支持手势
  msEventType = function(type) {   //区分ie10和ie11
    var lo = type.toLowerCase(),   //转换为全小写
      ms = 'MS' + type;   //ie10
    return navigator.msPointerEnabled ? ms : lo;  //判断是否ie10  ie10返回带ms的
  },
  touchevents = {   //对象
    touchstart: msEventType('PointerDown') + ' touchstart',
    touchend: msEventType('PointerUp') + ' touchend',
    touchmove: msEventType('PointerMove') + ' touchmove'
  },
  getPointerEvent = function(event) {   //统一各个浏览器之间的event的差异
    return event.targetTouches ? event.targetTouches[0] : event;  //判断如果是苹果和谷歌支持的触摸对象 返回它的触摸列表。否则ie的话直接返回列表 统一差异
  },
  setListener = function(elm, events, callback) {   //在document上设置监听      
    var eventsArray = events.split(' '),
      i = eventsArray.length;
    while (i--) {   //while循环 i===0的时候跳出              
      elm.addEventListener(eventsArray[i], callback, false);  //循环设置上各种监听
    }
  },
  creatE = function(e,eventName,data){
    var eve = document.createEvent('Event'); 
    data = data || {};
    data.x = currX;
    data.y = currY;
    data.cX = cX;
    data.cY = cY;
    data.type = eventName;
    // data.direction = moveDirection ? moveDirection : eventName;
    data.e = e;
    // console.log(_this)
    _this[eventName] && _this[eventName](data);
  },
  unifyE = function(e){
    return e.touches ? e.touches[0] : e;
  },
  direction = function(tre){
    var tre = tre === undefined ? TRESHOLD : tre,events;
    if(Math.abs(cX - currX) >= Math.abs(cY - currY) ){
      cX - currX > tre ? events = "swipeleft" :
      cX - currX < -tre ? events = "swiperight" : events = "tap";
    }else{
      cY - currY > tre ? events = "swipetop" :
      cY - currY < -tre ? events = "swipedown" : events = "tap";
    }
    return events;
  },
  start = function(e){    
    moveis = true;
    ev = unifyE(e); 
    creatE(ev,"swipestart");  
    cX = currX = ev.clientX;
    cY = currY = ev.clientY;
    moveDirection = undefined;
    e.stopPropagation();
  },
  move = function(e){
    if (!moveis) return;  //判断是否可以移动
    ev = unifyE(e);
    currX = ev.clientX;
    currY = ev.clientY;
    if (moveDirection === undefined) {  
      moveDirection = direction(0).split("swipe")[1];
    };
    creatE(ev,"hold");
    if (moveDirection === "left" || moveDirection === "right") {
      PREDEF[0] && e.preventDefault();  //阻止默认事件
      creatE(ev,"holdx");
      creatE(ev,"hold"+moveDirection);
    }else {
      PREDEF[1] && e.preventDefault();  //阻止默认事件
      creatE(ev,"holdy");
      creatE(ev,"hold"+moveDirection);
    }
    e.stopPropagation();
  },
  end = function(e){  
    creatE(e,"swipeend"); 
    moveis = false;
    creatE(e,direction());
    e.stopPropagation()
  }

  //设置事件侦听器
  setListener(obj, touchevents.touchstart + (isTouch ? '' : ' mousedown'), start);
  setListener(obj, touchevents.touchend + (isTouch ? '' : ' mouseup'), end);
  setListener(obj, touchevents.touchmove + (isTouch ? '' : ' mousemove'), move);

}