define(["jquery"],function($){
	$.fn.extend({
		//mul   放大的倍数
		fdj:function(mul){
			var index = 0;//当前是第几张图片
			var _this = this;
			var $fdj = $("#fdj"),
				$big = $(".big"),
				$bigImg = $(".big img");
			//获取盒子的宽高
			var mulWidth = this.width(),
				mulHeight = this.height();
			//设置放大后的图片的宽高
			$bigImg.css("width",mulWidth*mul);
			$bigImg.css("height",mulHeight*mul);
			this.mousemove(function(e){
				e = e || event;
				//console.log(e)
				var _left = e.pageX - _this.offset().left - $fdj.width()/2,
					_top = e.pageY - _this.offset().top - $fdj.height()/2;
				//判断边界
				if(_left < 0) _left = 0;
				if(_top < 0) _top = 0;
				if(_left > _this.width() - $fdj.width())  _left = _this.width() - $fdj.width();
				if(_top > _this.height() - $fdj.height())  _top = _this.height() - $fdj.height();
				
				
				//放大镜和大盒子显示
				$big.show();
				$fdj.show();
				$bigImg.eq(index).show();
				//放大镜的坐标
				$fdj.css("left",_left);
				$fdj.css("top",_top );
				//移动大图片，根据span的坐标的4倍来放大（负值）
				$bigImg.eq(index).css("left",-mul * _left);
				$bigImg.eq(index).css("top",-mul * _top);
				

			})
			this.mouseleave(function(){
				$big.hide();
				$fdj.hide();
				$bigImg.eq(index).hide();
			})
			
			/*var $smallImgBtn = $(".smallBox");
			$smallImgBtn.click(function(){
				$(this).addClass("nowpic").siblings().removeClass("nowpic");
				index = $(this).attr("data-index");
				//console.log(index);
				$("#imgBox .pic").eq(index).addClass("active").siblings().removeClass("active");
			})*/
		}
	})
})