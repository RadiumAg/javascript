def 使用format():
    "{},{}".format("first","second")
    print(f"Euler's constant is roughly {124}")
    print("{a}".format(a=1))


使用format()


def 基本转换():
    print("{pi!s} {pi!r} {pi!a}".format(pi = "我"))

基本转换()

def 宽度精度千位分隔符():
    print(repr("{num:10}".format(num = 3)))
    print(repr("{name:10}".format(name="Bob")))

宽度精度千位分隔符()


def 一个使用get的简单的数据库():
    labels ={
        'phone' :'phone number',
        'addr' :'address'
    }

    name = input('Phone number (p) or address (a)?')

一个使用get的简单的数据库()