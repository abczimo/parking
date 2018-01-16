$(function () {
    //
    $("body").click(function () {
        $(".cp_pull").hide();
        $("body").height("auto");
        $(".cp_pai").find("i").html("▼");
    });
    $(".cp_pull").click(function (event) {
        event.stopPropagation();
    });
    $(".cp_pai").click(function (event) {
        if ($(this).find("i").html() == "▼") {
            $(this).find("i").html("▲");
        } else {
            $(this).find("i").html("▼");
        }
        ;
        $("#pull_city").hide();
        pullpos();
        $("#pull_province").toggle();
        event.stopPropagation();
    });

    $("#pull_province li,.dqxz span").each(
        function (index, item) {
            if ($(this).html() == $("#cp_pai span:nth-child(1)").html())$(item).addClass('cur');

        }
    );
    $("#pull_city li,.dqxz span").each(
        function (index, item) {
            if ($(this).html() == $("#cp_pai span:nth-child(2)").html())$(item).addClass('cur');
        }
    );
    $("#pull_province li,.dqxz span").click(function (event) {
        $(this).addClass("cur").siblings().removeClass("cur");
        $("#pull_province").hide();
        $("#pull_city").show();
        $("#cp_pai span:nth-child(1)").html($(this).html());
    });
    $("#pull_city li").click(function (event) {
        $(this).addClass("cur").siblings().removeClass("cur");
        $(".cp_pull").hide();
        $("body").height("auto");
        $("#cp_pai span:nth-child(2)").html($(this).html());
        $(".cp_pai").find("i").html("▼");
    });
    
    function pullpos() {
        var postop = $(".searchbar").offset().top;
        $(".cp_pull").css("top", postop + 50);
        //$("body").height(postop+500).scrollTop(postop-10);	//页面补高
    }
});