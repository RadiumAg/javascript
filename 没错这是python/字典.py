def 创建和使用字典():
    phonebook = {'Alice': '2341', 'Beth': '9102', 'Cecil': '3258'}

    # 元组
    items = [('name', 'Gumby'), ('age', 32)]
    d = dict(items)
    print(d)
    x = {}
    x[42] = 'Foobar'
    print(x)


创建和使用字典()


def 将字符串格式设置功能用于字典():
    phonebook = {'Beth': '9102', 'Alice': '2341', 'Cecil': '3258'}
    "Cecil's phone number is {Ceil}".format_map(phonebook)


def 一个简单的数据库():
    people = {
        'Alice': {
            'phone': '2341',
            'addr': 'Foo drive 23'
        },

        'Beth': {
            'phone': "9102",
            'addr': "Bar street 42"
        },

        'Cecil': {
            'phone': '3158',
            'addr': 'Baz avenue 90'
        }
    }
    # 电话号码和地址的描述性标准，供打印输出时使用
    labels = {
        'phone': 'phone number',
        'addr': 'address '
    }

    name = input('name:')

    # 要查找电话号码还是地址
    request = input('Phone number (p) or address (a)')
    if request == 'p':
        key = 'phone'
    if request == 'a':
        key = 'addr'

    # 仅当名字是字典包含的键时才打印信息
    if name in people:
        print("{}'s is {}".format(name, labels[key], people[name][key]))


def 字典方法():
    d = {}
    d['name'] = 'Gumby'
    d['age'] = 42
    print(d)

    print(d.clear())

    x = {'username': 'admin', 'machines': ['foo', 'bar', 'baz']}
    y = x.copy()
    y['username'] = 'mlh'
    y['machines'].remove('bar')

    print(y)
    print(x)

    dict.fromkeys(['name', 'age'])

    #get访问不存在的键，不会报错
    d = {}
    print.get('name')



字典方法()
