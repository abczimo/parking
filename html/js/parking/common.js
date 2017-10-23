var reg_car_no_pattern_7 = /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[ABCDEFGHJKLMNPQRSTUVWXYZ_0-9]{4}[ABCDEFGHJKLMNPQRSTUVWXYZ_0-9港澳学]{1}$/i;
var reg_car_no_pattern_8 = /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[ABCDEFGHJKLMNPQRSTUVWXYZ_0-9]{6}$/i;
function checkCardNo(carNo) {
    if (carNo.search((carNo.length == 7) ? reg_car_no_pattern_7 : reg_car_no_pattern_8) == -1) {
        alert("车牌号格式不正确：" + carNo + "," + carNo.length);

        $.get('/page/wx/user/errorPlateNumber.html' + window.location.search,
            {"carNo": carNo, "carNoLength": carNo.length},
            function (response) {
            }
        );
    } else {
        return true;
    }
}

/**
 * 校验手机号码
 * @param phoneNum
 * @returns {boolean}
 */
var phoneValidate = function (phoneNum) {
    return (/^1\d{10}$/.test(phoneNum));
}

function formatMoney(s, n) {
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

function getPara(p) {
    var hrefstr, pos, parastr, para, tempstr;
    hrefstr = window.location.href;
    pos = hrefstr.indexOf("?");
    end = hrefstr.indexOf("#");
    if (end > 0) {
        parastr = hrefstr.substring(pos + 1, end);
    } else {
        parastr = hrefstr.substring(pos + 1);
    }
    para = parastr.split("&");
    tempstr = "";
    for (i = 0; i < para.length; i++) {
        tempstr = para[i];
        pos = tempstr.indexOf("=");
        if (tempstr.substring(0, pos) == p) {
            return tempstr.substring(pos + 1);
        } else if (!isNaN(p) && i == p - 1) {
            return tempstr.substring(pos + 1);
        }
    }
    return "";
}
function initWeixin(appid, ctx) {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: ctx + '/service/wx_config.html',
        data: {"appid": appid, "url": window.location.href},
        success: function (msg) {
            if (msg.type == 'success') {
                wx.config({
                    debug: false,
                    appId: msg.data.appid,
                    timestamp: msg.data.timestamp,
                    nonceStr: msg.data.nonceStr,
                    signature: msg.data.signature,
                    jsApiList: ['chooseWXPay']
                });
            }
        },
        error: function (xhr, type) {
            alert('Ajax error!')
        }
    });
};


/**
 * 生成UUID
 * @param len 随机数长度
 * @param radix 随机数字母范围
 * @returns {string}
 */
function createUuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

var cleanStorage = function (key, value) {
    $.fn.cookie(key, null, { expires: -1});
}

var setStorage = function (key, value) {
    $.fn.cookie(key, value, { expires: 365, path: "/"});
}

var getStorage = function (key) {
    return $.fn.cookie(key);
}

var compareWithStorage = function (key, value) {
    return true;
    // var result = $.fn.cookie(key) == value ? true : false;
    // if (!result) {
    //     alert("网络异常，请刷新重试");
    //     jsapi.httpPostJson(cpServiceBase + "page/misc/error/report.html", {
    //         'href': window.location.href,
    //         'local_sid': $.fn.cookie(key),
    //         'current_sid': value
    //     }, function (result) {
    //     });
    //     //window.location.reload();
    //     return false;
    // } else {
    //     return true;
    // }
}

function is_weixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}