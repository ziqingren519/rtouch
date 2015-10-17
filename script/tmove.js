  function tmove(o,ini){  
    var dir = o.dir || "x";
    if (dir !== "x" && dir !== "y") { alert("错误，dir为x或y"); return;};
    var span = o.span,len = span.length > 1 ? span.length : parseInt(span.innerHTML),con = o.sildebox,set = o.set ? -parseInt(o.set) : dir === "x" ? -o.silde.clientWidth : -o.silde.clientHeight ,index = 0,distance,base = o.base || -set/4,autorun = o.autorun,time = o.time || "300ms",movestates,setI,obj;
    function go(i){
      index = i;
      var tran = dir === "x" ? i*set +"px,0px" : "0px,"+i*set +"px" ; 
      con.style.Transform = "translate("+ tran +")";
      con.style.WebkitTransform = "translate3d("+ tran +",0px)";
      o.fn && o.fn(i);
    };
    if (span.length > 1) {
      for (var i = 0; i < span.length; i++) {
        span[i].onclick = function(i){
          return function(){
            run(i);
          };
        }(i);
      };
    }else{
      span.innerHTML = "<font>1</font>"+"/"+len;
    };

    function run(i){
      i = i < 0 ? 0 : i > (len-1) ? (len-1) : i;
      if (span.length > 1) {
        for (var a = 0; a < span.length; a++) {
          span[a].className = "";
        };
        span[i].className = o.spanclass || "hover";
      }else {
        span.innerHTML = "<font>"+(i+1)+"</font>"+"/"+len;
      }
      go(i);
    };

    function autorunfun(){
      setI = setInterval(function(){
        index = index+1 > (len-1) ? 0 : index+1;
        run(index);
      },autorun);
    };
    function move(e){
      movestates = 1;
      distance = dir === "x" ? e.x-e.cX :  e.y-e.cY ;
      var tran = dir === "x" ? (index*set+distance) +"px,0px" : "0px,"+(index*set+distance) +"px" ; 
      con.style.Transform = "translate("+ tran +")";
      con.style.WebkitTransform = "translate3d("+ tran +",0px)";
    }
    
    obj = new Rtouch(con,ini);
    obj.swipestart = function(e){
      con.style.WebkitTransitionDuration = "0s";
      con.style.TransitionDuration= "0s";
      autorun ? clearInterval(setI) : 1 ;
    };
    
    dir === "x" ? obj.holdx = move : obj.holdy = move;
    obj.swipeend=function(e){
      con.style.WebkitTransitionDuration = time;
      con.style.TransitionDuration= time;
      if (!movestates) {return};
      -distance > base ? run(index+1) : distance > base ? run(index-1) : run(index);
      movestates = 0;
      autorun ? autorunfun() : 1 ;
    };
    autorun ? autorunfun() : 1;
  };