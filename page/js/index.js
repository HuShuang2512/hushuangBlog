var everyDay = new Vue({ //每日一句
    el: "#every_day",
    data: {
        content: ""
    },
    computed: {
        getContent: function () {
            return this.content
        }
    },
    created: function () {
        //请求数据，给content赋值
        axios({
            method: "get",
            url: "/queryEveryDay"
        }).then(function (resp) {
            everyDay.content = resp.data.data[0].content;
            // console.log(resp)
        }).catch(function (resp) {
            console.log("请求失败")
        })
    }
})

var articleList = new Vue({ //文章列表
    el: "#article_list",
    data: {
        page: 1,
        pageSize: 5,
        count: 100,
        pageNumList: [],
        articleList: [
            {   title: "这是标题",
                content: "分开了那可就方便快捷少部分看会书吧v看了几十年发生规律进行不过就算打不过v能不能零零背靠背的法国境内",
                date: "2018-10-10",
                views: "101",
                tags: "test1 test2",
                id: "1",
                link: ""
            }
        ]
    },
    computed: {
        jumpTo: function() {
          return function (page) {
              this.getPage(page, this.pageSize)
          }
        },
        time: function() {//转换时间戳
             return function (time = + new Date()) {
                 var date = new Date(time * 1000 );
                 return date.toJSON().substr(0, 10).replace('T', ' ');
             }
        },
        getPage: function () {
            return function (page, pageSize) {
                var searcheUrlParams = location.search.indexOf("?") > -1 ? location.search.split("?")[1].split("&") : "";
                var tag = "";
                for (var i = 0; i < searcheUrlParams.length; i ++) {
                    if (searcheUrlParams[i].split("=")[0] == "tag") {
                        try {
                            tag = searcheUrlParams[i].split("=")[1];
                        }catch (e) {
                            console.log(e)
                        }
                    }
                }
                if (tag == "") {
                    axios({
                        method: "get",
                        url: "/queryBlogByPage?page=" + (page - 1) + "&pageSize=" + pageSize
                    }).then(function (resp) {
                        // console.log(resp)
                        var result = resp.data.data;
                        var list = [];
                        for (var i = 0; i < result.length; i ++) {
                            var temp = {};
                            temp.title = result[i].title;
                            temp.content = result[i].content;
                            temp.date = articleList.time(result[i].ctime);
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?bid=" + result[i].id;
                            list.push(temp)
                        }
                        articleList.articleList = list;
                        articleList.page = page;
                    }).catch(function (resp) {
                        console.log("请求失败")
                    });
                    axios({
                        method: "get",
                        url: "/queryBlogCount"
                    }).then(function (resp) {
                        // console.log(resp)
                        articleList.count = resp.data.data[0].count;
                        articleList.generatePageTool;
                    })
                } else {
                    axios({
                        method: "get",
                        url: "/queryByTag?page=" + (page - 1) + "&pageSize=" + pageSize + "&tag=" + tag
                    }).then(function (resp) {
                        // console.log(resp)
                        var result = resp.data.data;
                        var list = [];
                        for (var i = 0; i < result.length; i ++) {
                            var temp = {};
                            temp.title = result[i].title;
                            temp.content = result[i].content;
                            temp.date = articleList.time(result[i].ctime);
                            temp.views = result[i].views;
                            temp.tags = result[i].tags;
                            temp.id = result[i].id;
                            temp.link = "/blog_detail.html?bid=" + result[i].id;
                            list.push(temp)
                        }
                        articleList.articleList = list;
                        articleList.page = page;
                    }).catch(function (resp) {
                        console.log("请求失败")
                    });
                    axios({
                        method: "get",
                        url: "/queryByTagCount?tag=" + tag
                    }).then(function(resp) {
                        console.log(resp)
                        articleList.count = resp.data.data[0].count;
                        articleList.generatePageTool;
                    });
                }

            }
        },
        generatePageTool: function () {
            var nowPage = this.page;
            var pageSize = this.pageSize;
            var totalCount = this.count;
            var result = [];
            result.push({text: "<<", page: 1});
            if (nowPage > 2) {
                result.push({text: nowPage - 2, page: nowPage - 2});
            }
            if (nowPage > 1) {
                result.push({text: nowPage - 1, page: nowPage - 1});
            }
            result.push({text: nowPage, page: nowPage});
            if (nowPage + 1 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text: nowPage + 1, page: nowPage + 1});
            }
            if (nowPage + 2 <= (totalCount + pageSize - 1) / pageSize) {
                result.push({text: nowPage + 2, page: nowPage + 2});
            }
            result.push({text: ">>", page: parseInt((totalCount + pageSize - 1) / pageSize)});
            this.pageNumList = result;
            return result;
        }
    },
    created: function () {
        this.getPage(this.page, this.pageSize,)
    }
})

