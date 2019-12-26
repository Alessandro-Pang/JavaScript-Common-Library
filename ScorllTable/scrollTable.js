/**
 * dynamicTable 动态表格
 * @param { Object }  resource 
 * @param { String }  el : 指定元素
 * @param { Array }   header : 表头
 * @param { Array }   data : 数据行
 * @param { Number }  rowNum : 显示行数
 * @param { Boolean } index : 是否显示索引列
 * @param { Number }  timeout : 滚动动画延时
 * @param { String }  headerBGC : 标题栏背景颜色
 * @param { String }  oddRowBGC : 奇数行背景颜色
 * @param { String }  evenRowBGC : 偶数行背景颜色
 * @param { String }  fontColor : 字体颜色
 * @param { String }  indexBGC : 索引列背景颜色
 * @param { Array }   colWidth : 每列的宽度
 */
let dynamicTable = resource => {
    'use strict';

    //检查参数类型
    if (typeof resource !== 'object') {
        console.error('未传入参数,或者参数不是Object类型');
        return
    }

    // 检查是否传入元素
    const ele = resource.el;
    if (!ele) {
        console.error('元素获取不正确！');
        return
    }
    /**
     * 检查是否传入动画触发时长
     * 当时间小于 10 计算为秒级单位，
     * 大于 10 计算为毫秒级单位
     */
    let timeout = resource.timeout;
    if (!timeout) {
        timeout = 2000
    } else if (timeout < 10) {
        timeout = timeout * 1000
    }

    // 检查 配置元素是否传入数据
    const colName = resource.header === undefined ? '' : resource.header;
    const rowData = resource.data === undefined ? '' : resource.data;
    const rowNum = resource.rowNum === undefined ? '20%' : 100 / resource.rowNum + '%';
    const headerBGC = resource.headerBGC === undefined ? '#999' : resource.headerBGC;
    const oddRowBGC = resource.oddRowBGC === undefined ? '#bbb' : resource.oddRowBGC;
    const evenRowBGC = resource.evenRowBGC === undefined ? '#ddd' : resource.evenRowBGC;
    const fontColor = resource.fontColor === undefined ? 'black' : resource.fontColor;
    const indexBGC = resource.indexBGC === undefined ? '#555' : resource.indexBGC;
    const colIndex = resource.index === undefined ? true : resource.index;
    const colWidth = resource.colWidth === undefined ? false : resource.colWidth;
    const indexColor = fontColor.search(/('black')|(0{3,6})/) ? "white" : fontColor;

    //基本table html
    const html = `
                <div class="table">
                    <div class="thead">
                        <div class="tr"></div>
                    </div>
                    <div class="tbody"></div>
                </div>
            `;
    //Css样式集
    const boxCSS = {
        overflow: 'hidden',
        background: headerBGC
    };
    const tableCSS = {
        color: fontColor,
        width: '100%',
        height: '100%'
    };
    const theadCSS = {
        width: '100%',
        height: '20%'
    };
    const thead_trCSS = {
        display: "flex",
        flexWrap: "nowrap",
        width: "100%",
        height: "100%",
        background: headerBGC,
        justifyContent: "space-around"
    };
    const thCSS = {
        justifyContent: "space-around",
        fontWeight: "bold"
    };
    const tbodyCSS = {
        width: "100%",
        height: '80%',
        boxSizing: 'border-box'
    };
    const tbody_trCSS = {
        flexWrap: "nowrap",
        width: "100%",
        height: rowNum,
        justifyContent: "space-around"
    };
    const trOddCSS = {
        display: "flex",
        background: oddRowBGC
    };
    const trEvenCSS = {
        display: "flex",
        background: evenRowBGC
    };
    const th_tdCSS = {
        margin: 'auto',
        whiteSpace: 'nowrap',
        overflow: "hidden",
        textOverflow: 'ellipsis',
        textAlign: 'center',
        padding: '0 4px 0 4px'
    };
    const indexCSS = {
        display: 'inline-block',
        width: '90%',
        height: "90%",
        background: indexBGC,
        color: indexColor,
        borderRadius: '20%',
        margin: 'auto'
    };
    //插入table元素
    $(ele).append(html);

    //核心代码
    //遍历插入数据 表头
    if (colIndex) {
        $(ele + '>.table>.thead>.tr').append('<div class="th"><span class="index">#</span></div>')
    }
    colName.forEach(element => {
        $(ele + '>.table>.thead>.tr').append(`<div class="th">${element}</div>`)
    });

    //遍历插入数据 数据行
    for (let i = 0; i < rowData.length; i++) {
        $(ele + '>.table>.tbody').append('<div class="tr"></div>');
        if (colIndex) {
            $(ele + '>.table>.tbody>.tr:eq(' + i + ')').append(`<div class="td"><span class="index">${i+1}</span></div>`)
        }
        rowData[i].forEach(element => {
            $(ele + '>.table>.tbody>.tr:eq(' + i + ')').append(`<div class="td">${element}</div>`)
        })
    }

    //设置CSS样式
    $(ele).css(boxCSS);
    $(ele + '>.table').css(tableCSS);
    $(ele + '>.table>.thead').css(theadCSS);
    $(ele + '>.table>.thead>.tr').css(thead_trCSS);
    $(ele + '>.table>.thead>.tr>.th').css(th_tdCSS).css(thCSS);
    $(ele + '>.table>.tbody').css(tbodyCSS);
    $(ele + '>.table>.tbody>.tr').css(tbody_trCSS);
    $(ele + '>.table>.tbody>.tr:odd').css(trOddCSS);
    $(ele + '>.table>.tbody>.tr:even').css(trEvenCSS);
    $(ele + '>.table>.tbody>.tr>.td').css(th_tdCSS);
    $(ele + '>.table span.index').css(indexCSS)

    //统一计量单位
    const emptyUnit = element => element.replace(/[^0-9]/g, '');
    const hendlen = $(`${ele}>.table>.thead>.tr>.th`).length;
    const bodylen = $(`${ele}>.table>.tbody>.tr:nth-child(1)>.td`).length;
    const ceil = Math.ceil;

    /**
     * 设置每列的宽度
     * eq() 是在匹配的元素中取下标为n的元素
     * nth-child() 是在匹配元素的父元素中选择第n个元素
     */
    if (!colWidth) {
        $(`${ele}>.table>.thead>.tr>.th`).css({ width: ceil(100 / hendlen) + '%' });
        $(`${ele}>.table>.tbody>.tr>.td`).css({ width: ceil(100 / bodylen) + '%' });
    } else {
        for (let i = 0; i < colWidth.length; i++) {
            let emptyUnitColWidth = emptyUnit(colWidth[i]);
            $(`${ele}>.table>.thead>.tr>.th:nth-child(${i+1})`).width(emptyUnitColWidth);
            $(`${ele}>.table>.tbody>.tr>.td:nth-child(${i+1})`).width(emptyUnitColWidth);
        }
    }

    //奇偶校验 --> 处理最后一行是奇数的问题
    let oddORevenCheck = $(`${ele}>.table>.tbody>.tr`).length % 2 == 0 ? 'even' : 'odd';
    //滚动动画
    setInterval(function() {
        $(ele + '>.table>.tbody>.tr:eq(0)').slideToggle(100, function() {
            switch (oddORevenCheck) {
                case 'even':
                    $(this).clone().css(trEvenCSS).appendTo(ele + '>.table>.tbody');
                    oddORevenCheck = 'odd';
                    break;
                case 'odd':
                    $(this).clone().css(trOddCSS).appendTo(ele + '>.table>.tbody');
                    oddORevenCheck = 'even';
                    break;
            }
            $(this).remove();
        });
    }, timeout)
}