/**
 * Created by HELLO_QI on 2017/3/30.
 */
var gesture = document.getElementById("gesture");
var ctx = gesture.getContext("2d");
gesture.width = document.body.offsetWidth;
gesture.height = document.body.offsetHeight;
var r = 30 ;
var  sX = 50,sY = 50;
var hdiff = 74;//由于设置了段落等其他内容的高度，所以页面高度变化，需要减去该值，才能得到画布上的高度位置

var setPas = document.getElementById("setPas");
var checkPas = document.getElementById("checkPas");


var hint =  document.getElementById("hint");
var flag = 1;   //设置标志是否是第二次设置密码

var result ="";
var pointLocations=[];
var pathPoints=[];

var Point = function(x,y){
    this.x=x;this.y=y;
}

window.onload=function(){
	//两个点之间的距离
    var spacex = (gesture.width - sX*2 -r*2*3)/2;
    var spacey = (gesture.height - sY*2 -r*2*3)/2;
    for(var i=0;i<3;i++){
        for(var j=0; j <3;j++){
            x = sX + j * spacex +(2 * j + 1)* r;
            y = sY + i * spacey +(2 * i + 1)* r;
            var item = new Point(x,y);
            if(pointLocations.length < 9){
                pointLocations.push(item);
            }
        }
    }
	draw();
    setPas.onclick = function(){
        setPas.checked = true;
        initEvent();
    };
    checkPas.onclick = function(){
        checkPas.checked = true;
        initEvent();
    };
};

function draw(touches){
    //清除画布
    ctx.clearRect(0,0,gesture.width,gesture.height);
	//画线
	ctx.lineWidth = 5;
	ctx.beginPath();
    ctx.strokeStyle = "red";
	for(var i=0 ;i<pathPoints.length;i++){
		var index = pathPoints[i];
		var p = pointLocations[index];
		ctx.lineTo(pointLocations[index].x,pointLocations[index].y);
		}
    ctx.stroke();
    ctx.closePath();

	//画出9个密码点
    for(var i =0;i<pointLocations.length;i++){
        var point = pointLocations[i];
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        if(pathPoints.indexOf(i) < 0){
            ctx.arc(point.x,point.y,r,0,2*Math.PI,false);
            ctx.stroke();
        }else{
            ctx.fillStyle = "#FF9900" ;
            ctx.arc(point.x,point.y,r,0,2*Math.PI,false);
            ctx.fill();
        }
        ctx.closePath();
    }
}

function isPointIn(touches){
	for(var i=0;i<pointLocations.length;i++){
		var p = pointLocations[i];
		var xdiff = Math.abs(p.x - touches.pageX); 
		var ydiff = Math.abs(p.y - touches.pageY+hdiff);
		var d = Math.pow(xdiff*xdiff + ydiff*ydiff , 0.5);
		if(d < r){
			if(pathPoints.indexOf(i) <0){
			    pathPoints.push(i);
			}
			break;
		}
	}

	}

function initEvent(){
    gesture.addEventListener('touchstart',function(e){
        hint.style.display = 'none';
    	isPointIn(e.touches[0]);
    });
    gesture.addEventListener('touchmove',function(e){
		var touches = e.touches[0];
		isPointIn(touches);
		draw(touches);
    });
    gesture.addEventListener('touchend',function(e){
		if(pathPoints.length > 0){
		    if(setPas.checked){
		        if(pathPoints.length <5){
                    hint.style.display = 'block';
                    hint.innerHTML = '密码长度太短';
                    localStorage.clear();
                    flag = 1;
                }
                if(pathPoints.length >=5){
                    hint.style.display = 'block';
                    if(flag){
                        hint.innerHTML = '密码设置成功，请再次输入核对密码';
                        flag = 0;
                        result = pathPoints.join("");
                        localStorage.setItem("value",result) ;
                    }else{
                        if(pathPoints.join("") == localStorage.getItem("value")){
                            hint.innerHTML = '密码设置成功';
                            flag = 1;
                        }else{
                            localStorage.clear();
                            hint.innerHTML = '核对密码输入错误，请重新设置密码';
                            flag = 1;
                        }
                    }
                }
		    }
		    if(checkPas.checked){
                hint.style.display = 'block';
                if(pathPoints.join("") == localStorage.getItem("value")){
                    hint.innerHTML = '验证密码正确';
                }else{
                    hint.innerHTML = '密码验证失败';
                }
            }
            console.log(pathPoints.join(""));
            pathPoints = [] ;
            draw(null);
        }
    });
}