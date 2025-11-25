// ==UserScript==
// @name         启发式呆呆屏蔽器（帖子内用）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @downloadURL  https://github.com/cloudfish/block_CFVDaiDai/raw/refs/heads/main/启发式呆呆屏蔽器（帖子内用）.js
// @updateURL    https://github.com/cloudfish/block_CFVDaiDai/raw/refs/heads/main/启发式呆呆屏蔽器（帖子内用）.js
// @description  屏蔽或模糊某个不受欢迎的用户的小号
// @match        https://tieba.baidu.com/p/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /********** 配置区 **********/
    // true = 隐藏帖子；false = 模糊帖子
    let HIDE_CARD = false;
    /*************************/

function whitelisted(name) {
    let a = ["InEarlySpring", "ProStormGamer"];
    for (let i = 0; i < a.length; i++) {
        if (name === a[i]) return true;
    }
    return false;
}

function isSpamNickname(name) {
    if (!name) return false;
    if (whitelisted(name)) return false;

    if (name.length === 13 && /^[A-Za-z0-9]+$/.test(name)) {

        function typeA(c) {
            if (/[0-9]/.test(c)) return 'd';
            if (/[a-z]/.test(c)) return 'l';
            return 'u';
        }

        let typesA = [...name].map(typeA);
        let switches = 0;

        for (let i = 1; i < typesA.length; i++) {
            if (typesA[i] !== typesA[i - 1]) switches++;
        }

        if (switches >= 5) return true;
    }

    if (name.length === 10) {
        let types = "";

        for (const c of name) {
            if (/[a-z]/.test(c)) types += "l";
            else if (/[A-Z]/.test(c)) types += "u";
            else return false;
        }

        if (types === "lluullllll")
            return true;
    }

    return false;
}

    /** 主处理函数 **/
    function process(elem) {
        if (!elem) return;

        // 所有含用户信息的 selector 都要检查
// 先处理楼层（l_post）
elem.querySelectorAll('.l_post').forEach(post => {
    const df = post.getAttribute("data-field");
    if (!df) return;

    let data;
    try { data = JSON.parse(df); } catch { return; }

    const name = data.author?.user_name;
    if (!name) return;

    if (isSpamNickname(name)) {
        if (HIDE_CARD) {
            post.style.setProperty("display", "none", "important");
        } else {
            post.style.setProperty("color", "#000", "important");
            post.style.setProperty("filter", "blur(4px)", "important");
            post.style.setProperty("text-shadow", "0 0 4px #000", "important");
        }
    }
});

// 再处理楼中楼（原有逻辑）
elem.querySelectorAll('.j_user_card').forEach(card => {
    const name = card.getAttribute("username") || "";
    if (!name) return;

    if (isSpamNickname(name)) {
        if (HIDE_CARD) {
            card.closest('.lzl_single_post')?.style.setProperty("display", "none", "important");
        } else {
            card.closest('.lzl_single_post')?.style.setProperty("color", "#000", "important");
            card.closest('.lzl_single_post')?.style.setProperty("filter", "blur(4px)", "important");
            card.closest('.lzl_single_post')?.style.setProperty("text-shadow", "0 0 4px #000", "important");
        }
    }
});

    }

    /** 处理整个页面 **/
    function processAll() {
        process(document);
    }

    /** 关键：监听所有新增节点，包括楼中楼 **/
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    process(node);
                }
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true   // 必须监听整个 subtree 才能抓到楼中楼 append
    });

    // 初次运行
    processAll();
})();
