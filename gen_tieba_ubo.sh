#!/bin/bash

a=$(echo $1 | cut -d '?' -f 2 | cut -d '&' -f 1)
echo "tieba.baidu.com##.j_thread_list:has(a.j_user_card[href*=\"${a}\"])"
echo "tieba.baidu.com##.l_post:has(a.p_author_name[href*=\"${a}\"])"
echo "tieba.baidu.com##.lzl_single_post:has(a.j_user_card[href*=\"${a}\"])"
