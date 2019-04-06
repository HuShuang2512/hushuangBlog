var blogDetail = new Vue({
    el: "#blog_detail",
    data: {
        title: "",
        content: "",
        ctime: "",
        tags: "",
        views: ""
    },
    computed: {
        time: function() {//转换时间戳
            return function (time = + new Date()) {
                var date = new Date(time * 1000);
                return date.toJSON().substr(0, 10).replace('T', ' ');
            }
        }
    },
    created: function () {
        var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        if (searcheUrlParams == "") {
            return;
        }
        var bid = -10;
        for (var i = 0; i < searcheUrlParams.length; i ++) {
            if (searcheUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searcheUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e)
                }
            }
        }
        axios({
            method: "get",
            url: "/queryBlogById?bid=" + bid
        }).then(function (resp) {
            // console.log(resp)
            var result = resp.data.data[0];
            blogDetail.title = result.title;
            blogDetail.content = result.content;
            blogDetail.ctime = blogDetail.time(result.ctime);
            blogDetail.tags = result.tags;
            blogDetail.views = result.views;
        }).catch(function (resp) {
            console.log("请求失败")
        })
    }
});

var sendComment = new Vue({
    el: "#send_comment",
    data: {
        vcode: "",
        rightCode: ""
    },
    computed: {
        changeCode: function () {
            return function () {
                axios({
                    method: "get",
                    url: "/queryRandomCode"
                }).then(function (resp) {
                    // console.log(resp)
                    sendComment.vcode = resp.data.data.data;
                    sendComment.rightCode = resp.data.data.text;
                })
            }
        },
        sendComment: function () {
            return function () {
                var code = document.getElementById("comment_code").value;
                if (code != sendComment.rightCode) {
                    alert("验证码有误");
                    return;
                }
                var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var bid = -10;
                for (var i = 0; i < searcheUrlParams.length; i ++) {
                    if (searcheUrlParams[i].split("=")[0] == "bid") {
                        try {
                            bid = parseInt(searcheUrlParams[i].split("=")[1]);
                        }catch (e) {
                            console.log(e)
                        }
                    }
                }
                var replyName = document.getElementById("comment_reply_name").value;
                var reply = document.getElementById("comment_reply").value;
                var name = document.getElementById("comment_name").value;
                var email = document.getElementById("comment_email").value;
                var content = document.getElementById("comment_content").value;
                axios({
                    method: "get",
                    url: "/addComment?bid=" + bid + "&parent=" + reply + "&userName=" + name + "&email=" + email + "&content=" + content + "&parentName=" + replyName
                }).then(function (resp) {
                    // console.log(resp.data.msg)
                    alert(resp.data.msg)
                });
            }
        }

    },
    created: function () {
       this.changeCode();
    }
})

var blogComments = new Vue({
    el: "#blog_comments",
    data: {
        total: 0,
        comments: []
    },
    computed: {
        reply: function () {
            return function (commentId, userName) {
                document.getElementById("comment_reply").value = commentId;
                document.getElementById("comment_reply_name").value = userName;
                location.href = "#send_comment";
            }
        }
    },
    created: function () {
        var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
        var bid = -10;
        for (var i = 0; i < searcheUrlParams.length; i ++) {
            if (searcheUrlParams[i].split("=")[0] == "bid") {
                try {
                    bid = parseInt(searcheUrlParams[i].split("=")[1]);
                }catch (e) {
                    console.log(e)
                }
            }
        }
        axios({
            method: "get",
            url: "/queryCommentsByBlogId?bid=" + bid
        }).then(function (resp) {
            // console.log(resp)
            blogComments.comments = resp.data.data;
            for(var i =0; i < blogComments.comments.length; i ++) {
                if (blogComments.comments[i].parent > -1) {
                    blogComments.comments[i].options = "回复@" + blogComments.comments[i].parent_name;
                }
            }
        });
        axios({
            method: "get",
            url: "/queryCommentCountByBlogId?bid=" + bid
        }).then(function (resp) {
            // console.log(resp)
            blogComments.total = resp.data.data[0].count;
        })
    }
});
