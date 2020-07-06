/*

职教代刷助手3

date: 2020年07月06日
version: 0.2.0
author1: Pure-Peace
author2: https://timestove.gitee.io

*/

// vars --------------------------------
const hrefs = []
const arrowDown = 'am-icon-caret-down'
const cl = 'class'
const sp = 'span'
const st = setTimeout
var zjsqInfoDom
var currentLessonIndex = 0
var lessonFailed = 0
var totalStudyTime = 0
var losingStreak = 0
var stopFlag = false
var skipProgress = 0
var totalLessons = 0

// funcs --------------------------------
function main () {
  try {
    const input = prompt('[职教代刷助手v3] 跳过已学进度超过百分之几的课程？\n\n输入百分比，但是不要输入百分号\n如：90\n\n输入100或者更大的数字就不会跳过任何课程：', '90') || '100'
    skipProgress = parseInt(input.replace(/[^0-9]/ig, '')) || 100
    // fetch global datas
    log('开始获取课件数据！')
    globalDataHander()
    // get datas
    st(() => {
      log('正在准备刷取学习进度及时间的必要信息...')
      // started
      directoryDataRequester(0)
    }, 12000)
    return 'started'
  } catch (e) {
    log('主程序异常，可能无法正常工作：' + e)
  };
};

function log (text) {
  const info = `[${new Date().format()}] ${text}`
  console.log(info)
  zjsqInfoDom.append(info + '<br>')
  var ele = zjsqInfoDom[0]
  ele.scrollTop = ele.scrollHeight + 999
};

function initial () {
  // 请保持这种格式，否则getText函数无法从注释中正确提取此处的css
  function zjsqCss () {/*
.zjsqInfoBox {
    width: 700px;
    height: 450px;
    background-color:white;
    position:absolute;
    top:50%;
    left:50%;
    transform:translateX(-50%) translateY(-50%);
    -moz-transform:translateX(-50%) translateY(-50%);
    -webkit-transform:translateX(-50%) translateY(-50%);
    -ms-transform:translateX(-50%) translateY(-50%);
    border-radius:5px;
    z-index: 9999;
    box-shadow: 3px 3px 10px rgba(0,0,0,.2);
    padding: 20px;
}

.zjsqTitle {
    font-weight: bold;
    font-size: 16px;
    width: 100%;
    text-align: center;
}

#zjysqInfo {
    border-radius: 4px;
    margin-top: 15px;
    padding: 15px;
    width: 100%;
    height: 370px;
    word-wrap: break-word;
    overflow-y: scroll;
    font-size: 14px;
    color: #FAFAFA;
    background-color: rgba(0,0,0,.8);
} */
  };

    // 请保持这种格式，否则getText函数无法从注释中正确提取此处的html
  function zjsqHtml () {/*
<div id="zjsqInfoBoxId" class="zjsqInfoBox">
    <div class="zjsqTitle">职教代刷代码 v3 Beta2</div>
    <div id="zjysqInfo">
        -time-欢迎使用职教代刷助手！ | 由：<a href="https://timestove.gitee.io" target="_blank">https://timestove.gitee.io</a>（时光查题网）提供<br>
        -time-基于 @职教书签 二开 | 只用于网络学习，请于24小时内删除~<br>
        -time-使用本代码即代表您同意承担任何不良后果，我们不负责任何后果<br>
        -time-开始初始化...请勿随意操作页面...<br>
    </div>
</div> */
  };

  function getText (func) {
    var str = func.toString().split('\n')
    str = str.slice(1, str.length - 1).join('\n')
    return str.replace(/-time-/g, `[${new Date().format()}] `)
  };

  function makeDivDraggable (id) {
    var Drag = document.getElementById(id)
    Drag.onmousedown = function (event) {
      var ev = event || window.event
      event.stopPropagation()
      var disX = ev.clientX - Drag.offsetLeft
      var disY = ev.clientY - Drag.offsetTop
      document.onmousemove = function (event) {
        var ev = event || window.event
        Drag.style.left = ev.clientX - disX + 'px'
        Drag.style.top = ev.clientY - disY + 'px'
        Drag.style.cursor = 'move'
      }
    }
    Drag.onmouseup = function () {
      document.onmousemove = null
      this.style.cursor = 'default'
    }
  };

  try {
    console.log('职教代刷助手 v3 beta2 | 新版本获取地址：https://zj.miya.ink')
    console.log('开始初始化...请勿随意操作页面...')
    Date.prototype.format = function () {
      var format = 'yyyy-MM-dd HH:mm:ss'
      var o = {
        'M+': this.getMonth() + 1, // month
        'd+': this.getDate(), // day
        'H+': this.getHours(), // hour
        'm+': this.getMinutes(), // minute
        's+': this.getSeconds(), // second
        'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
        S: this.getMilliseconds() // millisecond
      }

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      };

      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        };
      };
      return format
    }
    $('<style></style>').text(getText(zjsqCss)).appendTo($('head'))
    $('body').append(getText(zjsqHtml))
    makeDivDraggable('zjsqInfoBoxId')
    zjsqInfoDom = $('#zjysqInfo')
    return true
  } catch (e) {
    log('初始化控制台框架异常：' + e)
    return false
  };
};

