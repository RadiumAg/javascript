numbers = [1,2,3,4,5,6,7,8,9,10]

def 切片():
    tag  = 'abcd'
    print(tag[0:2])

切片()

def 更大的步长(): 
    print(numbers[0:10:2]) #[1, 3, 5, 7, 9]

更大的步长()

def 拼接序列():
    print([1,2,3] + [4,5,6])


def 成员资格():
    permission = 'rw'
    print('w' in permission)

成员资格()

def 长度最小值最大值():
    numbers = [100,34,678]
    len(numbers)
    max(numbers)
    min(numbers)

def 给切片赋值():
    name = list('Perl')
    name[2:] = list('ar')
    print(name)

给切片赋值()
