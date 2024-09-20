// ==UserScript==
// @name 屏蔽呆哥
// @namespace http://tampermonkey.net/
// @version 0.1
// @description try to take over the world!
// @author You
// @match https://tieba.baidu.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=tieba.baidu.com
// @grant GM_xmlhttpRequest
// ==/UserScript==


(function() {
    "use strict";
    const targetNode = document.querySelector(".l_container");
    const config = { subtree: true, childList: true };
    const callback = (mutationList, observer) => {
    let avatar = targetNode.getElementsByTagName("img");
    for (let index = 0; index < avatar.length; index++) {
        let item = avatar[index];
        if (item.classList.contains("not_dai")||item.classList.contains("dai_post")||item.classList.contains("dai_lzl")) {
            continue;
        }
        GM_xmlhttpRequest({
            method: "GET",
            responseType: "blob",
            url: item.src,
            onload: function(response) {
                if (response.status === 200) {
                    new Promise((resolve, reject) => {
                        let reader = new FileReader();
                        reader.addEventListener("load", () => {
                            let img = new Image();
                            img.setAttribute("crossOrigin", "anonymous");
                            img.src = reader.result;
                            img.addEventListener("load", () => resolve(img));
                        });
                        reader.readAsDataURL(response.response);
                    }).then((img) => getImageData(item, img));
                }
            },
        });
    }

    function getImageData(item, img) {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", `${item.width}px`);
        canvas.setAttribute("height", `${item.height}px`);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, item.width, item.height);


        let imgData = ctx.getImageData(
            item.width / 4,
            item.height / 4,
            item.width / 2,
            item.height / 2
        );

        let map = new Map();
        for (let i = 0; i < imgData.data.length; i += 4) {
            let r = imgData.data[i];
            let g = imgData.data[i + 1];
            let b = imgData.data[i + 2];
            // let a
            let rgb = `${r},${g},${b}`;
            if (!map.has(rgb)) {
                map.set(rgb, 1);
            } else {
                map.set(rgb, map.get(rgb) + 1);
            }
        }
        // 寻找最大值
        let maxValue = 0;
        let color = "";
        map.forEach((value, key) => {
            if (value > maxValue) {
                maxValue = value;
                color = key;
            }
        });
        console.log(item.src);
        console.log(color);
        let a = color.split(",");
        if (a[0]>=29&&a[0]<=37&&a[1]>=37&&a[1]<=45&&a[2]>=93&&a[2]<=113) {
            if(item.hasAttribute("username")) {
                item.classList.add("dai_post");
            } else {
                item.classList.add("dai_lzl");
            }
            item.style.display = "none";
        } else if (a[0] != 218 || a[1] != 218 || a[2] != 218) {
            item.classList.add("not_dai");
        }
    }
    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
})();