function hrefParamsToArray (url) {
  return url
    .substring(url.indexOf('?') + 1)
    .split('&')
    .map((query) => query.split('='))
    .reduce((params, pairs) => (params[pairs[0]] = pairs[1] || '', params), {})
};

function studyProcessRequester (data) {
  function getProcessText () {
    return `[${new Date().format()}] 完成进度：(${totalCount}/${randomRequestTimes}) / 成功数：${successCount} / 失败数：${failedCount}`
  };

  if (stopFlag === true) return 0
  var lessonId = `lesson${currentLessonIndex}`
  var successCount = 0
  var failedCount = 0
  var totalCount = 0
  var randomRequestTimes = Math.floor((Math.random() * 87) + 56)
  const requestData = {
    courseOpenId: data.courseOpenId,
    openClassId: data.openClassId,
    cellId: data.cellId,
    cellLogId: data.cellLogId,
    picNum: Math.round(324 / randomRequestTimes),
    studyNewlyTime: Math.round(14640 / randomRequestTimes),
    studyNewlyPicNum: Math.round(324 / randomRequestTimes),
    token: data.guIdToken
  }
  log(`第(${currentLessonIndex}/${hrefs.length})课，课件：${data.cellName}，类型：[${data.categoryName}]`)
  log(`本次随机学习时间：${(randomRequestTimes * 10 / 60).toFixed(2)}分钟 总请求次数：${randomRequestTimes}`)
  log('现在开始上课！')
  zjsqInfoDom.append(`<div id="${lessonId}">${getProcessText()}</div>`)
  var ele = zjsqInfoDom[0]
  ele.scrollTop = ele.scrollHeight + 999
  var lessonProcessDom = $(`#${lessonId}`)
  for (let i = 0; i < randomRequestTimes; i++) {
    var defer = $.Deferred()
    $.ajax({
      async: true,
      timeout: 5000,
      type: 'post',
      url: urls2.Directory_stuProcessCellLog,
      data: requestData,
      dataType: 'json',
      success: function (responseData) {
        successCount += 1
      },
      error: function (response) {
        failedCount += 1
      },
      complete: function (response) {
        totalCount += 1
        lessonProcessDom.text(getProcessText())
        if (totalCount === randomRequestTimes) {
          totalStudyTime += randomRequestTimes * 10
          log(`当前课程(${lessonId})，已完成学习！三秒后开始下一课程...`)
          st(function () {
            return directoryDataRequester(currentLessonIndex)
          }, 4000)
        };
      }
    })
    requestData.picNum += Math.round(300 / randomRequestTimes)
    requestData.studyNewlyTime += Math.round(12640 / randomRequestTimes)
    requestData.studyNewlyPicNum += Math.round(300 / randomRequestTimes)
  };
  return defer
};

