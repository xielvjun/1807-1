"use strict";require(["config"],function(){require(["jquery","header","footer","template","cookie"],function(t,o,e,a){t("header").load("/html/component/header.html",function(){o.nav(),o.welcome(),o.colors()}),t("footer").load("/html/component/footer.html",function(){t.ajax({method:"get",url:"http://rap2api.taobao.org/app/mock/117232/example/1542074114211",success:function(o){console.log(o);var e=a("pro-template",{image:o.image});t("#proList").html(e)}})})})});