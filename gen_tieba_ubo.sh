#!/bin/bash

a=$(echo $1 | cut -d '?' -f 2 | cut -d '&' -f 1 | cut  -d '=' -f 2)
echo "tieba.baidu.com##.j_thread_list:has(a.j_user_card[href*=\"id=${a}\"])"
echo "tieba.baidu.com##.l_post:has(a.p_author_name[href*=\"id=${a}\"])"
echo "tieba.baidu.com##.lzl_single_post:has(a.j_user_card img[src$=\"${a}\"])"
echo "tieba.baidu.com##.lzl_single_post:has(.lzl_content_main a.at[portrait=\"${a}\"])"
