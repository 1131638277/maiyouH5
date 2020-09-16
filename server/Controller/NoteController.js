const express = require('express');
const NoteModel = require('../Model/NoteModel');
const router = express.Router();
const format = require('../conment/js/dateFormat/dateFormat')

//查询所有的笔记
router.get('/notes', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    noteModel.getNotes((results) => {
        res.json(results);
    });
});

// 获取一个用户的所有笔记
router.get('/allNotes', (req, res) => {
    // 需要对数据进行操作  Model
    let noteModel = new NoteModel();
    noteModel.getNotesByUid(req.query, (results) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i].imgs) {//将图片字符串转为数组
                results[i].imgs = results[i].imgs.split(";");
            }
            if (results[i].keywords) {//将关键字字符，转化为数组
                results[i].keywords = results[i].keywords.split(",");
            }
            if (!results[i].title && results[i].info) {//如果没有标题，将文章内容作为标题
                results[i].title = results[i].info;
            }
            if (results[i].releasetime) {
                results[i].releasetime = format.dateFormat("YYYY-mm-dd", results[i].releasetime)//获取当前时间;
            }
        }
        res.json(results);
    });
});

//根据nid获取一个笔记的详情
router.get('/oneNotes', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let nid = req.query.nid;
    noteModel.getNotesByNid(nid, (results) => {
        res.json(results);
    });
});

// 根据笔记id来获取笔记详情和作者信息
router.get('/userNotes', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let nid = req.query.nid;
    noteModel.getAllByNid(nid, (results) => {
        var reg = new RegExp("<br>", "g"); //创建正则RegExp对象,表示所有的<br>换行符  
        if (results[0].info) {
            results[0].info = results[0].info.replace(reg, "\n");//替换内容中的所有换行符
        }
        if (results[0].imgs) {
            results[0].imgs = results[0].imgs.split(";");
        }
        if (results[0].keywords) {
            results[0].keywords = results[0].keywords.split(",");
        }
        res.json(results);
    });
});

// 根据关键字获取笔记
router.get('/keyNotes', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let keyw = req.query.keyw;
    noteModel.getNotesByKey(keyw, (results) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i].imgs) {
                results[i].imgs = results[i].imgs.split(";");
            }
            if (results[i].keywords) {
                results[i].keywords = results[i].keywords.split(",");
            }
            if (!results[i].title && results[i].info) {
                results[i].title = results[i].info;
            }
        }
        res.json(results);
    });
});

//查询所有的笔记种类
router.get('/types', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    noteModel.getTypes((results) => {
        res.json(results);
    });
});

// 赞的增减
router.post('/supports', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let nid = req.body.nid;
    let addsupports = req.body.supports + 1;
    let reducesupports = req.body.supports - 1;
    if (req.body.zanFlag) {
        noteModel.support(addsupports, nid, (results) => {
            res.json(results);
        });
    } else {
        noteModel.support(reducesupports, nid, (results) => {
            res.json(results);
        });
    }

});


//收藏的增减(web网站 react的路由 )
router.post('/collection', (req, res) => {
    // 需要对数据进行操作  Model
    let noteModel = new NoteModel();
    let nids = req.body.nid;
    let addcollection = req.body.collection + 1;
    let reducecollection = req.body.collection - 1;
    if (req.body.collectionFlag) {
        noteModel.collection(addcollection, nids, (results) => {
            res.json(results);
        });
    } else {
        noteModel.collection(reducecollection, nids, (results) => {
            res.json(results);
        });
    }
});

//评论发表
router.post('/comments', (req, res) => {

    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM", date)//获取当前时间
    req.body["comtimes"] = nowData;
    noteModel.addComments(req.body, (results) => {
        res.json(results);
    });
});

// 查询加载评论
router.get('/getcomments', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let nid = req.query.nid;
    noteModel.getCommentsByNid(nid, (results) => {
        res.json(results);
    });
});

// 查询加载更多评论
router.post('/getmorecomments', (req, res) => {
    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    noteModel.getMoreComments(req.body, (results) => {
        res.json(results);
    });
});

//查询当前登录用户所有支持过的评论
router.get('/getsuppportcomments', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.getSuppportComments(req.query.uid, (results) => {
        res.json(results);
    });
})

//发表笔记
router.post('/publishNote', (req, res) => {

    // 需要对数据进行操作  Model 
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM", date)//获取当前时间
    req.body.notesContent["releasetime"] = nowData;//绑定发表时间
    req.body.notesContent['info'] = req.body.notesContent.info.replace(/\n|\r\n/g, "<br>");
    req.body.notesContent['imgs'] = req.body.notesContent.imgs.substr(0, req.body.notesContent.imgs.length - 1);//去除图片imgs字符串最后的';'
    noteModel.addNote(req.body.notesContent, (results) => {
        res.json(results);
    });
});

//点赞笔记
router.post('/supportnote', (req, res) => {
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    req.body["supportTimes"] = nowData;//绑定收藏时间
    noteModel.supportNote(req.body, (results) => {
        res.json(results);
    });
})

//取消点赞
router.post('/cancelSupport', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.cancelSupport(req.body, (results) => {
        res.json(results);
    });
})

// 收藏笔记
router.post('/collectionnote', (req, res) => {
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    req.body["collectiontime"] = nowData;//绑定收藏时间
    noteModel.collectionNote(req.body, (results) => {
        res.json(results);
    });
})

//取消收藏
router.post('/cancelCollection', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.cancelCollection(req.body, (results) => {
        res.json(results);
    });
})

//关注
router.post('/follow', (req, res) => {
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    req.body["followtime"] = nowData;//绑定收藏时间
    noteModel.Follow(req.body, (results) => {
        res.json(results);
    });
})

//取消关注
router.post('/cancelFollow', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.cancelFollow(req.body, (results) => {
        res.json(results);
    });
})

//检测 是否已点赞/关注/收藏
router.post('/testing', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.Testing(req.body, (results) => {
        res.json(results);
    });
})

//点击删除笔记
router.post('/delete', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.Delete(req.body.nid, (results) => {
        res.json(results);
    });
})

//点赞评论
router.post('/supportcomments', (req, res) => {
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    req.body["time"] = nowData;//绑定收藏时间
    noteModel.supportComments(req.body, (results) => {
        res.json(results);
    });
})

//取消点赞评论
router.post('/cancelSptcomments', (req, res) => {
    let noteModel = new NoteModel();
    noteModel.cancelSptComments(req.body, (results) => {
        res.json(results);
    });
})

//投诉举报
router.post('/report', (req, res) => {
    let noteModel = new NoteModel();
    let date = new Date()
    var nowData = format.dateFormat("YYYY-mm-dd HH:MM:SS", date)//获取当前时间
    req.body["time"]=nowData;
    noteModel.reportInfo(req.body, (results) => {
        res.json(results);
    });
})
module.exports = router;