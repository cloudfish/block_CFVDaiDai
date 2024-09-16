# block_CFVDaiDai
在百度贴吧电脑网页版屏蔽雀魂吧吧宠呆哥。需要支持自定义广告屏蔽规则和油猴脚本的浏览器，例如 Firefox 或 Chrome。使用 Android 版 Firefox 浏览电脑版贴吧时也有效。

# 第一步（添加广告屏蔽规则）

需要先安装支持自定义规则的广告屏蔽插件，例如 uBlock Origin (Firefox) 或 Adblock Plus (Chrome)。

添加步骤：

uBlock Origin + Firefox: 将 `rules.txt` 的内容粘贴到 uBlock Origin 设置中的自定义静态规则。或者，如果可以翻墙且需要自动更新，可以不添加静态规则，而改为点击规则列表-自定义-导入，将网址 `https://raw.githubusercontent.com/cloudfish/block_CFVDaiDai/main/rules.txt` 粘贴进去。

Adblock Plus + Chrome: 将 `rules.txt` 的内容粘贴到 Adblock Plus 设置中的高级-您的自定义过滤-我的过滤列表。暂不支持自动更新。

`rules.txt` 收集了呆哥的 1000 多个小号，将屏蔽这些小号发布的主题帖、回复、楼中楼。

# 第二步（安装油猴脚本）

需要先安装油猴脚本插件，例如暴力猴 (Violent Monkey)。

`block_daidai_avatar.js` 可以识别呆哥头像，然后使用广告屏蔽插件进行屏蔽。不过由于本人不会前端开发，代码是各种复制粘贴来的，所以还有些 bug，不能全部屏蔽。如果有改进方案，请提 PR。

安装步骤：

在暴力猴中，新建一个脚本，将 `block_daidai_avatar.js` 的内容粘贴进去。

使用说明到此结束。以下为备注。

# 备注

1. `rules.txt` 的前两条规则用于屏蔽被油猴脚本标记的呆哥帖子。

2. `rules.txt` 的第三条规则用于屏蔽贴吧的所有分享帖。因为呆哥会在半夜用这种帖子刷屏。如果你需要看到正常的分享帖，请删除这条规则。

2. `gen_tieba_ubo.sh` 是对单个账号生成屏蔽规则的 shell 脚本。使用方法：执行 `./gen_tieba_ubo.sh "目标账号贴吧主页网址"`。注意网址必须是 `https://tieba.baidu.com/home/main?id=xxxxxxxx` 的格式，即 main 后面的第一个参数需要是该用户的 ID。