function directoryDataRequester (hrefIndex, changeDirectory = false, addData = false) {
  if (stopFlag === true) return 0
  var changedFlag = false
  if (hrefIndex < hrefs.length) {
    currentLessonIndex = hrefIndex + 1
    if (!addData && changeDirectory !== true) log(`正在获取课件(${currentLessonIndex}/${hrefs.length})的请求令牌...`)
    var requestData = hrefParamsToArray(hrefs[hrefIndex])
    if (addData) {
      Object.assign(requestData, addData)
      console.log(requestData)
      delete (requestData.flag)
    };
    var defer = $.Deferred()
    $.ajax({
      async: true,
      timeout: 5000,
      type: 'post',
      url: changeDirectory ? urls2.Directory_changeStuStudyProcessCellData : urls2.Directory_viewDirectory,
      data: requestData,
      dataType: 'json',
      success: function (responseData) {
        if (changeDirectory === true) {
          log('课程切换成功！即将重新请求令牌...')
          changedFlag = false
          return directoryDataRequester(hrefIndex)
        };
        if (responseData.code === 1) {
          log('令牌获取成功！准备就绪...')
          losingStreak = 0
          return studyProcessRequester(responseData)
        } else if (responseData.code === -100) {
          if (changedFlag === true) {
            log('课程切换失败，将跳过此课程...')
            failedHandler(responseData)
          } else {
            log('收到职教云提示切换课程...准备切换...')
            changedFlag = true
            changeDirectory = true
            addData = {
              cellName: responseData.currCellName,
              moduleId: responseData.currModuleId
            }
            return directoryDataRequester(hrefIndex, changeDirectory, addData)
          };
        } else {
          failedHandler(responseData)
        };
      },
      error: function (response) {
        log(`令牌获取失败！跳过此课程，直接开始下一课：(${currentLessonIndex})`)
        console.log(response)
        lessonFailed += 1
        losingStreak += 1
        if (losingStreak > 3) {
          exitHander(-1)
        } else {
          directoryDataRequester(currentLessonIndex)
        };
      }
    })
    return defer
  } else {
    exitHander(1)
  };
};

function exitHander (status) {
  if (status === -1) {
    stopFlag = true
    const text = '由于令牌请求连续失败超过三次，所以书签将停止工作！请等待一段时间后再次使用！'
    log(text)
    alert(text)
  };
  const result = `本次共学习了${currentLessonIndex}个课件，成功数：${hrefs.length - lessonFailed}，失败数：${lessonFailed}，计算总学习时间约为：${(totalStudyTime / 60).toFixed(2)}分钟！`
  log('**********学习结束！**********')
  log(result)
  if (status !== -1) alert('学习结束！' + result)
  $('#zjsqInfoBoxId').click(function () {
    $('#zjsqInfoBoxId').remove()
  })
  log('感谢您使用职教书签 v3！现在单击本窗口即可关闭。')
};

function globalDataHander () {
  // get modules
  log('正在获取课件模块数据(1/3)...')
  $('.moduleList').each(function () {
    const that = $(this).children('div').get(0)
    if ($($(that).children(sp).get(1)).attr(cl).search(arrowDown) === -1) that.click()
  })
  // get children modules
  st(() => {
    log('正在获取课件详细数据(2/3)...')
    $('tr.openOrCloseTopic').each(function () {
      if ($($(this).find(sp).get(0)).attr(cl).search(arrowDown) === -1) $(this).click()
    })
  }, 3000)
  // get links

  st(() => {
    log('正在获取所有课件链接(3/3)...')
    $('a.isOpenModulePower').each(function () {
      totalLessons += 1
      if (skipProgress >= 100 || (parseInt($(this).prev().attr('title').replace(/[^0-9]/ig, '')) < skipProgress)) {
        hrefs.push($(this).attr('data-href'))
      };
    })
    log('已获取所有课件链接！课件总数：' + totalLessons)
    log('根据您的设置，' + (skipProgress < 100 ? `将跳过学习进度大于${skipProgress}%的课程：跳过了${totalLessons - hrefs.length}课` : '本次将学习所有课程'))
    log(`即将学习的课程数量为：${hrefs.length}`)
  }, 8000)
};

// go
if (initial() === true) {
  main()
} else {
  alert('程序初始化异常，请查看控制台错误信息！')
};

