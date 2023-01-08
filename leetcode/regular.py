class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        """
        :param s: 待匹配的字符串s.
        :param p: 正则表达式p.
        :return: 是否成功匹配。
        """
        now_state_set = {0}  # 表示现在可能处于的所有状态的集合。状态state表示接下来匹配p[state].

        def update_now_state_set(char: str) -> None:
            """
            :param char: 接续字符char后更新一下now_state_set. 如果char是'~'，表示后继字符为空。
            :return: 无。
            """
            nonlocal now_state_set
            tmp_state_set = set()  # 用一个临时变量tmp_state_set记录结果。
            if char == '~':
                # 将直接跳过_*的所有后继状态加入now_state_set.
                for state in now_state_set:
                    tmp_state_set.add(state)
                    possible_state = state
                    while possible_state + 1 < len(p) and p[possible_state + 1] == '*':
                        possible_state += 2
                        tmp_state_set.add(possible_state)
            else:
                # 接续字符char后的所有后继状态构成now_state_set.
                for state in now_state_set:
                    if state >= len(p) or p[state] not in {char, '.'}:
                        # state是终止状态，或者p[state]不匹配，此时匹配失败。
                        continue
                    if state + 1 < len(p) and p[state + 1] == '*':
                        # 从状态state开始，匹配了一个char*之后，还可以停留在该状态。
                        tmp_state_set.add(state)
                    else:
                        tmp_state_set.add(state + 1)
            now_state_set = tmp_state_set

        update_now_state_set('~')
        for char in s:
            update_now_state_set(char)
            update_now_state_set('~')

        if len(p) in now_state_set:
            # 如果now_state可能是终止状态len(p)，即存在一种方法进行匹配，返回True.
            return True
        return False

