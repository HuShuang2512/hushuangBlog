var blogDao = require("../dao/BlogDao");
var tagDao = require("../dao/TagDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao")
var timeUtil = require("../util/TimeUtil")
var respUtil = require("../util/RespUtil")
var url = require("url");
var path = new Map();


function queryRandomTags(request, response) {
    tagDao.queryAllTag(function (result) {
        result.sort(function () {
            return Math.random() > 0.5 ? true : false
        })
        // console.log(result)
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}
path.set("/queryRandomTags", queryRandomTags);

function queryByTagCount(request, response) {
    var params = url.parse(request.url, true).query;
    tagDao.queryTag(params.tag, function (result) {
        tagBlogMappingDao.queryByTagCount(result[0].id, function (result) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        })
    })
}
path.set("/queryByTagCount", queryByTagCount);

function queryByTag(request, response) {
    var params = url.parse(request.url, true).query;
    tagDao.queryTag(params.tag, function (result) {
        if (result == null || result.length == 0) {
            response.writeHead(200);
            response.write(respUtil.writeResult("success", "查询成功", result));
            response.end();
        } else {
            tagBlogMappingDao.queryByTag(result[0].id, parseInt(params.page), parseInt(params.pageSize), function (result) {
                var blogList = [];
                for (var i = 0 ; i < result.length ; i ++) {
                    blogDao.queryBlogById(result[i].blog_id, function (result) {
                        blogList.push(result[0]);
                    });
                }
                // console.log(blogList)
                getResult(blogList, result.length, response);
            })
        }
    })
}
path.set("/queryByTag", queryByTag);

function getResult(blogList, len, response) {
    if(blogList.length < len) {
        setTimeout(function () {
            getResult(blogList, len, response)
        }, 10);
    } else {
        for (var i = 0; i < blogList.length; i ++) {
            blogList[i].content = blogList[i].content.replace(/<img[\w\W]*">/, "");
            blogList[i].content = blogList[i].content.replace(/<[\w\W]{1,5}>/g, "");
            blogList[i].content = blogList[i].content.replace(/<[^<>]+>/g , "");
            blogList[i].content = blogList[i].content.substring(0, 300);
        }
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", blogList));
        response.end();
    }
}

function queryByTagCount(request, response) {
    tagDao.queryAllTag(function (result) {
        response.writeHead(200);
        response.write(respUtil.writeResult("success", "查询成功", result));
        response.end();
    })
}
path.set("/queryByTagCount", queryByTagCount);

module.exports.path = path;
