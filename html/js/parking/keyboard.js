(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 10 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

(function ($) {
    $.fn.lpnSelect = function (config) {
        $("body").click(function () {
            closeKeyBoard();
        });
        $(".btn_search").on("touchstart", function(){
            closeKeyBoard();
        })

        //占位按键和删除的特殊处理，return true表示停止
        var stopKeyEvent = function (me, type) {
            if (me.hasClass("disable") || me.hasClass("empty") || me.hasClass("empty_2")) {
                return true;
            }
            if (me.hasClass("del")) {
                var carPlateNum = $('#carplatnum').text();
                if (type == "touchend" && carPlateNum.length > 0) {
                    carPlateNum = carPlateNum.substr(0, carPlateNum.length - 1);
                    $('#carplatnum').text(carPlateNum);
                }
                showKeyBoard();
                toggleEnergyIcon();
                toggleDisplayKey();
                // console.log(carPlateNum);
                return true;
            }
            return false;
        };

        //根据当前车牌长度显示对应键盘
        var showKeyBoard = function () {
            $(".keyboard_box").show();
            var carPlateNum = $('#carplatnum').text();
            if (carPlateNum.length == 0) {
                $(".keyboard.suffix").hide();
                $(".keyboard.chs").show();
            } else {
                $(".keyboard.chs").hide();
                $(".keyboard.suffix").show();
            }
        };

        //隐藏浮动图片
        var hideClickImgObj = function () {
            var clickImgObj = $(".click");
            clickImgObj.css({
                "zIndex": "-200",
                "visibility": "hidden"
            });
        };

        //显示、隐藏数字按键、O字母和港澳学按键
        var toggleDisplayKey = function () {
            var carPlateNum = $('#carplatnum').text();
            if (carPlateNum.length <= 1) {
                $(".key.n_key").addClass("disable");
            } else {
                $(".key.n_key").removeClass("disable");
            }
            if (carPlateNum.length == 1) {
                $(".key.o_key").removeClass("disable");
            } else {
                $(".key.o_key").addClass("disable");
            }
            if (carPlateNum.length >= 6) {
                $(".key.last").removeClass("disable");
            } else {
                $(".key.last").addClass("disable");
            }
        };

        //显示、隐藏新能源图标
        var toggleEnergyIcon = function () {
            var carPlateNum = $('#carplatnum').text();
            if (carPlateNum.length == 8) {
                $('#icon_energy').show();
            } else if(carPlateNum.length <= 6) {
                $(".show-message").addClass("hidden"); //车牌号位数不全，缴费信息隐藏
                $('#icon_energy').hide();
            } else{
                $('#icon_energy').hide();
            }
        };

        //关闭键盘
        var closeKeyBoard = function () {
            hideClickImgObj();
            $(".keyboard_box").hide();
            $("#carplatnum").removeClass('cursor');
            var i = $("#carplatnum").html().length;
            if (i < 1) {
                $("#placeholder").show();
            }
            recoverCarPlateNumInputBox();
        };

        //激活输入框，根据carplatnum长度 显示不同键盘
        $(".searchbar").click(function () {
            $("#carplatnum").addClass('cursor');
            $("#placeholder").hide();
            showKeyBoard();
            adjustCarPlateNumInputBox();
            event.stopPropagation();//阻止事件冒泡
        });

        //调整车牌输入框位置
        var adjustCarPlateNumInputBox = function () {
            var searchbarTop = $(".searchbar").attr("offsetTop");//车牌输入框距离页面顶部的距离
            var searchbarHeight = $(".searchbar").height();//车牌输入框高度
            var keyboardHeight = $(".keyboard_box").height();//键盘高度
            var winHeight = document.body.clientHeight;//页面高度
            var distant = (searchbarTop + searchbarHeight) - (winHeight - keyboardHeight);
            if (distant > 0 && $(".adjust_box").length > 0) {//键盘挡住车牌输入框，需要调整
                $(".adjust_box").css({
                    'webkitTransform': 'translateY(-' + (distant + 10) + 'px)',
                    'transform': 'translateY(-' + (distant + 10) + 'px)'
                });
            }
            // alert(winHeight + ";" + searchbarTop + ";" + searchbarHeight + ";" + keyboardHeight);
        };
        //恢复输入框位置
        var recoverCarPlateNumInputBox = function () {
            if ($(".adjust_box").length > 0) {
                $(".adjust_box").css({
                    'webkitTransform': 'translateY(0px)',
                    'transform': 'translateY(0px)'
                });
            }
        };

        return {
            //设置默认车牌
            initSelect: function (carPlateNumber) {
                $('#carplatnum').text(carPlateNumber);
                if (carPlateNumber != undefined && carPlateNumber.length > 0) {
                    $("#placeholder").hide();
                }
                if (carPlateNumber != undefined && carPlateNumber.length == 8) {
                    $('#icon_energy').show();
                }
            },
            //获取车牌
            getCarPlateNumberValue: function () {
                return $('#carplatnum').text();
            },
            //初始化键盘
            initKeyboard: function (selector) {
                var html = '';
                html += '<!--键盘开始-->';
                html += '<div class="keyboard_box" align="center">';
                html += '   <div class="bar">';
                html += '       <div class="k_close">关闭</div>';
                html += '   </div>';
                html += '   <!--车牌首汉字键盘开始-->';
                html += '   <div class="keyboard chs">';
                html += '       <div class="click">';
                html += '           <div class="cover"></div>';
                html += '           <div class="float_num">8</div>';
                html += '           <img src="css/parking/img/hover.png"/>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full"><span><i>京</i></span></div>';
                html += '           <div class="key flex_full"><span><i>沪</i></span></div>';
                html += '           <div class="key flex_full"><span><i>粤</i></span></div>';
                html += '           <div class="key flex_full"><span><i>津</i></span></div>';
                html += '           <div class="key flex_full"><span><i>冀</i></span></div>';

                html += '           <div class="key flex_full"><span style="background-color:red;"><i>豫</i></span></div>';
                html += '           <div class="key flex_full"><span><i>云</i></span></div>';
                html += '           <div class="key flex_full"><span><i>辽</i></span></div>';
                html += '           <div class="key flex_full"><span><i>黑</i></span></div>';
                html += '           <div class="key flex_full"><span><i>湘</i></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_half empty"><span></span></div>';
                html += '           <div class="key flex_full"><span><i>皖</i></span></div>';
                html += '           <div class="key flex_full"><span><i>鲁</i></span></div>';
                html += '           <div class="key flex_full"><span><i>新</i></span></div>';
                html += '           <div class="key flex_full"><span><i>苏</i></span></div>';
                html += '           <div class="key flex_full"><span><i>浙</i></span></div>';

                html += '           <div class="key flex_full"><span><i>赣</i></span></div>';
                html += '           <div class="key flex_full"><span><i>鄂</i></span></div>';
                html += '           <div class="key flex_full"><span><i>桂</i></span></div>';
                html += '           <div class="key flex_full m_r_none"><span><i>甘</i></span></div>';
                html += '           <div class="key flex_half empty"><span></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full empty_2"><span><i></i></span></div>';
                html += '           <div class="key flex_full"><span><i>晋</i></span></div>';
                html += '           <div class="key flex_full"><span><i>蒙</i></span></div>';
                html += '           <div class="key flex_full"><span><i>陕</i></span></div>';
                html += '           <div class="key flex_full"><span><i>吉</i></span></div>';

                html += '           <div class="key flex_full"><span><i>闽</i></span></div>';
                html += '           <div class="key flex_full"><span><i>贵</i></span></div>';
                html += '           <div class="key flex_full"><span><i>粤</i></span></div>';
                html += '           <div class="key flex_full"><span><i>川</i></span></div>';
                html += '           <div class="key flex_full empty_2"><span><i></i></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full empty_2"><span></span></div>';
                html += '           <div class="key flex_half_3 empty_2"><span><i></i></span></div>';
                html += '           <div class="key flex_full"><span><i>青</i></span></div>';
                html += '           <div class="key flex_full"><span><i>藏</i></span></div>';
                html += '           <div class="key flex_full"><span><i>琼</i></span></div>';
                html += '           <div class="key flex_full"><span><i>宁</i></span></div>';
                html += '           <div class="key flex_full"><span><i>渝</i></span></div>';

                html += '           <div class="key flex_twice del"><span><i></i></span></div>';
                html += '           <div class="key flex_half_3 empty_2"><span><i></i></span></div>';
                html += '           <div class="key flex_full empty_2"><span></span></div>';
                html += '       </div>';
                html += '   </div>';
                html += '   <!--车牌首汉字键盘结束-->';
                html += '   <!--车牌后缀键盘开始-->';
                html += '   <div class="keyboard suffix" style="display: none">';
                html += '       <div class="click">';
                html += '           <div class="cover"></div>';
                html += '           <div class="float_num">8</div>';
                html += '           <img src="css/parking/img/hover.png"/>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full n_key"><span><i>1</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>2</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>3</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>4</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>5</i></span></div>';

                html += '           <div class="key flex_full n_key"><span><i>6</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>7</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>8</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>9</i></span></div>';
                html += '           <div class="key flex_full n_key"><span><i>0</i></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full"><span><i>Q</i></span></div>';
                html += '           <div class="key flex_full"><span><i>W</i></span></div>';
                html += '           <div class="key flex_full"><span><i>E</i></span></div>';
                html += '           <div class="key flex_full"><span><i>R</i></span></div>';
                html += '           <div class="key flex_full"><span><i>T</i></span></div>';

                html += '           <div class="key flex_full"><span><i>Y</i></span></div>';
                html += '           <div class="key flex_full"><span><i>U</i></span></div>';
                html += '           <div class="key flex_full o_key disable"><span><i>O</i></span></div>';
                html += '           <div class="key flex_full"><span><i>P</i></span></div>';
                html += '           <div class="key flex_full"><span><i>A</i></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_full"><span><i>S</i></span></div>';
                html += '           <div class="key flex_full"><span><i>D</i></span></div>';
                html += '           <div class="key flex_full"><span><i>F</i></span></div>';
                html += '           <div class="key flex_full"><span><i>G</i></span></div>';
                html += '           <div class="key flex_full"><span><i>H</i></span></div>';

                html += '           <div class="key flex_full"><span><i>J</i></span></div>';
                html += '           <div class="key flex_full"><span><i>K</i></span></div>';
                html += '           <div class="key flex_full"><span><i>L</i></span></div>';
                html += '           <div class="key flex_full"><span><i>X</i></span></div>';
                html += '           <div class="key flex_full"><span><i>Z</i></span></div>';
                html += '       </div>';
                html += '       <div class="key_box flex_center">';
                html += '           <div class="key flex_half_2 empty"><span></span></div>';
                html += '           <div class="key flex_full"><span><i>C</i></span></div>';
                html += '           <div class="key flex_full"><span><i>V</i></span></div>';
                html += '           <div class="key flex_full"><span><i>B</i></span></div>';
                html += '           <div class="key flex_full"><span><i>N</i></span></div>';
                html += '           <div class="key flex_full"><span><i>M</i></span></div>';

                html += '           <div class="key flex_full last disable"><span><i>港</i></span></div>';
                html += '           <div class="key flex_full last disable"><span><i>澳</i></span></div>';
                html += '           <div class="key flex_full last disable"><span><i>学</i></span></div>';
                html += '           <div class="key flex_twice del m_r_none"><span><i></i></span></div>';
                html += '           <div class="key flex_half_2 empty"><span></span></div>';
                html += '       </div>';
                html += '   </div>';
                html += '   <!--车牌后缀键盘结束-->';
                html += '</div>';
                html += '<!--键盘结束-->';

                if ($(".keyboard_box").length == 0) {
                    $(selector).append(html);
                } else {
                    console.log("键盘已存在");
                }

                //开始添加键盘事件

                //反悔标记，当手指移到别处时可以取消当前按键输入
                var regret = false;

                //按键点击开始
                $(".keyboard .key").on("touchstart", function () {
                    event.stopPropagation();
                    regret = false;
                    var me = $(this);
                    if (stopKeyEvent(me, "touchstart")) {
                        return false;
                    }
                    var span = me.find("span");
                    var width = span.width();
                    var height = span.height();
                    var x = span.attr("offsetLeft");
                    var y = span.attr("offsetTop");
                    var num = span.text();
                    // console.log(x + "," + y + "," + num);
                    // console.log(width + "," + height);
                    var hoverImgWidth = width * (110 / 64.0);
                    var clickImgObj = me.parent().parent().find(".click");
                    clickImgObj.width(hoverImgWidth);
                    var hoverImgHeight = clickImgObj.height();
                    var leftSpace = (hoverImgWidth - width) / 2.0;
                    var topSpace = hoverImgHeight - height;
                    var floatNum = clickImgObj.find(".float_num");
                    floatNum.height(topSpace);
                    floatNum.css("lineHeight", topSpace + "px");
                    floatNum.html(num);
                    // console.log(hoverImgWidth + "," + x);
                    clickImgObj.css({
                        "left": (x - leftSpace) + "px",
                        "top": (y - topSpace) + "px",
                        "zIndex": "200",
                        "visibility": "visible"
                    });
                    return false;
                });

                //按住按键并拖动，识别为用户操作反悔
                $(".keyboard .key").on("touchmove", function () {
                    event.stopPropagation();
                    regret = true;
                });

                //按键点击结束
                $(".keyboard .key").on("touchend", function () {
                    event.stopPropagation();
                    var me = $(this);
                    if (stopKeyEvent(me, "touchend")) {
                        return false;
                    }
                    var span = me.find("span");
                    var num = span.text();
                    var carPlateNum = $('#carplatnum').text();
                    if (carPlateNum.length < 8 && carPlateNum.indexOf("港") < 0 && carPlateNum.indexOf("澳") < 0  && carPlateNum.indexOf("学") < 0 ) {
                        $('#carplatnum').text(carPlateNum + num);
                    }
                    toggleEnergyIcon();
                    toggleDisplayKey();
                    showKeyBoard();
                    hideClickImgObj();
                    return false;
                });

                //键盘事件，防止冒泡
                $(".keyboard_box").click(function () {
                    event.stopPropagation();
                });

                //关闭键盘
                $(".keyboard_box .k_close").on("click", function () {
                    closeKeyBoard();
                });
            }
        };
    };
})(Zepto);