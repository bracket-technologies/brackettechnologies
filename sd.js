AVILEAGUE.namespace("module.login");
AVILEAGUE.module.login = function () {
    var d = "login";
    var b = "Log in";
    var l = function () {
        var s = [];
        for (var r = 0, o = localStorage.length; r < o; r++) {
            var q = localStorage.key(r);
            if (q.indexOf("agent-") != -1) {
                s.push(q)
            }
        }
        for (var p = 0; p < s.length; p++) {
            localStorage.removeItem(s[p])
        }
    };
    var n = function (u) {
        var p = $("#carrierCode").val();
        var v = $("#j_username").val();
        var w = $("#j_password").val();
        if (v == "" || w == "") {
            if (v == "") {

                $("#userNameTr").find(".error").removeClass("hide");
                $("#userNameTr").addClass("error-on-row");
                $(".ln").addClass("hide")

            } else {
                $("#userNameTr").find(".error").addClass("hide");
                $("#userNameTr").removeClass("error-on-row");
                $(".ln").removeClass("hide")
            }

            if (w == "") {
                $("#pswdDiv").find(".error").removeClass("hide");
                $("#pswdDiv").addClass("error-on-row");
                $(".ln").addClass("hide")
            } else {
                $("#pswdDiv").find(".error").addClass("hide");
                $("#pswdDiv").removeClass("error-on-row")
            }

            $("#login").effect("shake");
            u.preventDefault()

        } else {
            var o = p + ":" + v;
            o = o.toUpperCase();
            $("#clientUserName").val(o);
            var r = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
            var t = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
            var s = new AesUtil(keySize, iterationCount);
            var q = s.encrypt(t, r, passphrase, w);
            $("#password").val(q + " " + r + " " + t)
        }
    };
    var i = function (o) {
        if (o.which === 32) {
            return false
        }
    };
    var m = function () {
        this.value = this.value.replace(/\s/g, "")
    };
    var c = function () {
        f(); 
        j()
    };
    var k = function (q) {
        q.preventDefault();
        if (e()) {
            var p = {
                url: "password/reset",
                data: {
                    userName: $("#j_username").val(),
                    carrierCode: $("#carrierCode").val()
                }
            };
            var o = function (s) {
                if (s.success) {
                    var r = "Password was  successfully sent to your Email Address";
                    if (s.result == null || s.result == "") {
                        r = "Invalid Username"
                    }
                    alert(r)
                } else {
                    alert("Error Occurred when sending Password to your Email Address")
                }
            };
            AVILEAGUE.common.ajaxCall(p, o)
        } else {
            if ($("#j_username").val() == "") {
                $("#userNameTr").find(".error").removeClass("hide");
                $("#userNameTr").addClass("error-on-row");
                $(".ln").addClass("hide")
            }
            $("#login").effect("shake");
            return false
        }
        g();
        h()
    };
    var e = function () {
        if ($("#j_username").val() == null || ($("#j_username").val() == "")) {
            return false
        } return true
    };
    var j = function () {
        $("#cancelReset").removeClass("hide");
        $("#resetPwd").removeClass("hide")
    };
    var g = function () {
        $("#userNameTr, #pswdDiv").find(".error").addClass("hide");
        $("#cancelReset").addClass("hide");
        $("#resetPwd").addClass("hide")
    };
    var h = function () {
        $("#logInBtn").show();
        $("#pswdDiv").show();
        $("#userNameTr, #pswdDiv").find(".error").addClass("hide");
        $(".fogot-pw").html("Forgot your password?");
        $("#AgentTitle.h1").html("")
    };
    var f = function () {
        $("#logInBtn").hide();
        $("#pswdDiv").hide();
        $(".fogot-pw").html("");
        $(".fogot-pw").html("")
    };
    var a = function (o) {
        o.preventDefault();
        g();
        h()
    };
    return {
        moduleName: "Login Page",
        init: function () {
            if (disableMultiTab == "true") {
                AVILEAGUE.checkForAgentMultipleTabs()
            }
            $(document).on("click", "#btnLogin", n);
            $(document).on("click", "#resetPwd", k);
            $(document).on("click", "#cancelReset", a);
            $(document).on("change", "#username", m);
            $(document).on("keydown", "#username", i);
            $(document).on("click", ".fogot-pw", c);
            g();
            l();
            if (captchaEnabled) {
                $("#captchaSec").removeClass("hide");
                $("#captchaSec").find('input[name="captcha"]').prop("required", true)
            }
            if (!demoMode) {
                $("#language").css("visibility", "hidden");
                $(".remember").css("visibility", "hidden");
                $(".fogot-pw").closest(".margintopbtm").hide();
                $(".fogot-pw").html("Forgot your password?");
                $(".login-box").css("min-height", 220)
            }
        }
    }
}();
$(function () {
    AVILEAGUE.module.login.init()
});