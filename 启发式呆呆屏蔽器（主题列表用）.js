// ==UserScript==
// @name         启发式呆呆屏蔽器（主题列表用）
// @namespace    http://tampermonkey.net/
// @version      1.4
// @downloadURL  https://github.com/cloudfish/block_CFVDaiDai/raw/refs/heads/main/启发式呆呆屏蔽器（主题列表用）.js
// @updateURL    https://github.com/cloudfish/block_CFVDaiDai/raw/refs/heads/main/启发式呆呆屏蔽器（主题列表用）.js
// @description  屏蔽某位不受欢迎的用户的小号，并可选择隐藏主题帖或仅模糊昵称
// @match        https://tieba.baidu.com/f*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // =========================================
    // 可调参数
    // =========================================
    const HIDE_THREAD = false;
    // false → 只隐藏昵称（模糊、hover 时显示）
    // true  → 隐藏整个主题帖

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

    // 隐藏所有出现该 UID 的昵称（默认模式）
    function hideNicknameByUid(uid) {
        const nodes = document.querySelectorAll('a.j_user_card');

        nodes.forEach(a => {
            const df = a.getAttribute("data-field");
            if (!df) return;

            let data;
            try { data = JSON.parse(df); } catch (e) { return; }

            if (data.id !== uid) return;

            // 隐藏昵称：透明 + 模糊阴影
            a.style.color = "transparent";
            a.style.textShadow = "0 0 6px rgba(0,0,0,0.7)";
            a.style.transition = "color 0.2s";

            const emojis = a.querySelectorAll('.nicknameEmoji');
            emojis.forEach(img => {
                img.style.visibility = "hidden";
            });

            // hover 恢复
            a.addEventListener("mouseover", () => {
                a.style.color = "";
                a.style.textShadow = "";
                emojis.forEach(img => img.style.visibility = "");
            });

            a.addEventListener("mouseout", () => {
                a.style.color = "transparent";
                a.style.textShadow = "0 0 6px rgba(0,0,0,0.7)";
                emojis.forEach(img => img.style.visibility = "hidden");
            });
        });
    }

    // 隐藏该 UID 所回复的整个主题帖
    function hideThreadByUid(uid) {
        const replyItems = document.querySelectorAll(".j_replyer");

        replyItems.forEach(span => {
            const a = span.querySelector("a.j_user_card");
            if (!a) return;

            let df = a.getAttribute("data-field");
            if (!df) return;

            let data;
            try { data = JSON.parse(df); } catch (e) { return; }

            if (data.id !== uid) return;

            // 找到整条主题帖 li.j_thread_list
            const li = span.closest("li.j_thread_list");
            if (li) {
                li.style.display = "none";
            }
        });
    }

    // 主逻辑：检测 spam 昵称，并根据开关执行不同隐藏策略
    function main() {
        const replyers = document.querySelectorAll(".j_replyer");

        replyers.forEach(span => {
            const title = span.getAttribute("title");
            if (!title) return;

            const name = title.replace("最后回复人: ", "").trim();
            if (!name) return;

            if (!isSpamNickname(name)) return;

            // 找 UID
            const a = span.querySelector("a.j_user_card");
            if (!a) return;

            let df = a.getAttribute("data-field");
            if (!df) return;

            let data;
            try { data = JSON.parse(df); } catch (e) { return; }
            if (!data.id) return;

            const uid = data.id;

            // 根据开关执行不同操作
            if (HIDE_THREAD) {
                hideThreadByUid(uid);
            } else {
                hideNicknameByUid(uid);
            }
        });
    }

    // 覆盖贴吧异步渲染
    window.addEventListener("load", () => {
        setTimeout(main, 600);
        setTimeout(main, 1500);
        setTimeout(main, 3000);
    });

    // 监听 DOM 变化（贴吧动态加载）
    let lastRun = 0;
    const obs = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastRun > 2000) {
            lastRun = now;
            main();
        }
    });
    obs.observe(document.body, { childList: true, subtree: true });

})();
