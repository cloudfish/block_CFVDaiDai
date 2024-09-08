# block_CFVDaiDai
本项目通过两种方式屏蔽雀魂吧吧宠呆哥。目前，两种方式叠加使用，理论上（打开网页后可能有数秒延迟）可以屏蔽呆哥的几乎所有帖子（除了未知的小号发布的主题帖）。

# 方式一（黑名单）

暴力收集呆哥小号，并使用 uBlock Origin 自定义规则进行屏蔽。

方式一使用说明：

将 `rules.txt` 的内容粘贴到 uBlock Origin 的自定义静态规则。或者，在网络条件允许的情况下（你懂的），如需要自动更新，可点击规则列表-自定义-导入，将网址 `https://raw.githubusercontent.com/cloudfish/block_CFVDaiDai/main/rules.txt` 粘贴进去。

此外，在 uBlock Origin 的自定义静态规则中，添加以下内容，可以屏蔽贴吧的所有分享帖，这样就可以屏蔽呆哥未知小号的分享帖刷屏。虽然正常的分享帖也会被屏蔽，但是贴吧真的有正常的分享帖吗……

```
! 贴吧的所有分享帖
tieba.baidu.com##.j_thread_list:has(a.j_th_tit[title*="分享："])
```

和方式一有关的其他文件：

`gen_tieba_ubo.sh`: 对单个账号生成屏蔽规则的 shell 脚本。使用方法：执行 `./gen_tieba_ubo.sh "目标账号贴吧主页网址"`。注意网址必须是 `https://tieba.baidu.com/home/main?id=xxxxxxxx` 的格式，即 main 后面的第一个参数需要是该用户的 ID。

# 方式二（启发式古户绘梨花头像识别）

使用油猴脚本识别并标记呆哥头像，然后使用 uBlock Origin 进行屏蔽。理论上可以屏蔽呆哥所有未知的小号的帖子，除非呆哥换头像逃避检测。

（本人不会前端开发，所以各种复制粘贴代码做了一个勉强能用的版本。性能等方面尚有改进空间）

方式二使用说明：

安装油猴插件（如 ViolentMonkey）。新建一个脚本，将 `block_daidai_avatar.js` 的内容粘贴进去。然后，在 uBlock Origin 的自定义静态规则中，添加以下内容：

```
! 被呆哥头像屏蔽脚本标记的帖子
tieba.baidu.com##.l_post:has(img.dai_post)
tieba.baidu.com##.lzl_single_post:has(img.dai_lzl)
```
